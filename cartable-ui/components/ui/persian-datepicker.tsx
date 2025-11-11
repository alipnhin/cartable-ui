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

// تبدیل تاریخ ISO به فرمت DayValue
const parseISODate = (isoDate: string): DayValue | null => {
  if (!isoDate) return null;
  const [year, month, day] = isoDate.split("-").map(Number);
  if (!year || !month || !day) return null;
  return { year, month, day };
};

// تبدیل DayValue به تاریخ ISO
const formatToISO = (date: DayValue): string => {
  if (!date) return "";
  const { year, month, day } = date;
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

// فرمت نمایش تاریخ
const formatDisplayDate = (date: DayValue | null, locale: string): string => {
  if (!date) return "";
  const { year, month, day } = date;

  if (locale === "fa") {
    // نمایش فارسی
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

  // نمایش میلادی
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
  const [selectedDay, setSelectedDay] = useState<DayValue | null>(
    value ? parseISODate(value) : null
  );
  const [isOpen, setIsOpen] = useState(false);

  // بروزرسانی selectedDay وقتی value از خارج تغییر می‌کند
  useEffect(() => {
    setSelectedDay(value ? parseISODate(value) : null);
  }, [value]);

  const handleDateChange = (date: DayValue) => {
    setSelectedDay(date);
    if (onChange) {
      onChange(formatToISO(date));
    }
    setIsOpen(false);
  };

  const displayValue = selectedDay
    ? formatDisplayDate(selectedDay, locale)
    : placeholder || t("common.selectDate");

  // تنظیم locale برای تقویم
  const calendarLocale = locale === "fa" ? "fa" : "en";

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
