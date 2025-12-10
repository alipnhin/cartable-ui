# =====================================================
# IIS Deployment Script for Next.js with PM2
# =====================================================
# این اسکریپت برای نصب و راه‌اندازی اپلیکیشن Next.js با PM2 و IIS Reverse Proxy استفاده می‌شود
# PM2 به عنوان Windows Service نصب می‌شود تا در صورت ریستارت سرور، خودکار اجرا شود

# نیازمندی‌ها:
# - Node.js نصب شده باشد
# - IIS با Application Request Routing (ARR) و URL Rewrite نصب شده باشد
# - این اسکریپت باید با Administrator اجرا شود

param(
    [string]$AppPath = (Get-Location).Path,
    [string]$ServiceName = "PM2-Cartable-UI",
    [int]$Port = 3000,
    [string]$SiteName = "Cartable-UI",
    [switch]$SkipBuild = $false,
    [switch]$SkipInstall = $false,
    [switch]$UninstallOnly = $false
)

# بررسی Administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERROR: This script must be run as Administrator!" -ForegroundColor Red
    Write-Host "Please right-click and select 'Run as Administrator'" -ForegroundColor Yellow
    exit 1
}

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "IIS Deployment Script for Next.js" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# تابع برای حذف سرویس
function Remove-PM2Service {
    Write-Host "Removing existing PM2 service..." -ForegroundColor Yellow

    # توقف و حذف PM2 process
    & npm run pm2:stop 2>$null
    & npm run pm2:delete 2>$null

    # حذف سرویس Windows (pm2-installer uses "PM2" as service name)
    $service = Get-Service -Name "PM2" -ErrorAction SilentlyContinue
    if ($service) {
        Stop-Service -Name "PM2" -Force -ErrorAction SilentlyContinue
        Write-Host "Attempting to remove PM2 service using pm2-installer..." -ForegroundColor Yellow

        $pm2InstallerLocation = & npm root -g
        $pm2InstallerPath = Join-Path $pm2InstallerLocation "pm2-installer"

        if (Test-Path $pm2InstallerPath) {
            Push-Location $pm2InstallerPath
            & npm run remove 2>$null
            Pop-Location
        }

        Write-Host "PM2 service removed successfully." -ForegroundColor Green
    }

    # حذف PM2
    & pm2 kill 2>$null

    Start-Sleep -Seconds 2
}

# اگر فقط حذف درخواست شده
if ($UninstallOnly) {
    Remove-PM2Service
    Write-Host "Uninstall completed." -ForegroundColor Green
    exit 0
}

# رفتن به مسیر اپلیکیشن
Set-Location $AppPath

Write-Host "Application Path: $AppPath" -ForegroundColor Cyan
Write-Host "Port: $Port" -ForegroundColor Cyan
Write-Host ""

# بررسی وجود Node.js
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = & node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH!" -ForegroundColor Red
    exit 1
}

# بررسی وجود npm
try {
    $npmVersion = & npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm is not installed or not in PATH!" -ForegroundColor Red
    exit 1
}

Write-Host ""

# نصب dependencies
if (-not $SkipInstall) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    # استفاده از legacy-peer-deps برای سازگاری با Node.js v25
    & npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install dependencies!" -ForegroundColor Red
        Write-Host "Trying with --force flag..." -ForegroundColor Yellow
        & npm install --force
        if ($LASTEXITCODE -ne 0) {
            Write-Host "ERROR: Failed to install dependencies even with --force!" -ForegroundColor Red
            exit 1
        }
    }
    Write-Host "Dependencies installed successfully." -ForegroundColor Green
} else {
    Write-Host "Skipping npm install (SkipInstall flag is set)." -ForegroundColor Yellow
    Write-Host "Make sure node_modules directory exists and is complete." -ForegroundColor Yellow

    # بررسی وجود node_modules
    if (-not (Test-Path ".\node_modules")) {
        Write-Host "WARNING: node_modules directory not found!" -ForegroundColor Red
        Write-Host "Please copy node_modules from your build machine or run without -SkipInstall flag." -ForegroundColor Yellow
        exit 1
    }
}
Write-Host ""

