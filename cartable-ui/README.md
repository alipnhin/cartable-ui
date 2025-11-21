# Cartable UI 🎯

سیستم مدیریت و تأیید دستورات پرداخت با رابط کاربری پیشرفته و پشتیبانی از PWA

## 📋 فهرست مطالب

- [ویژگی‌ها](#ویژگیها)
- [پیش‌نیازها](#پیشنیازها)
- [نصب و راه‌اندازی](#نصب-و-راهاندازی)
- [ساختار پروژه](#ساختار-پروژه)
- [تکنولوژی‌ها](#تکنولوژیها)
- [اسکریپت‌ها](#اسکریپتها)
- [احراز هویت](#احراز-هویت)
- [تست](#تست)
- [دیپلوی](#دیپلوی)
- [مستندات](#مستندات)

## ✨ ویژگی‌ها

- ✅ **مدیریت دستورات پرداخت** - سیستم جامع برای ایجاد، مشاهده و مدیریت دستورات پرداخت
- 🔐 **احراز هویت OIDC** - یکپارچه‌سازی با Identity Server و NextAuth.js
- 👥 **RBAC (Role-Based Access Control)** - کنترل دسترسی مبتنی بر نقش
- 📱 **PWA (Progressive Web App)** - قابلیت نصب و کار آفلاین
- 🌙 **تم تیره/روشن** - پشتیبانی کامل از حالت‌های تاریک و روشن
- 📊 **داشبورد تحلیلی** - نمایش آمار و نمودارهای تحلیلی
- 🔄 **به‌روزرسانی خودکار توکن** - مدیریت هوشمند refresh token
- ♿ **دسترسی‌پذیری** - پشتیبانی از استاندارد WCAG 2.1
- 📱 **Responsive** - طراحی واکنش‌گرا برای تمام دستگاه‌ها
- 🚀 **بهینه‌سازی عملکرد** - Code splitting، lazy loading، و caching
- 🔒 **امنیت قوی** - CSP headers، XSS protection، CSRF protection
- ✅ **تست‌های جامع** - Unit tests با Jest و React Testing Library

## 📦 پیش‌نیازها

- Node.js >= 18.x
- npm >= 9.x یا yarn >= 1.22.x
- یک Identity Server فعال (برای احراز هویت)
- دسترسی به API سرور

## 🚀 نصب و راه‌اندازی

### 1. کلون کردن پروژه

```bash
git clone <repository-url>
cd cartable-ui
```

### 2. نصب Dependencies

```bash
npm install
```

### 3. تنظیم متغیرهای محیطی

فایل `.env.local` را با الگوی `.env.example` ایجاد کنید:

```bash
cp .env.example .env.local
```

سپس مقادیر را تنظیم کنید:

```env
# احراز هویت
AUTH_ISSUER=https://your-identity-server.com
AUTH_CLIENT_ID=your-client-id
AUTH_CLIENT_SECRET=your-client-secret
NEXTAUTH_SECRET=your-random-secret-key
NEXTAUTH_URL=http://localhost:3000

# API
NEXT_PUBLIC_API_BASE_URL=https://your-api-server.com
```

### 4. اجرای پروژه

#### حالت Development

```bash
npm run dev
```

پروژه در `http://localhost:3000` در دسترس خواهد بود.

#### حالت Production

```bash
npm run build
npm start
```

## 📁 ساختار پروژه

```
cartable-ui/
├── app/                      # Next.js App Router - صفحات و routing
│   ├── dashboard/           # داشبورد تحلیلی
│   ├── my-cartable/         # کارتابل امضادار
│   ├── manager-cartable/    # کارتابل مدیر
│   ├── payment-orders/      # مدیریت دستورات پرداخت
│   ├── accounts/            # مدیریت حساب‌ها
│   ├── reports/             # گزارش‌گیری
│   └── api/auth/            # NextAuth endpoints
├── components/               # کامپوننت‌های React
│   ├── ui/                  # کامپوننت‌های پایه UI (75+ component)
│   ├── common/              # کامپوننت‌های مشترک
│   ├── layout/              # کامپوننت‌های layout
│   ├── dashboard/           # کامپوننت‌های داشبورد
│   └── auth/                # کامپوننت‌های احراز هویت
├── lib/                      # توابع کمکی و utilities
│   ├── utils.ts             # توابع عمومی
│   ├── api-client.ts        # کلاینت API با interceptors
│   ├── error-handler.ts     # مدیریت خطاها
│   ├── logger.ts            # سیستم لاگ‌گیری ساختاریافته
│   └── jwt-utils.ts         # ابزارهای کار با JWT
├── services/                 # سرویس‌های API (7 service)
│   ├── authService.ts
│   ├── approverCartableService.ts
│   ├── managerCartableService.ts
│   ├── paymentOrderService.ts
│   └── ...
├── types/                    # تعریف تایپ‌های TypeScript
│   ├── index.ts             # تایپ‌های عمومی
│   └── next-auth.d.ts       # تایپ‌های NextAuth
├── config/                   # فایل‌های پیکربندی
│   ├── permissions.ts       # تنظیمات RBAC
│   └── navigation.ts        # تنظیمات منو
├── providers/                # React Context Providers
│   ├── theme-provider.tsx
│   ├── i18n-provider.tsx
│   └── ...
├── hooks/                    # Custom React Hooks
├── i18n/                     # فایل‌های ترجمه (فارسی/انگلیسی)
├── styles/                   # استایل‌های global
├── public/                   # فایل‌های استاتیک
│   ├── fonts/               # فونت‌های یکان‌باخ
│   ├── icons/               # آیکون‌ها و لوگو
│   └── manifest.json        # PWA manifest
└── __tests__/                # تست‌های Jest
    ├── config/              # تست‌های تنظیمات
    ├── lib/                 # تست‌های utilities
    └── components/          # تست‌های کامپوننت
```

## 🛠 تکنولوژی‌ها

### Core

- **Next.js 16.0** - React framework با App Router
- **React 19.2** - کتابخانه UI
- **TypeScript 5** - Type safety با strict mode
- **Tailwind CSS v4** - Utility-first CSS framework

### UI Components

- **Radix UI** - کامپوننت‌های accessible و unstyled
- **shadcn/ui** - کامپوننت‌های پیش‌ساخته
- **Recharts** - نمودارها و چارت‌ها
- **Lucide React** - آیکون‌ها

### Authentication & State

- **NextAuth.js 5** - احراز هویت با OIDC
- **React Hooks** - مدیریت state محلی

### Data & Forms

- **Axios** - HTTP client
- **React Hook Form** - مدیریت فرم‌ها
- **TanStack Table** - جداول پیشرفته

### Development

- **Jest** - Test framework
- **React Testing Library** - تست کامپوننت‌ها
- **ESLint** - Linting
- **ts-jest** - TypeScript support برای Jest

### PWA

- **next-pwa** - تبدیل به Progressive Web App
- **Workbox** - Service worker و caching

### Utilities

- **jose** - JWT handling
- **ExcelJS** - Export به Excel
- **jsPDF** - Export به PDF
- **Persian Tools** - ابزارهای فارسی‌سازی

## 📜 اسکریپت‌ها

```bash
# Development
npm run dev              # اجرای سرور development

# Production
npm run build            # ساخت production build
npm start                # اجرای production server

# Testing
npm test                 # اجرای تست‌ها
npm run test:watch       # اجرای تست‌ها در حالت watch
npm run test:coverage    # تست‌ها با coverage report
npm run test:ci          # تست‌ها برای CI/CD

# Code Quality
npm run lint             # بررسی کد با ESLint
```

## 🔐 احراز هویت

پروژه از OIDC (OpenID Connect) با NextAuth.js استفاده می‌کند.

### نقش‌های کاربری

- **cartable-approver**: امضادار - دسترسی به کارتابل من
- **cartable-manager**: مدیر - دسترسی به کارتابل مدیر و مدیریت حساب‌ها
- **admin**: ادمین سیستم - دسترسی کامل

### Flow احراز هویت

1. کاربر روی دکمه "ورود" کلیک می‌کند
2. هدایت به Identity Server برای لاگین
3. بعد از لاگین موفق، کاربر به اپلیکیشن بازگردانده می‌شود
4. Access token و refresh token ذخیره می‌شوند
5. Token به صورت خودکار refresh می‌شود (60 ثانیه قبل از انقضا)

مستندات کامل: [AUTH_SETUP.md](./AUTH_SETUP.md)

## ✅ تست

پروژه دارای تست‌های جامع با Jest و React Testing Library است.

### اجرای تست‌ها

```bash
# اجرای همه تست‌ها
npm test

# اجرای تست‌ها در حالت watch
npm run test:watch

# دریافت coverage report
npm run test:coverage
```

### Coverage فعلی

- **98 تست** - همه پاس شده ✅
- Utilities: 100% coverage
- Config: 100% coverage
- Components: تست‌های کلیدی نوشته شده

### نوشتن تست جدید

تست‌های جدید را در پوشه `__tests__` با ساختار مشابه پروژه ایجاد کنید:

```typescript
// __tests__/lib/my-util.test.ts
import { myFunction } from '@/lib/my-util';

describe('lib/my-util', () => {
  it('should work correctly', () => {
    expect(myFunction('test')).toBe('expected');
  });
});
```

## 🚀 دیپلوی

### IIS (Windows Server)

راهنمای کامل دیپلوی در IIS: [IIS_DEPLOYMENT_GUIDE.md](./IIS_DEPLOYMENT_GUIDE.md)

### Docker

```bash
# ساخت image
docker build -t cartable-ui .

# اجرای container
docker run -p 3000:3000 cartable-ui
```

### آماده‌سازی Production

چک‌لیست: [PRODUCTION_READINESS.md](./PRODUCTION_READINESS.md)

## 📖 مستندات

- [راهنمای راه‌اندازی احراز هویت](./AUTH_SETUP.md)
- [راهنمای دیپلوی IIS](./IIS_DEPLOYMENT_GUIDE.md)
- [آماده‌سازی Production](./PRODUCTION_READINESS.md)
- [ساختار Styles](./styles/README.md)

## 🔒 امنیت

### Security Headers

- Content Security Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### Best Practices

- تمام API calls با Bearer token
- Token refresh خودکار
- محافظت در برابر XSS, CSRF
- Validation ورودی‌ها
- Error handling امن

## 🤝 مشارکت

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. نوشتن تست‌ها برای تغییرات
4. اطمینان از pass شدن همه تست‌ها
5. Commit changes (`git commit -m 'feat: add amazing feature'`)
6. Push to branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📝 لایسنس

این پروژه تحت لایسنس [MIT](./LICENSE) منتشر شده است.

## 📞 پشتیبانی

برای گزارش مشکلات یا درخواست ویژگی‌های جدید، لطفاً یک Issue ایجاد کنید.

---

**ساخته شده با ❤️ با Next.js و TypeScript**
