/**
 * Color Picker Component
 * کامپوننت انتخاب رنگ
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
import { ALLOWED_COLORS, AllowedColor } from "@/types/account-group-types";
import { cn } from "@/lib/utils";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  label?: string;
}

export function ColorPicker({ value, onChange, label }: ColorPickerProps) {
  const [open, setOpen] = useState(false);
  const selectedColor = value || ALLOWED_COLORS[0];

  const handleSelect = (color: string) => {
    onChange(color);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start gap-2 h-10">
            <div className="flex items-center gap-2">
              <div
                className="h-5 w-5 rounded border"
                style={{ backgroundColor: selectedColor }}
              />
              <span className="text-xs text-muted-foreground">
                {selectedColor}
              </span>
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-3" align="start">
          <div className="space-y-3">
            {/* لیست رنگ‌ها */}
            <div className="max-h-[300px] overflow-y-auto">
              <div className="grid grid-cols-4 gap-2">
                {ALLOWED_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleSelect(color)}
                    className={cn(
                      "relative h-12 rounded-lg border-2 transition-all hover:border-primary/50 hover:scale-105",
                      selectedColor === color
                        ? "border-primary"
                        : "border-transparent"
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {selectedColor === color && (
                      <Check className="absolute inset-0 m-auto h-5 w-5 text-white drop-shadow-lg" />
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
