# راهنمای Deploy بر روی Windows Server و IIS

<div dir="rtl">

این مستند راهنمای کامل برای نصب و راه‌اندازی اپلیکیشن Cartable UI بر روی Windows Server و IIS است.

## 📋 پیش‌نیازها

### نرم‌افزارهای مورد نیاز

1. **Windows Server 2019 یا بالاتر**
2. **IIS 10.0 یا بالاتر**
3. **Node.js LTS (نسخه 18 یا 20)** - برای build
4. **URL Rewrite Module برای IIS**
5. **Application Request Routing (ARR)** - برای Load Balancer
6. **.NET Core Hosting Bundle** (اختیاری)

### توجه مهم: محیط بدون اینترنت

**این راهنما با فرض عدم دسترسی به اینترنت در سرور production نوشته شده است.**

تمام فایل‌های نصبی و dependencies باید از قبل دانلود و آماده شوند.

---

## 🎯 معماری Deployment

```
                    ┌─────────────────┐
                    │  Load Balancer  │
                    │      (IIS)      │
                    └────────┬────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
        ┌───────▼────────┐       ┌───────▼────────┐
        │   Server 1     │       │   Server 2     │
        │   (IIS + App)  │       │   (IIS + App)  │
        └────────────────┘       └────────────────┘
```

---

## 📦 مرحله 1: آماده‌سازی فایل‌های Build

### 1.1 دانلود Dependencies (روی سیستم با اینترنت)

```bash
# کلون کردن پروژه
git clone https://github.com/your-repo/cartable-ui.git
cd cartable-ui/cartable-ui

# نصب dependencies
npm install

# آرشیو کردن node_modules
tar -czf node_modules.tar.gz node_modules/
```

### 1.2 Build کردن پروژه

قبل از build، فایل `.env.production` بسازید:

```bash
# .env.production
AUTH_ISSUER=https://your-identity-server.com
AUTH_CLIENT_ID=cartable-ui
AUTH_CLIENT_SECRET=your-secret-here
AUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=https://cartable.yourcompany.com
NEXT_PUBLIC_API_BASE_URL=https://api.yourcompany.com/api
NEXT_PUBLIC_API_TIMEOUT=30000
NODE_ENV=production
```

**Build:**

```bash
# Build پروژه
npm run build

# فایل build شامل این موارد می‌شود:
# - .next/ (Build output)
# - public/ (Static files)
# - node_modules/
# - package.json
# - next.config.ts
```

### 1.3 بسته‌بندی برای انتقال

```bash
# ایجاد پوشه deployment
mkdir deployment-package
cd deployment-package

# کپی فایل‌های ضروری
cp -r ../.next ./
cp -r ../public ./
cp -r ../node_modules ./
cp ../package.json ./
cp ../next.config.ts ./
cp ../.env.production ./.env

# ایجاد فایل ecosystem برای PM2 (اختیاری)
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'cartable-ui',
    script: 'node_modules/next/dist/bin/next',
    args: 'start -p 3000',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# فشرده‌سازی
cd ..
zip -r cartable-ui-deployment.zip deployment-package/
```

---

## 🖥️ مرحله 2: نصب و پیکربندی Windows Server

### 2.1 نصب IIS

```powershell
# اجرا به عنوان Administrator
Install-WindowsFeature -name Web-Server -IncludeManagementTools
```

### 2.2 نصب URL Rewrite Module

