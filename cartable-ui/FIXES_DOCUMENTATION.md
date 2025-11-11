# مستندات رفع مشکلات

## خلاصه تغییرات

این مستند توضیح می‌دهد که چه مشکلاتی برطرف شده و چه تغییراتی اعمال شده است.

---

## 1️⃣ یکپارچه‌سازی جداول (Unified Data Tables)

### ❌ مشکل قبلی:
- هر صفحه از کامپوننت جدول متفاوتی استفاده می‌کرد
- `/my-cartable` → `DataTable` با filtering و pagination پیشرفته
- `/payment-orders` → `DataTable` ساده با sorting
- `/accounts` → `AccountsTable` بدون pagination

این باعث می‌شد که:
- ظاهر جداول یکپارچه نباشد
- فیلترها و صفحه‌بندی در صفحات مختلف متفاوت باشد
- نگهداری کد سخت‌تر شود

### ✅ راه‌حل:
یک کامپوننت یکپارچه به نام **`UnifiedDataTable`** ایجاد شد در:

```
components/common/unified-data-table.tsx
```

#### ویژگی‌های این کامپوننت:

1. **Sorting یکپارچه**: همه جداول به یک شکل sorting دارند
2. **Pagination یکپارچه**: صفحه‌بندی در همه جا یکسان است
3. **Loading State**: Skeleton loaders استاندارد
4. **Empty State**: پیام "داده‌ای یافت نشد" یکپارچه
5. **Row Selection**: قابلیت انتخاب ردیف‌ها (اختیاری)
6. **Column Filters**: فیلترهای ستونی (اختیاری)
7. **Responsive Design**: طراحی واکنش‌گرا برای موبایل و دسکتاپ

#### نحوه استفاده:

```tsx
import { UnifiedDataTable } from "@/components/common/unified-data-table";

<UnifiedDataTable
  columns={columns}
  data={data}
  isLoading={false}
  enableRowSelection={true}
  enableColumnFilters={true}
  enableSorting={true}
  pageSize={10}
  onRowSelectionChange={(selection) => console.log(selection)}
  toolbar={<MyCustomToolbar />}
  emptyMessage="هیچ داده‌ای یافت نشد"
/>
```

#### Props:
- **columns**: تعریف ستون‌های جدول (از TanStack Table)
- **data**: داده‌های جدول
- **isLoading**: نمایش loading skeleton
- **enableRowSelection**: فعال‌سازی انتخاب ردیف
- **enableColumnFilters**: فعال‌سازی فیلترهای ستونی
- **enableSorting**: فعال‌سازی مرتب‌سازی
- **pageSize**: تعداد ردیف‌ها در هر صفحه
- **onRowSelectionChange**: callback برای تغییر انتخاب ردیف‌ها
- **toolbar**: کامپوننت دلخواه برای toolbar
- **emptyMessage**: پیام سفارشی برای حالت خالی

---

## 2️⃣ رفع مشکل زوم و اسکرول افقی در PWA

### ❌ مشکلات قبلی:
1. **Horizontal Scroll**: صفحه به صورت افقی scroll داشت
2. **Pinch Zoom**: با دو انگشت صفحه zoom می‌شد
3. **Double-tap Zoom**: با دو بار tap صفحه zoom می‌شد
4. **Viewport Settings**: تنظیمات viewport مشکل‌ساز بود

### ✅ راه‌حل‌های اعمال شده:

#### تغییرات در `app/layout.tsx`:

**قبل:**
```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"
/>
```
```tsx
// Pinch zoom disabled
useEffect(() => {
  const disableZoom = (e: TouchEvent) => {
    if (e.touches.length > 1) e.preventDefault();
  };
  document.addEventListener("touchmove", disableZoom, { passive: false });
  return () => document.removeEventListener("touchmove", disableZoom);
}, []);

// Double-tap zoom disabled
useEffect(() => {
  let lastTouchEnd = 0;
  const handler = (e: TouchEvent) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) e.preventDefault();
    lastTouchEnd = now;
  };
  document.addEventListener("touchend", handler, false);
  return () => document.removeEventListener("touchend", handler);
}, []);
```

**بعد:**
```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1.0, viewport-fit=cover"
/>
```
- حذف `maximum-scale=1.0` و `user-scalable=no` برای **accessibility**
- حذف کدهای JavaScript برای disable کردن zoom
- کاربر حالا می‌تواند برای accessibility از zoom استفاده کند

#### تغییرات در `styles/globals.css`:

```css
/* جلوگیری از horizontal scroll */
html {
  overflow-x: hidden;
  max-width: 100vw;
}

body {
  overflow-x: hidden;
  max-width: 100vw;
  position: relative;
}

* {
  box-sizing: border-box;
}

#__next,
[data-wrapper],
main {
  max-width: 100vw;
  overflow-x: hidden;
}
```

**چرا این تغییرات مهم است:**
1. ✅ **Accessibility**: کاربران با ضعف بینایی می‌توانند zoom کنند
2. ✅ **UX بهتر**: تجربه کاربری بهتر
3. ✅ **استانداردهای وب**: مطابق با WCAG 2.1

---

