# PowerShell Script to Install Cartable UI as Windows Service using NSSM
# Run this script as Administrator

param(
    [string]$ServiceName = "CartableUI",
    [string]$ProjectPath = (Get-Location).Path,
    [string]$NodePath = "node.exe",
    [int]$Port = 3000,
    [string]$ServiceUser = "",
    [string]$ServicePassword = ""
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Cartable UI - NSSM Service Installer" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "❌ Error: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

# Check if NSSM is installed
$nssmPath = Get-Command nssm -ErrorAction SilentlyContinue
if (-not $nssmPath) {
    Write-Host "❌ NSSM not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install NSSM first:" -ForegroundColor Yellow
    Write-Host "  1. Download from: https://nssm.cc/download" -ForegroundColor White
    Write-Host "  2. Extract nssm.exe to C:\Windows\System32\" -ForegroundColor White
    Write-Host "  OR" -ForegroundColor Yellow
    Write-Host "  Install via Chocolatey: choco install nssm" -ForegroundColor White
    exit 1
}

Write-Host "✅ NSSM found: $($nssmPath.Source)" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = & node --version
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found!" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Set paths
$serverPath = Join-Path $ProjectPath ".next\standalone\server.js"
$logPath = Join-Path $ProjectPath "logs"

# Check if server.js exists
if (-not (Test-Path $serverPath)) {
    Write-Host "❌ Server file not found: $serverPath" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run 'npm run build' first to create the standalone build." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Server file found" -ForegroundColor Green

# Create logs directory if not exists
if (-not (Test-Path $logPath)) {
    New-Item -ItemType Directory -Path $logPath -Force | Out-Null
    Write-Host "✅ Created logs directory" -ForegroundColor Green
}

# Check if service already exists
$existingService = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if ($existingService) {
    Write-Host ""
    Write-Host "⚠️  Service '$ServiceName' already exists!" -ForegroundColor Yellow
    $response = Read-Host "Do you want to remove and reinstall? (y/n)"
    if ($response -eq 'y') {
        Write-Host "Stopping service..." -ForegroundColor Yellow
        nssm stop $ServiceName
        Start-Sleep -Seconds 2

        Write-Host "Removing service..." -ForegroundColor Yellow
        nssm remove $ServiceName confirm
        Start-Sleep -Seconds 2
        Write-Host "✅ Service removed" -ForegroundColor Green
    } else {
        Write-Host "Installation cancelled." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "Installing service..." -ForegroundColor Cyan

# Install service
$nssmInstall = nssm install $ServiceName $NodePath $serverPath

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install service!" -ForegroundColor Red
    exit 1
}

# Configure service
Write-Host "Configuring service..." -ForegroundColor Cyan

# Set working directory
nssm set $ServiceName AppDirectory $ProjectPath

# Set environment variables
nssm set $ServiceName AppEnvironmentExtra NODE_ENV=production PORT=$Port

# Set display name and description
nssm set $ServiceName DisplayName "Cartable UI Application"
nssm set $ServiceName Description "Next.js Cartable UI Application running as Windows Service"

# Set startup type to automatic
nssm set $ServiceName Start SERVICE_AUTO_START

# Configure logging
$stdoutLog = Join-Path $logPath "service-output.log"
$stderrLog = Join-Path $logPath "service-error.log"

nssm set $ServiceName AppStdout $stdoutLog
nssm set $ServiceName AppStderr $stderrLog

# Rotate logs (10MB max)
nssm set $ServiceName AppRotateFiles 1
nssm set $ServiceName AppRotateBytes 10485760

# Set restart behavior
nssm set $ServiceName AppExit Default Restart
nssm set $ServiceName AppRestartDelay 4000

# Configure service account if provided
if ($ServiceUser -and $ServicePassword) {
    Write-Host "Configuring service account..." -ForegroundColor Cyan
    nssm set $ServiceName ObjectName $ServiceUser $ServicePassword

    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Service account configured: $ServiceUser" -ForegroundColor Green

        # Grant permissions to project folder
        Write-Host "Granting permissions to project folder..." -ForegroundColor Cyan
        try {
            $acl = Get-Acl $ProjectPath
            $permission = "$ServiceUser", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow"
            $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
            $acl.SetAccessRule($accessRule)
            Set-Acl $ProjectPath $acl
            Write-Host "✅ Permissions granted to: $ProjectPath" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Warning: Failed to set permissions automatically" -ForegroundColor Yellow
            Write-Host "Please grant permissions manually using:" -ForegroundColor Yellow
            Write-Host "  icacls `"$ProjectPath`" /grant `"${ServiceUser}:(OI)(CI)F`" /T" -ForegroundColor White
        }

        # Grant permissions to logs folder
        Write-Host "Granting permissions to logs folder..." -ForegroundColor Cyan
        try {
            $acl = Get-Acl $logPath
            $permission = "$ServiceUser", "FullControl", "ContainerInherit,ObjectInherit", "None", "Allow"
            $accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
            $acl.SetAccessRule($accessRule)
            Set-Acl $logPath $acl
            Write-Host "✅ Permissions granted to: $logPath" -ForegroundColor Green
        } catch {
            Write-Host "⚠️  Warning: Failed to set log permissions automatically" -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Failed to configure service account!" -ForegroundColor Red
        Write-Host "Please verify the username and password are correct." -ForegroundColor Yellow
        nssm remove $ServiceName confirm
        exit 1
    }
} else {
    Write-Host "⚠️  Running service as Local System account" -ForegroundColor Yellow
    Write-Host "For production, consider using a dedicated service account." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Service installed successfully!" -ForegroundColor Green
Write-Host ""

# Start service
Write-Host "Starting service..." -ForegroundColor Cyan
$startResult = nssm start $ServiceName

if ($LASTEXITCODE -eq 0) {
    Start-Sleep -Seconds 3
    $serviceStatus = Get-Service -Name $ServiceName

    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "✅ Installation Complete!" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Service Name:    $ServiceName" -ForegroundColor White
    Write-Host "Status:          $($serviceStatus.Status)" -ForegroundColor White
    if ($ServiceUser) {
        Write-Host "Run As:          $ServiceUser" -ForegroundColor White
    } else {
        Write-Host "Run As:          Local System" -ForegroundColor White
    }
    Write-Host "URL:             http://localhost:$Port" -ForegroundColor White
    Write-Host "Logs:            $logPath" -ForegroundColor White
    Write-Host ""
    Write-Host "Management Commands:" -ForegroundColor Cyan
    Write-Host "  Start:         nssm start $ServiceName" -ForegroundColor White
    Write-Host "  Stop:          nssm stop $ServiceName" -ForegroundColor White
    Write-Host "  Restart:       nssm restart $ServiceName" -ForegroundColor White
    Write-Host "  Status:        nssm status $ServiceName" -ForegroundColor White
    Write-Host "  Remove:        nssm remove $ServiceName confirm" -ForegroundColor White
    Write-Host ""
    Write-Host "Or use Services.msc (Windows Services Manager)" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host "❌ Failed to start service!" -ForegroundColor Red
    Write-Host "Check logs in: $logPath" -ForegroundColor Yellow
    exit 1
}
