# ✅ Production Deployment Checklist
# چک‌لیست آماده‌سازی برای Production

## 📋 فایل‌های ضروری

### ✅ فایل‌های پیکربندی IIS
- [x] `server.js` - سرور سفارشی Next.js برای IIS
- [x] `web.config` - پیکربندی IIS و URL rewriting
- [x] `iisnode.yml` - تنظیمات iisnode

### ✅ فایل‌های محیط (Environment)
- [x] `.env.production` - متغیرهای محیطی production
  - ✅ `NEXTAUTH_URL=https://newecartable.etadbirco.ir`
  - ✅ `AUTH_ISSUER=https://accounts.etadbirco.ir`
  - ✅ `NEXT_PUBLIC_API_BASE_URL=https://ecartableapi.etadbirco.ir/api`

### ✅ فایل‌های Build
- [x] `.next/` - خروجی build شده Next.js
- [x] `node_modules/` - وابستگی‌ها
- [x] `public/` - فایل‌های استاتیک و PWA

---

## 🔧 تنظیمات انجام شده

### ✅ رفع مشکل Redirect
1. **NEXTAUTH_URL فیکس شد** - حالا به URL خود اپلیکیشن اشاره می‌کند
2. **Middleware بهبود یافت** - مسیرهای داخلی (`//` و `/pipe/`) را handle می‌کند
3. **IIS Rule اضافه شد** - double slash URLs را redirect می‌کند

### ✅ PWA Support
- Service Worker: ✅
- Manifest: ✅
- Runtime Caching: ✅
- Offline Mode: ✅

### ✅ Security Headers
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: enabled
- Content Security Policy (CSP)
- Referrer Policy

---

## 🚀 مراحل Deployment

### 1️⃣ Build کردن پروژه
```bash
# در محیط development
npm run build
```

### 2️⃣ فایل‌هایی که باید به سرور منتقل شوند:
```
📦 cartable-ui/
├── 📄 server.js              ← ضروری
├── 📄 web.config              ← ضروری
├── 📄 iisnode.yml             ← ضروری
├── 📄 .env.production         ← نام آن را به .env تغییر دهید
├── 📄 package.json
├── 📄 package-lock.json
├── 📄 next.config.ts
├── 📁 .next/                  ← خروجی build
├── 📁 public/                 ← فایل‌های استاتیک
└── 📁 node_modules/           ← وابستگی‌ها
```

### 3️⃣ تنظیمات سرور (IIS)

#### الزامات:
- [x] Node.js نصب باشد (توصیه: v18 یا بالاتر)
- [x] iisnode نصب باشد
- [x] URL Rewrite Module نصب باشد

#### تنظیمات Application Pool:
```
- .NET CLR Version: No Managed Code
- Managed Pipeline Mode: Integrated
- Identity: ApplicationPoolIdentity یا حساب مناسب
```

### 4️⃣ متغیرهای محیطی (Environment Variables)

در سرور، این متغیرها را تنظیم کنید:

```env
NODE_ENV=production
NEXTAUTH_URL=https://newecartable.etadbirco.ir
AUTH_ISSUER=https://accounts.etadbirco.ir
AUTH_CLIENT_ID=cartable-new
AUTH_CLIENT_SECRET=ce2833384df04b51bef9f03502998fef
AUTH_SECRET=ce2833384df04b51bef9f03502998fef
NEXT_PUBLIC_API_BASE_URL=https://ecartableapi.etadbirco.ir/api
```

**⚠️ نکته مهم:** فایل `.env.production` را به `.env` تغییر نام دهید یا متغیرها را در IIS تنظیم کنید.

### 5️⃣ Identity Server Configuration

در Identity Server مطمئن شوید redirect URIs شامل این موارد است:

```
✅ https://newecartable.etadbirco.ir/api/auth/callback/identity-server
✅ https://newecartable.etadbirco.ir
```

Post Logout Redirect URI:
```
✅ https://newecartable.etadbirco.ir
```

