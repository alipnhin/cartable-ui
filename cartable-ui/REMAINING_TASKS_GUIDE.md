# راهنمای پیاده‌سازی کارهای باقی‌مانده

این مستند شامل راهنمای کامل برای پیاده‌سازی کارهای باقی‌مانده است.

---

## ✅ کارهای تکمیل شده (8 از 12)

1. ✅ ارتفاع دکمه‌ها در موبایل (48px)
2. ✅ اصلاح دکمه‌های outline
3. ✅ یکسان‌سازی رنگ Sidebar و Header
4. ✅ اصلاح صفحه جزئیات دستور پرداخت
5. ✅ طراحی مجدد دکمه‌های کارتابل
6. ✅ اصلاح دکمه‌های جدول حساب‌ها
7. ✅ حل مشکل scroll Sidebar/Header
8. ✅ افزودن MobilePagination component

---

## 🚧 کارهای باقی‌مانده (4 مورد)

### 1️⃣ استفاده از MobilePagination در لیست‌های موجود

**فایل‌های نیازمند تغییر:**
- `app/payment-orders/page.tsx`
- `app/payment-orders/[id]/components/order-detail-transactions.tsx`
- `app/reports/transactions/page.tsx`

**مثال پیاده‌سازی:**

```tsx
// قبل:
{hasMore && (
  <Button
    variant="outline"
    className="w-full"
    onClick={handleLoadMore}
  >
    <ChevronDown className="h-4 w-4 me-2" />
    نمایش بیشتر ({remainingCount} مورد باقیمانده)
  </Button>
)}

// بعد:
import { MobilePagination } from "@/components/common/mobile-pagination";

// در component:
const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 10;
const totalPages = Math.ceil(filteredData.length / itemsPerPage);

const paginatedData = filteredData.slice(
  (currentPage - 1) * itemsPerPage,
  currentPage * itemsPerPage
);

// در JSX:
{isMobile && (
  <MobilePagination
    currentPage={currentPage}
    totalPages={totalPages}
    onPageChange={setCurrentPage}
  />
)}
```

**Translation keys لازم (در `i18n/langs/fa.json`):**
```json
{
  "common": {
    "pagination": {
      "previous": "قبلی",
      "next": "بعدی"
    }
  }
}
```

---

### 2️⃣ باز طراحی فیلتر گزارشات

**فایل:** `app/reports/transactions/components/filters.tsx`

**مشکلات فعلی:**
- UI ساده و غیرحرفه‌ای
- دکمه‌های بد طراحی شده
- عدم استفاده از کامپوننت‌های یکپارچه

**راه‌حل پیشنهادی:**

ایجاد یک کامپوننت فیلتر حرفه‌ای:

```tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useTranslation from "@/hooks/useTranslation";

interface TransactionFiltersProps {
  filters: {
    search: string;
    status: string[];
    dateFrom: string;
    dateTo: string;
    minAmount: string;
    maxAmount: string;
  };
  onFiltersChange: (filters: any) => void;
  onReset: () => void;
}

export function TransactionFilters({
  filters,
  onFiltersChange,
  onReset,
}: TransactionFiltersProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const activeFiltersCount = Object.values(filters).filter((v) =>
    Array.isArray(v) ? v.length > 0 : v !== ""
  ).length;

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2 relative">
          <Filter className="h-4 w-4" />
          {t("common.buttons.filter")}
          {activeFiltersCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -end-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh]">
        <SheetHeader>
          <SheetTitle>{t("reports.filterTitle")}</SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-6 overflow-y-auto h-[calc(100%-8rem)] pb-4">
          {/* جستجو */}
          <div className="space-y-2">
            <Label>{t("common.search")}</Label>
            <Input
              placeholder={t("reports.searchPlaceholder")}
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* محدوده تاریخ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("common.dateFrom")}</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("common.dateTo")}</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleFilterChange("dateTo", e.target.value)}
              />
            </div>
          </div>

          {/* محدوده مبلغ */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("common.minAmount")}</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.minAmount}
                onChange={(e) => handleFilterChange("minAmount", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("common.maxAmount")}</Label>
              <Input
                type="number"
                placeholder="0"
                value={filters.maxAmount}
                onChange={(e) => handleFilterChange("maxAmount", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* دکمه‌های عملیات */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background flex gap-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              onReset();
              setOpen(false);
            }}
          >
            <X className="h-4 w-4 me-2" />
            {t("common.buttons.reset")}
          </Button>
          <Button className="flex-1" onClick={() => setOpen(false)}>
            {t("common.buttons.apply")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

---

### 3️⃣ یکپارچه‌سازی جدول تراکنش‌ها

**فایل:** `app/payment-orders/[id]/components/order-detail-transactions.tsx`

**مشکل:** استفاده از Table سفارشی به جای UnifiedDataTable

**راه‌حل:**

1. ایجاد columns برای تراکنش‌ها:

```tsx
// transactions-columns.tsx
import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "@/types/transaction";
import { TransactionStatusBadge } from "@/components/ui/status-badge";
import { PaymentTypeIcon } from "@/components/common/payment-type-icon";
import { BankLogo } from "@/components/common/bank-logo";
import { formatCurrency } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";

