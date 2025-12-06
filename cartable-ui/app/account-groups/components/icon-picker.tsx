/**
 * Icon Picker Component
 * کامپوننت انتخاب آیکون
 */

"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { ALLOWED_ICONS, AllowedIcon } from "@/types/account-group-types";
import { cn } from "@/lib/utils";

interface IconPickerProps {
  value?: string;
  onChange: (icon: string) => void;
  label?: string;
}

export function IconPicker({ value, onChange, label }: IconPickerProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (icon: string) => {
    onChange(icon);
    setOpen(false);
  };

  const getIcon = (iconName: string) => {
    const Icon = (LucideIcons as any)[iconName];
    return Icon ? <Icon className="h-5 w-5" /> : null;
  };

  const selectedIcon = value || "Folder";

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2 h-10">
            <div className="flex items-center gap-2">
              {getIcon(selectedIcon)}
              <span>{selectedIcon}</span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-3">
            {/* لیست آیکون‌ها */}
            <div className="max-h-[300px] overflow-y-auto">
              <div className="grid grid-cols-4 gap-2">
                {ALLOWED_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleSelect(icon)}
                    className={cn(
                      "flex items-center justify-center h-12 rounded-lg border-2 transition-all hover:border-primary/50 hover:bg-muted/50",
                      value === icon
                        ? "border-primary bg-primary/10"
                        : "border-transparent bg-muted/30"
                    )}
                    title={icon}
                  >
                    {getIcon(icon)}
                    {value === icon && (
                      <Check className="absolute h-3 w-3 text-primary -mt-6 -me-6" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
