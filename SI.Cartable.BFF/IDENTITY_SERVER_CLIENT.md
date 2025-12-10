# Identity Server Client Configuration برای BFF

این فایل شامل تنظیمات مورد نیاز برای ایجاد Client در Identity Server است.

## Client Configuration

در Identity Server باید یک API Resource و یک Client جدید اضافه کنید:

### 1. API Resource (اگر وجود ندارد)

```csharp
new ApiResource("cartable-bff-api", "Cartable BFF API")
{
    Scopes = { "cartable-bff-api.scope" },
    UserClaims = { "name", "email", "role" }
}
```

### 2. API Scope

```csharp
new ApiScope("cartable-bff-api.scope", "Cartable BFF API Scope")
```

### 3. Client برای BFF

این Client برای احراز هویت درخواست‌های بین Next.js و BFF استفاده می‌شود:

```csharp
new Client
{
    ClientId = "cartable-bff",
    ClientName = "Cartable BFF Service",

    // Client Credentials Flow - برای server-to-server authentication
    AllowedGrantTypes = GrantTypes.ClientCredentials,

    // Client Secret (باید در appsettings.json BFF قرار گیرد)
    ClientSecrets =
    {
        new Secret("your-secure-secret-here".Sha256())
    },

    // Scopes مجاز
    AllowedScopes =
    {
        "cartable-bff-api.scope",
        "TadbirPay.Cartable.Api.Scope" // برای دسترسی به تدبیرپی
    },

    // Claim های اضافی
    AlwaysSendClientClaims = true,
    AlwaysIncludeUserClaimsInIdToken = true,

    // Access Token Lifetime (1 hour)
    AccessTokenLifetime = 3600
}
```

## Alternative: استفاده از Token های Next.js

اگر می‌خواهید BFF از همان توکن‌های Next.js استفاده کند (بهترین روش):

```csharp
// فقط باید API Resource تنظیم شود
new ApiResource("cartable-bff-api", "Cartable BFF API")
{
    Scopes = { "cartable-bff-api.scope" },
    UserClaims = { "name", "email", "role", "sub" }
}

new ApiScope("cartable-bff-api.scope", "Cartable BFF API Scope")
```

سپس Client موجود Next.js (`cartable-new`) را به‌روزرسانی کنید:

```csharp
new Client
{
    ClientId = "cartable-new",
    ClientName = "Cartable Next.js Application",

    AllowedGrantTypes = GrantTypes.Code,
    RequirePkce = true,

    ClientSecrets =
    {
        new Secret("ce2833384df04b51bef9f03502998fef".Sha256())
    },

    RedirectUris =
    {
        "http://localhost:3000/api/auth/callback/identity-server",
        "https://your-production-domain/api/auth/callback/identity-server"
    },

    PostLogoutRedirectUris =
    {
        "http://localhost:3000",
        "https://your-production-domain"
    },

    AllowedScopes =
    {
        IdentityServerConstants.StandardScopes.OpenId,
        IdentityServerConstants.StandardScopes.Profile,
        IdentityServerConstants.StandardScopes.Email,
        IdentityServerConstants.StandardScopes.OfflineAccess,
        "TadbirPay.Cartable.Api.Scope",
        "cartable-bff-api.scope" // ✅ اضافه کردن scope جدید
    },

    AllowOfflineAccess = true,
    RefreshTokenUsage = TokenUsage.ReUse,
    RefreshTokenExpiration = TokenExpiration.Sliding,
    SlidingRefreshTokenLifetime = 2592000, // 30 days

    AccessTokenLifetime = 3600, // 1 hour
    IdentityTokenLifetime = 3600
}
```

## توصیه

**روش دوم (استفاده از توکن‌های Next.js)** بهترین روش است چون:

1. ✅ کاربر یکبار login می‌کند
2. ✅ توکن همان کاربر به BFF ارسال می‌شود
3. ✅ BFF می‌تواند اطلاعات کاربر را از token بخواند
4. ✅ نیازی به مدیریت توکن جداگانه نیست

## مراحل پیاده‌سازی

### در Identity Server:

1. به Admin Panel Identity Server بروید
2. به قسمت API Resources بروید و Resource بالا را اضافه کنید
3. به قسمت API Scopes بروید و Scope بالا را اضافه کنید
4. به قسمت Clients بروید و Client `cartable-new` را ویرایش کنید
5. Scope `cartable-bff-api.scope` را به AllowedScopes اضافه کنید

### در BFF (appsettings.json):

```json
{
  "IdentityServer": {
    "Authority": "https://si-lab-idp.etadbir.com",
    "Audience": "cartable-bff-api.scope",
    "RequireHttpsMetadata": true
  }
}
```

## Security Notes

- ⚠️ Client Secret را هیچوقت در کد commit نکنید
- ⚠️ در Production از Environment Variables استفاده کنید
- ⚠️ HTTPS را حتما فعال کنید
- ⚠️ Token Lifetime را بر اساس نیاز تنظیم کنید