export const createTransactionColumns = (
  locale: string,
  t: (key: string) => string,
  onView: (transaction: Transaction) => void
): ColumnDef<Transaction>[] => {
  return [
    {
      accessorKey: "ownerName",
      header: () => <div>{t("transactions.beneficiary")}</div>,
      cell: ({ row }) => (
        <div className="font-medium">{row.original.ownerName}</div>
      ),
    },
    {
      accessorKey: "destinationIban",
      header: () => <div>{t("transactions.iban")}</div>,
      cell: ({ row }) => (
        <div className="font-mono text-xs">{row.original.destinationIban}</div>
      ),
    },
    {
      accessorKey: "amount",
      header: () => <div className="text-end">{t("transactions.amount")}</div>,
      cell: ({ row }) => (
        <div className="text-end font-bold">
          {formatCurrency(row.original.amount, locale)}
        </div>
      ),
    },
    {
      accessorKey: "paymentType",
      header: () => <div>{t("transactions.type")}</div>,
      cell: ({ row }) => (
        <PaymentTypeIcon type={row.original.paymentType} showLabel />
      ),
    },
    {
      accessorKey: "status",
      header: () => <div>{t("common.status")}</div>,
      cell: ({ row }) => (
        <TransactionStatusBadge status={row.original.status} size="sm" />
      ),
    },
    {
      id: "actions",
      header: () => <div className="text-center">{t("common.actions")}</div>,
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            className="h-9 w-9 p-0"
            onClick={() => onView(row.original)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];
};
```

2. استفاده از UnifiedDataTable:

```tsx
import { UnifiedDataTable } from "@/components/common/unified-data-table";
import { createTransactionColumns } from "./transactions-columns";

// در کامپوننت:
const columns = useMemo(
  () => createTransactionColumns(locale, t, handleViewDetails),
  [locale, t]
);

// در JSX (desktop):
<UnifiedDataTable
  columns={columns}
  data={filteredTransactions}
  isLoading={false}
  enableSorting={true}
  pageSize={25}
  emptyMessage={t("transactions.noTransactions")}
/>
```

---

### 4️⃣ افزودن Persian DatePicker (کار بزرگ)

**پیچیدگی:** بالا
**زمان تخمینی:** 2-3 ساعت

**کتابخانه‌های پیشنهادی:**
- `react-modern-calendar-datepicker` (پشتیبانی خوب از فارسی)
- `@persian-tools/persian-tools` (ابزارهای تاریخ)
- `date-fns-jalali` (کار با تاریخ جلالی)

**نصب:**
```bash
npm install react-modern-calendar-datepicker
npm install @persian-tools/persian-tools
```

**ایجاد کامپوننت:**

```tsx
// components/ui/persian-datepicker.tsx
"use client";

import { useState } from "react";
import DatePicker from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";

interface PersianDatePickerProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function PersianDatePicker({
  value,
  onChange,
  placeholder,
  className,
}: PersianDatePickerProps) {
  const { t, locale } = useTranslation();
  const [selectedDay, setSelectedDay] = useState(null);

  const handleDateChange = (date: any) => {
    setSelectedDay(date);
    if (onChange && date) {
      // تبدیل به فرمت ISO
      const isoDate = `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`;
      onChange(isoDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-right font-normal",
            !value && "text-muted-foreground",
            className
          )}
        >
          <Calendar className="me-2 h-4 w-4" />
          {value || placeholder || t("common.selectDate")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <DatePicker
          value={selectedDay}
          onChange={handleDateChange}
          locale={locale === "fa" ? "fa" : "en"}
          shouldHighlightWeekends
        />
      </PopoverContent>
    </Popover>
  );
}
```

**استفاده:**
```tsx
<PersianDatePicker
  value={filters.dateFrom}
  onChange={(date) => handleFilterChange("dateFrom", date)}
  placeholder="از تاریخ"
/>
```

---

### 5️⃣ باز طراحی کامل صفحه جزئیات حساب (کار بزرگ)

**فایل:** `app/accounts/[id]/page.tsx`

**تغییرات مورد نیاز:**

#### A. حذف تب‌بندی

```tsx
// قبل:
<Tabs defaultValue="info">
  <TabsList>...</TabsList>
  <TabsContent value="info">...</TabsContent>
  <TabsContent value="signers">...</TabsContent>
</Tabs>

// بعد:
<div className="space-y-6">
  <Card className="p-6">
    {/* اطلاعات حساب */}
    <AccountInfo account={account} />
  </Card>

  <Card className="p-6">
    {/* امضاداران */}
    <SignersSection account={account} />
  </Card>

  <Card className="p-6">
    {/* تنظیمات */}
    <AccountSettings account={account} />
  </Card>
</div>
```

#### B. باز طراحی کارت امضاداران

```tsx
// components/accounts/signer-card.tsx
interface SignerCardProps {
  signer: {
    id: string;
    name: string;
    role: string;
    isActive: boolean;
    avatar?: string;
  };
  onToggleStatus: (signerId: string) => void;
}

export function SignerCard({ signer, onToggleStatus }: SignerCardProps) {
  const { t } = useTranslation();

  return (
    <Card className="p-4">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
          {signer.avatar ? (
            <img src={signer.avatar} alt={signer.name} className="w-full h-full rounded-full" />
          ) : (
            <span className="text-lg font-bold text-primary">
              {signer.name.charAt(0)}
            </span>
          )}
        </div>

        {/* اطلاعات */}
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base">{signer.name}</h4>
          <p className="text-sm text-muted-foreground">{signer.role}</p>

          {/* Badge وضعیت */}
          <Badge
            variant={signer.isActive ? "success" : "secondary"}
            className="mt-2"
          >
            {signer.isActive ? t("common.active") : t("common.inactive")}
          </Badge>
        </div>

        {/* دکمه عملیات */}
        <Button
          variant={signer.isActive ? "destructive" : "default"}
          size="sm"
          onClick={() => onToggleStatus(signer.id)}
        >
          {signer.isActive
            ? t("accounts.requestDeactivation")
            : t("accounts.requestActivation")}
        </Button>
      </div>
    </Card>
  );
}
```

#### C. فرم ویرایش حداقل امضا

```tsx
// components/accounts/minimum-signatures-form.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useTranslation from "@/hooks/useTranslation";

interface MinimumSignaturesFormProps {
  currentValue: number;
  maxValue: number;
  onSave: (value: number) => void;
}

export function MinimumSignaturesForm({
  currentValue,
  maxValue,
  onSave,
}: MinimumSignaturesFormProps) {
  const { t } = useTranslation();
  const [value, setValue] = useState(currentValue);
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(value);
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <div className="flex items-center justify-between p-4 border rounded-lg">
        <div>
          <Label>{t("accounts.minimumSignatures")}</Label>
          <p className="text-2xl font-bold text-primary">{currentValue}</p>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          {t("common.buttons.edit")}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
      <div className="space-y-2">
        <Label htmlFor="minSignatures">{t("accounts.minimumSignatures")}</Label>
        <Input
          id="minSignatures"
          type="number"
          min={1}
          max={maxValue}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
        />
        <p className="text-xs text-muted-foreground">
          {t("accounts.minSignaturesHelp", { max: maxValue })}
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleSave} className="flex-1">
          {t("common.buttons.save")}
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setValue(currentValue);
            setIsEditing(false);
          }}
          className="flex-1"
        >
          {t("common.buttons.cancel")}
        </Button>
      </div>
    </div>
  );
}
```

#### D. قابلیت افزودن امضادار

```tsx
// components/accounts/add-signer-dialog.tsx
"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Search } from "lucide-react";
import useTranslation from "@/hooks/useTranslation";