1. دانلود فایل `rewrite_amd64_en-US.msi` از [اینجا](https://www.iis.net/downloads/microsoft/url-rewrite)
2. انتقال به سرور و نصب:

```powershell
Start-Process msiexec.exe -Wait -ArgumentList '/i rewrite_amd64_en-US.msi /quiet'
```

### 2.3 نصب Node.js (برای اجرای Next.js)

1. دانلود Node.js LTS `.msi` از [nodejs.org](https://nodejs.org)
2. نصب روی سرور:

```powershell
# نصب silent
Start-Process msiexec.exe -Wait -ArgumentList '/i node-v20.x.x-x64.msi /quiet'

# بررسی نصب
node --version
npm --version
```

### 2.4 نصب iisnode (برای اجرای Node.js در IIS)

1. دانلود از [GitHub](https://github.com/Azure/iisnode/releases)
2. نصب:

```powershell
Start-Process msiexec.exe -Wait -ArgumentList '/i iisnode-full-v0.2.26-x64.msi /quiet'
```

---

## 📁 مرحله 3: Deploy اپلیکیشن روی Server 1 و Server 2

### 3.1 ایجاد ساختار پوشه‌ها

```powershell
# ایجاد پوشه اصلی
New-Item -ItemType Directory -Path "C:\inetpub\wwwroot\cartable-ui" -Force

# استخراج فایل‌های deployment
Expand-Archive -Path "cartable-ui-deployment.zip" -DestinationPath "C:\inetpub\wwwroot\cartable-ui"
```

### 3.2 پیکربندی دسترسی‌ها

```powershell
# دادن دسترسی به IIS_IUSRS
icacls "C:\inetpub\wwwroot\cartable-ui" /grant "IIS_IUSRS:(OI)(CI)F" /T
```

### 3.3 ایجاد Application Pool در IIS

```powershell
# Import IIS Module
Import-Module WebAdministration

# ایجاد Application Pool
New-WebAppPool -Name "CartableUIPool"

# تنظیمات Application Pool
Set-ItemProperty IIS:\AppPools\CartableUIPool -Name managedRuntimeVersion -Value ""
Set-ItemProperty IIS:\AppPools\CartableUIPool -Name enable32BitAppOnWin64 -Value $false
Set-ItemProperty IIS:\AppPools\CartableUIPool -Name processModel.identityType -Value "ApplicationPoolIdentity"
Set-ItemProperty IIS:\AppPools\CartableUIPool -Name recycling.periodicRestart.time -Value "00:00:00"
Set-ItemProperty IIS:\AppPools\CartableUIPool -Name startMode -Value "AlwaysRunning"
```

### 3.4 ایجاد وب‌سایت در IIS

```powershell
# ایجاد سایت
New-Website -Name "Cartable-UI" `
            -Port 80 `
            -HostHeader "cartable.local" `
            -PhysicalPath "C:\inetpub\wwwroot\cartable-ui" `
            -ApplicationPool "CartableUIPool"

# یا برای HTTPS:
New-Website -Name "Cartable-UI" `
            -Port 443 `
            -HostHeader "cartable.yourcompany.com" `
            -PhysicalPath "C:\inetpub\wwwroot\cartable-ui" `
            -ApplicationPool "CartableUIPool" `
            -Ssl

# افزودن Binding
New-WebBinding -Name "Cartable-UI" -Protocol https -Port 443 -HostHeader "cartable.yourcompany.com"
```

### 3.5 ایجاد web.config

```xml
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
```

### 3.6 ایجاد server.js (Entry Point)

```javascript
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
      console.log(`> Ready on http://${hostname}:${port}`)
    })
})
```

---

## ⚖️ مرحله 4: پیکربندی Load Balancer

### 4.1 نصب Application Request Routing (ARR)

1. دانلود ARR از [اینجا](https://www.iis.net/downloads/microsoft/application-request-routing)
2. نصب روی سرور Load Balancer:

```powershell
Start-Process msiexec.exe -Wait -ArgumentList '/i ARR_3.0_x64.msi /quiet'
```

### 4.2 فعال‌سازی Proxy در ARR

```powershell
# فعال کردن proxy
Import-Module WebAdministration
Set-WebConfigurationProperty -pspath 'MACHINE/WEBROOT/APPHOST' -filter "system.webServer/proxy" -name "enabled" -value "True"
```

### 4.3 ایجاد Server Farm

```powershell
# ایجاد Server Farm
$farmName = "CartableFarm"

# اضافه کردن سرورها
$server1 = "192.168.1.10" # IP سرور 1
$server2 = "192.168.1.11" # IP سرور 2

# از طریق IIS Manager:
# 1. Server Farms > Create Server Farm
# 2. نام: CartableFarm
# 3. Add Servers: 192.168.1.10:443 و 192.168.1.11:443
```

### 4.4 پیکربندی URL Rewrite برای Load Balancer

```xml
<!-- web.config در سایت Load Balancer -->
<?xml version="1.0" encoding="UTF-8"?>
<configuration>
  <system.webServer>
    <rewrite>
      <rules>
        <rule name="ARR_CartableFarm_loadbalance" patternSyntax="Wildcard" stopProcessing="true">
          <match url="*" />
          <action type="Rewrite" url="http://CartableFarm/{R:0}" />
        </rule>
      </rules>
    </rewrite>
  </system.webServer>
</configuration>
```

### 4.5 تنظیمات Health Check

```powershell
# در IIS Manager > Server Farms > CartableFarm > Health Test
# URL: /api/health (باید این endpoint را در Next.js اضافه کنید)
# Interval: 30 seconds
# Timeout: 10 seconds
```

### 4.6 تنظیمات Load Balancing Algorithm

```powershell
# از طریق IIS Manager:
# Server Farms > CartableFarm > Load Balance
# Algorithm: Least Response Time یا Weighted Round Robin
```

---

## 🔒 مرحله 5: پیکربندی SSL/TLS

### 5.1 نصب Certificate

```powershell
# Import کردن Certificate
$certPath = "C:\Certificates\cartable.pfx"
$certPassword = ConvertTo-SecureString -String "YourPassword" -Force -AsPlainText
Import-PfxCertificate -FilePath $certPath -CertStoreLocation Cert:\LocalMachine\My -Password $certPassword

