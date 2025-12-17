# بهبودهای API Retry و Error Handling

## تغییرات انجام‌شده

### 1. Retry خودکار (axios-retry)
- 3 بار تلاش مجدد خودکار برای خطاهای شبکه و 5xx
- Exponential backoff: 1s → 2s → 4s
- فقط network errors، 5xx، timeout، و 429 retry می‌شوند

### 2. کاهش Timeout
- GET: 20 ثانیه (قبلاً 120 ثانیه)
- POST/PUT/DELETE: 30 ثانیه

### 3. دکمه "تلاش مجدد"
- صفحات: dashboard, my-cartable, manager-cartable
- نمایش بعد از fail شدن retry های خودکار
- کامپوننت: `components/common/error-state.tsx`

## تنظیمات (.env)

```bash
NEXT_PUBLIC_API_RETRY_COUNT=3
NEXT_PUBLIC_API_RETRY_DELAY=1000
NEXT_PUBLIC_API_TIMEOUT_GET=20000
NEXT_PUBLIC_API_TIMEOUT=30000
```

## نتیجه
✅ کاربر خطاها را کمتر می‌بیند
✅ تجربه بهتر در موبایل
✅ پایداری بالاتر در پروداکشن
