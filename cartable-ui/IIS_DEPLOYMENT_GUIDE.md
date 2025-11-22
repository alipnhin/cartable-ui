# راهنمای Deploy بر روی Windows Server و IIS

<div dir="rtl">

این مستند راهنمای کامل برای نصب و راه‌اندازی اپلیکیشن Cartable UI بر روی Windows Server و IIS است.

## 📋 پیش‌نیازها

### نرم‌افزارهای مورد نیاز

1. **Windows Server 2019 یا بالاتر**
2. **IIS 10.0 یا بالاتر**
3. **Node.js LTS (نسخه 18 یا 20)** - برای build و اجرای اپلیکیشن
4. **URL Rewrite Module برای IIS**
5. **iisnode** - برای اجرای Node.js در IIS
6. **.NET Core Hosting Bundle** (اختیاری)

### توجه مهم: محیط بدون اینترنت

**این راهنما با فرض عدم دسترسی به اینترنت در سرور production نوشته شده است.**

تمام فایل‌های نصبی و dependencies باید از قبل دانلود و آماده شوند.

---

## 📦 مرحله 1: آماده‌سازی فایل‌های Build

### 1.1 دانلود Dependencies (روی سیستم با اینترنت)

**در CMD:**
```cmd
REM کلون کردن پروژه
git clone https://github.com/your-repo/cartable-ui.git
cd cartable-ui\cartable-ui

REM نصب dependencies
npm install

REM آرشیو کردن node_modules
tar -czf node_modules.tar.gz node_modules\
```

**در PowerShell:**
```powershell
# کلون کردن پروژه
git clone https://github.com/your-repo/cartable-ui.git
Set-Location .\cartable-ui\cartable-ui

# نصب dependencies
npm install

# آرشیو کردن node_modules
Compress-Archive -Path .\node_modules -DestinationPath node_modules.zip
```

### 1.2 Build کردن پروژه

قبل از build، فایل `.env.production` بسازید:

**در CMD:**
```cmd
REM ایجاد فایل .env.production
(
echo AUTH_ISSUER=https://your-identity-server.com
echo AUTH_CLIENT_ID=cartable-ui
echo AUTH_CLIENT_SECRET=your-secret-here
echo AUTH_SECRET=your-nextauth-secret-here
echo NEXTAUTH_URL=https://cartable.yourcompany.com
echo NEXT_PUBLIC_API_BASE_URL=https://api.yourcompany.com/api
echo NEXT_PUBLIC_API_TIMEOUT=30000
echo NODE_ENV=production
) > .env.production
```

**در PowerShell:**
```powershell
# ایجاد فایل .env.production
@"
AUTH_ISSUER=https://your-identity-server.com
AUTH_CLIENT_ID=cartable-ui
AUTH_CLIENT_SECRET=your-secret-here
AUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://cartable.yourcompany.com
NEXT_PUBLIC_API_BASE_URL=https://api.yourcompany.com/api
NEXT_PUBLIC_API_TIMEOUT=30000
NODE_ENV=production
"@ | Out-File -FilePath .env.production -Encoding UTF8
```

**Build پروژه:**
```cmd
npm run build
```

فایل build شامل این موارد می‌شود:
- `.next/` (Build output)
- `public/` (Static files)
- `node_modules/`
- `package.json`
- `next.config.ts`

### 1.3 بسته‌بندی برای انتقال

**در CMD:**
```cmd
REM ایجاد پوشه deployment
mkdir deployment-package
cd deployment-package

REM کپی فایل‌های ضروری
xcopy /E /I /Y ..\.next .next\
xcopy /E /I /Y ..\public public\
xcopy /E /I /Y ..\node_modules node_modules\
copy ..\package.json .\
copy ..\next.config.ts .\
copy ..\.env.production .env

REM بازگشت به پوشه اصلی
cd ..

REM فشرده‌سازی
tar -czf cartable-ui-deployment.zip deployment-package\
```

