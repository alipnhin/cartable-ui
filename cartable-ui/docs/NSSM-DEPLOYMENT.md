# راهنمای دیپلویمنت با NSSM

این راهنما نحوه نصب و اجرای Cartable UI به عنوان Windows Service با استفاده از NSSM را شرح می‌دهد.

## مزایای NSSM نسبت به PM2

✅ یکپارچگی کامل با Windows Services
✅ Auto-start با راه‌اندازی Windows
✅ پایداری بیشتر در Windows Server
✅ مدیریت آسان از طریق Services.msc
✅ مصرف حافظه کمتر
✅ لاگ‌های یکپارچه با Event Viewer

---

## پیش‌نیازها

### 1. نصب NSSM

**روش 1: دانلود Manual**
```powershell
# 1. دانلود از https://nssm.cc/download
# 2. استخراج فایل zip
# 3. کپی nssm.exe به C:\Windows\System32\
```

**روش 2: نصب با Chocolatey**
```powershell
choco install nssm
```

### 2. بررسی نصب
```powershell
nssm version
```

---

## نصب به عنوان Service

### دستور سریع

```powershell
# اجرا به عنوان Administrator
npm run service:install
```

### نصب Manual

اگر می‌خواهید با پارامترهای سفارشی نصب کنید:

```powershell
# اجرا به عنوان Administrator
.\scripts\install-nssm-service.ps1 -ServiceName "CartableUI" -Port 3000
```

### پارامترهای قابل تنظیم

```powershell
-ServiceName    # نام service (پیش‌فرض: CartableUI)
-ProjectPath    # مسیر پروژه (پیش‌فرض: مسیر فعلی)
-NodePath       # مسیر node.exe (پیش‌فرض: node.exe در PATH)
-Port           # پورت اجرا (پیش‌فرض: 3000)
```

### مثال با پارامترهای سفارشی

```powershell
.\scripts\install-nssm-service.ps1 `
    -ServiceName "Cartable-Production" `
    -Port 8080 `
    -ProjectPath "D:\Apps\cartable-ui"
```

---

## مدیریت Service

### دستورات NSSM

```powershell
# شروع service
nssm start CartableUI

# توقف service
nssm stop CartableUI

# ریستارت service
nssm restart CartableUI

# بررسی وضعیت
nssm status CartableUI

# حذف service
nssm remove CartableUI confirm
```

### مدیریت از طریق Windows Services

1. فشار دادن `Win + R`
2. تایپ `services.msc` و Enter
3. پیدا کردن "Cartable UI Application"
4. راست‌کلیک → Start/Stop/Restart

### دستورات PowerShell

```powershell
# بررسی وضعیت
Get-Service CartableUI

# شروع
Start-Service CartableUI

# توقف
Stop-Service CartableUI

# ریستارت
Restart-Service CartableUI
```

---

## مشاهده لاگ‌ها

### لاگ‌های فایلی

لاگ‌ها در پوشه `logs/` ذخیره می‌شوند:

```powershell
# مشاهده لاگ‌های خروجی
Get-Content logs\service-output.log -Tail 50 -Wait

# مشاهده لاگ‌های خطا
Get-Content logs\service-error.log -Tail 50 -Wait
```

### لاگ‌های Event Viewer

1. فشار دادن `Win + R`
2. تایپ `eventvwr.msc` و Enter
3. رفتن به: Windows Logs → Application
4. فیلتر کردن بر اساس Source: CartableUI

---

## تنظیمات پیشرفته

### تغییر Environment Variables

```powershell
# نمایش تنظیمات فعلی
nssm get CartableUI AppEnvironmentExtra

# تنظیم متغیرهای جدید
nssm set CartableUI AppEnvironmentExtra NODE_ENV=production PORT=3000 API_URL=https://api.example.com
```

### تنظیم Startup Type

```powershell
# Auto start با Windows
nssm set CartableUI Start SERVICE_AUTO_START

