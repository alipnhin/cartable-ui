"use client";

import DatePicker, { DateObject } from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import { cn } from "@/lib/utils";
import "react-multi-date-picker/styles/colors/purple.css";

interface PersianDatePickerProps {
  value?: string | Date;
  onChange?: (isoDate: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
  locale?: "fa" | "en";
  isMobile?: boolean;
}

/**
 * A reusable Persian/Gregorian date picker component
 * Properly handles conversion between Gregorian and Persian calendars
 */
export default function PersianDatePicker({
  value,
  onChange,
  placeholder,
  className,
  inputClassName,
  disabled = false,
  locale = "fa",
  isMobile = false,
}: PersianDatePickerProps) {
  const handleChange = (date: Value) => {
    if (date && typeof date === "object" && "toDate" in date) {
      // Convert to ISO date string (YYYY-MM-DD)
      const jsDate = (date as DateObject).toDate();
      const isoDate = jsDate.toISOString().split("T")[0];
      onChange?.(isoDate);
    } else if (!date) {
      onChange?.("");
    }
  };

  // Convert value to DateObject if it's a string
  let dateValue: Value = null;
  if (value) {
    if (typeof value === "string") {
      // Parse ISO date string (YYYY-MM-DD) - create a Date object first
      const dateStr = value.split("T")[0]; // Get date part only
      const jsDate = new Date(dateStr + "T12:00:00"); // Add time to avoid timezone issues

      // Create DateObject from JavaScript Date
      dateValue = new DateObject(jsDate);

      // If locale is Persian, convert to Persian calendar
      if (locale === "fa") {
        dateValue = dateValue.convert(persian, persian_fa);
      }
    } else {
      // value is already a Date object
      dateValue = new DateObject(value);
      if (locale === "fa") {
        dateValue = dateValue.convert(persian, persian_fa);
      }
    }
  }

  return (
    <DatePicker
      value={dateValue}
      onChange={handleChange}
      calendar={locale === "fa" ? persian : gregorian}
      locale={locale === "fa" ? persian_fa : gregorian_en}
      format={locale === "fa" ? "YYYY/MM/DD" : "YYYY-MM-DD"}
      className={cn("purple", isMobile && "rmdp-mobile", className)}
      calendarPosition={locale === "fa" ? "bottom-right" : "bottom-left"}
      inputClass={cn(
        "w-full px-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        isMobile ? "h-12 text-base" : "h-10",
        inputClassName
      )}
      containerClassName="w-full"
      placeholder={
        placeholder || (locale === "fa" ? "انتخاب تاریخ" : "Select date")
      }
      disabled={disabled}
    />
  );
}
