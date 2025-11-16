# راهنمای پیکربندی Identity Server Client

این راهنما مراحل لازم برای ساخت و پیکربندی کلاینت در Identity Server با آدرس `https://si-lab-idp.etadbir.com` را شرح می‌دهد.

## 📋 مراحل پیکربندی در Identity Server

### 1. ایجاد Client جدید

در پنل مدیریت Identity Server، یک Client جدید با مشخصات زیر ایجاد کنید:

```json
{
  "ClientId": "cartable-ui",
  "ClientName": "کارتابل پرداخت",
  "Description": "کارتابل مدیریت پرداخت - وب اپلیکیشن",
  "ClientUri": "http://localhost:3000",
  "LogoUri": "http://localhost:3000/media/logo.png"
}
```

### 2. تنظیمات Grant Types

Client باید از **Authorization Code Flow با PKCE** پشتیبانی کند:

```json
{
  "AllowedGrantTypes": ["authorization_code"],
  "RequirePkce": true,
  "RequireClientSecret": true,
  "AllowOfflineAccess": true
}
```

### 3. تنظیمات Redirect URIs

URLهای بازگشت (Redirect URIs) که باید در Client تنظیم شوند:

#### برای محیط Development:
```
http://localhost:3000/api/auth/callback/identity-server
```

#### برای محیط Production:
```
https://your-domain.com/api/auth/callback/identity-server
```

#### Logout URIs:
```
http://localhost:3000
https://your-domain.com
```

### 4. تنظیمات CORS Origins

اگر Identity Server نیاز به CORS دارد:

```
http://localhost:3000
https://your-domain.com
```

### 5. Scopes مجاز

Scopeهایی که Client باید به آن‌ها دسترسی داشته باشد:

```json
{
  "AllowedScopes": [
    "openid",
    "profile",
    "email",
    "offline_access"
  ]
}
```

### 6. تنظیمات Token

```json
{
  "AccessTokenLifetime": 3600,
  "IdentityTokenLifetime": 300,
  "AuthorizationCodeLifetime": 300,
  "AbsoluteRefreshTokenLifetime": 2592000,
  "SlidingRefreshTokenLifetime": 1296000,
  "RefreshTokenUsage": "ReUse",
  "RefreshTokenExpiration": "Sliding"
}
```

### 7. تنظیمات امنیتی

```json
{
  "RequireConsent": false,
  "AllowRememberConsent": true,
  "RequirePkce": true,
  "AllowPlainTextPkce": false,
  "RequireClientSecret": true,
  "AllowAccessTokensViaBrowser": false
}
```

## 🔐 دریافت Client Secret

پس از ایجاد Client، یک **Client Secret** تولید خواهد شد. این مقدار را در فایل `.env.local` ذخیره کنید:

```env
AUTH_CLIENT_SECRET=your-generated-client-secret-here
```

⚠️ **هشدار امنیتی**: Client Secret را هرگز در کد یا git commit نکنید!

## ⚙️ پیکربندی محیط (Environment Variables)

فایل `.env.local` را در ریشه پروژه ایجاد کنید:

```env
# NextAuth Secret - Generate with: openssl rand -base64 32
AUTH_SECRET=your-random-secret-key-here

# Identity Server Configuration
AUTH_ISSUER=https://si-lab-idp.etadbir.com
AUTH_CLIENT_ID=cartable-ui
AUTH_CLIENT_SECRET=your-client-secret-from-identity-server

# Application URL (change for production)
NEXTAUTH_URL=http://localhost:3000
```

### تولید AUTH_SECRET

برای تولید یک کلید امن، از دستور زیر استفاده کنید:

```bash
openssl rand -base64 32
```

## 🧪 تست احراز هویت

### 1. اجرای برنامه

```bash
npm run dev
```

### 2. دسترسی به صفحه لاگین

به آدرس زیر بروید:
```
http://localhost:3000/login
```

### 3. فرآیند ورود

1. روی دکمه ورود کلیک کنید
2. به صفحه لاگین Identity Server منتقل می‌شوید
3. اطلاعات کاربری خود را وارد کنید
4. پس از احراز هویت موفق، به dashboard برگردانده می‌شوید

## 📊 نمونه JSON کامل Client

این یک نمونه کامل از پیکربندی Client است که می‌توانید در Identity Server استفاده کنید:

