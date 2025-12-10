# راهنمای دیپلوی Next.js با IIS Reverse Proxy و PM2

این راهنما نحوه دیپلوی اپلیکیشن Next.js با استفاده از IIS Reverse Proxy و PM2 را توضیح می‌دهد. در این روش:
- **PM2** به عنوان process manager برای اجرای Next.js استفاده می‌شود
- **pm2-installer** برای نصب خودکار PM2 به عنوان Windows Service
- **IIS Reverse Proxy** برای هدایت درخواست‌ها به PM2

## مزایای این روش

✅ **Auto-restart**: در صورت خطا یا ریستارت سرور، اپلیکیشن خودکار اجرا می‌شود
✅ **بدون نیاز به iisnode**: استفاده از Reverse Proxy به جای iisnode
✅ **عملکرد بهتر**: PM2 بهینه‌تر از iisnode است
✅ **سرویس پایدار**: pm2-installer از node-windows مدرن استفاده می‌کند و به‌روز است
✅ **Local Service**: اجرای PM2 به عنوان Local Service (امن‌تر از Local System)
✅ **مانیتورینگ آسان**: امکان مانیتور کردن اپلیکیشن با PM2
✅ **کار بدون اینترنت**: تمام پکیج‌ها به صورت آفلاین نصب می‌شوند با قابلیت bundle

## پیش‌نیازها

