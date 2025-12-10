# راهنمای مدیریت خطا در API

این سند نحوه استفاده از سیستم مدیریت خطای پروژه را توضیح می‌دهد.

## معرفی

سیستم مدیریت خطا به صورت خودکار انواع مختلف خطاها را شناسایی و پردازش می‌کند:

- ✅ **خطاهای Validation** (400) - خطاهای اعتبارسنجی FluentValidation
- ✅ **خطاهای Bad Request** (400) - خطاهای معمولی
- ✅ **خطاهای Unauthorized** (401) - خطای عدم احراز هویت
- ✅ **خطاهای سرور** (500+)
- ✅ **خطاهای شبکه** (Network errors)

## استفاده ساده در کامپوننت‌ها

### استفاده با Toast

```tsx
import { getErrorMessage } from "@/lib/error-handler";
import { toast } from "sonner";

try {
  const response = await dashboardService.getTransactionProgress(params);
  // ...
} catch (error) {
  const errorMessage = getErrorMessage(error);
  toast.error(errorMessage);
}
```

### نمایش خطاهای Validation

```tsx
import {
  getErrorMessage,
  isValidationErrorFn,
  getValidationErrorMessages
} from "@/lib/error-handler";
import { toast } from "sonner";

try {
  const response = await cartableService.getApproverCartable(filterParams);
  // ...
} catch (error) {
  if (isValidationErrorFn(error)) {
    // نمایش هر خطا به صورت جداگانه
    const messages = getValidationErrorMessages(error);
    messages.forEach(msg => toast.error(msg));
  } else {
    // نمایش خطای عادی
    toast.error(getErrorMessage(error));
  }
}
```

### نمایش خطای فیلد خاص

برای فرم‌ها که می‌خواهید خطای هر فیلد را زیر خودش نمایش دهید:

```tsx
import {
  hasFieldError,
  getFieldError
} from "@/lib/error-handler";

try {
  await updateProfile(data);
} catch (error) {
  // چک کردن خطای فیلد ToDate
  if (hasFieldError(error, "ToDate")) {
    const toDateError = getFieldError(error, "ToDate");
    setFieldError("toDate", toDateError);
  }

  // چک کردن خطای فیلد FromDate
  if (hasFieldError(error, "FromDate")) {
    const fromDateError = getFieldError(error, "FromDate");
    setFieldError("fromDate", fromDateError);
  }

  // یا نمایش کلی خطا
  toast.error(getErrorMessage(error));
}
```

## فرمت خطاهای Validation

خطاهای validation از سرور به این فرمت ارسال می‌شوند:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "ToDate": [
      "تاریخ پایان نمی‌تواند در آینده باشد"
    ],
    "PageSize": [
      "اندازه صفحه باید بین 1 تا 100 باشد"
    ]
  },
  "traceId": "00-..."
}
```

این خطاها به صورت خودکار پردازش می‌شوند و پیغام‌های فارسی نمایش داده می‌شود.

## API Reference

### `getErrorMessage(error: unknown): string`

اصلی‌ترین تابع برای دریافت پیغام خطا. همیشه یک رشته بازمی‌گرداند.

```tsx
const message = getErrorMessage(error);
toast.error(message);
```

### `isValidationErrorFn(error: unknown): boolean`

چک می‌کند که آیا خطا از نوع validation است یا نه.

```tsx
if (isValidationErrorFn(error)) {
  // این یک خطای validation است
}
```

### `getValidationErrors(error: unknown): Record<string, string[]> | undefined`

تمام خطاهای validation را به صورت object برمی‌گرداند.

```tsx
const errors = getValidationErrors(error);
// { "ToDate": ["تاریخ پایان نمی‌تواند در آینده باشد"], ... }
```

### `getValidationErrorMessages(error: unknown): string[]`

لیست تمام پیغام‌های خطا را برمی‌گرداند (بدون نام فیلد).

```tsx
const messages = getValidationErrorMessages(error);
// ["تاریخ پایان نمی‌تواند در آینده باشد", "اندازه صفحه باید بین 1 تا 100 باشد"]
```

### `hasFieldError(error: unknown, fieldName: string): boolean`

چک می‌کند که آیا خطای خاصی برای یک فیلد وجود دارد.

```tsx
if (hasFieldError(error, "ToDate")) {
  // فیلد ToDate دارای خطا است
}
```

### `getFieldError(error: unknown, fieldName: string): string | undefined`

اولین پیغام خطای یک فیلد خاص را برمی‌گرداند.

```tsx
const toDateError = getFieldError(error, "ToDate");
// "تاریخ پایان نمی‌تواند در آینده باشد"
```

## نمونه‌های کاربردی

### مثال 1: صفحه Dashboard

```tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/error-handler";
import { dashboardService } from "@/services/dashboard-service";

