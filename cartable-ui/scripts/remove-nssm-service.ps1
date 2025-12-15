# PowerShell Script to Remove Cartable UI Windows Service
# Run this script as Administrator

param(
    [string]$ServiceName = "CartableUI"
)

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Cartable UI - NSSM Service Remover" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $isAdmin) {
    Write-Host "❌ Error: This script must be run as Administrator!" -ForegroundColor Red
    exit 1
}

# Check if service exists
$existingService = Get-Service -Name $ServiceName -ErrorAction SilentlyContinue
if (-not $existingService) {
    Write-Host "⚠️  Service '$ServiceName' not found!" -ForegroundColor Yellow
    exit 0
}

Write-Host "Found service: $ServiceName" -ForegroundColor White
Write-Host "Status: $($existingService.Status)" -ForegroundColor White
Write-Host ""

$response = Read-Host "Are you sure you want to remove this service? (y/n)"
if ($response -ne 'y') {
    Write-Host "Operation cancelled." -ForegroundColor Yellow
    exit 0
}

# Stop service if running
if ($existingService.Status -eq 'Running') {
    Write-Host "Stopping service..." -ForegroundColor Yellow
    nssm stop $ServiceName
    Start-Sleep -Seconds 2
    Write-Host "✅ Service stopped" -ForegroundColor Green
}

# Remove service
Write-Host "Removing service..." -ForegroundColor Yellow
nssm remove $ServiceName confirm

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Service removed successfully!" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "❌ Failed to remove service!" -ForegroundColor Red
    exit 1
}
