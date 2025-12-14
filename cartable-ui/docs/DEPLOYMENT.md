# راهنمای دیپلویمنت

این راهنما مراحل دیپلویمنت اپلیکیشن Cartable UI را با استفاده از PM2 و IIS شرح می‌دهد.

## فهرست مطالب

- [پیش‌نیازها](#پیش‌نیازها)
- [تنظیمات محیط](#تنظیمات-محیط)
- [بیلد اپلیکیشن](#بیلد-اپلیکیشن)
- [دیپلویمنت با PM2](#دیپلویمنت-با-pm2)
- [تنظیمات IIS](#تنظیمات-iis)
- [تنظیمات PWA](#تنظیمات-pwa)
- [مانیتورینگ و لاگ‌ها](#مانیتورینگ-و-لاگ‌ها)
- [عیب‌یابی](#عیب‌یابی)

---

## پیش‌نیازها

### نرم‌افزارهای مورد نیاز

1. **Node.js** (نسخه 18 یا بالاتر)
   ```bash
   node --version  # باید >= 18.x باشد
   ```

2. **PM2** (برای مدیریت پروسه)
   ```bash
   npm install -g pm2
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

**نکته مهم**: این پروژه از webpack استفاده می‌کند (نه Turbopack) برای سازگاری با PWA. دستور build به صورت خودکار flag `--webpack` را اضافه می‌کند.

### 3. بررسی خروجی Build

فایل‌های زیر باید ساخته شوند:

- `.next/` - فایل‌های build شده Next.js
- `.next/standalone/` - فایل‌های standalone برای production
- `public/sw.js` - Service Worker برای PWA
- `public/workbox-*.js` - کتابخانه Workbox

**نکته:** با تنظیم `output: "standalone"` در next.config.ts، یک standalone server در `.next/standalone/` ساخته می‌شود که تمام dependencies لازم را شامل می‌شود.

### 4. روش‌های اجرای Production

این پروژه از **دو روش** برای اجرای production پشتیبانی می‌کند:

#### روش 1: استفاده از PM2 (پیشنهادی)
```bash
npm run pm2:start
```

#### روش 2: استفاده از server.js
```bash
NODE_ENV=production node server.js
```

فایل `server.js` به صورت خودکار:
- Standalone build را شناسایی و اجرا می‌کند
- فایل‌های `public` و `static` را کپی می‌کند
- در development mode از Next.js dev server استفاده می‌کند

---

## دیپلویمنت با PM2

### 1. بررسی تنظیمات PM2

فایل `ecosystem.config.js` را بررسی کنید:

```javascript
module.exports = {
  apps: [
    {
      name: 'cartable-ui',
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      cwd: './',
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      // ... سایر تنظیمات
    },
  ],
};
```

### 2. راه‌اندازی با PM2

```bash
# شروع اپلیکیشن
npm run pm2:start

# یا به صورت مستقیم
pm2 start ecosystem.config.js

# ذخیره تنظیمات برای restart خودکار
pm2 save
pm2 startup
```

### 3. دستورات مدیریتی PM2

```bash
# مشاهده وضعیت
pm2 status

# مشاهده لاگ‌ها
npm run pm2:logs
# یا
pm2 logs cartable-ui

# ریستارت
npm run pm2:restart
# یا
pm2 restart cartable-ui

# توقف
npm run pm2:stop
# یا
pm2 stop cartable-ui

# حذف از PM2
npm run pm2:delete
# یا
pm2 delete cartable-ui

# مانیتورینگ
npm run pm2:monit
# یا
pm2 monit
```

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

- درخواست‌ها را از IIS به PM2 (localhost:3000) هدایت می‌کند
- HTTPS را اجباری می‌کند
- فایل‌های حساس را مخفی می‌کند
- هدرهای امنیتی را تنظیم می‌کند
- فشرده‌سازی را فعال می‌کند

### 5. تست کانفیگوریشن

```bash
# بررسی اینکه PM2 در حال اجرا است
pm2 status

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

### 1. لاگ‌های PM2

```bash
# مشاهده لاگ‌های زنده
pm2 logs cartable-ui

# مشاهده فایل‌های لاگ
# error logs: logs/pm2-error.log
# output logs: logs/pm2-out.log
```

### 2. لاگ‌های IIS

مسیر لاگ‌های IIS:
```
C:\inetpub\logs\LogFiles\W3SVC{site-id}\
```

### 3. مانیتورینگ منابع

```bash
# مشاهده استفاده از CPU و RAM
pm2 monit

# اطلاعات تکمیلی
pm2 info cartable-ui
```

---

## عیب‌یابی

### مشکل 1: سایت در دسترس نیست

**علل احتمالی:**
- PM2 در حال اجرا نیست
- پورت 3000 در حال استفاده است
- تنظیمات IIS اشتباه است

**راه‌حل:**
```bash
# بررسی وضعیت PM2
pm2 status

# بررسی پورت 3000
netstat -ano | findstr :3000

# ریستارت PM2
pm2 restart cartable-ui

# بررسی لاگ‌ها
pm2 logs cartable-ui --lines 50
```

### مشکل 2: فایل‌های PWA ساخته نمی‌شوند

**علل احتمالی:**
- build با Turbopack انجام شده (به جای webpack)
- پکیج `@ducanh2912/next-pwa` نصب نیست

**راه‌حل:**
```bash
# اطمینان از نصب پکیج
npm install @ducanh2912/next-pwa

# بیلد با webpack
npm run build

# بررسی وجود فایل‌ها
ls public/sw.js
ls public/workbox-*.js
```

### مشکل 3: خطای 502 Bad Gateway

**علل احتمالی:**
- PM2 متوقف شده
- پورت اشتباه در web.config

**راه‌حل:**
```bash
# ریستارت PM2
pm2 restart cartable-ui

# بررسی پورت در ecosystem.config.js (باید 3000 باشد)
# بررسی پورت در web.config (باید localhost:3000 باشد)
```

### مشکل 4: Environment Variables کار نمی‌کنند

**راه‌حل:**
```bash
# بررسی فایل .env.production.local
cat .env.production.local

# ریستارت PM2 بعد از تغییر env
pm2 restart cartable-ui

# یا با reload برای zero-downtime
pm2 reload cartable-ui
```

### مشکل 5: SSL/HTTPS کار نمی‌کند

**راه‌حل:**
1. بررسی گواهینامه SSL در IIS
2. اطمینان از binding صحیح HTTPS
3. بررسی قانون "Force HTTPS" در web.config

---

## چک‌لیست دیپلویمنت

- [ ] Node.js نصب شده (>= 18.x)
- [ ] PM2 نصب شده
- [ ] IIS نصب شده
- [ ] URL Rewrite Module نصب شده
- [ ] ARR نصب شده و فعال است
- [ ] فایل `.env.production.local` ایجاد شده
- [ ] Dependencies نصب شدند (`npm install`)
- [ ] Build موفق بود (`npm run build`)
- [ ] فایل‌های PWA ساخته شدند (sw.js, workbox-*.js)
- [ ] PM2 راه‌اندازی شد و در حال اجرا است
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
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start/)
- [IIS Reverse Proxy](https://docs.microsoft.com/en-us/iis/extensions/url-rewrite-module/reverse-proxy-with-url-rewrite-v2-and-application-request-routing)
- [PWA Documentation](https://web.dev/progressive-web-apps/)

---

**نسخه:** 1.0.0
**تاریخ به‌روزرسانی:** دسامبر 2025
