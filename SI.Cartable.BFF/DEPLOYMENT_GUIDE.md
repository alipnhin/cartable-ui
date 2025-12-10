# راهنمای استقرار BFF

این راهنما مراحل کامل راه‌اندازی و استقرار BFF را شرح می‌دهد.

## 📋 پیش‌نیازها

- [x] .NET 10 SDK نصب شده باشد
- [x] دسترسی به Identity Server
- [ ] Client جدید در Identity Server ایجاد شود
- [ ] Scope جدید در Identity Server ایجاد شود

## 🔧 مرحله 1: تنظیمات Identity Server

### 1.1. ایجاد API Scope

در Identity Server Admin Panel:

```csharp
new ApiScope("cartable-bff-api.scope", "Cartable BFF API Scope")
```

### 1.2. ایجاد API Resource

```csharp
new ApiResource("cartable-bff-api", "Cartable BFF API")
{
    Scopes = { "cartable-bff-api.scope" },
    UserClaims = { "name", "email", "role", "sub" }
}
```

### 1.3. به‌روزرسانی Client موجود Next.js

به `AllowedScopes` کلاینت `cartable-new` اضافه کنید:

```csharp
AllowedScopes =
{
    // ... scopes قبلی
    "cartable-bff-api.scope" // ✅ جدید
}
```

## 🚀 مرحله 2: راه‌اندازی BFF

### 2.1. Build کردن

```bash
cd SI.Cartable.BFF
dotnet restore
dotnet build
```

### 2.2. اجرای Development

```bash
dotnet run
```

BFF روی پورت پیش‌فرض اجرا می‌شود:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`

### 2.3. تست Swagger

مرورگر را باز کنید و به آدرس زیر بروید:
```
https://localhost:5001/swagger
```

## 🔐 مرحله 3: تنظیمات BFF

### 3.1. appsettings.json

```json
{
  "TadbirPay": {
    "BaseUrl": "https://si-lab-tadbirpay.etadbir.com/api",
    "TimeoutSeconds": 30
  },
  "IdentityServer": {
    "Authority": "https://si-lab-idp.etadbir.com",
    "Audience": "cartable-bff-api.scope",
    "RequireHttpsMetadata": true
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://localhost:3000"
    ]
  }
}
```

### 3.2. appsettings.Production.json

برای production فایل جداگانه ایجاد کنید:

```json
{
  "TadbirPay": {
    "BaseUrl": "https://production-tadbirpay.etadbir.com/api",
    "TimeoutSeconds": 60
  },
  "IdentityServer": {
    "Authority": "https://production-idp.etadbir.com",
    "Audience": "cartable-bff-api.scope",
    "RequireHttpsMetadata": true
  },
  "Cors": {
    "AllowedOrigins": [
      "https://your-production-domain.com"
    ]
  },
  "Logging": {
    "LogLevel": {
      "Default": "Warning",
      "Microsoft.AspNetCore": "Error"
    }
  }
}
```

## 🌐 مرحله 4: تنظیمات Cartable-UI

### 4.1. به‌روزرسانی .env.local

```env
# Backend API base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api

# BFF URL
NEXT_PUBLIC_BFF_URL=http://localhost:5000
```

### 4.2. به‌روزرسانی Services

طبق فایل [UPDATE_SERVICES.md](./UPDATE_SERVICES.md) سرویس‌ها را به‌روز کنید.

### 4.3. تست اتصال

1. BFF را اجرا کنید
2. Next.js را اجرا کنید:
   ```bash
   npm run dev
   ```
3. مرورگر را باز کنید: `http://localhost:3000`
4. لاگین کنید
5. به صفحات مختلف بروید و بررسی کنید

## 🐳 مرحله 5: Docker (اختیاری)

### 5.1. Dockerfile

```dockerfile
FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src
COPY ["SI.Cartable.BFF.csproj", "./"]
RUN dotnet restore "SI.Cartable.BFF.csproj"
COPY . .
RUN dotnet build "SI.Cartable.BFF.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SI.Cartable.BFF.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SI.Cartable.BFF.dll"]
```

### 5.2. docker-compose.yml

```yaml
version: '3.8'

services:
  bff:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "5000:80"
      - "5001:443"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ASPNETCORE_URLS=https://+:443;http://+:80
    volumes:
      - ./appsettings.Production.json:/app/appsettings.Production.json
```

### 5.3. اجرا با Docker

```bash
docker-compose up -d
```

## 📊 مرحله 6: Monitoring & Logging

### 6.1. اضافه کردن Serilog (پیشنهادی)

```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.File
dotnet add package Serilog.Sinks.Console
```

در `Program.cs`:

```csharp
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/bff-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();
```

### 6.2. Health Checks

در `Program.cs`:

```csharp
builder.Services.AddHealthChecks();

// ...

app.MapHealthChecks("/health");
```

## 🔒 مرحله 7: امنیت

### 7.1. HTTPS در Production

```csharp
if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
    app.UseHttpsRedirection();
}
```

### 7.2. Rate Limiting

```bash
dotnet add package AspNetCoreRateLimit
```

```csharp
builder.Services.AddMemoryCache();
builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
builder.Services.AddInMemoryRateLimiting();
builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
```

### 7.3. API Key برای تدبیرپی (اختیاری)

در `appsettings.json`:

```json
{
  "TadbirPay": {
    "BaseUrl": "...",
    "ApiKey": "your-api-key-here"
  }
}
```

## 📝 Checklist استقرار

### Development
- [ ] BFF build می‌شود
- [ ] BFF اجرا می‌شود
- [ ] Swagger در دسترس است
- [ ] Next.js به BFF متصل می‌شود
- [ ] Authentication کار می‌کند
- [ ] API calls موفق هستند

### Production
- [ ] Client در Identity Server ایجاد شده
- [ ] Scope در Identity Server ایجاد شده
- [ ] appsettings.Production.json تنظیم شده
- [ ] HTTPS فعال است
- [ ] Logging تنظیم شده
- [ ] Health checks فعال است
- [ ] CORS صحیح تنظیم شده
- [ ] Rate limiting (اختیاری) فعال است
- [ ] Monitoring راه‌اندازی شده

## 🐛 عیب‌یابی

### خطای 401 Unauthorized

```
✅ بررسی کنید:
- Token معتبر است؟
- Audience در appsettings درست است؟
- Scope در Identity Server اضافه شده؟
- Client مجوز scope را دارد؟
```

### خطای CORS

```
✅ بررسی کنید:
- آدرس Next.js در Cors:AllowedOrigins است؟
- UseCors قبل از UseAuthentication فراخوانی شده؟
```

### BFF به تدبیرپی متصل نمی‌شود

```
✅ بررسی کنید:
- BaseUrl صحیح است؟
- تدبیرپی در دسترس است؟
- Network/Firewall مشکلی ندارد؟
```

## 📞 پشتیبانی

در صورت بروز مشکل:
1. لاگ‌های BFF را بررسی کنید
2. لاگ‌های Next.js را بررسی کنید
3. Network tab در مرورگر را بررسی کنید
4. Swagger را برای تست مستقیم استفاده کنید

## 🔄 Rollback

در صورت بروز مشکل:

1. `.env.local` را به حالت قبل برگردانید:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://si-lab-tadbirpay.etadbir.com/api
   ```

2. Next.js را restart کنید

3. BFF را متوقف کنید

برنامه به حالت قبل (اتصال مستقیم به تدبیرپی) برمی‌گردد.
