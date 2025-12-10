# 🔀 توضیحات URL Rewrite Rules

این مستند توضیح می‌دهد که هر یک از قوانین URL Rewrite در فایل `web.config` چه کاری انجام می‌دهند.

## 📋 لیست Rules (به ترتیب اجرا)

### 1️⃣ Force HTTPS Redirect
```xml
<rule name="Redirect to HTTPS" stopProcessing="true">
  <match url="(.*)" />
  <conditions>
    <add input="{HTTPS}" pattern="^OFF$" />
    <add input="{REQUEST_URI}" pattern="^/.well-known/" negate="true" />
  </conditions>
  <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
</rule>
```

**کاربرد:**
- همه درخواست‌های HTTP را به HTTPS redirect می‌کند (301 Permanent)
- استثنا: مسیرهای `/.well-known/` (برای SSL certificate verification)
- امنیت: تضمین می‌کند که همه ارتباطات رمزنگاری شده باشند

**مثال:**
- `http://newecartable.etadbirco.ir/dashboard` → `https://newecartable.etadbirco.ir/dashboard`

---

### 2️⃣ Remove Trailing Slash
```xml
<rule name="Remove Trailing Slash" stopProcessing="true">
  <match url="(.+)/$" />
  <conditions>
    <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
    <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="true" />
  </conditions>
  <action type="Redirect" url="{R:1}" redirectType="Permanent" />
</rule>
```

**کاربرد:**
- حذف اسلش انتهایی از URLها (به جز root)
- جلوگیری از duplicate content در SEO
- سازگاری با رفتار پیش‌فرض Next.js

**مثال:**
- `https://newecartable.etadbirco.ir/dashboard/` → `https://newecartable.etadbirco.ir/dashboard`
- `https://newecartable.etadbirco.ir/` → بدون تغییر (root)

---

### 3️⃣ NodeInspector (Debugging)
```xml
<rule name="NodeInspector" patternSyntax="ECMAScript" stopProcessing="true">
  <match url="^server.js\/debug[\/]?" />
</rule>
```

**کاربرد:**
- اجازه می‌دهد node-inspector برای debugging استفاده شود
- فقط در development mode فعال باشد
- در production معمولاً استفاده نمی‌شود

---

### 4️⃣ Next.js Static Files
```xml
<rule name="Next.js Static Files" stopProcessing="true">
  <match url="^_next/static/(.*)$" />
  <action type="Rewrite" url=".next/static/{R:1}" />
</rule>
```

**کاربرد:**
- مسیریابی فایل‌های static Next.js (`_next/static/*`)
- این فایل‌ها شامل JS bundles، CSS، و دیگر assets هستند
- بسیار مهم برای عملکرد صحیح Next.js

**مثال:**
- `/_next/static/chunks/main-abc123.js` → `.next/static/chunks/main-abc123.js`
- `/_next/static/css/app.css` → `.next/static/css/app.css`

---

### 5️⃣ Next.js Build Files
```xml
<rule name="Next.js Build Files" stopProcessing="true">
  <match url="^_next/(.*)$" />
  <action type="Rewrite" url=".next/{R:1}" />
</rule>
```

**کاربرد:**
- مسیریابی سایر فایل‌های Next.js build (مثل manifest)
- catch-all برای همه چیزهایی که در `_next/` هستند

**مثال:**
- `/_next/BUILD_ID` → `.next/BUILD_ID`

---

### 6️⃣ Public Static Files
```xml
<rule name="Public Static Files" stopProcessing="true">
  <match url="^(favicon\.ico|manifest\.json|robots\.txt|sitemap\.xml|sw\.js|workbox-.*)$" />
  <action type="Rewrite" url="public/{R:1}" />
</rule>
```

**کاربرد:**
- سرو فایل‌های استاتیک مهم از پوشه `public/`
- شامل: favicon، manifest (PWA)، robots.txt، sitemap، service workers

**مثال:**
- `/favicon.ico` → `public/favicon.ico`
- `/manifest.json` → `public/manifest.json`
- `/sw.js` → `public/sw.js` (Service Worker)
- `/workbox-abc123.js` → `public/workbox-abc123.js`

---

### 7️⃣ Public Folder Assets
```xml
<rule name="Public Folder Assets" stopProcessing="true">
  <match url="^(images|fonts|icons|static)/(.*)$" />
  <conditions>
    <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="true" />
  </conditions>
  <action type="Rewrite" url="public/{R:0}" />
</rule>
```

**کاربرد:**
- مسیریابی پوشه‌های assets در `public/`
- شامل: images، fonts، icons، static

**مثال:**
- `/images/logo.png` → `public/images/logo.png`
- `/fonts/iran-sans.woff2` → `public/fonts/iran-sans.woff2`
- `/icons/profile.svg` → `public/icons/profile.svg`

---

### 8️⃣ Next.js Application (Catch-All)
```xml
<rule name="Next.js Application" stopProcessing="true">
  <match url=".*" />
  <conditions>
    <add input="{REQUEST_FILENAME}" matchType="IsFile" negate="True"/>
    <add input="{REQUEST_FILENAME}" matchType="IsDirectory" negate="True"/>
    <add input="{REQUEST_URI}" pattern="^/iisnode" negate="true" />
  </conditions>
  <action type="Rewrite" url="server.js"/>
</rule>
```