// Mock data - باید از API بیاید
const availableUsers = [
  { id: "1", name: "محمد احمدی", role: "مدیر" },
  { id: "2", name: "فاطمه رضایی", role: "کارشناس" },
  { id: "3", name: "علی محمدی", role: "حسابدار" },
];

interface AddSignerDialogProps {
  accountId: string;
  onAdd: (userId: string) => void;
}

export function AddSignerDialog({ accountId, onAdd }: AddSignerDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filteredUsers = availableUsers.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (selected) {
      onAdd(selected);
      setOpen(false);
      setSelected(null);
      setSearch("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          {t("accounts.addSigner")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("accounts.selectUser")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {/* جستجو */}
          <div className="space-y-2">
            <Label>{t("common.search")}</Label>
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("accounts.searchUserPlaceholder")}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pe-10"
              />
            </div>
          </div>

          {/* لیست کاربران */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className={cn(
                  "p-3 border rounded-lg cursor-pointer transition-colors",
                  selected === user.id
                    ? "border-primary bg-primary/5"
                    : "hover:bg-muted/50"
                )}
                onClick={() => setSelected(user.id)}
              >
                <div className="font-medium">{user.name}</div>
                <div className="text-sm text-muted-foreground">{user.role}</div>
              </div>
            ))}
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-2 pt-4">
            <Button onClick={handleAdd} disabled={!selected} className="flex-1">
              {t("common.buttons.add")}
            </Button>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              {t("common.buttons.cancel")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

---

## 📝 Translation Keys لازم

```json
{
  "common": {
    "pagination": {
      "previous": "قبلی",
      "next": "بعدی"
    },
    "selectDate": "انتخاب تاریخ",
    "dateFrom": "از تاریخ",
    "dateTo": "تا تاریخ",
    "minAmount": "حداقل مبلغ",
    "maxAmount": "حداکثر مبلغ",
    "active": "فعال",
    "inactive": "غیرفعال"
  },
  "reports": {
    "filterTitle": "فیلتر گزارشات",
    "searchPlaceholder": "جستجو در تراکنش‌ها..."
  },
  "accounts": {
    "requestDeactivation": "درخواست غیرفعال‌سازی",
    "requestActivation": "درخواست فعال‌سازی",
    "minimumSignatures": "حداقل امضای مورد نیاز",
    "minSignaturesHelp": "حداکثر تا {{max}} امضا می‌توانید تعیین کنید",
    "addSigner": "افزودن امضادار",
    "selectUser": "انتخاب کاربر",
    "searchUserPlaceholder": "جستجوی کاربر..."
  }
}
```

---

## 🎯 خلاصه اقدامات

### فوری (30 دقیقه):
1. ✅ استفاده از MobilePagination در لیست‌ها
2. ✅ اضافه کردن translation keys

### کوتاه‌مدت (2-3 ساعت):
3. پیاده‌سازی فیلتر حرفه‌ای گزارشات
4. یکپارچه‌سازی جدول تراکنش‌ها

### بلندمدت (4-6 ساعت):
5. پیاده‌سازی Persian DatePicker
6. باز طراحی کامل صفحه جزئیات حساب

---

## 💡 نکات مهم

1. **Testing**: هر تغییر را در موبایل و دسکتاپ تست کنید
2. **RTL Support**: تمام کامپوننت‌ها باید RTL پشتیبانی کنند
3. **Accessibility**: ARIA labels را فراموش نکنید
4. **Performance**: از useMemo و useCallback استفاده کنید

---

تاریخ: 2025-11-11
نویسنده: Claude AI Assistant