# Manual start
nssm set CartableUI Start SERVICE_DEMAND_START

# Delayed start
nssm set CartableUI Start SERVICE_DELAYED_AUTO_START
```

### تنظیم Log Rotation

```powershell
# فعال کردن rotation
nssm set CartableUI AppRotateFiles 1

# تنظیم حداکثر سایز (10MB)
nssm set CartableUI AppRotateBytes 10485760

# تنظیم تعداد فایل‌های backup
nssm set CartableUI AppRotateOnline 1
```

---

## حذف Service

### دستور سریع

```powershell
# اجرا به عنوان Administrator
npm run service:remove
```

### حذف Manual

```powershell
.\scripts\remove-nssm-service.ps1
```

یا مستقیماً:

```powershell
nssm stop CartableUI
nssm remove CartableUI confirm
```

---

## عیب‌یابی

### مشکل 1: Service شروع نمی‌شود

**بررسی لاگ‌ها:**
```powershell
Get-Content logs\service-error.log -Tail 50
```

**علل احتمالی:**
- Build نشده یا ناقص است → `npm run build`
- فایل‌های standalone کپی نشدند → `npm run deploy:standalone`
- پورت در حال استفاده است → بررسی پورت 3000
- Environment variables اشتباه است

### مشکل 2: Service مداوم restart می‌شود

**بررسی وضعیت:**
```powershell
nssm status CartableUI
```

**بررسی تنظیمات restart:**
```powershell
nssm get CartableUI AppExit
nssm get CartableUI AppRestartDelay
```

### مشکل 3: دسترسی Denied

**راه‌حل:**
- PowerShell را به عنوان Administrator اجرا کنید
- بررسی کنید که User دسترسی لازم دارد

### مشکل 4: فایل‌های Static 404

**راه‌حل:**
```powershell
# کپی فایل‌های static
npm run deploy:standalone

# ریستارت service
nssm restart CartableUI
```

---

## به‌روزرسانی اپلیکیشن

### مراحل به‌روزرسانی

```powershell
# 1. توقف service
nssm stop CartableUI

# 2. Pull/دریافت کد جدید
git pull origin main

# 3. نصب dependencies (در صورت نیاز)
npm install

# 4. Build
npm run build

# 5. شروع service
nssm start CartableUI

# 6. بررسی وضعیت
nssm status CartableUI
```

---

## مقایسه NSSM با PM2

| ویژگی | NSSM | PM2 |
|-------|------|-----|
| پلتفرم | Windows Only | Cross-platform |
| یکپارچگی با Windows | ✅ Native | ⚠️ محدود |
| Auto-start | ✅ خودکار | ⚠️ نیاز به تنظیم |
| مدیریت | Services.msc | PM2 CLI |
| لاگ‌ها | Event Viewer + File | File Only |
| پایداری | ✅✅ عالی | ✅ خوب |
| حافظه | کمتر | بیشتر |
| Monitoring Dashboard | ❌ | ✅ |
| Cluster Mode | ❌ | ✅ |

---

## چک‌لیست دیپلویمنت

- [ ] NSSM نصب شده است
- [ ] Build انجام شده (`npm run build`)
- [ ] فایل‌های standalone کپی شدند
- [ ] PowerShell به عنوان Administrator اجرا شد
- [ ] Service نصب شد (`npm run service:install`)
- [ ] Service در حال اجرا است
- [ ] اپلیکیشن از طریق browser قابل دسترسی است
- [ ] لاگ‌ها بررسی شدند
- [ ] Auto-start با Windows تست شد

---

## منابع مفید

- [NSSM Official Website](https://nssm.cc/)
- [NSSM Documentation](https://nssm.cc/usage)
- [Windows Services Management](https://docs.microsoft.com/en-us/windows-server/administration/windows-commands/sc-create)

---

**نسخه:** 1.0.0
**تاریخ:** دسامبر 2025
**پلتفرم:** Windows Server / Windows 10+
