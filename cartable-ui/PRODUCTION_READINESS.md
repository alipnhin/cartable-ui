# Production Readiness Guide - Cartable UI

این مستند راهنمای آماده‌سازی پروژه Cartable UI برای محیط پروداکشن است.

## ✅ بهینه‌سازی‌های اعمال شده

### 1. امنیت (Security)

#### ✅ Environment Variables
- **قبل**: API URL به صورت هاردکد در `lib/api-client.ts` بود
- **بعد**: از environment variables استفاده می‌شود
- **فایل**: `lib/api-client.ts`
- **متغیرها**:
  - `NEXT_PUBLIC_API_BASE_URL`: آدرس پایه API
  - `NEXT_PUBLIC_API_TIMEOUT`: زمان timeout برای درخواست‌ها

#### ✅ Security Headers
در `next.config.ts` تنظیم شده:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

#### ✅ رفع آسیب‌پذیری Excel Export
- **قبل**: استفاده از کتابخانه `xlsx` با آسیب‌پذیری High (Prototype Pollution و ReDoS)
- **بعد**: جایگزینی با `exceljs` - کتابخانه ایمن و قدرتمند
- **فایل**: `lib/export-utils.ts`
- **مزایای exceljs**:
  - بدون آسیب‌پذیری امنیتی
  - قالب‌بندی حرفه‌ای‌تر (رنگ‌ها، borders، styling)
  - پشتیبانی کامل از RTL برای زبان فارسی
  - عملکرد بهتر

### 2. Error Handling

#### ✅ Error Boundary اضافه شد
- **فایل جدید**: `components/common/error-boundary.tsx`
- **استفاده**: در `app/layout.tsx` اضافه شده
- **قابلیت‌ها**:
  - جلوگیری از خرابی کل اپلیکیشن
  - نمایش UI مناسب برای خطاها
  - نمایش جزئیات خطا فقط در development
  - دکمه‌های "تلاش مجدد" و "بارگذاری مجدد"
  - آماده برای اتصال به سرویس‌های monitoring مثل Sentry

### 3. Logging System

#### ✅ سیستم لاگینگ مرکزی
- **فایل جدید**: `lib/logger.ts`
- **قابلیت‌ها**:
  - کنترل لاگ‌ها بر اساس محیط (development/production)
  - پشتیبانی از `NEXT_PUBLIC_DEBUG` برای فعال‌سازی debug logs
  - جایگزینی همه `console.log` با logger
- **فایل‌های به‌روزرسانی شده**:
  - `components/auth/unauthorized-handler.tsx`
  - `components/common/pwa-installer.tsx`
  - `components/ui/data-grid-table-dnd.tsx`

### 4. Configuration Management

#### ✅ فایل .env.example
- **فایل جدید**: `.env.example`
- **محتوا**:
  - مستندات کامل برای همه متغیرهای محیطی
  - دسته‌بندی منظم متغیرها
  - مثال‌هایی برای هر متغیر

### 5. Performance

#### ✅ تنظیمات موجود در next.config.ts
- **PWA Caching**: استراتژی‌های cache برای انواع محتوا
- **Image Optimization**: AVIF و WebP
- **Code Splitting**: Webpack optimization
- **Compression**: فعال است
- **Remove Console**: console.log ها در production حذف می‌شوند (به جز error و warn)

### 6. Progressive Web App (PWA)

#### ✅ PWA Installer بهبود یافته
- **فایل**: `components/common/pwa-installer.tsx`
- **قابلیت‌ها**:
  - تشخیص خودکار سیستم عامل (Android/iOS)
  - راهنمای نصب گام به گام برای iOS Safari
  - نصب با یک کلیک برای Android Chrome
  - UI زیبا و کاربرپسند
  - مدیریت هوشمند نمایش (7 روز بعد از dismiss)
  - بررسی وضعیت نصب قبلی
  - آیکون‌های واضح و راهنما برای هر مرحله
- **پشتیبانی**:
  - ✅ Android Chrome (نصب خودکار)
  - ✅ iOS Safari (راهنمای دستی)
  - ✅ Desktop browsers
  - ✅ تشخیص حالت standalone