**کاربرد:**
- همه درخواست‌های دیگر را به Next.js (server.js) می‌فرستد
- این rule برای dynamic routes، API routes، و SSR است
- فقط اگر فایل فیزیکی وجود نداشته باشد

**استثناها:**
- فایل‌های فیزیکی موجود
- پوشه‌های فیزیکی موجود
- مسیرهای `/iisnode/*` (لاگ‌ها)

**مثال:**
- `/dashboard` → `server.js` (dynamic route)
- `/api/users` → `server.js` (API route)
- `/payment-orders/123` → `server.js` (dynamic route با param)

---

## 🔍 جریان اجرا (Execution Flow)

وقتی یک request می‌آید، rules به ترتیب زیر بررسی می‌شوند:

```
1. درخواست HTTP است؟
   ✅ بله → Redirect به HTTPS
   ❌ خیر → ادامه

2. URL اسلش انتهایی دارد؟
   ✅ بله → Redirect بدون اسلش
   ❌ خیر → ادامه

3. مسیر debugging است؟
   ✅ بله → توقف (allow debugging)
   ❌ خیر → ادامه

4. مسیر _next/static/* است؟
   ✅ بله → Rewrite به .next/static/*
   ❌ خیر → ادامه

5. مسیر _next/* است؟
   ✅ بله → Rewrite به .next/*
   ❌ خیر → ادامه

6. فایل public مهم است (favicon, manifest, ...)?
   ✅ بله → Rewrite به public/*
   ❌ خیر → ادامه

7. مسیر assets در public است (images, fonts, ...)?
   ✅ بله → Rewrite به public/*
   ❌ خیر → ادامه

8. فایل یا پوشه فیزیکی است?
   ✅ بله → سرو مستقیم فایل
   ❌ خیر → Rewrite به server.js (Next.js)
```

---

## ⚙️ تنظیمات مهم

### stopProcessing="true"
- وقتی یک rule match شود، بقیه rules اجرا نمی‌شوند
- برای performance و جلوگیری از conflictها مهم است

### redirectType="Permanent" (301)
- برای SEO بهتر است
- مرورگرها و search engines این redirectها را cache می‌کنند
- فقط برای redirectهایی که قرار است دائمی باشند استفاده شود

### نکات امنیتی
- مسیرهای `/iisnode` در catch-all rule exclude شده‌اند
- فایل‌های `.env` و پوشه‌های حساس در بخش `<security>` محافظت شده‌اند

---

## 🧪 تست URL Rewrite Rules

### تست HTTPS Redirect
```bash
curl -I http://newecartable.etadbirco.ir/dashboard
# باید 301 Moved Permanently به HTTPS برگرداند
```

### تست Trailing Slash
```bash
curl -I https://newecartable.etadbirco.ir/dashboard/
# باید 301 به /dashboard (بدون اسلش) برگرداند
```

### تست Static Files
```bash
curl -I https://newecartable.etadbirco.ir/_next/static/chunks/main.js
# باید 200 OK برگرداند و فایل را سرو کند
```

### تست Public Assets
```bash
curl -I https://newecartable.etadbirco.ir/manifest.json
curl -I https://newecartable.etadbirco.ir/favicon.ico
# هر دو باید 200 OK برگردانند
```

### تست Dynamic Routes
```bash
curl -I https://newecartable.etadbirco.ir/dashboard
curl -I https://newecartable.etadbirco.ir/payment-orders/123
# باید به Next.js فرستاده شوند و 200 OK برگردانند
```

---

## 🐛 عیب‌یابی (Troubleshooting)

### مشکل: Static files load نمی‌شوند

**علت احتمالی:**
- مسیرهای `.next` یا `public` اشتباه هستند
- دسترسی‌های فایل مشکل دارند

**راه‌حل:**
```powershell
# بررسی وجود فایل‌ها
Test-Path "C:\inetpub\wwwroot\cartable-ui\.next\static"
Test-Path "C:\inetpub\wwwroot\cartable-ui\public"

# بررسی دسترسی‌ها
icacls "C:\inetpub\wwwroot\cartable-ui\.next"
icacls "C:\inetpub\wwwroot\cartable-ui\public"
```

### مشکل: Redirect loop

**علت احتمالی:**
- HTTPS rule در conflict با reverse proxy است
- Load balancer HTTPS را terminate می‌کند

**راه‌حل:**
اگر از reverse proxy/load balancer استفاده می‌کنید، rule را تغییر دهید:
```xml
<rule name="Redirect to HTTPS" stopProcessing="true">
  <match url="(.*)" />
  <conditions>
    <add input="{HTTPS}" pattern="^OFF$" />
    <add input="{HTTP_X_FORWARDED_PROTO}" pattern="^https$" negate="true" />
  </conditions>
  <action type="Redirect" url="https://{HTTP_HOST}/{R:1}" redirectType="Permanent" />
</rule>
```

### مشکل: API routes کار نمی‌کنند

**علت احتمالی:**
- API routes به Next.js forward نمی‌شوند

**راه‌حل:**
مطمئن شوید که catch-all rule (`Next.js Application`) فعال است و conditions صحیح هستند.

---

## 📚 منابع

- [IIS URL Rewrite Module Documentation](https://docs.microsoft.com/en-us/iis/extensions/url-rewrite-module/url-rewrite-module-configuration-reference)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [iisnode GitHub](https://github.com/Azure/iisnode)

---

**تاریخ ایجاد:** 2025-12-10
**نسخه:** 1.0.0