**در PowerShell:**
```powershell
# ایجاد پوشه deployment
New-Item -ItemType Directory -Path "deployment-package" -Force
Set-Location deployment-package

# کپی فایل‌های ضروری
Copy-Item -Path "..\.next" -Destination ".\" -Recurse -Force
Copy-Item -Path "..\public" -Destination ".\" -Recurse -Force
Copy-Item -Path "..\node_modules" -Destination ".\" -Recurse -Force
Copy-Item -Path "..\package.json" -Destination ".\"
Copy-Item -Path "..\next.config.ts" -Destination ".\"
Copy-Item -Path "..\.env.production" -Destination ".env"

# بازگشت به پوشه اصلی
Set-Location ..

# فشرده‌سازی
Compress-Archive -Path .\deployment-package\* -DestinationPath cartable-ui-deployment.zip
```

---

## 🖥️ مرحله 2: نصب و پیکربندی Windows Server

### 2.1 نصب IIS

**در PowerShell (به عنوان Administrator):**
```powershell
# نصب IIS با ابزارهای مدیریتی
Install-WindowsFeature -Name Web-Server -IncludeManagementTools

# بررسی نصب
Get-WindowsFeature -Name Web-Server
```

### 2.2 نصب URL Rewrite Module

1. دانلود فایل `rewrite_amd64_en-US.msi` از [Microsoft IIS Downloads](https://www.iis.net/downloads/microsoft/url-rewrite)
2. انتقال به سرور و نصب:

**در CMD:**
```cmd
REM نصب URL Rewrite Module
msiexec /i rewrite_amd64_en-US.msi /quiet /qn /norestart

REM بررسی نصب
dir "C:\Program Files\IIS\URL Rewrite"
```

**در PowerShell:**
```powershell
# نصب URL Rewrite Module
Start-Process msiexec.exe -Wait -ArgumentList '/i rewrite_amd64_en-US.msi /quiet /qn /norestart'

# بررسی نصب
Test-Path "C:\Program Files\IIS\URL Rewrite"
```

### 2.3 نصب Node.js

1. دانلود Node.js LTS `.msi` از [nodejs.org](https://nodejs.org)
2. نصب روی سرور:

**در CMD:**
```cmd
REM نصب Node.js (فایل را جایگزین کنید)
msiexec /i node-v20.11.0-x64.msi /quiet /qn /norestart

REM بررسی نصب
node --version
npm --version
```

**در PowerShell:**
```powershell
# نصب Node.js
Start-Process msiexec.exe -Wait -ArgumentList '/i node-v20.11.0-x64.msi /quiet /qn /norestart'

# بررسی نصب
node --version
npm --version

# اضافه کردن Node.js به PATH (اگر لازم باشد)
$env:Path += ";C:\Program Files\nodejs\"
[Environment]::SetEnvironmentVariable("Path", $env:Path, [System.EnvironmentVariableTarget]::Machine)
```

### 2.4 نصب iisnode

1. دانلود از [GitHub iisnode Releases](https://github.com/Azure/iisnode/releases)
2. نصب:

**در CMD:**
```cmd
REM نصب iisnode
msiexec /i iisnode-full-v0.2.26-x64.msi /quiet /qn /norestart

REM بررسی نصب
dir "%ProgramFiles%\iisnode"
```

**در PowerShell:**
```powershell
# نصب iisnode
Start-Process msiexec.exe -Wait -ArgumentList '/i iisnode-full-v0.2.26-x64.msi /quiet /qn /norestart'

# بررسی نصب
Test-Path "$env:ProgramFiles\iisnode"
```

---

## 📁 مرحله 3: Deploy اپلیکیشن

### 3.1 ایجاد ساختار پوشه‌ها

**در CMD:**
```cmd
REM ایجاد پوشه اصلی
mkdir "C:\inetpub\wwwroot\cartable-ui"

REM استخراج فایل‌های deployment
tar -xzf cartable-ui-deployment.zip -C "C:\inetpub\wwwroot\cartable-ui"
```

**در PowerShell:**
```powershell
# ایجاد پوشه اصلی
New-Item -ItemType Directory -Path "C:\inetpub\wwwroot\cartable-ui" -Force

# استخراج فایل‌های deployment
Expand-Archive -Path ".\cartable-ui-deployment.zip" -DestinationPath "C:\inetpub\wwwroot\cartable-ui" -Force
```

### 3.2 پیکربندی دسترسی‌ها

**در CMD:**
```cmd
REM دادن دسترسی به IIS_IUSRS
icacls "C:\inetpub\wwwroot\cartable-ui" /grant "IIS_IUSRS:(OI)(CI)F" /T

REM دادن دسترسی به NETWORK SERVICE
icacls "C:\inetpub\wwwroot\cartable-ui" /grant "NETWORK SERVICE:(OI)(CI)F" /T
```

**در PowerShell:**
```powershell
# دادن دسترسی به IIS_IUSRS
$acl = Get-Acl "C:\inetpub\wwwroot\cartable-ui"
$permission = "IIS_IUSRS","FullControl","ContainerInherit,ObjectInherit","None","Allow"
$accessRule = New-Object System.Security.AccessControl.FileSystemAccessRule $permission
$acl.SetAccessRule($accessRule)
Set-Acl "C:\inetpub\wwwroot\cartable-ui" $acl

# یا استفاده از icacls
icacls "C:\inetpub\wwwroot\cartable-ui" /grant "IIS_IUSRS:(OI)(CI)F" /T
```

### 3.3 ایجاد Application Pool در IIS

**در PowerShell:**
```powershell
# Import IIS Module
Import-Module WebAdministration

# ایجاد Application Pool
New-WebAppPool -Name "CartableUIPool"

# تنظیمات Application Pool
Set-ItemProperty "IIS:\AppPools\CartableUIPool" -Name "managedRuntimeVersion" -Value ""
Set-ItemProperty "IIS:\AppPools\CartableUIPool" -Name "enable32BitAppOnWin64" -Value $false
Set-ItemProperty "IIS:\AppPools\CartableUIPool" -Name "processModel.identityType" -Value "ApplicationPoolIdentity"
Set-ItemProperty "IIS:\AppPools\CartableUIPool" -Name "recycling.periodicRestart.time" -Value "00:00:00"
Set-ItemProperty "IIS:\AppPools\CartableUIPool" -Name "startMode" -Value "AlwaysRunning"
Set-ItemProperty "IIS:\AppPools\CartableUIPool" -Name "processModel.idleTimeout" -Value "00:00:00"

# بررسی وضعیت
Get-WebAppPoolState -Name "CartableUIPool"
```

### 3.4 ایجاد وب‌سایت در IIS

**در PowerShell:**
```powershell
# حذف Default Website (اختیاری)
# Remove-Website -Name "Default Web Site"

# ایجاد سایت با HTTP
New-Website -Name "Cartable-UI" `
            -Port 80 `
            -HostHeader "cartable.local" `
            -PhysicalPath "C:\inetpub\wwwroot\cartable-ui" `
            -ApplicationPool "CartableUIPool"

# یا برای HTTPS (اگر SSL Certificate داشته باشید):
New-Website -Name "Cartable-UI" `
            -Port 443 `
            -HostHeader "cartable.yourcompany.com" `
            -PhysicalPath "C:\inetpub\wwwroot\cartable-ui" `
            -ApplicationPool "CartableUIPool" `
            -Ssl

# افزودن Binding
New-WebBinding -Name "Cartable-UI" -Protocol https -Port 443 -HostHeader "cartable.yourcompany.com"

# بررسی وضعیت
Get-Website -Name "Cartable-UI"
```

**در CMD (با استفاده از appcmd):**
```cmd
REM ایجاد سایت
%windir%\system32\inetsrv\appcmd add site /name:"Cartable-UI" /physicalPath:"C:\inetpub\wwwroot\cartable-ui" /bindings:http/*:80:cartable.local

REM تنظیم Application Pool
%windir%\system32\inetsrv\appcmd set site "Cartable-UI" /[path='/'].applicationPool:"CartableUIPool"

REM شروع سایت
%windir%\system32\inetsrv\appcmd start site "Cartable-UI"
```

### 3.5 ایجاد web.config

**در PowerShell:**
```powershell
# ایجاد فایل web.config
$webConfigContent = @"
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>

    <!-- Handler برای iisnode -->
    <handlers>
      <add name="iisnode" path="server.js" verb="*" modules="iisnode" />
    </handlers>

    <!-- URL Rewrite Rules -->
    <rewrite>
      <rules>
        <!-- اولین قانون: هدایت به Node.js -->
        <rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
          <match url="^server.js\/debug[\/]?" />
        </rule>

        <!-- دومین قانون: فایل‌های استاتیک -->
        <rule name="StaticContent">
          <action type="Rewrite" url="public{REQUEST_URI}"/>
        </rule>

        <!-- سومین قانون: Next.js -->
        <rule name="DynamicContent">
          <conditions>
            <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
          </conditions>
          <action type="Rewrite" url="server.js"/>
        </rule>
      </rules>
    </rewrite>

    <!-- تنظیمات iisnode -->
    <iisnode
      node_env="production"
      nodeProcessCountPerApplication="2"
      maxConcurrentRequestsPerProcess="1024"
      maxNamedPipeConnectionRetry="100"
      namedPipeConnectionRetryDelay="250"
      maxNamedPipeConnectionPoolSize="512"
      maxNamedPipePooledConnectionAge="30000"
      asyncCompletionThreadCount="0"
      initialRequestBufferSize="4096"
      maxRequestBufferSize="65536"
      watchedFiles="*.js;iisnode.yml"
      uncFileChangesPollingInterval="5000"
      gracefulShutdownTimeout="60000"
      loggingEnabled="true"
      logDirectory="iisnode"
      debuggingEnabled="false"
      devErrorsEnabled="false"
      flushResponse="false"
      enableXFF="true"
    />

    <!-- Security Headers -->
    <httpProtocol>
      <customHeaders>
        <add name="X-Content-Type-Options" value="nosniff" />
        <add name="X-Frame-Options" value="DENY" />
        <add name="X-XSS-Protection" value="1; mode=block" />
        <add name="Strict-Transport-Security" value="max-age=31536000; includeSubDomains" />
      </customHeaders>
    </httpProtocol>

    <!-- Compression -->
    <urlCompression doStaticCompression="true" doDynamicCompression="true" />

  </system.webServer>
</configuration>
"@

# نوشتن فایل
Set-Content -Path "C:\inetpub\wwwroot\cartable-ui\web.config" -Value $webConfigContent -Encoding UTF8
```

### 3.6 ایجاد server.js (Entry Point)

**در PowerShell:**
```powershell
$serverJsContent = @"
// server.js
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = false
const hostname = 'localhost'
const port = process.env.PORT || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true)
      await handle(req, res, parsedUrl)
    } catch (err) {
      console.error('Error occurred handling', req.url, err)
      res.statusCode = 500
      res.end('internal server error')
    }
  })
    .once('error', (err) => {
      console.error(err)
      process.exit(1)
    })
    .listen(port, () => {
      console.log(`> Ready on http://`+hostname+`:`+port)
    })
})
"@

Set-Content -Path "C:\inetpub\wwwroot\cartable-ui\server.js" -Value $serverJsContent -Encoding UTF8
```

---

## 🔒 مرحله 4: پیکربندی SSL/TLS

### 4.1 نصب Certificate

**در PowerShell:**
```powershell
# Import کردن Certificate
$certPath = "C:\Certificates\cartable.pfx"
$certPassword = ConvertTo-SecureString -String "YourPassword" -Force -AsPlainText
Import-PfxCertificate -FilePath $certPath -CertStoreLocation Cert:\LocalMachine\My -Password $certPassword

# پیدا کردن Thumbprint
Get-ChildItem -Path Cert:\LocalMachine\My | Where-Object {$_.Subject -like "*cartable*"}
```

**در CMD:**
```cmd
REM Import کردن Certificate با certutil
certutil -importpfx -p "YourPassword" "C:\Certificates\cartable.pfx"

REM لیست کردن Certificates
certutil -store My
```

### 4.2 Binding Certificate به سایت

**در PowerShell:**
```powershell
# جایگزینی Thumbprint با مقدار واقعی
$thumbprint = "YOUR_CERT_THUMBPRINT_HERE"

# افزودن HTTPS Binding (اگر قبلاً اضافه نشده)
New-WebBinding -Name "Cartable-UI" -Protocol https -Port 443 -HostHeader "cartable.yourcompany.com"

# Bind کردن Certificate
$cert = Get-Item -Path "Cert:\LocalMachine\My\$thumbprint"
New-Item -Path "IIS:\SslBindings\0.0.0.0!443" -Value $cert -Force

# یا برای hostname خاص:
New-Item -Path "IIS:\SslBindings\!443!cartable.yourcompany.com" -Value $cert -Force
```

**در CMD:**
```cmd
REM Bind کردن Certificate با netsh
netsh http add sslcert ipport=0.0.0.0:443 certhash=YOUR_CERT_THUMBPRINT appid={YOUR-APP-GUID}
```

---

## 🔄 مرحله 5: Session Affinity (اختیاری)

برای Next.js با NextAuth که از JWT استفاده می‌کند، Session Affinity معمولاً ضروری نیست.
این بخش فقط در صورت نیاز اجرا شود.

**در PowerShell:**
```powershell
# فعال کردن Cookie-based affinity
Set-WebConfigurationProperty -PSPath 'MACHINE/WEBROOT/APPHOST' `
  -Filter "system.webServer/proxy/sessionAffinity" `
  -Name "enabled" `
  -Value "True"
```

---

## 📊 مرحله 6: Monitoring و Logging

### 6.1 فعال‌سازی IIS Logs

**در PowerShell:**
```powershell
# تنظیم مسیر لاگ
Set-ItemProperty "IIS:\Sites\Cartable-UI" -Name logFile.directory -Value "C:\inetpub\logs\CartableUI"

# فرمت لاگ: W3C
Set-ItemProperty "IIS:\Sites\Cartable-UI" -Name logFile.logFormat -Value "W3C"

# تنظیم فیلدهای لاگ
Set-ItemProperty "IIS:\Sites\Cartable-UI" -Name logFile.logExtFileFlags -Value "Date,Time,ClientIP,UserName,ServerIP,Method,UriStem,UriQuery,HttpStatus,TimeTaken"

# فعال‌سازی لاگ
Set-ItemProperty "IIS:\Sites\Cartable-UI" -Name logFile.enabled -Value $true
```

**در CMD:**
```cmd
REM فعال‌سازی لاگ با appcmd
%windir%\system32\inetsrv\appcmd set site "Cartable-UI" /logFile.enabled:true
%windir%\system32\inetsrv\appcmd set site "Cartable-UI" /logFile.logFormat:W3C
```

### 6.2 فعال‌سازی iisnode Logging

**در PowerShell:**
```powershell
# ایجاد پوشه لاگ iisnode
New-Item -ItemType Directory -Path "C:\inetpub\wwwroot\cartable-ui\iisnode" -Force

# دادن دسترسی
icacls "C:\inetpub\wwwroot\cartable-ui\iisnode" /grant "IIS_IUSRS:(OI)(CI)F" /T
```

### 6.3 Performance Counters

**در PowerShell:**
```powershell
# نصب Performance Monitor Feature
Install-WindowsFeature Web-Performance -IncludeAllSubFeature

# بررسی Performance Counters موجود
Get-Counter -ListSet "*iisnode*"
Get-Counter -ListSet "*ASP.NET*"
```

---

## 🚀 مرحله 7: راه‌اندازی و تست

### 7.1 راه‌اندازی سرویس

**در PowerShell:**
```powershell
# Restart Application Pool
Restart-WebAppPool -Name "CartableUIPool"

# Restart Website
Restart-WebItem "IIS:\Sites\Cartable-UI"

# بررسی وضعیت Application Pool
Get-WebAppPoolState -Name "CartableUIPool"

# بررسی وضعیت Website
Get-WebItemState "IIS:\Sites\Cartable-UI"

# شروع سایت (اگر متوقف باشد)
Start-Website -Name "Cartable-UI"
Start-WebAppPool -Name "CartableUIPool"
```

**در CMD:**
```cmd
REM Restart Application Pool
%windir%\system32\inetsrv\appcmd recycle apppool "CartableUIPool"

REM شروع سایت
%windir%\system32\inetsrv\appcmd start site "Cartable-UI"

REM بررسی وضعیت
%windir%\system32\inetsrv\appcmd list site "Cartable-UI"
```

### 7.2 تست‌های اولیه

**در PowerShell:**
```powershell
# تست localhost
Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing

# تست با domain
Invoke-WebRequest -Uri "https://cartable.yourcompany.com" -UseBasicParsing

# تست با curl (اگر نصب باشد)
curl -I http://localhost

# بررسی پورت‌های باز
Test-NetConnection -ComputerName localhost -Port 80
Test-NetConnection -ComputerName localhost -Port 443
```

**در CMD:**
```cmd
REM تست با curl
curl -I http://localhost
curl -I https://cartable.yourcompany.com

REM یا با PowerShell از CMD
powershell -Command "Invoke-WebRequest -Uri 'http://localhost' -UseBasicParsing"
```

### 7.3 بررسی لاگ‌ها

**در PowerShell:**
```powershell
# بررسی لاگ‌های iisnode
Get-Content "C:\inetpub\wwwroot\cartable-ui\iisnode\*.log" -Tail 50

# بررسی Event Viewer
Get-EventLog -LogName Application -Source "iisnode" -Newest 10

# بررسی IIS Logs
Get-Content "C:\inetpub\logs\LogFiles\W3SVC1\*.log" -Tail 50
```

**در CMD:**
```cmd
REM نمایش آخرین لاگ‌های iisnode
type "C:\inetpub\wwwroot\cartable-ui\iisnode\*.log"

REM Event Viewer
eventvwr.msc
```

---

## 🛠️ مرحله 8: عیب‌یابی رایج

### 8.1 اپلیکیشن شروع نمی‌شود

**در PowerShell:**
```powershell
# بررسی لاگ‌های iisnode
Get-ChildItem "C:\inetpub\wwwroot\cartable-ui\iisnode" |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1 |
    Get-Content -Tail 50

# بررسی Event Viewer
Get-EventLog -LogName Application -Newest 20 |
    Where-Object {$_.Source -like "*iis*" -or $_.Source -like "*node*"}

# بررسی وضعیت Application Pool
Get-WebAppPoolState -Name "CartableUIPool"

# بررسی Process های Node.js
Get-Process -Name node -ErrorAction SilentlyContinue
```

**در CMD:**
```cmd
REM بررسی Process های Node
tasklist | findstr node

REM بررسی پورت‌های در حال استفاده
netstat -ano | findstr :3000
netstat -ano | findstr :80
```

### 8.2 خطای 500 Internal Server Error

**چک‌لیست:**
1. بررسی `web.config` برای خطای syntax
2. بررسی دسترسی‌های پوشه
3. بررسی Environment Variables
4. بررسی فایل `.env`

**در PowerShell:**
```powershell
# بررسی دسترسی‌ها
Get-Acl "C:\inetpub\wwwroot\cartable-ui" | Format-List

# بررسی web.config
Test-Path "C:\inetpub\wwwroot\cartable-ui\web.config"
Get-Content "C:\inetpub\wwwroot\cartable-ui\web.config" -ErrorAction SilentlyContinue

# بررسی Environment Variables
Get-ChildItem Env: | Where-Object {$_.Name -like "*NODE*"}
```

### 8.3 خطای 502 Bad Gateway

این خطا معمولاً وقتی اتفاق می‌افتد که Node.js process شروع نشده یا crash کرده باشد.

**در PowerShell:**
```powershell
# بررسی Process های Node.js
Get-Process -Name node -ErrorAction SilentlyContinue | Format-Table -AutoSize

# اگر process وجود نداشت، Application Pool را restart کنید
Restart-WebAppPool -Name "CartableUIPool"

# بررسی لاگ‌های iisnode
Get-Content "C:\inetpub\wwwroot\cartable-ui\iisnode\*.log" -Tail 100
```

### 8.4 خطای Module Not Found

**در PowerShell:**
```powershell
# بررسی وجود node_modules
Test-Path "C:\inetpub\wwwroot\cartable-ui\node_modules"

# نصب مجدد dependencies در سرور
Set-Location "C:\inetpub\wwwroot\cartable-ui"
npm install --production

# بررسی package.json
Test-Path "C:\inetpub\wwwroot\cartable-ui\package.json"
```

### 8.5 مشکلات Performance

**در PowerShell:**
```powershell
# بررسی استفاده از CPU و Memory
Get-Process -Name node | Format-Table Name, CPU, WS -AutoSize

# افزایش تعداد worker processes در web.config
# nodeProcessCountPerApplication را به 4 یا 8 تغییر دهید

# کاهش idle timeout
Set-ItemProperty "IIS:\AppPools\CartableUIPool" -Name "processModel.idleTimeout" -Value "00:00:00"
```

---

## 📋 Checklist نهایی

**پیش از Deploy:**
- [ ] Node.js نصب شده است
- [ ] IIS و URL Rewrite Module نصب شده است
- [ ] iisnode نصب شده است
- [ ] فایل‌های build آماده است
- [ ] فایل `.env` با مقادیر صحیح تنظیم شده

**حین Deploy:**
- [ ] پوشه اپلیکیشن ایجاد شد
- [ ] فایل‌های build کپی شد
- [ ] دسترسی‌های پوشه تنظیم شد
- [ ] Application Pool ایجاد و پیکربندی شد
- [ ] Website در IIS ایجاد شد
- [ ] `web.config` با تنظیمات صحیح ایجاد شد
- [ ] `server.js` ایجاد شد

**پس از Deploy:**
- [ ] SSL Certificate نصب و bind شد
- [ ] Logging فعال شد
- [ ] سایت راه‌اندازی شد
- [ ] تست‌های اولیه انجام شد
- [ ] لاگ‌ها بررسی شد
- [ ] Performance مانیتور شد

---

## 🔧 دستورات مفید

### مدیریت IIS از PowerShell

```powershell
# لیست کردن تمام سایت‌ها
Get-Website

# لیست کردن تمام Application Pools
Get-WebAppPool

# متوقف کردن سایت
Stop-Website -Name "Cartable-UI"

# شروع سایت
Start-Website -Name "Cartable-UI"

# Recycle کردن Application Pool
Restart-WebAppPool -Name "CartableUIPool"

# حذف سایت
Remove-Website -Name "Cartable-UI"

# حذف Application Pool
Remove-WebAppPool -Name "CartableUIPool"
```

### مانیتورینگ

```powershell
# نمایش لاگ‌ها به صورت Real-time
Get-Content "C:\inetpub\logs\LogFiles\W3SVC1\u_ex$(Get-Date -Format yyMMdd).log" -Wait -Tail 10

# بررسی استفاده از منابع
Get-Counter '\Process(node)\% Processor Time'
Get-Counter '\Process(node)\Working Set'

# تعداد درخواست‌های فعال
Get-Counter '\Web Service(_Total)\Current Connections'
```

---

## 📞 پشتیبانی و Troubleshooting

### منابع لاگ

1. **IIS Logs**: `C:\inetpub\logs\LogFiles\`
2. **iisnode Logs**: `C:\inetpub\wwwroot\cartable-ui\iisnode\`
3. **Event Viewer**: Application و System logs
4. **Node.js stdout/stderr**: در لاگ‌های iisnode

### دستورات مفید برای عیب‌یابی

**در PowerShell:**
```powershell
# خلاصه وضعیت سیستم
Get-Website | Format-Table Name, State, PhysicalPath
Get-WebAppPool | Format-Table Name, State, ManagedRuntimeVersion

# بررسی فایل‌های قفل شده
Get-Process | Where-Object {$_.Path -like "*cartable-ui*"}

# پاک کردن cache IIS
Stop-Website -Name "Cartable-UI"
Remove-Item "C:\inetpub\wwwroot\cartable-ui\.next\cache\*" -Recurse -Force
Start-Website -Name "Cartable-UI"
```

در صورت بروز مشکل:
1. ✅ لاگ‌های IIS را بررسی کنید
2. ✅ Event Viewer ویندوز را چک کنید
3. ✅ لاگ‌های iisnode را مطالعه کنید
4. ✅ Process های Node.js را بررسی کنید
5. ✅ دسترسی‌های فایل را تأیید کنید

---

## 📝 یادداشت‌های نهایی

### بهترین روش‌ها (Best Practices)

1. **همیشه از HTTPS استفاده کنید** برای محیط Production
2. **Logging را فعال نگه دارید** برای عیب‌یابی
3. **Application Pool را به صورت منظم recycle کنید** (مثلاً روزانه ساعت 2 بامداد)
4. **Backup منظم** از فایل‌های اپلیکیشن و تنظیمات بگیرید
5. **Performance Counters را مانیتور کنید**
6. **Security Headers را تنظیم کنید** (در web.config موجود است)

### نکات امنیتی

1. دسترسی‌های فایل را محدود کنید
2. از HTTPS با Certificate معتبر استفاده کنید
3. `devErrorsEnabled` را در production خاموش کنید
4. لاگ‌ها را منظماً بررسی کنید
5. Windows و IIS را به‌روز نگه دارید

---

**نویسنده**: تیم توسعه Cartable UI
**آخرین به‌روزرسانی**: 2025-11-22
**نسخه**: 2.0.0

</div>