# Build اپلیکیشن
if (-not $SkipBuild) {
    Write-Host "Building Next.js application..." -ForegroundColor Yellow
    & npm run build
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Build failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "Build completed successfully." -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "Skipping build (SkipBuild flag is set)." -ForegroundColor Yellow

    # بررسی وجود .next directory
    if (-not (Test-Path ".\.next")) {
        Write-Host "WARNING: .next directory not found!" -ForegroundColor Red
        Write-Host "Please copy .next directory from your build machine or run without -SkipBuild flag." -ForegroundColor Yellow
        exit 1
    }
    Write-Host ""
}

# ایجاد پوشه logs
$logsPath = Join-Path $AppPath "logs"
if (-not (Test-Path $logsPath)) {
    New-Item -ItemType Directory -Path $logsPath -Force | Out-Null
    Write-Host "Logs directory created." -ForegroundColor Green
}

# حذف سرویس قبلی (اگر وجود دارد)
Remove-PM2Service

# نصب PM2 به صورت global (اگر نصب نشده)
Write-Host "Checking PM2 installation..." -ForegroundColor Yellow
try {
    & pm2 --version 2>$null | Out-Null
    Write-Host "PM2 is already installed." -ForegroundColor Green
} catch {
    Write-Host "Installing PM2 globally..." -ForegroundColor Yellow
    & npm install -g pm2
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install PM2!" -ForegroundColor Red
        exit 1
    }
    Write-Host "PM2 installed successfully." -ForegroundColor Green
}

Write-Host ""

# نصب pm2-installer به صورت global (اگر نصب نشده)
Write-Host "Checking pm2-installer installation..." -ForegroundColor Yellow
$pm2InstallerInstalled = $false
try {
    $pm2InstallerPath = & npm list -g pm2-installer --depth=0 2>$null
    if ($pm2InstallerPath -match "pm2-installer") {
        Write-Host "pm2-installer is already installed." -ForegroundColor Green
        $pm2InstallerInstalled = $true
    }
} catch {
    # pm2-installer not installed
}

if (-not $pm2InstallerInstalled) {
    Write-Host "Installing pm2-installer from GitHub..." -ForegroundColor Yellow
    Write-Host "Note: This requires Git to be installed on the system." -ForegroundColor Yellow
    & npm install -g github:jessety/pm2-installer
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Failed to install pm2-installer!" -ForegroundColor Red
        Write-Host "Make sure Git is installed and accessible in PATH." -ForegroundColor Red
        Write-Host "Or manually download from: https://github.com/jessety/pm2-installer" -ForegroundColor Yellow
        exit 1
    }
    Write-Host "pm2-installer installed successfully." -ForegroundColor Green
}

Write-Host ""

# پیکربندی npm برای Local Service access
Write-Host "Configuring npm for Local Service access..." -ForegroundColor Yellow
$pm2InstallerLocation = & npm root -g
$pm2InstallerPath = Join-Path $pm2InstallerLocation "pm2-installer"
if (Test-Path $pm2InstallerPath) {
    Push-Location $pm2InstallerPath
    & npm run configure 2>&1 | Out-Null
    Pop-Location
    Write-Host "npm configuration completed." -ForegroundColor Green
} else {
    Write-Host "WARNING: pm2-installer directory not found. Skipping configure." -ForegroundColor Yellow
}
Write-Host ""

# پیکربندی PowerShell Execution Policy
Write-Host "Configuring PowerShell execution policy..." -ForegroundColor Yellow
if (Test-Path $pm2InstallerPath) {
    Push-Location $pm2InstallerPath
    & npm run configure-policy 2>&1 | Out-Null
    Pop-Location
    Write-Host "PowerShell policy configured." -ForegroundColor Green
} else {
    Write-Host "WARNING: pm2-installer directory not found. Skipping policy configuration." -ForegroundColor Yellow
}
Write-Host ""

# شروع PM2
Write-Host "Starting application with PM2..." -ForegroundColor Yellow
& npm run pm2:start
if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Failed to start PM2!" -ForegroundColor Red
    exit 1
}
Write-Host "Application started successfully." -ForegroundColor Green
Write-Host ""