# پیدا کردن Thumbprint
Get-ChildItem -Path Cert:\LocalMachine\My | Where-Object {$_.Subject -like "*cartable*"}
```

### 5.2 Binding Certificate به سایت

```powershell
$thumbprint = "YOUR_CERT_THUMBPRINT"

New-WebBinding -Name "Cartable-UI" -Protocol https -Port 443
Get-Item -Path "Cert:\LocalMachine\My\$thumbprint" | New-Item -Path "IIS:\SslBindings\0.0.0.0!443"
```

---

## 🔄 مرحله 6: Session Affinity (Sticky Sessions)

برای Next.js با NextAuth، Session Affinity ضروری نیست چون از JWT استفاده می‌شود.
ولی اگر نیاز باشد:

```powershell
# فعال کردن Cookie-based affinity
Set-WebConfigurationProperty -pspath 'MACHINE/WEBROOT/APPHOST' `
  -filter "system.webServer/proxy/sessionAffinity" `
  -name "enabled" `
  -value "True"
```

---

## 📊 مرحله 7: Monitoring و Logging

### 7.1 فعال‌سازی IIS Logs

```powershell
# تنظیم مسیر لاگ
Set-ItemProperty "IIS:\Sites\Cartable-UI" -Name logFile.directory -Value "C:\inetpub\logs\CartableUI"

# فرمت لاگ: W3C
Set-ItemProperty "IIS:\Sites\Cartable-UI" -Name logFile.logFormat -Value "W3C"
```

### 7.2 Application Logging

در `next.config.ts` logging را فعال کنید و لاگ‌ها را در Windows Event Log بنویسید.

### 7.3 Performance Counters

```powershell
# نصب Performance Monitor
Add-WindowsFeature Web-Performance -IncludeAllSubFeature
```

---

## 🚀 مرحله 8: راه‌اندازی و تست

### 8.1 راه‌اندازی سرویس

```powershell
# Restart Application Pool
Restart-WebAppPool -Name "CartableUIPool"

# Restart Website
Restart-WebItem "IIS:\Sites\Cartable-UI"

# بررسی وضعیت
Get-WebItemState "IIS:\Sites\Cartable-UI"
```

### 8.2 تست‌های اولیه

```powershell
# تست localhost
Invoke-WebRequest -Uri "http://localhost" -UseBasicParsing

# تست با domain
Invoke-WebRequest -Uri "https://cartable.yourcompany.com" -UseBasicParsing

# تست Load Balancer
Invoke-WebRequest -Uri "https://lb.yourcompany.com" -UseBasicParsing
```

### 8.3 تست Load Balancing

```bash
# از یک کلاینت، چند بار درخواست بزنید
for i in {1..10}; do curl -I https://cartable.yourcompany.com; done

# بررسی کنید که response از هر دو سرور می‌آید
# (با بررسی لاگ‌ها یا response headers)
```

---

## 🛠️ مرحله 9: عیب‌یابی رایج

### 9.1 اپلیکیشن شروع نمی‌شود

```powershell
# بررسی لاگ‌های iisnode
Get-Content "C:\inetpub\wwwroot\cartable-ui\iisnode\*.txt" -Tail 50

# بررسی Event Viewer
Get-EventLog -LogName Application -Source "iisnode" -Newest 10
```

### 9.2 خطای 500

- بررسی `web.config`
- بررسی دسترسی‌های پوشه
- بررسی Environment Variables

### 9.3 Load Balancer کار نمی‌کند

```powershell
# بررسی وضعیت سرورها در Farm
Get-WebConfiguration -Filter /system.webServer/proxy/serverFarm
```

---

## 📋 Checklist نهایی

- [ ] Node.js نصب شده
- [ ] IIS و ماژول‌های مورد نیاز نصب شده
- [ ] فایل‌های build کپی شده
- [ ] web.config صحیح است
- [ ] server.js ایجاد شده
- [ ] Application Pool پیکربندی شده
- [ ] SSL Certificate نصب شده
- [ ] Load Balancer پیکربندی شده
- [ ] Health Check فعال است
- [ ] Logging فعال است
- [ ] تست انجام شده

---

## 📞 پشتیبانی

در صورت بروز مشکل:
1. لاگ‌های IIS را بررسی کنید
2. Event Viewer ویندوز را چک کنید
3. لاگ‌های iisnode را مطالعه کنید

---

**نویسنده**: تیم توسعه Cartable UI
**آخرین به‌روزرسانی**: 2025-11-20
**نسخه**: 1.0.0

</div>
