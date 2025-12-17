# React Query Migration - پیشرفت کار

## ✅ کارهای تکمیل شده (70% انجام شده)

### 1. Setup و پیکربندی پایه ✅
- [x] نصب `@tanstack/react-query` و `@tanstack/react-query-devtools`
- [x] ساخت [`lib/react-query.ts`](../lib/react-query.ts) - QueryClient + Query Keys
- [x] ساخت [`components/providers/query-provider.tsx`](../components/providers/query-provider.tsx)
- [x] اضافه کردن QueryProvider به [`app/layout.tsx`](../app/layout.tsx:139)

### 2. صفحه Dashboard ✅
**Hook**: [`hooks/useDashboardQuery.ts`](../hooks/useDashboardQuery.ts)
- ✅ مدیریت filters (fromDate, toDate, bankGatewayId)
- ✅ Helper: `getDefaultDashboardFilters()`
- ✅ Cache: 1 دقیقه

**صفحه**: [`app/dashboard/page.tsx`](../app/dashboard/page.tsx)
- ✅ Refactored با useDashboardQuery
- ✅ ErrorState با retry button
- ✅ Skeleton در حالت loading

**نتیجه**:
- Build ✅ موفق
- کاهش ~27 خط کد

### 3. صفحات Cartable ✅
**Hook**: [`hooks/useCartableQuery.ts`](../hooks/useCartableQuery.ts)
- ✅ پشتیبانی از my-cartable و manager-cartable
- ✅ مدیریت pagination (pageNumber, pageSize, totalPages)
- ✅ همگام‌سازی با localStorage برای accountGroupId
- ✅ Map خودکار با `mapPaymentListDtosToPaymentOrders`
- ✅ Cache: 30 ثانیه

**صفحات**:
1. [`app/my-cartable/page.tsx`](../app/my-cartable/page.tsx:42-58) ✅
   - استفاده از `useCartableQuery` با `cartableType: "my"`
   - مدیریت error یکپارچه

2. [`app/manager-cartable/page.tsx`](../app/manager-cartable/page.tsx:42-58) ✅
   - استفاده از `useCartableQuery` با `cartableType: "manager"`
   - مدیریت error یکپارچه

**نتیجه**:
- Build ✅ موفق
- ~20 خط کد کمتر در هر صفحه
- API calls بهینه‌تر با caching

### 4. صفحه Payment Orders ✅
**Hook**: [`hooks/usePaymentOrdersQuery.ts`](../hooks/usePaymentOrdersQuery.ts)
- ✅ پشتیبانی از 11 فیلتر: trackingId, orderId, name, sourceIban, bankGatewayId, accountGroupId, status, fromDate, toDate
- ✅ Sorting support
- ✅ Pagination (pageNumber, pageSize)
- ✅ Cache: 30 ثانیه

**صفحه**: [`app/payment-orders/page.tsx`](../app/payment-orders/page.tsx)
- ✅ Refactored با usePaymentOrdersQuery
- ✅ پارامترهای API در useMemo
- ✅ Toast notification برای خطاها
- ✅ Skeleton در حالت loading اولیه
- ✅ Loading state هنگام تغییر فیلتر

**نتیجه**:
- Build ✅ موفق
- حذف ~80 خط کد تکراری
- مدیریت بهتر state

## 📊 آمار کلی

### فایل‌های جدید ساخته شده:
1. `lib/react-query.ts` - 88 خط
2. `components/providers/query-provider.tsx` - 29 خط
3. `hooks/useDashboardQuery.ts` - 91 خط
4. `hooks/useCartableQuery.ts` - 166 خط
5. `hooks/usePaymentOrdersQuery.ts` - 135 خط
6. `docs/REACT-QUERY-MIGRATION.md` - مستندات کامل

**جمع کد جدید**: ~509 خط (reusable hooks)

### فایل‌های refactor شده:
1. `app/layout.tsx` - +2 خط (QueryProvider)
2. `app/dashboard/page.tsx` - حذف ~27 خط
3. `app/my-cartable/page.tsx` - حذف ~20 خط
4. `app/manager-cartable/page.tsx` - حذف ~20 خط
5. `app/payment-orders/page.tsx` - حذف ~80 خط

**جمع کد حذف شده**: ~147 خط کد تکراری

### Build Status:
- ✅ تمام builds موفق
- ✅ بدون TypeScript errors
- ✅ بدون warnings
- ⏱️ Build time: ~20 ثانیه

## 📝 صفحات باقی‌مانده (30%)

### 1. Reports Page ❌ (اولویت بالا)
**Service**: `services/reportsService.ts` (احتمالاً باید بسازیم)
**Page**: `app/reports/page.tsx`

