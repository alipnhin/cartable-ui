# راهنمای دیپلویمنت

این راهنما مراحل دیپلویمنت اپلیکیشن Cartable UI را با استفاده از NSSM (Windows Service) و IIS شرح می‌دهد.

## دستورات سریع (Quick Start)

```powershell
# 1. نصب dependencies
npm install

# 2. Build (شامل کپی فایل‌ها به standalone)
npm run build

# 3. نصب به عنوان Windows Service (به عنوان Administrator)
npm run service:install

# 4. بررسی وضعیت
nssm status CartableUI
# یا
Get-Service CartableUI

# 5. مشاهده لاگ‌ها
Get-Content logs\service-output.log -Tail 50 -Wait
```

## فهرست مطالب

- [دستورات سریع](#دستورات-سریع-quick-start)
- [پیش‌نیازها](#پیش‌نیازها)
- [تنظیمات محیط](#تنظیمات-محیط)
- [بیلد اپلیکیشن](#بیلد-اپلیکیشن)
- [دیپلویمنت با NSSM](#دیپلویمنت-با-nssm)
- [تنظیمات IIS](#تنظیمات-iis)
- [تنظیمات PWA](#تنظیمات-pwa)
- [مانیتورینگ و لاگ‌ها](#مانیتورینگ-و-لاگ‌ها)
- [عیب‌یابی](#عیب‌یابی)
- [Scripts مفید](#scripts-مفید)

---

## پیش‌نیازها

### نرم‌افزارهای مورد نیاز

1. **Node.js** (نسخه 18 یا بالاتر)
   ```bash
   node --version  # باید >= 18.x باشد
   ```

2. **NSSM** (Non-Sucking Service Manager)

   **روش 1: دانلود Manual**
   - دانلود از: https://nssm.cc/download
   - کپی `nssm.exe` به `C:\Windows\System32\`

   **روش 2: نصب با Chocolatey**
   ```powershell
   choco install nssm
   ```

   **بررسی نصب:**
   ```powershell
   nssm version
   ```

3. **IIS** (Internet Information Services)
   - نصب از Windows Features
   - نصب URL Rewrite Module: [دانلود از اینجا](https://www.iis.net/downloads/microsoft/url-rewrite)
   - نصب Application Request Routing (ARR): [دانلود از اینجا](https://www.iis.net/downloads/microsoft/application-request-routing)

4. **Git** (برای دریافت کد)

---

## تنظیمات محیط

### 1. ایجاد فایل Environment

فایل `.env.production.local` را در ریشه پروژه ایجاد کنید:

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com/api
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication
AUTH_SECRET=your-secret-key-here
AUTH_ISSUER=https://your-identity-server.com
AUTH_TRUST_HOST=true

# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production
PORT=3000
```

### 2. بررسی تنظیمات

اطمینان حاصل کنید که همه متغیرهای environment به درستی تنظیم شده‌اند.

---

## بیلد اپلیکیشن

### 1. نصب Dependencies

```bash
cd cartable-ui
npm install --production=false
```

### 2. ایجاد Build

```bash
npm run build
```

**این دستور به صورت خودکار:**
1. Build را با webpack می‌سازد (`--webpack` flag برای PWA لازم است)
2. فایل‌های PWA را تولید می‌کند (sw.js, workbox-*.js)
3. Standalone build می‌سازد
4. فایل‌های `public` و `.next/static` را به `.next/standalone/` کپی می‌کند

**نکته:** اگر فقط می‌خواهید build بگیرید بدون کپی فایل‌ها:
```bash
npm run build:only
```

### 3. بررسی خروجی Build

پس از build موفق، ساختار زیر باید وجود داشته باشد:

```
.next/
├── standalone/              # Standalone server
│   ├── server.js           # Entry point برای production
│   ├── .next/
│   │   └── static/         # فایل‌های static (کپی شده)
│   ├── public/             # فایل‌های public (کپی شده)
│   │   ├── sw.js
│   │   ├── workbox-*.js
│   │   └── manifest.json
│   └── node_modules/       # Dependencies مورد نیاز
└── static/                  # فایل‌های static اصلی

public/
├── sw.js                    # Service Worker
├── workbox-*.js             # Workbox runtime
└── manifest.json            # Web App Manifest
```

### 4. کپی Manual فایل‌ها (در صورت نیاز)

اگر به هر دلیلی فایل‌ها کپی نشدند:

```bash
npm run deploy:standalone
```

این script فایل‌های `public` و `.next/static` را به `.next/standalone/` کپی می‌کند.

### 5. حالت‌های اجرا

#### حالت Development
```bash
npm run dev
```

#### حالت Production (Standalone با NSSM)
```powershell
# به عنوان Administrator
npm run service:install
```

**Standalone Mode چیست؟**
- Server مستقل با تمام dependencies لازم
- حجم کمتر و سریع‌تر از next start
- مناسب برای deployment در production
- نیاز به کپی manual فایل‌های static و public دارد

---

## دیپلویمنت با NSSM

### 1. نصب Service

**به عنوان Administrator** PowerShell را اجرا کنید:

```powershell
# نصب با تنظیمات پیش‌فرض
npm run service:install
```

یا با پارامترهای سفارشی:

```powershell
.\scripts\install-nssm-service.ps1 -ServiceName "CartableUI" -Port 3000
```

Script به صورت خودکار:
- Service را نصب می‌کند
- Environment variables را تنظیم می‌کند
- Log rotation را فعال می‌کند
- Auto-start را فعال می‌کند
- Service را شروع می‌کند

### 2. مدیریت Service

**دستورات NSSM:**

```powershell
# بررسی وضعیت
nssm status CartableUI

# شروع
nssm start CartableUI

# توقف
nssm stop CartableUI

# ریستارت
nssm restart CartableUI

# حذف
nssm remove CartableUI confirm
# یا
npm run service:remove
```

**دستورات PowerShell:**

```powershell
# بررسی وضعیت
Get-Service CartableUI

# شروع
Start-Service CartableUI

# توقف
Stop-Service CartableUI

# ریستارت
Restart-Service CartableUI
```

**مدیریت از طریق Windows Services:**

1. فشار `Win + R`
2. تایپ `services.msc` و Enter
3. پیدا کردن "Cartable UI Application"
4. راست‌کلیک → Start/Stop/Restart

### 3. مشاهده لاگ‌ها

```powershell
# لاگ‌های خروجی (realtime)
Get-Content logs\service-output.log -Tail 50 -Wait

# لاگ‌های خطا
Get-Content logs\service-error.log -Tail 50 -Wait
```

**مستندات کامل:** برای اطلاعات بیشتر، [NSSM-DEPLOYMENT.md](./NSSM-DEPLOYMENT.md) را مشاهده کنید.

---

## تنظیمات IIS

### 1. فعال‌سازی ARR Proxy

1. باز کردن IIS Manager
2. انتخاب سرور (نه سایت)
3. دوبار کلیک روی "Application Request Routing Cache"
4. کلیک روی "Server Proxy Settings" در سمت راست
5. تیک زدن "Enable proxy"
6. کلیک روی "Apply"

### 2. ایجاد سایت جدید

1. در IIS Manager، راست‌کلیک روی "Sites"
2. انتخاب "Add Website"
3. تنظیمات:
   - **Site name**: Cartable-UI
   - **Physical path**: مسیر پوشه پروژه (جایی که `web.config` قرار دارد)
   - **Binding**:
     - Type: http
     - Port: 80
     - Host name: your-domain.com

### 3. تنظیم SSL (HTTPS)

1. راست‌کلیک روی سایت → "Edit Bindings"
2. "Add" کلیک کنید
3. تنظیمات:
   - Type: https
   - Port: 443
   - SSL certificate: انتخاب گواهینامه SSL

### 4. بررسی web.config

فایل `web.config` در ریشه پروژه باید وجود داشته باشد. این فایل:

- درخواست‌ها را از IIS به Windows Service (localhost:3000) هدایت می‌کند
- HTTPS را اجباری می‌کند
- فایل‌های حساس را مخفی می‌کند
- هدرهای امنیتی را تنظیم می‌کند
- فشرده‌سازی را فعال می‌کند

### 5. تست کانفیگوریشن

```powershell
# بررسی اینکه Service در حال اجرا است
nssm status CartableUI
Get-Service CartableUI

# تست اتصال مستقیم به Next.js
curl http://localhost:3000

# تست اتصال از طریق IIS
curl http://your-domain.com
```

---

## تنظیمات PWA

### 1. بررسی فایل‌های PWA

پس از build، فایل‌های زیر باید در پوشه `public/` وجود داشته باشند:

```
public/
├── sw.js                    # Service Worker
├── workbox-*.js             # Workbox runtime
├── manifest.json            # Web App Manifest
└── media/
    └── icons/              # آیکون‌های PWA
```

### 2. تست PWA

1. باز کردن سایت در Chrome/Edge
2. باز کردن Developer Tools (F12)
3. رفتن به تب "Application"
4. بررسی:
   - **Service Workers**: باید یک service worker فعال باشد
   - **Manifest**: باید manifest.json با اطلاعات صحیح نمایش داده شود
   - **Offline**: تست کردن حالت آفلاین با غیرفعال کردن شبکه

### 3. نصب PWA

- **Android Chrome**: دکمه "Add to Home Screen" باید نمایش داده شود
- **iOS Safari**: راهنمای نصب به صورت خودکار نمایش داده می‌شود

---

## مانیتورینگ و لاگ‌ها

### 1. لاگ‌های NSSM Service

```powershell
# مشاهده لاگ‌های خروجی (realtime)
Get-Content logs\service-output.log -Tail 50 -Wait

# مشاهده لاگ‌های خطا (realtime)
Get-Content logs\service-error.log -Tail 50 -Wait

# مشاهده لاگ‌های Event Viewer
eventvwr.msc
# Windows Logs → Application → Filter: CartableUI
```

### 2. لاگ‌های IIS

مسیر لاگ‌های IIS:
```
C:\inetpub\logs\LogFiles\W3SVC{site-id}\
```

### 3. مانیتورینگ منابع

```powershell
# بررسی وضعیت Service
nssm status CartableUI
Get-Service CartableUI

# مشاهده استفاده از CPU و RAM
Get-Process -Name node | Select-Object CPU, WorkingSet, ProcessName

# بررسی تنظیمات Service
nssm dump CartableUI
```

---

## عیب‌یابی

### مشکل 1: سایت در دسترس نیست

**علل احتمالی:**
- Service در حال اجرا نیست
- پورت 3000 در حال استفاده است
- تنظیمات IIS اشتباه است

**راه‌حل:**
```powershell
# بررسی وضعیت Service
nssm status CartableUI
Get-Service CartableUI

# بررسی پورت 3000
netstat -ano | findstr :3000

# ریستارت Service
nssm restart CartableUI

# بررسی لاگ‌ها
Get-Content logs\service-error.log -Tail 50
```

### مشکل 2: فایل‌های static/public در دسترس نیست (404 Error)

**علت:**
- فایل‌های `public` و `.next/static` به standalone کپی نشده‌اند

**راه‌حل:**
```bash
# کپی فایل‌ها به standalone
npm run deploy:standalone

# یا rebuild کامل
npm run build

# ریستارت Service
nssm restart CartableUI

# بررسی فایل‌ها در standalone
dir .next\standalone\public\
dir .next\standalone\.next\static\
```

### مشکل 3: فایل‌های PWA ساخته نمی‌شوند

**علل احتمالی:**
- build با Turbopack انجام شده (به جای webpack)
- پکیج `@ducanh2912/next-pwa` نصب نیست

**راه‌حل:**
```bash
# اطمینان از نصب پکیج
npm install @ducanh2912/next-pwa

# بیلد با webpack (همیشه از npm run build استفاده کنید)
npm run build

# بررسی وجود فایل‌ها
ls public/sw.js
ls public/workbox-*.js
ls .next/standalone/public/sw.js
```

### مشکل 4: خطای 502 Bad Gateway

**علل احتمالی:**
- Service متوقف شده
- پورت اشتباه در web.config

**راه‌حل:**
```powershell
# ریستارت Service
nssm restart CartableUI

# بررسی تنظیمات پورت
nssm get CartableUI AppEnvironmentExtra

# بررسی پورت در web.config (باید localhost:3000 باشد)
```

### مشکل 5: Environment Variables کار نمی‌کنند

**راه‌حل:**
```powershell
# بررسی فایل .env.production.local
Get-Content .env.production.local

# بررسی environment variables service
nssm get CartableUI AppEnvironmentExtra

# تنظیم مجدد env variables
nssm set CartableUI AppEnvironmentExtra NODE_ENV=production PORT=3000

# ریستارت Service
nssm restart CartableUI
```

### مشکل 6: SSL/HTTPS کار نمی‌کند

**راه‌حل:**
1. بررسی گواهینامه SSL در IIS
2. اطمینان از binding صحیح HTTPS
3. بررسی قانون "Force HTTPS" در web.config

---

## چک‌لیست دیپلویمنت

- [ ] Node.js نصب شده (>= 18.x)
- [ ] NSSM نصب شده
- [ ] IIS نصب شده
- [ ] URL Rewrite Module نصب شده
- [ ] ARR نصب شده و فعال است
- [ ] فایل `.env.production.local` ایجاد شده
- [ ] Dependencies نصب شدند (`npm install`)
- [ ] Build موفق بود (`npm run build`)
- [ ] فایل‌های PWA ساخته شدند (sw.js, workbox-*.js)
- [ ] فایل‌های standalone کپی شدند
- [ ] Windows Service نصب شد (`npm run service:install`)
- [ ] Service در حال اجرا است
- [ ] سایت در IIS ایجاد شد
- [ ] Binding های HTTP و HTTPS تنظیم شدند
- [ ] ARR Proxy فعال است
- [ ] سایت از طریق domain قابل دسترسی است
- [ ] PWA به درستی کار می‌کند
- [ ] حالت آفلاین تست شد
- [ ] لاگ‌ها بررسی شدند

---

## منابع مفید

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [NSSM Documentation](https://nssm.cc/usage)
- [IIS Reverse Proxy](https://docs.microsoft.com/en-us/iis/extensions/url-rewrite-module/reverse-proxy-with-url-rewrite-v2-and-application-request-routing)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [NSSM Deployment Guide](./NSSM-DEPLOYMENT.md)

---

## Scripts مفید

### Build و Deployment

```bash
# Build کامل (با کپی فایل‌ها)
npm run build

# Build بدون کپی فایل‌ها
npm run build:only

# کپی فایل‌ها به standalone
npm run deploy:standalone
```

### Windows Service Management

```powershell
# نصب Service (به عنوان Administrator)
npm run service:install

# حذف Service
npm run service:remove

# مدیریت با NSSM
nssm start CartableUI
nssm stop CartableUI
nssm restart CartableUI
nssm status CartableUI

# مدیریت با PowerShell
Start-Service CartableUI
Stop-Service CartableUI
Restart-Service CartableUI
Get-Service CartableUI

# مشاهده لاگ‌ها
Get-Content logs\service-output.log -Tail 50 -Wait
Get-Content logs\service-error.log -Tail 50 -Wait
```

### Development

```bash
# Dev server
npm run dev

# Lint
npm run lint

# Test
npm run test
npm run test:watch
npm run test:coverage
```

---

## تفاوت‌های مهم

### Standalone vs Next Start

| ویژگی | Standalone | Next Start |
|-------|-----------|------------|
| حجم | کمتر (فقط dependencies لازم) | بیشتر (تمام node_modules) |
| سرعت | سریع‌تر | کندتر |
| Setup | نیاز به کپی manual فایل‌ها | بدون نیاز به کپی |
| استفاده | Production (Docker, IIS) | Development و Production |
| NSSM Config | `.next/standalone/server.js` | `next start` |

### NSSM vs PM2

| ویژگی | NSSM | PM2 |
|-------|------|-----|
| پلتفرم | Windows Only | Cross-platform |
| یکپارچگی با Windows | ✅ Native Service | ⚠️ محدود |
| Auto-start | ✅ خودکار | ⚠️ نیاز به تنظیم |
| مدیریت | Services.msc + PowerShell | PM2 CLI |
| لاگ‌ها | Event Viewer + File | File Only |
| پایداری در Windows | ✅✅ عالی | ✅ خوب |
| حافظه | کمتر | بیشتر |

---

**نسخه:** 3.0.0
**تاریخ به‌روزرسانی:** دسامبر 2025
**تغییرات اخیر:**
- مهاجرت از PM2 به NSSM برای Windows Service
- حذف کامل PM2 و فایل‌های مربوطه
- اضافه شدن PowerShell scripts برای مدیریت Service
- به‌روزرسانی کامل مستندات deployment
- اضافه شدن script خودکار کپی فایل‌ها
- رفع مشکل 404 برای فایل‌های static/public
- بهینه‌سازی webpack bundle splitting
- رفع warnings میان‌افزار (middleware → proxy)
