# Custom Hook Refactoring - useCartableData

## خلاصه تغییرات

### Hook جدید: `hooks/useCartableData.ts`
- Centralized data management برای my-cartable و manager-cartable
- حذف ~120 خط کد تکراری
- یکپارچه‌سازی logic واکشی داده‌ها و error handling

## فایل‌های تغییر یافته

### ✅ `hooks/useCartableData.ts` (جدید)
```typescript
export function useCartableData({
  fetchFunction,
  pageSize = 10,
}): UseCartableDataReturn
```

**قابلیت‌ها:**
- مدیریت state: orders, loading, error, pagination
- واکشی خودکار داده‌ها با useEffect
- تابع reloadData برای refresh کردن
- پشتیبانی از accountGroupId از localStorage

**Return values:**
```typescript
{
  orders: PaymentOrder[]
  isLoading: boolean
  error: string | null
  pageNumber: number
  totalItems: number
  totalPages: number
  setPageNumber: (page: number) => void
  reloadData: () => Promise<void>
}
```

### ✅ `app/my-cartable/page.tsx`
**قبل:** 832 خط
**بعد:** ~700 خط (132 خط کمتر)

**تغییرات:**
- حذف useState برای orders, loading, error, pagination
- حذف useEffect برای fetch کردن داده‌ها (46 خط)
- حذف reloadData callback (33 خط)
- جایگزینی با یک خط: `useCartableData({ fetchFunction: getApproverCartable })`

### ✅ `app/manager-cartable/page.tsx`
**قبل:** 762 خط
**بعد:** ~630 خط (132 خط کمتر)

**تغییرات:**
- مشابه my-cartable
- جایگزینی با: `useCartableData({ fetchFunction: getManagerCartable })`

## مزایا

✅ **کاهش کد تکراری:** ~120 خط کمتر
✅ **نگهداری آسان‌تر:** تغییرات فقط در یک جا
✅ **ثبات بیشتر:** یک منبع واحد برای data logic
✅ **خوانایی بهتر:** component ها فقط روی UI تمرکز دارند

## نتیجه

✅ Build موفق
✅ هیچ breaking change نداریم
✅ عملکرد یکسان با کد قبلی
✅ آماده برای Phase بعدی: React Query
