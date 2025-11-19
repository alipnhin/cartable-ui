"use client";

import DatePicker, { DateObject } from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import gregorian from "react-date-object/calendars/gregorian";
import gregorian_en from "react-date-object/locales/gregorian_en";
import "react-multi-date-picker/styles/colors/purple.css";
import { cn } from "@/lib/utils";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";

interface PersianDatePickerProps {
  value?: string; // ISO date string (YYYY-MM-DD or full ISO)
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function PersianDatePicker({
  value,
  onChange,
  placeholder,
  className,
  disabled = false,
}: PersianDatePickerProps) {
  const { t, locale } = useTranslation();
  const isMobile = useIsMobile();

  const handleChange = (date: Value) => {
    if (date && typeof date === "object" && "toDate" in date) {
      const jsDate = (date as DateObject).toDate();
      const isoDate = jsDate.toISOString().split("T")[0];
      onChange?.(isoDate);
    } else if (!date) {
      onChange?.("");
    }
  };

  // Convert value to DateObject
  let dateValue: Value = null;
  if (value) {
    // Parse ISO date string (YYYY-MM-DD)
    const dateStr = value.split("T")[0];
    const jsDate = new Date(dateStr + "T12:00:00"); // Add time to avoid timezone issues

    // Create DateObject from JavaScript Date
    dateValue = new DateObject(jsDate);

    // If locale is Persian, convert to Persian calendar
    if (locale === "fa") {
      dateValue = dateValue.convert(persian, persian_fa);
    }
  }

  return (
    <DatePicker
      value={dateValue}
      onChange={handleChange}
      calendar={locale === "fa" ? persian : gregorian}
      locale={locale === "fa" ? persian_fa : gregorian_en}
      format={locale === "fa" ? "YYYY/MM/DD" : "YYYY-MM-DD"}
      className={cn("purple rmdp-dark-mode", isMobile && "rmdp-mobile")}
      calendarPosition={locale === "fa" ? "bottom-right" : "bottom-left"}
      inputClass={cn(
        "w-full px-3 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        isMobile ? "h-12 text-base" : "h-10",
        className
      )}
      containerClassName="w-full"
      placeholder={placeholder || t("common.selectDate")}
      disabled={disabled}
      portal
      portalTarget={typeof document !== "undefined" ? document.body : undefined}
      mobileLabels={{
        OK: locale === "fa" ? "تایید" : "OK",
        CANCEL: locale === "fa" ? "لغو" : "Cancel",
      }}
      mobileButtons={[
        {
          label: locale === "fa" ? "امروز" : "Today",
          type: "button",
          className: "rmdp-button rmdp-action-button",
          onClick: () => {
            const today = new DateObject();
            if (locale === "fa") {
              today.convert(persian, persian_fa);
            }
            handleChange(today);
          },
        },
      ]}
    />
  );
}