---

## 📋 Checklist قبل از Deploy

### مرحله 1: تنظیمات محیطی

```bash
# 1. کپی کردن .env.example به .env.local (برای development)
cp .env.example .env.local

# 2. تکمیل متغیرهای محیطی
# ویرایش .env.local و مقادیر واقعی را وارد کنید
```

**متغیرهای اجباری**:
- ✅ `AUTH_ISSUER`: آدرس Identity Server
- ✅ `AUTH_CLIENT_ID`: Client ID
- ✅ `AUTH_CLIENT_SECRET`: Client Secret
- ✅ `AUTH_SECRET`: Secret برای NextAuth (تولید: `openssl rand -base64 32`)
- ✅ `NEXTAUTH_URL`: آدرس اپلیکیشن
- ✅ `NEXT_PUBLIC_API_BASE_URL`: آدرس API

**متغیرهای اختیاری**:
- `NEXT_PUBLIC_API_TIMEOUT`: پیش‌فرض 30000ms
- `NEXT_PUBLIC_DEBUG`: برای فعال‌سازی debug logs
- `NODE_ENV`: production/development

### مرحله 2: بررسی کد

```bash
# 1. اجرای lint
npm run lint

# 2. بررسی type errors
npx tsc --noEmit

# 3. بررسی آسیب‌پذیری‌های امنیتی
npm audit

# 4. بررسی bundle size
npm run build
```

### مرحله 3: تست عملکرد

- [ ] تست ورود/خروج
- [ ] تست token refresh
- [ ] تست عملکرد offline (PWA)
- [ ] تست responsive design
- [ ] تست در مرورگرهای مختلف
- [ ] تست عملکرد با VPN/proxy
- [ ] تست OTP workflow
- [ ] تست batch operations
- [ ] تست export (Excel/PDF)
- [ ] تست فیلترها و جستجو

### مرحله 4: بهینه‌سازی

- [x] API URL از environment variable استفاده می‌کند
- [x] Error Boundary اضافه شده
- [x] Logging system پیاده‌سازی شده
- [x] Console logs تمیز شده
- [ ] بررسی و حذف کدهای استفاده نشده
- [ ] بررسی bundle size
- [ ] تست performance با Lighthouse
- [ ] بررسی accessibility

---

## 🚀 مراحل Deploy

### Option 1: Docker (توصیه می‌شود)

```bash
# 1. Build
npm run build

# 2. ساخت image
docker build -t cartable-ui:latest .

# 3. اجرا
docker run -p 3000:3000 \
  -e AUTH_ISSUER="..." \
  -e AUTH_CLIENT_ID="..." \
  -e AUTH_CLIENT_SECRET="..." \
  -e AUTH_SECRET="..." \
  -e NEXTAUTH_URL="..." \
  -e NEXT_PUBLIC_API_BASE_URL="..." \
  cartable-ui:latest
```

### Option 2: Standalone Build

```bash
# 1. Build
npm run build

# 2. اجرا
npm start
```

### Option 3: Vercel/Netlify

1. متصل کردن repository به Vercel
2. تنظیم environment variables در dashboard
3. Deploy خودکار از main branch

---

## 🔍 Monitoring و Observability

### توصیه‌های Monitoring

1. **Error Tracking**:
   - اتصال Sentry یا سرویس مشابه
   - کامنت در `components/common/error-boundary.tsx` را فعال کنید

2. **Performance Monitoring**:
   - استفاده از Web Vitals
   - اضافه کردن Google Analytics یا Plausible

3. **Logging**:
   - در production، لاگ‌ها را به سرویس مرکزی بفرستید
   - استفاده از winston یا pino برای structured logging

### Health Check Endpoint

می‌توانید یک API endpoint برای health check اضافه کنید:

```typescript
// app/api/health/route.ts
export async function GET() {
  return Response.json({ status: 'ok', timestamp: new Date().toISOString() });
}
```

---

## ⚠️ نکات مهم

### 1. TODO های باقی‌مانده

