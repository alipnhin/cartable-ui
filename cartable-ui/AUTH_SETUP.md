# 🔐 راهنمای سریع راه‌اندازی احراز هویت

## 📦 نصب شده

این پروژه از **NextAuth.js v5** و **Identity Server** استفاده می‌کند.

## ⚡ راه‌اندازی سریع (Quick Start)

### 1. ساخت فایل محیطی

```bash
cp .env.example .env.local
```

### 2. ویرایش `.env.local`

فایل `.env.local` را باز کنید و مقادیر زیر را تنظیم کنید:

```env
# تولید با: openssl rand -base64 32
AUTH_SECRET=your-random-secret-here

# تنظیمات Identity Server
AUTH_ISSUER=https://si-lab-idp.etadbir.com
AUTH_CLIENT_ID=your-client-id-from-identity-server
AUTH_CLIENT_SECRET=your-client-secret-from-identity-server

# URL برنامه
NEXTAUTH_URL=http://localhost:3000
```

### 3. تولید AUTH_SECRET

```bash
openssl rand -base64 32
```

خروجی را کپی کنید و در `AUTH_SECRET` قرار دهید.

### 4. دریافت اطلاعات Client

برای دریافت `CLIENT_ID` و `CLIENT_SECRET`:

1. به پنل مدیریت Identity Server بروید
2. یک Client جدید با این مشخصات بسازید:
   - **Client ID**: `cartable-new` (یا هر نام دلخواه)
   - **Redirect URI**: `http://localhost:3000/api/auth/callback/identity-server`
   - **Grant Type**: Authorization Code + PKCE
   - **Scopes**: `openid`, `profile`, `email`, `offline_access`

3. Client Secret تولید شده را کپی کنید

📖 **راهنمای کامل**: برای جزئیات بیشتر به فایل [`IDENTITY_SERVER_SETUP.md`](./IDENTITY_SERVER_SETUP.md) مراجعه کنید.

### 5. اجرای برنامه

```bash
npm run dev
```

### 6. تست احراز هویت

1. به `http://localhost:3000` بروید
2. به صفحه login هدایت می‌شوید
3. وارد شوید (به Identity Server منتقل می‌شوید)
4. پس از ورود موفق، به dashboard برمی‌گردید

## 📁 فایل‌های ایجاد شده

```
cartable-ui/
├── auth.ts                          # NextAuth config
├── proxy.ts                          # Route protection (Next.js 16)
├── .env.local                        # Environment variables (gitignored)
├── .env.example                      # Environment template
├── AUTH_SETUP.md                     # این فایل
├── IDENTITY_SERVER_SETUP.md          # راهنمای کامل
├── app/
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts          # Auth endpoints
└── types/
    └── next-auth.d.ts                # TypeScript types
```

## 🔧 عیب‌یابی

### خطا: MissingSecret

```
[auth][error] MissingSecret: Please define a `secret`
```

**راه‌حل**: اطمینان حاصل کنید که فایل `.env.local` وجود دارد و `AUTH_SECRET` تنظیم شده است.

### خطا: Invalid Client

```
[auth][error] Invalid client
```

**راه‌حل**: بررسی کنید:
- `AUTH_CLIENT_ID` صحیح است
- `AUTH_CLIENT_SECRET` صحیح است
- Client در Identity Server فعال است

### خطا: Redirect URI mismatch

```
[auth][error] redirect_uri_mismatch
```

**راه‌حل**: اطمینان حاصل کنید Redirect URI در Identity Server دقیقاً این است:
```
http://localhost:3000/api/auth/callback/identity-server
```

## 🔒 نکات امنیتی

⚠️ **هشدار**: هرگز فایل `.env.local` را commit نکنید!

✅ **توصیه‌ها**:
- از HTTPS در production استفاده کنید
- AUTH_SECRET را قوی انتخاب کنید
- Client Secret را محرمانه نگه دارید

## 📞 پشتیبانی

برای راهنمای کامل و جزئیات بیشتر:
- 📖 [`IDENTITY_SERVER_SETUP.md`](./IDENTITY_SERVER_SETUP.md)
- 🌐 [NextAuth.js Docs](https://next-auth.js.org/)
- 🔐 [Identity Server Docs](https://si-lab-idp.etadbir.com)

---

**نسخه:** 1.0.0
**آخرین بروزرسانی:** 2025