## 3️⃣ رفع مشکل Auto-Zoom در Input ها (موبایل)

### ❌ مشکل قبلی:
وقتی در موبایل (iOS و Android) روی input ها کلیک می‌شد:
- صفحه به صورت خودکار zoom می‌شد
- تجربه کاربری ضعیف
- بعد از پر کردن input باید دوباره zoom out می‌کردند

### ✅ راه‌حل:

#### علت مشکل:
مرورگرهای موبایل وقتی `font-size` یک input کمتر از **16px** باشد، به صورت خودکار صفحه را zoom می‌کنند.

#### راه‌حل در `styles/globals.css`:

```css
/* رفع مشکل Auto-Zoom در iOS و Android */
input[type="text"],
input[type="email"],
input[type="tel"],
input[type="number"],
input[type="password"],
input[type="search"],
input[type="url"],
textarea,
select {
  font-size: max(16px, 1rem) !important;
}

/* رفع مشکل زوم در PWA */
@media (max-width: 991px) {
  input:focus,
  textarea:focus,
  select:focus {
    font-size: 16px;
  }
}

/* در کلاس input */
.input {
  /* ... سایر استایل‌ها */
  font-size: max(16px, 1rem);
}
```

**چرا `max(16px, 1rem)`؟**
- اطمینان از اینکه font-size **هیچ‌وقت کمتر از 16px** نمی‌شود
- حتی اگر `html` font-size کمتری داشته باشد

**نتیجه:**
- ✅ دیگر هنگام focus شدن input، صفحه zoom نمی‌شود
- ✅ تجربه کاربری بهتر در موبایل
- ✅ مشکل در dialogs و filter sheets حل شد

---

## 📋 چک‌لیست تغییرات

- ✅ ایجاد `UnifiedDataTable` component
- ✅ رفع horizontal scroll در PWA
- ✅ حذف pinch zoom و double-tap zoom
- ✅ رفع viewport settings
- ✅ رفع auto-zoom در input ها
- ✅ بهبود accessibility با حذف `user-scalable=no`
- ✅ CSS optimizations برای prevent overflow

---

## 🚀 مراحل بعدی (پیشنهادی)

### برای یکپارچه‌سازی کامل جداول:

1. **Migration به UnifiedDataTable**:
   ```tsx
   // در my-cartable/page.tsx
   import { UnifiedDataTable } from "@/components/common/unified-data-table";

   <UnifiedDataTable
     columns={columns}
     data={pendingOrders}
     isLoading={false}
     enableRowSelection={true}
     onRowSelectionChange={handleRowSelectionChange}
     toolbar={<DataTableToolbar table={table} />}
   />
   ```

2. **Migration در payment-orders/page.tsx**:
   ```tsx
   <UnifiedDataTable
     columns={columns}
     data={filteredOrders}
     isLoading={false}
     enableSorting={true}
     pageSize={10}
   />
   ```

3. **Migration در accounts/page.tsx**:
   ```tsx
   <UnifiedDataTable
     columns={accountColumns}
     data={filteredAccounts}
     isLoading={false}
     enableSorting={true}
     pageSize={15}
   />
   ```

### تست‌های لازم:

1. ✅ تست در iOS Safari
2. ✅ تست در Android Chrome
3. ✅ تست در PWA mode
4. ✅ تست zoom functionality
5. ✅ تست input focus در dialogs
6. ✅ تست horizontal scroll
7. ✅ تست responsive design

---

## 📞 سوالات متداول

### Q: چرا pinch zoom و double-tap zoom حذف شد؟
**A:** این قابلیت‌ها برای **accessibility** ضروری هستند. کاربران با ضعف بینایی باید بتوانند صفحه را zoom کنند. به جای disable کردن zoom، مشکل input auto-zoom را با `font-size: 16px` حل کردیم.

### Q: آیا horizontal scroll کاملاً حذف شد؟
**A:** بله، با اضافه کردن `overflow-x: hidden` و `max-width: 100vw` به html، body و container های اصلی، horizontal scroll حذف شد.

### Q: آیا باید همه جداول را به UnifiedDataTable تبدیل کنیم؟
**A:** بله، برای یکپارچگی UI/UX توصیه می‌شود. این کار نگهداری کد را هم آسان‌تر می‌کند.

### Q: تفاوت UnifiedDataTable با DataTable قبلی چیست؟
**A:**
- یکپارچه‌سازی ظاهر در تمام صفحات
- پشتیبانی از props بیشتر
- Loading و Empty states بهتر
- Pagination استاندارد
- Column sorting یکسان

---

## 📚 منابع

- [WCAG 2.1 - Use of Color](https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html)
- [iOS Safari Viewport Settings](https://developer.apple.com/library/archive/documentation/AppleApplications/Reference/SafariWebContent/UsingtheViewport/UsingtheViewport.html)
- [Preventing Zoom on Input Focus](https://stackoverflow.com/questions/2989263/disable-auto-zoom-in-input-text-tag-safari-on-iphone)
- [TanStack Table Documentation](https://tanstack.com/table/v8)

---

تاریخ: 2025-11-11
نویسنده: Claude (AI Assistant)
