# 🎨 Premium Payment Management Design System

سیستم طراحی پرمیوم کارتابل پرداخت - نسخه 2.0

## 📋 فهرست مطالب

- [درباره](#درباره)
- [فلسفه طراحی](#فلسفه-طراحی)
- [پالت رنگی](#پالت-رنگی)
- [کامپوننت‌ها](#کامپوننت‌ها)
- [نحوه استفاده](#نحوه-استفاده)
- [بهترین روش‌ها](#بهترین-روش‌ها)

## درباره

این سیستم طراحی برای ایجاد یک تجربه کاربری حرفه‌ای، مدرن و قابل اعتماد در سیستم‌های مدیریت پرداخت طراحی شده است. الهام‌گرفته از بهترین سیستم‌های بانکی و مالی جهان، با تمرکز بر:

- **اعتماد**: رنگ‌ها و عناصر بصری که احساس امنیت و قابلیت اطمینان ایجاد می‌کنند
- **وضوح**: اطلاعات مالی باید واضح، خوانا و بدون ابهام باشند
- **کارایی**: رابط کاربری که کار کاربران را سریع‌تر و راحت‌تر می‌کند
- **زیبایی**: طراحی مدرن و جذاب که تجربه استفاده را لذت‌بخش می‌کند

## فلسفه طراحی

### Visual Hierarchy (سلسله مراتب بصری)
- استفاده از سایه‌ها و عمق برای ایجاد لایه‌بندی اطلاعات
- Typography واضح با وزن‌های مختلف برای تمایز اهمیت
- Spacing منظم و قابل پیش‌بینی

### Financial Aesthetics (زیبایی‌شناسی مالی)
- رنگ‌های آبی برای اعتماد و امنیت
- سبز برای موفقیت و تراکنش‌های موفق
- قرمز برای هشدارها و خطاها
- طلایی برای تاکید و اطلاعات مهم

### Professional Touch (لمس حرفه‌ای)
- انیمیشن‌های ظریف و محتاطانه
- Hover states واضح و قابل تشخیص
- Loading states و Skeleton screens
- Empty states طراحی شده

## پالت رنگی

### Primary - Financial Blue
رنگ اصلی سیستم، برای اقدامات اصلی و برند
```css
--premium-primary: #1e40af
--premium-primary-light: #3b82f6
--premium-primary-dark: #1e3a8a
--premium-primary-subtle: #dbeafe
```

### Success - Money Green
برای تراکنش‌های موفق، تایید و وضعیت‌های مثبت
```css
--premium-success: #059669
--premium-success-light: #10b981
--premium-success-dark: #047857
--premium-success-subtle: #d1fae5
```

### Warning - Gold
برای هشدارها و اقدامات نیازمند توجه
```css
--premium-warning: #d97706
--premium-warning-light: #f59e0b
--premium-warning-dark: #b45309
--premium-warning-subtle: #fef3c7
```

### Danger - Critical Red
برای خطاها، رد و وضعیت‌های خطرناک
```css
--premium-danger: #dc2626
--premium-danger-light: #ef4444
--premium-danger-dark: #b91c1c
--premium-danger-subtle: #fee2e2
```

### Info - Sky Blue
برای اطلاعات عمومی و راهنمایی‌ها
```css
--premium-info: #0284c7
--premium-info-light: #0ea5e9
--premium-info-dark: #075985
--premium-info-subtle: #e0f2fe
```

### Neutrals - Sophisticated Grays
رنگ‌های خاکستری برای متن، بوردرها و پس‌زمینه‌ها
```css
--premium-slate-[50-900]
```

## کامپوننت‌ها

### 1. Premium Cards

#### Card Types
- `.premium-card` - کارت معمولی با hover effect
- `.premium-card-flat` - کارت بدون سایه قوی
- `.premium-card-elevated` - کارت با سایه بیشتر
- `.premium-card-glass` - کارت با افکت شیشه‌ای

```html
<div class="premium-card">
  <div class="p-6">
    محتوای کارت
  </div>
</div>
```

### 2. Premium Table

جدول پیشرفته با قابلیت sort، hover و styling حرفه‌ای

```html
<div class="premium-table-container">
  <table class="premium-table">
    <thead>
      <tr>
        <th class="sortable">ستون قابل مرتب‌سازی</th>
        <th>ستون معمولی</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>داده 1</td>
        <td>داده 2</td>
      </tr>
    </tbody>
  </table>
</div>
```

**ویژگی‌ها:**
- Sticky header برای scroll طولانی
- Hover effect روی ردیف‌ها
- قابلیت sort با کلیک روی header
- Responsive و mobile-friendly

### 3. Premium Status Badges

Badge های وضعیت با رنگ‌بندی استاندارد

```html
<span class="premium-status-badge success">موفق</span>
<span class="premium-status-badge warning">در انتظار</span>
<span class="premium-status-badge danger">ناموفق</span>
<span class="premium-status-badge info">اطلاعات</span>
<span class="premium-status-badge neutral">خنثی</span>
```

### 4. Premium Filters

فیلترهای مدرن با chip-based UI

```html
<div class="premium-filter-group">
  <div class="flex flex-wrap gap-2">
    <button class="premium-filter-chip">فیلتر 1</button>
    <button class="premium-filter-chip active">فیلتر فعال</button>
  </div>
</div>
```

**ویژگی‌ها:**
- کلیک برای فعال/غیرفعال کردن
- حالت active با رنگ primary
- Hover effects ظریف
- Responsive layout

### 5. Premium Buttons

دکمه‌های مختلف با styling یکپارچه

```html
<button class="premium-btn premium-btn-primary">دکمه اصلی</button>
<button class="premium-btn premium-btn-outline">دکمه outline</button>
<button class="premium-btn premium-btn-ghost">دکمه ghost</button>
```

### 6. Premium Metrics Cards

کارت‌های نمایش متریک با gradient و animation

```html
<div class="premium-metric-card">
  <div class="premium-metric-value">۱۲,۳۴۵</div>
  <div class="premium-metric-label">تعداد تراکنش‌ها</div>
</div>
```

### 7. Premium Typography

```html
<h1 class="premium-heading-1">عنوان سطح 1</h1>
<h2 class="premium-heading-2">عنوان سطح 2</h2>
<h3 class="premium-heading-3">عنوان سطح 3</h3>
<p class="premium-body">متن اصلی</p>
<p class="premium-body-sm">متن کوچک</p>
<span class="premium-caption">Caption</span>
```

### 8. Premium Utilities

```html
<!-- Dividers -->
<div class="premium-divider"></div>
<div class="premium-divider-vertical"></div>

<!-- Glow Effects -->
<div class="premium-glow">افکت نور</div>
<div class="premium-glow-success">افکت نور سبز</div>

<!-- Scrollbar -->
<div class="premium-scrollbar overflow-auto">
  محتوای scrollable
</div>
```

## نحوه استفاده

### 1. Import کردن Styles

در کامپوننت React:
```tsx
import "@/styles/global-v2.css";
```

یا در globals.css:
```css
@import "./global-v2.css";
```

### 2. استفاده از Classes

```tsx
export function MyComponent() {
  return (
    <div className="premium-card">
      <h2 className="premium-heading-2">عنوان</h2>
      <p className="premium-body">محتوا</p>
      <button className="premium-btn premium-btn-primary">
        اقدام
      </button>
    </div>
  );
}
```

### 3. استفاده از CSS Variables

```tsx
<div
  style={{
    color: 'var(--premium-primary)',
    backgroundColor: 'var(--premium-surface-elevated)',
    borderColor: 'var(--premium-border-light)'
  }}
>
  محتوا
</div>
```

یا با Tailwind:
```tsx
<div className="text-[var(--premium-primary)] bg-[var(--premium-surface-1)]">
  محتوا
</div>
```

## انیمیشن‌ها

### Built-in Animations

```html
<div class="premium-animate-fade-in">Fade in</div>
<div class="premium-animate-slide-in">Slide in</div>
<div class="premium-animate-scale-in">Scale in</div>
```

**مدت زمان:** 0.3s
**Timing function:** ease-out
**Use case:** ورود المان‌ها، Modal ها، و Notification ها

## بهترین روش‌ها

### ✅ Do's

1. **از رنگ‌های semantic استفاده کنید**
   ```tsx
   // درست
   <span className="text-[var(--premium-success)]">موفق</span>

   // اشتباه
   <span className="text-green-500">موفق</span>
   ```

2. **از Typography classes استفاده کنید**
   ```tsx
   // درست
   <h2 className="premium-heading-2">عنوان</h2>

   // اشتباه
   <h2 className="text-2xl font-bold">عنوان</h2>
   ```

3. **Spacing ثابت حفظ کنید**
   ```tsx
   // درست - استفاده از spacing system
   <div className="space-y-4">

   // اشتباه - spacing دلخواه
   <div className="space-y-[13px]">
   ```

4. **از Card components استفاده کنید**
   ```tsx
   // درست
   <div className="premium-card">

   // اشتباه - styling دستی
   <div className="bg-white rounded-lg shadow-md border">
   ```

### ❌ Don'ts

1. **مستقیماً color values استفاده نکنید**
2. **Shadow های custom ایجاد نکنید**
3. **از rounding های غیر استاندارد استفاده نکنید**
4. **Typography غیر استاندارد ایجاد نکنید**

## Dark Mode Support

تمام CSS variables به صورت خودکار در dark mode تغییر می‌کنند:

```css
.dark {
  --premium-surface-1: #0f172a;
  --premium-surface-2: #1e293b;
  /* ... */
}
```

استفاده:
```tsx
<div className="dark">
  {/* تمام کامپوننت‌های داخل به صورت خودکار dark می‌شوند */}
</div>
```

## Examples

### Example 1: Transaction Table
```tsx
<div className="premium-table-container premium-scrollbar">
  <table className="premium-table">
    <thead>
      <tr>
        <th className="sortable">نام</th>
        <th className="sortable">مبلغ</th>
        <th>وضعیت</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>محمد احمدی</td>
        <td className="font-bold text-[var(--premium-primary)]">
          ۱۰,۰۰۰,۰۰۰ ریال
        </td>
        <td>
          <span className="premium-status-badge success">
            موفق
          </span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Example 2: Filter Group
```tsx
<div className="premium-filter-group">
  <div className="flex flex-wrap gap-2">
    <span className="premium-caption">فیلتر براساس:</span>
    <button className="premium-filter-chip active">
      همه
    </button>
    <button className="premium-filter-chip">
      موفق
    </button>
    <button className="premium-filter-chip">
      در انتظار
    </button>
  </div>
</div>
```

### Example 3: Metrics Dashboard
```tsx
<div className="grid grid-cols-3 gap-4">
  <div className="premium-metric-card">
    <div className="premium-metric-value">۱۲,۳۴۵</div>
    <div className="premium-metric-label">تراکنش‌ها</div>
  </div>
  <div className="premium-metric-card">
    <div className="premium-metric-value">۹۸٪</div>
    <div className="premium-metric-label">نرخ موفقیت</div>
  </div>
  <div className="premium-metric-card">
    <div className="premium-metric-value">۲.۵M</div>
    <div className="premium-metric-label">مجموع مبلغ</div>
  </div>
</div>
```

## Performance Tips

1. **از CSS variables استفاده کنید** - سریع‌تر از inline styles
2. **از built-in animations استفاده کنید** - بهینه شده برای performance
3. **Lazy load کنید** - فقط در صفحاتی که نیاز دارند import کنید
4. **از premium-scrollbar استفاده کنید** - برای scroll های سنگین

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## نکات مهم

1. ⚠️ این design system مستقل از design system اصلی است
2. 🎨 می‌توانید به تدریج کامپوننت‌ها را migrate کنید
3. 📱 تمام کامپوننت‌ها responsive هستند
4. 🌙 تمام کامپوننت‌ها از dark mode پشتیبانی می‌کنند
5. ♿ تمام کامپوننت‌ها accessible هستند

## مشارکت

برای اضافه کردن کامپوننت یا ویژگی جدید:

1. رنگ‌ها را از پالت استاندارد انتخاب کنید
2. از naming convention استفاده کنید: `premium-*`
3. مستندات را به‌روز کنید
4. از best practices پیروی کنید

---

**نسخه:** 2.0.0
**آخرین به‌روزرسانی:** 2025
**نگهدارنده:** Cartable Payment Team