# ذخیره PM2 configuration
Write-Host "Saving PM2 configuration..." -ForegroundColor Yellow
& pm2 save --force
Write-Host "PM2 configuration saved." -ForegroundColor Green
Write-Host ""

# نصب PM2 به عنوان Windows Service با pm2-installer
Write-Host "Installing PM2 as Windows Service using pm2-installer..." -ForegroundColor Yellow

# تنظیم environment variables برای سرویس
$env:PM2_HOME = "C:\ProgramData\pm2"

$pm2InstallerLocation = & npm root -g
$pm2InstallerPath = Join-Path $pm2InstallerLocation "pm2-installer"

if (Test-Path $pm2InstallerPath) {
    Push-Location $pm2InstallerPath
    & npm run setup 2>&1 | Out-Null
    $setupResult = $LASTEXITCODE
    Pop-Location

    if ($setupResult -ne 0) {
        Write-Host "WARNING: Failed to install PM2 service automatically." -ForegroundColor Yellow
        Write-Host "You may need to navigate to pm2-installer directory and run: npm run setup" -ForegroundColor Yellow
    } else {
        Write-Host "PM2 service installed successfully." -ForegroundColor Green
    }
} else {
    Write-Host "ERROR: pm2-installer directory not found at: $pm2InstallerPath" -ForegroundColor Red
    Write-Host "Please install pm2-installer manually." -ForegroundColor Yellow
}

Write-Host ""

# بررسی وضعیت سرویس
Write-Host "Checking PM2 service status..." -ForegroundColor Yellow
$service = Get-Service -Name "PM2" -ErrorAction SilentlyContinue
if ($service) {
    if ($service.Status -eq "Running") {
        Write-Host "PM2 service is running." -ForegroundColor Green
    } else {
        Write-Host "Starting PM2 service..." -ForegroundColor Yellow
        Start-Service -Name "PM2" -ErrorAction SilentlyContinue
        if ($?) {
            Write-Host "PM2 service started successfully." -ForegroundColor Green
        } else {
            Write-Host "WARNING: Could not start service. You may need to start it manually." -ForegroundColor Yellow
        }
    }
} else {
    Write-Host "WARNING: PM2 service not found. Check pm2-installer logs." -ForegroundColor Yellow
}

Write-Host ""

# بررسی وضعیت
Write-Host "Checking application status..." -ForegroundColor Yellow
Start-Sleep -Seconds 3
& pm2 list

Write-Host ""
Write-Host "======================================" -ForegroundColor Green
Write-Host "Deployment Completed Successfully!" -ForegroundColor Green
Write-Host "======================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Yellow
Write-Host "1. Configure IIS site to point to this directory" -ForegroundColor White
Write-Host "2. Ensure web.config is present in the root" -ForegroundColor White
Write-Host "3. Install IIS Application Request Routing (ARR) module" -ForegroundColor White
Write-Host "4. Enable proxy in IIS: Server > Application Request Routing > Server Proxy Settings > Enable proxy" -ForegroundColor White
Write-Host "5. Test the application by browsing to your IIS site" -ForegroundColor White
Write-Host ""
Write-Host "Useful Commands:" -ForegroundColor Yellow
Write-Host "  npm run pm2:logs      - View application logs" -ForegroundColor Cyan
Write-Host "  npm run pm2:monit     - Monitor application" -ForegroundColor Cyan
Write-Host "  npm run pm2:restart   - Restart application" -ForegroundColor Cyan
Write-Host "  npm run pm2:stop      - Stop application" -ForegroundColor Cyan
Write-Host ""
Write-Host "Service Name: PM2" -ForegroundColor Cyan
Write-Host "Application Port: $Port" -ForegroundColor Cyan
Write-Host "Application URL: http://localhost:$Port" -ForegroundColor Cyan
Write-Host "PM2 Home: C:\ProgramData\pm2" -ForegroundColor Cyan
Write-Host ""
Write-Host "Note: PM2 runs as Local Service user." -ForegroundColor Yellow
Write-Host "Use elevated PowerShell to interact with PM2 (e.g., pm2 list)." -ForegroundColor Yellow
Write-Host ""