در `services/managerCartableService.ts` پنج TODO وجود دارد:
- خطوط 48, 73, 97, 121, 145
- **موضوع**: استفاده موقت از endpoint های کارتابل امضادار به جای مدیر
- **اقدام لازم**: پس از آماده شدن API های مخصوص مدیر، URL ها را تغییر دهید

### 2. CSS Files

سه فایل CSS وجود دارد:
- `styles/globals.css`
- `styles/globals-new.css`
- `styles/global-v2.css`

**اقدام توصیه شده**:
- تعیین فایل فعال
- حذف فایل‌های استفاده نشده
- یا مستندسازی استفاده هر فایل

### 3. Service Worker

- در development غیرفعال است
- در production به صورت خودکار ثبت می‌شود
- استراتژی cache در `next.config.ts` تعریف شده

---

## 📊 Performance Targets

هدف‌گذاری برای Lighthouse scores:

- **Performance**: > 90
- **Accessibility**: > 95
- **Best Practices**: > 95
- **SEO**: > 90

---

## 🔐 Security Best Practices

### جلوگیری از لو رفتن Secrets

```bash
# اضافه کردن به .gitignore
.env
.env.local
.env.production
.env.development
```

### CORS و CSP

در صورت نیاز، تنظیمات CORS و CSP را در `next.config.ts` اضافه کنید:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; ..."
        }
      ]
    }
  ]
}
```

### Rate Limiting

برای API routes، rate limiting پیاده‌سازی کنید:

```typescript
// در middleware یا API routes
import rateLimit from 'express-rate-limit'
```

---

## 📞 پشتیبانی

در صورت بروز مشکل:

1. **Check Logs**: لاگ‌های error را بررسی کنید
2. **Health Check**: `/api/health` را بررسی کنید
3. **Environment**: متغیرهای محیطی را دوباره چک کنید
4. **Network**: اتصال به API و Identity Server را تست کنید

---

## 📝 Changelog

### [v0.2.0] - 2025-11-20

#### Added
- ✅ PWA Installer بهبود یافته با راهنمای نصب برای Android و iOS
- ✅ تشخیص خودکار سیستم عامل و مرورگر
- ✅ UI زیبا و گام به گام برای نصب PWA

#### Changed
- ✅ جایگزینی xlsx با exceljs (رفع آسیب‌پذیری امنیتی)
- ✅ بهبود export-utils.ts با قالب‌بندی حرفه‌ای‌تر
- ✅ پشتیبانی کامل از RTL در Excel exports

#### Security
- ✅ رفع آسیب‌پذیری High در xlsx (Prototype Pollution و ReDoS)
- ✅ npm audit بدون vulnerability

### [v0.1.0] - 2025-11-20

#### Added
- ✅ Error Boundary component برای مدیریت خطاها
- ✅ Logger utility برای لاگینگ مرکزی
- ✅ فایل .env.example برای مستندسازی
- ✅ این مستند (PRODUCTION_READINESS.md)

#### Changed
- ✅ API base URL از environment variable استفاده می‌کند
- ✅ همه console.log ها به logger تبدیل شدند
- ✅ Error handling بهبود یافت

#### Security
- ✅ حذف hardcoded URLs

---

## ✨ بهبودهای آینده (Roadmap)

### Priority High
- [ ] رفع TODO ها در managerCartableService
- [x] جایگزینی xlsx با exceljs ✅
- [ ] اضافه کردن unit tests
- [ ] اضافه کردن e2e tests

### Priority Medium
- [ ] اتصال به Sentry برای error tracking
- [ ] پیاده‌سازی structured logging
- [ ] اضافه کردن health check endpoint
- [ ] بهبود TypeScript strictness
- [ ] حذف CSS files استفاده نشده

### Priority Low
- [ ] اضافه کردن Storybook
- [ ] بهبود documentation
- [ ] اضافه کردن API mocking برای development
- [ ] پیاده‌سازی feature flags

---

**نویسنده**: تیم توسعه Cartable UI
**آخرین به‌روزرسانی**: 2025-11-20
**نسخه**: 0.1.0