```json
{
  "ClientId": "cartable-ui",
  "ClientName": "کارتابل پرداخت",
  "Description": "کارتابل مدیریت پرداخت - وب اپلیکیشن",
  "ClientUri": "http://localhost:3000",
  "LogoUri": "http://localhost:3000/media/logo.png",
  "RequireClientSecret": true,
  "ClientSecrets": [
    {
      "Description": "Production Secret",
      "Value": "sha256-hash-of-your-secret",
      "Expiration": null
    }
  ],
  "AllowedGrantTypes": ["authorization_code"],
  "RequirePkce": true,
  "AllowPlainTextPkce": false,
  "RedirectUris": [
    "http://localhost:3000/api/auth/callback/identity-server",
    "https://your-domain.com/api/auth/callback/identity-server"
  ],
  "PostLogoutRedirectUris": [
    "http://localhost:3000",
    "https://your-domain.com"
  ],
  "AllowedCorsOrigins": [
    "http://localhost:3000",
    "https://your-domain.com"
  ],
  "AllowedScopes": [
    "openid",
    "profile",
    "email",
    "offline_access"
  ],
  "AllowOfflineAccess": true,
  "RequireConsent": false,
  "AllowRememberConsent": true,
  "AllowAccessTokensViaBrowser": false,
  "AccessTokenLifetime": 3600,
  "IdentityTokenLifetime": 300,
  "AuthorizationCodeLifetime": 300,
  "AbsoluteRefreshTokenLifetime": 2592000,
  "SlidingRefreshTokenLifetime": 1296000,
  "RefreshTokenUsage": "ReUse",
  "RefreshTokenExpiration": "Sliding",
  "UpdateAccessTokenClaimsOnRefresh": true,
  "IncludeJwtId": true,
  "AlwaysSendClientClaims": false,
  "AlwaysIncludeUserClaimsInIdToken": false,
  "BackChannelLogoutSessionRequired": true,
  "Enabled": true
}
```

## 🔍 بررسی Discovery Document

برای اطمینان از صحت پیکربندی Identity Server، می‌توانید Discovery Document را بررسی کنید:

```
https://si-lab-idp.etadbir.com/.well-known/openid-configuration
```

این endpoint باید اطلاعاتی شامل:
- `issuer`
- `authorization_endpoint`
- `token_endpoint`
- `userinfo_endpoint`
- `jwks_uri`
- `scopes_supported`
- `response_types_supported`

را برگرداند.

## 🛠 عیب‌یابی (Troubleshooting)

### خطای Redirect URI mismatch

✅ **راه‌حل**: اطمینان حاصل کنید که Redirect URI در Identity Server دقیقاً مطابق با URL زیر است:
```
http://localhost:3000/api/auth/callback/identity-server
```

### خطای Invalid Client

✅ **راه‌حل**:
- بررسی کنید که `CLIENT_ID` در `.env.local` با `ClientId` در Identity Server یکسان باشد
- بررسی کنید که `CLIENT_SECRET` صحیح وارد شده باشد

### خطای CORS

✅ **راه‌حل**: اطمینان حاصل کنید که origin شما در `AllowedCorsOrigins` تنظیم شده است

### توکن منقضی می‌شود

✅ **راه‌حل**: بررسی کنید که:
- `AllowOfflineAccess: true` تنظیم شده باشد
- Scope `offline_access` در `AllowedScopes` موجود باشد

## 📞 پشتیبانی

در صورت بروز مشکل:

1. لاگ‌های Identity Server را بررسی کنید
2. Developer Console مرورگر را چک کنید (F12)
3. متغیرهای محیطی را دوباره بررسی کنید
4. اطمینان حاصل کنید که Identity Server در دسترس است

## 🔒 نکات امنیتی

1. ✅ همیشه HTTPS در production استفاده کنید
2. ✅ Client Secret را ایمن نگه دارید
3. ✅ AUTH_SECRET را با الگوریتم قوی تولید کنید
4. ✅ Redirect URIs را محدود کنید
5. ✅ PKCE را فعال کنید (RequirePkce: true)
6. ✅ از Plain Text PKCE استفاده نکنید

---

**نسخه:** 1.0.0
**تاریخ:** 2025
**مخصوص:** کارتابل مدیریت پرداخت