### 1. نصب Node.js
- دانلود و نصب [Node.js LTS](https://nodejs.org/)
- بررسی نصب:
```bash
node --version
npm --version
```

### 2. نصب Git (برای pm2-installer)
- **مهم**: pm2-installer از GitHub نصب می‌شود و نیاز به Git دارد
- دانلود و نصب [Git for Windows](https://git-scm.com/download/win)
- بررسی نصب:
```bash
git --version
```
- در صورت عدم دسترسی به اینترنت، می‌توانید pm2-installer را به صورت دستی از GitHub دانلود کنید

### 3. نصب و پیکربندی IIS

#### نصب IIS
1. Control Panel → Programs → Turn Windows features on or off
2. انتخاب **Internet Information Services** و **Web Management Tools**
3. انتخاب **World Wide Web Services** → **Application Development Features** → **ASP.NET 4.x**

#### نصب Application Request Routing (ARR)
1. دانلود [IIS Application Request Routing](https://www.iis.net/downloads/microsoft/application-request-routing) از سرور دیگری که اینترنت دارد
2. انتقال فایل نصبی به سرور
3. نصب ARR روی سرور

#### نصب URL Rewrite Module
1. دانلود [IIS URL Rewrite Module](https://www.iis.net/downloads/microsoft/url-rewrite) از سرور دیگری
2. انتقال فایل نصبی به سرور
3. نصب URL Rewrite روی سرور

#### فعال کردن Proxy در IIS
1. باز کردن IIS Manager
2. انتخاب Server (نه سایت)
3. دوبار کلیک روی **Application Request Routing Cache**
4. در سمت راست کلیک روی **Server Proxy Settings**
5. چک کردن گزینه **Enable proxy**
6. کلیک روی **Apply**

## مراحل دیپلوی

### 1. آماده‌سازی فایل‌های اپلیکیشن

فایل‌های زیر باید در پروژه وجود داشته باشند:
- `web.config` - تنظیمات IIS Reverse Proxy
- `ecosystem.config.js` - تنظیمات PM2
- `deploy-iis.ps1` - اسکریپت خودکار دیپلوی
- `package.json` - با اسکریپت‌های PM2

### 2. کپی فایل‌های اپلیکیشن به سرور

کل پروژه را به مسیر مورد نظر در سرور کپی کنید، مثلاً:
```
C:\inetpub\wwwroot\cartable-ui
```

### 3. نصب Dependencies (در صورت عدم دسترسی به اینترنت)

اگر روی سرور اینترنت ندارید، دو روش دارید:

#### روش 1: کپی node_modules (ساده‌تر)
```bash
# روی سیستم با اینترنت:
npm install

# کپی کل پوشه node_modules به سرور
```

#### روش 2: استفاده از pm2-installer bundle (پیشنهادی)
```bash
# روی سیستم با اینترنت و Git (همان OS سرور):
npm install -g github:jessety/pm2-installer

# پیدا کردن مسیر pm2-installer
npm root -g
# مثلاً: C:\Users\YourUser\AppData\Roaming\npm\node_modules

# رفتن به دایرکتوری pm2-installer
cd "C:\Users\YourUser\AppData\Roaming\npm\node_modules\pm2-installer"
npm run bundle

# این کار cache آفلاین ایجاد می‌کند
# کل دایرکتوری pm2-installer را به سرور کپی کنید به مسیر:
# C:\Users\YourUser\AppData\Roaming\npm\node_modules\pm2-installer
```

#### روش 3: دانلود دستی pm2-installer (بدون Git)
```bash
# اگر Git روی سرور ندارید:
# 1. دانلود ZIP از: https://github.com/jessety/pm2-installer
# 2. Extract کردن به یک پوشه
# 3. در آن پوشه: npm install
# 4. npm run configure
# 5. npm run setup
```

### 4. اجرای اسکریپت دیپلوی

باز کردن PowerShell به عنوان **Administrator** و اجرای:

```powershell
cd C:\inetpub\wwwroot\cartable-ui
.\deploy-iis.ps1
```

#### پارامترهای اسکریپت:

```powershell
# دیپلوی با مسیر و پورت سفارشی
.\deploy-iis.ps1 -AppPath "C:\inetpub\wwwroot\cartable-ui" -Port 3000

# دیپلوی بدون npm install (برای آفلاین - نیاز به node_modules از قبل کپی شده)
.\deploy-iis.ps1 -SkipInstall

# دیپلوی بدون build مجدد (برای آفلاین - نیاز به .next از قبل کپی شده)
.\deploy-iis.ps1 -SkipBuild

# دیپلوی کاملاً آفلاین (node_modules و .next از قبل کپی شده)
.\deploy-iis.ps1 -SkipInstall -SkipBuild

# تغییر نام سرویس
.\deploy-iis.ps1 -ServiceName "MyCustomServiceName"

# حذف سرویس
.\deploy-iis.ps1 -UninstallOnly
```

#### نکته مهم برای نصب آفلاین:

اگر از `-SkipInstall` و `-SkipBuild` استفاده می‌کنید:

1. **node_modules**: از سیستم با اینترنت کپی کنید
2. **.next**: روی سیستم با اینترنت `npm run build` کنید و کپی کنید
3. **package-lock.json**: همراه با بقیه فایل‌ها کپی کنید

```powershell
# روی سیستم با اینترنت:
npm install
npm run build

# کپی این پوشه‌ها و فایل‌ها به سرور:
# - node_modules/
# - .next/
# - package-lock.json
```

### 5. پیکربندی IIS Site

1. باز کردن IIS Manager
2. کلیک راست روی **Sites** → **Add Website**
3. تنظیمات:
   - **Site name**: Cartable-UI
   - **Physical path**: `C:\inetpub\wwwroot\cartable-ui`
   - **Binding**: HTTP یا HTTPS با IP و پورت دلخواه
4. اطمینان از وجود فایل `web.config` در ریشه سایت
5. کلیک روی **OK**

### 6. تست اپلیکیشن

1. مرور به آدرس سایت در IIS
2. بررسی لاگ‌ها:
```bash
npm run pm2:logs
```

3. بررسی وضعیت PM2:
```bash
npm run pm2:monit
```

## مدیریت اپلیکیشن

### دستورات PM2

```bash
# مشاهده لیست اپلیکیشن‌ها
pm2 list

# مشاهده لاگ‌ها
npm run pm2:logs
# یا
pm2 logs cartable-ui

# ریستارت اپلیکیشن
npm run pm2:restart
# یا
pm2 restart cartable-ui

# توقف اپلیکیشن
npm run pm2:stop
# یا
pm2 stop cartable-ui

# شروع مجدد اپلیکیشن
npm run pm2:start
# یا
pm2 start ecosystem.config.js

# مانیتورینگ
npm run pm2:monit
# یا
pm2 monit

# حذف اپلیکیشن از PM2
npm run pm2:delete
# یا
pm2 delete cartable-ui
```

### مدیریت Windows Service

```powershell
# بررسی وضعیت سرویس (pm2-installer uses "PM2" as service name)
Get-Service PM2

# توقف سرویس
Stop-Service PM2

# شروع سرویس
Start-Service PM2

# ریستارت سرویس
Restart-Service PM2

# حذف سرویس (استفاده از pm2-installer)
cd C:\inetpub\wwwroot\cartable-ui
npm run remove
```

### نکات مهم pm2-installer

1. **PM2 Home Directory**: `C:\ProgramData\pm2` (نه `%USERPROFILE%\.pm2`)
2. **npm Global Directory**: `C:\ProgramData\npm` (نه `%APPDATA%\npm`)
3. **Service User**: Local Service (امن‌تر از Local System)
4. **دسترسی PM2**: باید از elevated PowerShell استفاده کنید (Run as Administrator)

```powershell
# برای تعامل با PM2، از PowerShell با دسترسی Administrator استفاده کنید:
pm2 list
pm2 logs
pm2 monit
```

## به‌روزرسانی اپلیکیشن

```bash
# 1. کپی فایل‌های جدید به سرور

# 2. رفتن به مسیر اپلیکیشن
cd C:\inetpub\wwwroot\cartable-ui

# 3. نصب dependencies جدید (در صورت تغییر)
npm install

# 4. Build مجدد
npm run build

# 5. ریستارت PM2
npm run pm2:restart
```

## بررسی مشکلات (Troubleshooting)

### 1. اپلیکیشن اجرا نمی‌شود

```bash
# بررسی لاگ‌های PM2
npm run pm2:logs

# بررسی وضعیت PM2
pm2 list

# بررسی پورت
netstat -ano | findstr :3000
```

### 2. خطای IIS 502 Bad Gateway

- بررسی اینکه PM2 در حال اجرا است: `pm2 list`
- بررسی اینکه پورت 3000 در دسترس است
- بررسی فایل `web.config` و مسیر Reverse Proxy
- بررسی اینکه ARR Proxy فعال است در IIS

### 3. سرویس PM2 شروع نمی‌شود

```powershell
# حذف و نصب مجدد با pm2-installer
cd C:\inetpub\wwwroot\cartable-ui
npm run remove

# نصب مجدد
pm2 start ecosystem.config.js
pm2 save
npm run setup
```

### 4. اپلیکیشن پس از ریستارت سرور اجرا نمی‌شود

```powershell
# بررسی وضعیت سرویس
Get-Service PM2

# تنظیم Automatic startup (pm2-installer به طور پیش‌فرض این کار را انجام می‌دهد)
Set-Service PM2 -StartupType Automatic

# شروع سرویس
Start-Service PM2

# بررسی PM2 home directory
# باید C:\ProgramData\pm2 باشد نه %USERPROFILE%\.pm2
[System.Environment]::GetEnvironmentVariable('PM2_HOME', 'Machine')
```

### 5. مشکلات Environment Variables

اگر `.env` فایل‌ها load نمی‌شوند:

1. فایل `.env.production` را در ریشه پروژه قرار دهید
2. یا environment variables را در `ecosystem.config.js` تعریف کنید:

```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3000,
  NEXT_PUBLIC_API_BASE_URL: 'https://api.example.com',
  // ... سایر متغیرها
}
```

## ساختار فایل‌ها

```
cartable-ui/
├── .next/                    # فولدر build (بعد از npm run build)
├── node_modules/             # dependencies
├── public/                   # فایل‌های استاتیک
├── src/                      # سورس کد
├── logs/                     # لاگ‌های PM2 (ساخته می‌شود توسط اسکریپت)
├── .env.production           # متغیرهای محیطی
├── ecosystem.config.js       # تنظیمات PM2
├── web.config                # تنظیمات IIS Reverse Proxy
├── deploy-iis.ps1            # اسکریپت دیپلوی
├── package.json              # dependencies و scripts
├── next.config.ts            # تنظیمات Next.js
└── DEPLOYMENT.md             # این فایل
```

## تنظیمات امنیتی

### فایل web.config
- محافظت از فایل‌های `.env`
- اضافه کردن Security Headers
- محدودیت حجم درخواست‌ها

### فایروال
```powershell
# باز کردن پورت 3000 فقط برای localhost (پیشنهادی)
# این پورت فقط برای IIS قابل دسترسی است
New-NetFirewallRule -DisplayName "PM2 Next.js" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow -LocalAddress 127.0.0.1
```

## منابع

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [pm2-installer (GitHub)](https://github.com/jessety/pm2-installer)
- [pm2-installer (npm)](https://www.npmjs.com/package/pm2-installer)
- [IIS Application Request Routing](https://www.iis.net/downloads/microsoft/application-request-routing)
- [IIS URL Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite)

## مقایسه روش‌های مختلف Windows Service

### PM2 با pm2-installer (انتخاب ما)

| ویژگی | pm2-installer | pm2-windows-service | NSSM |
|-------|--------------|-------------------|------|
| آخرین به‌روزرسانی | 2024 (فعال) | 2018 (متوقف شده) | 2017 |
| node-windows | نسخه جدید | نسخه قدیمی | - |
| Service User | Local Service | Local System | قابل تنظیم |
| Node 14+ Support | ✅ بله | ❌ خیر | ✅ بله |
| Offline Install | ✅ با bundle | ❌ خیر | ✅ بله |
| Auto-configure npm | ✅ بله | ❌ خیر | ❌ خیر |
| PowerShell Policy Fix | ✅ بله | ❌ خیر | ❌ خیر |
| نیاز به Git | ✅ بله | ❌ خیر | ❌ خیر |
| سادگی نصب | متوسط | آسان | بسیار آسان |
| Process Management | PM2 | PM2 | ❌ ندارد |

### چرا PM2؟

PM2 نسبت به سایر process manager ها مزایای زیر را دارد:

✅ **Clustering**: اجرای چند instance از اپلیکیشن
✅ **Load Balancing**: توزیع بار بین instance ها
✅ **Zero-downtime reload**: به‌روزرسانی بدون downtime
✅ **Log Management**: مدیریت حرفه‌ای لاگ‌ها
✅ **Monitoring**: مانیتورینگ real-time با `pm2 monit`
✅ **Memory Limits**: restart خودکار در صورت مصرف بیش از حد رم
✅ **Community بزرگ**: 41K+ stars در GitHub

## پشتیبانی

در صورت بروز مشکل:
1. بررسی لاگ‌های PM2: `npm run pm2:logs`
2. بررسی Event Viewer در Windows
3. بررسی IIS logs در: `C:\inetpub\logs\LogFiles`

---

**نسخه:** 1.0.0
**تاریخ:** 2025-12-10
**سازگاری:** Next.js 16.x, PM2 5.x, Windows Server 2016+
