"use client";

import { useState, useEffect } from "react";
import DatePicker, { DayValue } from "react-modern-calendar-datepicker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";

interface PersianDatePickerProps {
  value?: string; // ISO date string (YYYY-MM-DD)
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// تبدیل تاریخ میلادی به شمسی
const gregorianToJalali = (gy: number, gm: number, gd: number): [number, number, number] => {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let jy = gy <= 1600 ? 0 : 979;
  gy = gy <= 1600 ? gy - 621 : gy - 1600;
  const gy2 = gm > 2 ? gy + 1 : gy;
  let days =
    365 * gy +
    Math.floor((gy2 + 3) / 4) -
    Math.floor((gy2 + 99) / 100) +
    Math.floor((gy2 + 399) / 400) -
    80 +
    gd +
    g_d_m[gm - 1];
  jy += 33 * Math.floor(days / 12053);
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  jy += Math.floor((days - 1) / 365);
  if (days > 365) days = (days - 1) % 365;
  const jm =
    days < 186 ? 1 + Math.floor(days / 31) : 7 + Math.floor((days - 186) / 30);
  const jd = 1 + (days < 186 ? days % 31 : (days - 186) % 30);
  return [jy, jm, jd];
};

// تبدیل تاریخ شمسی به میلادی
const jalaliToGregorian = (jy: number, jm: number, jd: number): [number, number, number] => {
  let gy = jy <= 979 ? 621 : 1600;
  jy = jy <= 979 ? jy : jy - 979;
  const days =
    365 * jy +
    Math.floor(jy / 33) * 8 +
    Math.floor(((jy % 33) + 3) / 4) +
    78 +
    jd +
    (jm < 7 ? (jm - 1) * 31 : (jm - 7) * 30 + 186);
  gy += 400 * Math.floor(days / 146097);
  let d = days % 146097;
  if (d > 36524) {
    gy += 100 * Math.floor(--d / 36524);
    d %= 36524;
    if (d >= 365) d++;
  }
  gy += 4 * Math.floor(d / 1461);
  d %= 1461;
  gy += Math.floor((d - 1) / 365);
  if (d > 365) d = (d - 1) % 365;
  const gd = d + 1;
  const sal_a = [
    0, 31, (gy % 4 === 0 && gy % 100 !== 0) || gy % 400 === 0 ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ];
  let gm = 0;
  let v = gd;
  for (gm = 0; gm < 13 && v > sal_a[gm]; gm++) v -= sal_a[gm];
  return [gy, gm, v];
};

// تبدیل تاریخ ISO میلادی به DayValue شمسی
const parseISOToJalali = (isoDate: string): DayValue | null => {
  if (!isoDate) return null;
  const dateOnly = isoDate.split("T")[0];
  const [year, month, day] = dateOnly.split("-").map(Number);
  if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) return null;
  const [jy, jm, jd] = gregorianToJalali(year, month, day);
  return { year: jy, month: jm, day: jd };
};

// تبدیل تاریخ ISO میلادی به DayValue میلادی
const parseISOToGregorian = (isoDate: string): DayValue | null => {
  if (!isoDate) return null;
  const dateOnly = isoDate.split("T")[0];
  const [year, month, day] = dateOnly.split("-").map(Number);
  if (!year || !month || !day || isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return { year, month, day };
};

// تبدیل DayValue شمسی به تاریخ ISO میلادی
const jalaliToISO = (date: DayValue): string => {
  if (!date) return "";
  const { year, month, day } = date;
  const [gy, gm, gd] = jalaliToGregorian(year, month, day);
  return `${gy}-${String(gm).padStart(2, "0")}-${String(gd).padStart(2, "0")}`;
};

// تبدیل DayValue میلادی به تاریخ ISO
const gregorianToISO = (date: DayValue): string => {
  if (!date) return "";
  const { year, month, day } = date;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

// فرمت نمایش تاریخ
const formatDisplayDate = (date: DayValue | null, locale: string): string => {
  if (!date) return "";
  const { year, month, day } = date;

  if (locale === "fa") {
    const persianMonths = [
      "فروردین",
      "اردیبهشت",
      "خرداد",
      "تیر",
      "مرداد",
      "شهریور",
      "مهر",
      "آبان",
      "آذر",
      "دی",
      "بهمن",
      "اسفند",
    ];
    return `${day} ${persianMonths[month - 1]} ${year}`;
  }

  return `${day}/${month}/${year}`;
};

export function PersianDatePicker({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}: PersianDatePickerProps) {
  const { t, locale } = useTranslation();
  const isJalali = locale === "fa";

  const [selectedDay, setSelectedDay] = useState<DayValue | null>(
    value
      ? (isJalali ? parseISOToJalali(value) : parseISOToGregorian(value))
      : null
  );
  const [isOpen, setIsOpen] = useState(false);

  // بروزرسانی selectedDay وقتی value از خارج تغییر می‌کند
  useEffect(() => {
    setSelectedDay(
      value
        ? (isJalali ? parseISOToJalali(value) : parseISOToGregorian(value))
        : null
    );
  }, [value, isJalali]);

  const handleDateChange = (date: DayValue) => {
    setSelectedDay(date);
    if (onChange) {
      // تبدیل به ISO میلادی برای ذخیره
      const isoDate = isJalali ? jalaliToISO(date) : gregorianToISO(date);
      onChange(isoDate);
    }
    setIsOpen(false);
  };

  const displayValue = selectedDay
    ? formatDisplayDate(selectedDay, locale)
    : placeholder || t("common.selectDate");

  const calendarLocale = isJalali ? "fa" : "en";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-start text-start font-normal",
            !selectedDay && "text-muted-foreground",
            className
          )}
        >
          <Calendar className="me-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="persian-datepicker-wrapper">
          <DatePicker
            value={selectedDay}
            onChange={handleDateChange}
            locale={calendarLocale}
            shouldHighlightWeekends
            calendarClassName="custom-calendar"
            calendarTodayClassName="custom-today"
            calendarSelectedDayClassName="custom-selected-day"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
}