**پیچیدگی**: بالا
- 12 فیلتر مختلف
- Export functionality (Excel/PDF)
- نمودارها و charts
- Date range filtering

**Hook مورد نیاز**: `hooks/useReportsQuery.ts`
```typescript
useReportsQuery({
  filterParams: {
    pageNumber, pageSize,
    fromDate, toDate,
    status, bankGatewayId, accountGroupId,
    trackingId, orderId, name,
    paymentType, reasonCode
  }
})
```

### 2. Account Groups Page ❌ (اولویت متوسط)
**Service**: `services/accountGroupService.ts` ✅ (موجود است)
**Page**: `app/account-groups/page.tsx`

**پیچیدگی**: متوسط
- CRUD operations (Create, Read, Update, Delete)
- Filter با pagination: `filterAccountGroups()`
- Dialog state management
- Status toggle

**Hooks مورد نیاز**:
```typescript
// برای لیست
useAccountGroupsQuery({
  filterParams: { pageNumber, pageSize, searchTerm, status }
})

// برای mutations (با useMutation)
useAccountGroupMutations() // create, edit, delete, changeStatus
```

### 3. Accounts Page ❌ (اولویت پایین)
**Service**: `services/accountService.ts` ✅ (موجود است)
**Page**: `app/accounts/page.tsx`

**پیچیدگی**: پایین
- لیست ساده: `getAccountsList()`
- فیلتر client-side (بدون pagination)
- نمایش جزئیات

**Hook مورد نیاز**:
```typescript
useAccountsQuery({
  accountGroupId?: string
})
```

## 🎯 مزایای بدست آمده

### 1. کاهش کد ✅
- حذف ~150 خط کد تکراری
- اضافه ~500 خط hook قابل استفاده مجدد
- Net result: کد تمیزتر و maintainable تر

### 2. Performance ✅
- Automatic caching (30s-1min staleTime)
- جلوگیری از fetch‌های تکراری
- Background refetch بعد از reconnect
- عدم refetch با window focus (بهینه برای PWA)

### 3. Developer Experience ✅
- کد خوانا‌تر و کوتاه‌تر
- مدیریت خودکار loading و error states
- DevTools برای debug
- TypeScript support کامل

### 4. User Experience ✅
- Loading states بهتر
- Error handling یکپارچه
- Retry functionality
- Cache = سرعت بیشتر

## 🚀 مراحل بعدی

### فاز 1: تکمیل صفحات باقی‌مانده
1. **Reports** - پیچیدگی بالا، 2-3 ساعت
2. **Account Groups** - پیچیدگی متوسط، mutations نیاز دارد، 1-2 ساعت
3. **Accounts** - پیچیدگی پایین، 30 دقیقه

### فاز 2: بهینه‌سازی و Clean up
1. حذف `hooks/useCartableData.ts` (دیگر استفاده نمی‌شود)
2. بررسی و بهینه‌سازی query keys
3. اضافه کردن prefetching در جاهای مناسب
4. Optimistic updates برای mutations

### فاز 3: Testing
1. تست تمام صفحات refactor شده
2. تست cache invalidation
3. تست error scenarios
4. تست با network throttling

## 📚 منابع و الگوها

### الگوی Query
```typescript
const { data, isLoading, error, refetch } = useCustomQuery({
  params: { /* filters */ }
});
```

### الگوی Mutation (برای آینده)
```typescript
const { mutate, isLoading } = useMutation({
  mutationFn: createItem,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['items'] });
  }
});
```

### Query Keys Pattern
```typescript
// از queryKeys در lib/react-query.ts استفاده کن
queryKeys.dashboard.transactionProgress(filters)
queryKeys.cartable.myCartable(params)
queryKeys.paymentOrders.list(params)
```

## ⚠️ نکات مهم

1. **همیشه از queryKeys استفاده کن** - برای consistency و invalidation
2. **Error handling** - همیشه از `getErrorMessage()` استفاده کن
3. **Loading states** - از `isLoading && data.length === 0` برای initial load
4. **Dependencies در useMemo** - همه dependencies رو اضافه کن
5. **localStorage sync** - از useEffect برای accountGroupId استفاده کن

## 🎉 خلاصه

تا اینجا 70% پروژه migrate شده است. مهم‌ترین صفحات (Dashboard و Cartables) آماده هستند و payment-orders هم کامل شد. فقط 3 صفحه باقی مانده که reports مهم‌ترین اونهاست.

**Status**: 🟢 On Track
**آخرین بروزرسانی**: 2025-12-17
**آخرین Build**: ✅ موفق (21.7s)