export default function DashboardPage() {
  const [loading, setLoading] = useState(false);

  const fetchData = async (params: DashboardFilterParams) => {
    setLoading(true);
    try {
      const data = await dashboardService.getTransactionProgress(params);
      // پردازش داده‌ها
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  // ...
}
```

### مثال 2: فرم با خطاهای فیلدی

```tsx
"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  getErrorMessage,
  isValidationErrorFn,
  getFieldError,
  hasFieldError,
} from "@/lib/error-handler";

export default function FilterForm() {
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (data: FormData) => {
    setFieldErrors({});

    try {
      await submitForm(data);
      toast.success("عملیات با موفقیت انجام شد");
    } catch (error) {
      if (isValidationErrorFn(error)) {
        // ست کردن خطاهای فیلدی
        const errors: Record<string, string> = {};

        if (hasFieldError(error, "FromDate")) {
          errors.fromDate = getFieldError(error, "FromDate") || "";
        }
        if (hasFieldError(error, "ToDate")) {
          errors.toDate = getFieldError(error, "ToDate") || "";
        }

        setFieldErrors(errors);
        toast.error("لطفاً خطاهای فرم را برطرف کنید");
      } else {
        toast.error(getErrorMessage(error));
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="fromDate" />
      {fieldErrors.fromDate && (
        <span className="text-red-500">{fieldErrors.fromDate}</span>
      )}

      <input name="toDate" />
      {fieldErrors.toDate && (
        <span className="text-red-500">{fieldErrors.toDate}</span>
      )}

      <button type="submit">ارسال</button>
    </form>
  );
}
```

### مثال 3: نمایش همه خطاها در یک لیست

```tsx
import {
  isValidationErrorFn,
  getValidationErrorMessages,
  getErrorMessage,
} from "@/lib/error-handler";
import { Alert } from "@/components/ui/alert";

function ErrorDisplay({ error }: { error: unknown }) {
  if (isValidationErrorFn(error)) {
    const messages = getValidationErrorMessages(error);
    return (
      <Alert variant="destructive">
        <ul className="list-disc list-inside">
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      </Alert>
    );
  }

  return <Alert variant="destructive">{getErrorMessage(error)}</Alert>;
}
```

## نکات مهم

1. **همیشه از `getErrorMessage` استفاده کنید** - این تابع همیشه یک پیغام مناسب برمی‌گرداند
2. **خطاهای Validation به صورت خودکار فرمت می‌شوند** - نیازی به پردازش دستی نیست
3. **لاگ‌ها فقط در Development نمایش داده می‌شوند** - در Production لاگی ثبت نمی‌شود
4. **نام فیلدها از camelCase به فارسی تبدیل می‌شوند** - مثلاً `ToDate` → `تاریخ پایان`

## مپینگ نام فیلدها

نام فیلدهای رایج به صورت خودکار به فارسی ترجمه می‌شوند:

| نام فیلد در API | نام فارسی |
|-----------------|-----------|
| PageNumber | شماره صفحه |
| PageSize | اندازه صفحه |
| ToDate | تاریخ پایان |
| FromDate | تاریخ شروع |
| NationalCode | کد ملی |
| DestinationIban | شبای مقصد |
| SourceIban | شبای مبدا |
| TrackingId | شناسه پیگیری |
| OrderId | شناسه سفارش |
| OtpCode | کد OTP |
| WithdrawalOrderId | شناسه دستور برداشت |

برای اضافه کردن فیلد جدید، فایل [types/api-error.ts](../types/api-error.ts) را ویرایش کنید.