### 6️⃣ نصب Dependencies در سرور

```bash
# در سرور، در مسیر پروژه
npm ci --production
# یا اگر همه dependencies را می‌خواهید:
npm install
```

### 7️⃣ Permissions

مطمئن شوید Application Pool Identity دسترسی خواندن/نوشتن به این پوشه‌ها دارد:
- `.next/`
- `node_modules/`
- `public/`
- `iisnode/` (برای log ها)

### 8️⃣ Testing

بعد از deployment:

1. **تست Login:**
   - به `https://newecartable.etadbirco.ir` بروید
   - لاگین کنید
   - مطمئن شوید redirect درست کار می‌کند

2. **تست PWA:**
   - `https://newecartable.etadbirco.ir/manifest.json` را چک کنید
   - `https://newecartable.etadbirco.ir/sw.js` را چک کنید
   - از DevTools > Application > Service Workers وضعیت را بررسی کنید

3. **تست API Calls:**
   - وارد dashboard شوید
   - مطمئن شوید API calls به BFF درست کار می‌کنند

4. **تست Permissions:**
   - با user های مختلف (Admin, Manager, Employee) تست کنید
   - مطمئن شوید role-based access کار می‌کند

---

## 🐛 عیب‌یابی (Troubleshooting)

### مشکل: صفحه 500 یا خطای Internal Server Error

**راه حل:**
1. Log های iisnode را چک کنید: `iisnode/` folder
2. Event Viewer Windows را بررسی کنید
3. مطمئن شوید Node.js نصب است و در PATH قرار دارد
4. Application Pool را restart کنید

### مشکل: فایل‌های استاتیک load نمی‌شوند

**راه حل:**
1. MIME types در IIS را چک کنید
2. مطمئن شوید `web.config` در root قرار دارد
3. URL Rewrite rules را بررسی کنید

### مشکل: Service Worker کار نمی‌کند

**راه حل:**
1. مطمئن شوید سایت با HTTPS سرو می‌شود
2. `manifest.json` و `sw.js` در `public/` وجود دارند
3. Browser cache را پاک کنید
4. DevTools > Application > Service Workers را چک کنید

### مشکل: Redirect Loop یا مشکل Login

**راه حل:**
1. `NEXTAUTH_URL` را دوباره چک کنید (باید URL اپلیکیشن باشد)
2. Identity Server redirect URIs را بررسی کنید
3. Cookies را پاک کنید
4. مطمئن شوید `AUTH_SECRET` تنظیم شده است

---

## 📊 Monitoring

### Log Files

**iisnode logs:**
```
iisnode/*.log
```

**Application logs:**
در production، console.log ها حذف می‌شوند (به جز error و warn)

### Performance Monitoring

توصیه می‌شود:
- Sentry برای error tracking
- Application Insights یا مشابه برای performance monitoring

---

## 🔄 به‌روزرسانی (Update)

برای update کردن اپلیکیشن:

1. Build جدید بگیرید
2. Application Pool را stop کنید
3. فایل‌های جدید را copy کنید (بدون حذف `node_modules` اگر تغییری نکرده)
4. اگر `package.json` تغییر کرده: `npm install`
5. Application Pool را start کنید

---

## ✅ Final Checklist

قبل از production:

- [ ] Build موفق بود بدون error
- [ ] همه environment variables تنظیم شدند
- [ ] Identity Server redirect URIs درست است
- [ ] SSL certificate معتبر است
- [ ] iisnode و URL Rewrite نصب شده
- [ ] Permissions درست تنظیم شده
- [ ] Backup از database و files گرفته شد
- [ ] Testing در staging environment انجام شد

---

## 📞 پشتیبانی

اگر مشکلی پیش آمد:

1. Log های iisnode را چک کنید
2. Browser DevTools Console را بررسی کنید
3. Network tab را برای failed requests چک کنید
4. Identity Server logs را ببینید

---

**✅ پروژه آماده deployment است!**

تاریخ آخرین بررسی: 2025-12-10
