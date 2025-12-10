# SI.Cartable.BFF - Backend for Frontend

این پروژه یک **BFF (Backend for Frontend)** با .NET 10 است که به عنوان واسط بین اپلیکیشن کارتابل و سرویس تدبیرپی عمل می‌کند.

## ویژگی‌ها

- ✅ معماری BFF Pattern
- ✅ JWT Authentication با Identity Server
- ✅ Authorization با [Authorize] Attribute
- ✅ Proxy کردن درخواست‌ها به سرویس تدبیرپی
- ✅ Retry Policy با Polly
- ✅ Circuit Breaker Pattern
- ✅ CORS Configuration
- ✅ Swagger/OpenAPI Documentation
- ✅ Structured Logging
- ✅ Error Handling

## ساختار پروژه

```
SI.Cartable.BFF/
├── Configuration/          # تنظیمات پروژه
│   └── TadbirPaySettings.cs
├── Controllers/            # کنترلرها
│   ├── PaymentOrdersController.cs
│   ├── AccountsController.cs
│   └── CartableController.cs
├── Models/                 # مدل‌های داده
│   ├── Common/
│   ├── Enums/
│   ├── PaymentOrders/
│   ├── Accounts/
│   └── Cartable/
├── Services/               # سرویس‌ها
│   ├── ITadbirPayService.cs
│   ├── TadbirPayService.cs
│   ├── IPaymentOrdersService.cs
│   ├── PaymentOrdersService.cs
│   ├── IAccountService.cs
│   ├── AccountService.cs
│   ├── ICartableService.cs
│   └── CartableService.cs
└── Program.cs
```

## تنظیمات

### appsettings.json

```json
{
  "TadbirPay": {
    "BaseUrl": "https://si-lab-tadbirpay.etadbir.com/api",
    "TimeoutSeconds": 30,
    "ApiKey": ""
  },
  "IdentityServer": {
    "Authority": "https://si-lab-idp.etadbir.com",
    "Audience": "TadbirPay.Cartable.Api.Scope",
    "RequireHttpsMetadata": true,
    "ValidateIssuer": true,
    "ValidateAudience": true,
    "ValidateLifetime": true
  },
  "Cors": {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://localhost:3000"
    ]
  }
}
```

### Authentication

این BFF از JWT Bearer Authentication استفاده می‌کند. همه endpoint‌ها نیاز به Authorization دارند.

برای دسترسی به API باید:
1. ابتدا از Identity Server توکن دریافت کنید
2. توکن را در هدر Authorization با فرمت `Bearer {token}` ارسال کنید

```bash
# مثال درخواست با توکن
curl -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     https://localhost:5001/api/PaymentOrders/search
```

## API Endpoints

### Payment Orders

- `POST /api/PaymentOrders/search` - جستجوی دستورات پرداخت
- `GET /api/PaymentOrders/{id}` - دریافت جزئیات دستور پرداخت
- `GET /api/PaymentOrders/{id}/statistics` - دریافت آمار دستور پرداخت
- `GET /api/PaymentOrders/{id}/inquiry` - استعلام دستور پرداخت
- `POST /api/PaymentOrders/{id}/send-to-bank` - ارسال به بانک

### Accounts

- `GET /api/Accounts` - دریافت لیست حساب‌ها
- `GET /api/Accounts/{id}` - دریافت جزئیات حساب
- `POST /api/Accounts/change-minimum-signature` - تغییر حداقل تعداد امضا
- `POST /api/Accounts/add-signer` - اضافه کردن امضادار
- `GET /api/Accounts/users` - دریافت لیست کاربران
- `POST /api/Accounts/signers/{signerId}/disable` - غیرفعال کردن امضادار
- `POST /api/Accounts/signers/{signerId}/enable` - فعال کردن امضادار

### Cartable

- `POST /api/Cartable/approver-cartable` - دریافت لیست کارتابل امضادار
- `POST /api/Cartable/send-otp` - ارسال کد OTP
- `POST /api/Cartable/approve` - تایید/رد دستور پرداخت
- `POST /api/Cartable/send-batch-otp` - ارسال کد OTP گروهی
- `POST /api/Cartable/batch-approve` - تایید/رد گروهی

## نحوه اجرا

### Development

```bash
cd SI.Cartable.BFF
dotnet restore
dotnet run
```

سرویس روی پورت پیش‌فرض (معمولا 5000 یا 5001) اجرا می‌شود.

### Swagger UI

بعد از اجرا، به آدرس زیر بروید:

```
https://localhost:5001/swagger
```

## استفاده در Cartable-UI

برای استفاده از BFF در پروژه Next.js، آدرس API را تغییر دهید:

### .env.local

```env
NEXT_PUBLIC_API_BASE_URL=https://localhost:5001/api
```

### مثال استفاده

```typescript
// قبلا - مستقیم به تدبیرپی
const response = await apiClient.post(
  'https://si-lab-tadbirpay.etadbir.com/api/v1-Cartable/Withdrawal/Search',
  data
);

// بعد از BFF - به BFF
const response = await apiClient.post(
  '/PaymentOrders/search',
  data
);
```

## مزایای استفاده از BFF

1. **امنیت بیشتر**: API keys و تنظیمات حساس در سمت سرور نگهداری می‌شوند
2. **کنترل بهتر**: می‌توانید درخواست‌ها را قبل از ارسال به تدبیرپی پردازش کنید
3. **Caching**: امکان cache کردن پاسخ‌ها
4. **Rate Limiting**: محدود کردن تعداد درخواست‌ها
5. **Logging**: لاگ‌گیری متمرکز
6. **Error Handling**: مدیریت بهتر خطاها
7. **Retry Logic**: تلاش مجدد خودکار در صورت خطا

## توسعه بیشتر

برای اضافه کردن سرویس جدید:

1. مدل‌ها را در پوشه `Models` ایجاد کنید
2. Interface و Implementation سرویس را در `Services` بسازید
3. کنترلر مربوطه را در `Controllers` ایجاد کنید
4. سرویس را در `Program.cs` ثبت کنید

## License

این پروژه تحت مالکیت شرکت سامانه‌های اطلاعات تدبیر است.
