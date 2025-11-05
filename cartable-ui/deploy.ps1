# مسیر مقصد روی سیستم محلی (برای آماده‌سازی)
$dest = ".\deploy-package"

Write-Host "Starting deployment package preparation..." -ForegroundColor Green

# پاک کردن کامل پوشه قدیمی
if (Test-Path $dest) {
    Write-Host "Removing old package..." -ForegroundColor Yellow
    Remove-Item -Path $dest -Recurse -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# ایجاد پوشه جدید
New-Item -ItemType Directory -Path $dest -Force | Out-Null

# 1. کپی محتویات standalone
Write-Host "Copying standalone files..." -ForegroundColor Cyan
$standalonePath = ".\.next\standalone"
if (Test-Path $standalonePath) {
    Copy-Item -Path "$standalonePath\*" -Destination $dest -Recurse -Force
} else {
    Write-Host "Error: Standalone folder not found!" -ForegroundColor Red
    exit 1
}

# 2. کپی static
Write-Host "Copying static files..." -ForegroundColor Cyan
$staticSource = ".\.next\static"
$staticDest = "$dest\.next\static"
if (Test-Path $staticSource) {
    New-Item -ItemType Directory -Path "$dest\.next" -Force | Out-Null
    Copy-Item -Path $staticSource -Destination $staticDest -Recurse -Force
} else {
    Write-Host "Error: Static folder not found!" -ForegroundColor Red
    exit 1
}

# 3. کپی public
Write-Host "Copying public files..." -ForegroundColor Cyan
$publicSource = ".\public"
$publicDest = "$dest\public"
if (Test-Path $publicSource) {
    Copy-Item -Path $publicSource -Destination $publicDest -Recurse -Force
} else {
    Write-Host "Warning: Public folder not found!" -ForegroundColor Yellow
}

# 4. ایجاد web.config
Write-Host "Creating web.config..." -ForegroundColor Cyan
$webConfig = @"
<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode"/>
    </handlers>
    
    <rewrite>
      <rules>
        <rule name="StaticContent" stopProcessing="true">
          <match url="^(.*)$" />
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" />
          </conditions>
          <action type="Rewrite" url="{R:1}" />
        </rule>
        
        <rule name="DynamicContent">
          <match url="/*" />
          <action type="Rewrite" url="server.js" />
        </rule>
      </rules>
    </rewrite>
    
    <iisnode 
      node_env="production"
      nodeProcessCommandLine="&quot;C:\Program Files\nodejs\node.exe&quot;"
      loggingEnabled="true"
      devErrorsEnabled="false"
    />
    
    <httpErrors existingResponse="PassThrough" />
  </system.webServer>
</configuration>
"@

Set-Content -Path "$dest\web.config" -Value $webConfig -Encoding UTF8

# 5. ایجاد README
Write-Host "Creating deployment instructions..." -ForegroundColor Cyan
$readme = @"
# CartableUI Deployment Package

## فایل‌های آماده برای Deploy

این پوشه شامل تمام فایل‌های لازم برای deploy روی IIS است.

## مراحل نصب روی سرور:

### 1. کپی فایل‌ها
تمام محتویات این پوشه را به سرور کپی کنید (مثلاً: D:\Websites\CartableUI)

### 2. نصب پیش‌نیازها روی سرور
- Node.js (LTS version 18.17+)
- iisnode

### 3. تنظیمات IIS

**Application Pool:**
- Name: CartableUI_Pool
- .NET CLR Version: No Managed Code
- Managed Pipeline Mode: Integrated

**Website:**
- Site name: CartableUI
- Physical path: D:\Websites\CartableUI
- Application pool: CartableUI_Pool
- Port: 80 (یا هر پورت دلخواه)

### 4. تنظیم دسترسی‌ها
در PowerShell روی سرور:
``````powershell
icacls "D:\Websites\CartableUI" /grant IIS_IUSRS:(OI)(CI)F /T
icacls "D:\Websites\CartableUI" /grant IUSR:(OI)(CI)F /T
``````

### 5. Start Website
در IIS Manager:
- روی Website راست کلیک
- Manage Website > Start

### 6. تست
مرورگر را باز کنید:
http://localhost

## رفع مشکلات

اگر خطا دیدید، لاگ‌ها را چک کنید:
D:\Websites\CartableUI\iisnode\

## ساختار فایل‌ها:
.
├── .next/
│   ├── static/         (فایل‌های CSS/JS)
│   └── server/         (فایل‌های سرور)
├── node_modules/       (پکیج‌های ضروری)
├── public/            (تصاویر و فایل‌های عمومی)
├── server.js          (سرور Node.js)
├── package.json
└── web.config         (تنظیمات IIS)
"@

Set-Content -Path "$dest\README.md" -Value $readme -Encoding UTF8

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Deployment package ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Package location: $((Get-Item $dest).FullName)" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files included:" -ForegroundColor Yellow
Write-Host "  ✓ server.js" -ForegroundColor White
Write-Host "  ✓ .next/static/" -ForegroundColor White
Write-Host "  ✓ .next/server/" -ForegroundColor White
Write-Host "  ✓ node_modules/" -ForegroundColor White
Write-Host "  ✓ public/" -ForegroundColor White
Write-Host "  ✓ web.config" -ForegroundColor White
Write-Host "  ✓ README.md" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Copy the entire '$dest' folder to your server" -ForegroundColor White
Write-Host "2. Follow instructions in README.md" -ForegroundColor White
Write-Host ""

# نمایش حجم کل
$totalSize = (Get-ChildItem -Path $dest -Recurse | Measure-Object -Property Length -Sum).Sum / 1MB
Write-Host "Total package size: $([math]::Round($totalSize, 2)) MB" -ForegroundColor Cyan