/**
 * Accounts Filters Component
 * کامپوننت فیلترهای صفحه حساب‌ها
 */

"use client";

import { Search, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import useTranslation from "@/hooks/useTranslation";
import { useIsMobile } from "@/hooks/use-mobile";

interface AccountsFiltersProps {
  searchText: string;
  setSearchText: (value: string) => void;
  selectedBank: string;
  setSelectedBank: (value: string) => void;
  selectedStatus: string;
  setSelectedStatus: (value: string) => void;
  uniqueBanks: string[];
}

export function AccountsFilters({
  searchText,
  setSearchText,
  selectedBank,
  setSelectedBank,
  selectedStatus,
  setSelectedStatus,
  uniqueBanks,
}: AccountsFiltersProps) {
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const activeFiltersCount = [
    selectedBank !== "all" ? 1 : 0,
    selectedStatus !== "all" ? 1 : 0,
  ].reduce((a, b) => a + b, 0);

  const handleReset = () => {
    setSelectedBank("all");
    setSelectedStatus("all");
  };

  const FilterForm = () => (
    <div className="space-y-4">
      {/* فیلتر بانک */}
      <div className="space-y-2">
        <Label>{t("accounts.selectBank")}</Label>
        <Select value={selectedBank} onValueChange={setSelectedBank}>
          <SelectTrigger>
            <SelectValue placeholder={t("accounts.selectBank")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            {uniqueBanks.map((bank) => (
              <SelectItem key={bank} value={bank}>
                {bank}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* فیلتر وضعیت */}
      <div className="space-y-2">
        <Label>{t("accounts.selectStatus")}</Label>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger>
            <SelectValue placeholder={t("accounts.selectStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("common.all")}</SelectItem>
            <SelectItem value="active">{t("common.active")}</SelectItem>
            <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      {/* جستجو */}
      <div className="relative flex-1 max-w-md">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t("accounts.searchPlaceholder")}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="ps-10"
        />
      </div>

      {/* دکمه فیلتر */}
      {isMobile ? (
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="me-2 h-4 w-4" />
              {t("common.buttons.filter") || "فیلتر"}
              {activeFiltersCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -end-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>{t("filters.title") || "فیلترها"}</DrawerTitle>
              <DrawerDescription>
                انتخاب فیلترهای مورد نظر برای جستجو
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 py-6">
              <FilterForm />
            </div>
            <DrawerFooter>
              <div className="flex gap-2 w-full">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleReset}
                >
                  <X className="me-2 h-4 w-4" />
                  {t("common.buttons.reset") || "پاک کردن"}
                </Button>
                <DrawerClose asChild>
                  <Button className="flex-1">اعمال فیلتر</Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="me-2 h-4 w-4" />
              {t("common.buttons.filter") || "فیلتر"}
              {activeFiltersCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-2 -end-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("filters.title") || "فیلترها"}</DialogTitle>
              <DialogDescription>
                انتخاب فیلترهای مورد نظر برای جستجو
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <FilterForm />
            </div>
            <DialogFooter className="gap-2">
              <Button variant="outline" onClick={handleReset}>
                <X className="me-2 h-4 w-4" />
                {t("common.buttons.reset") || "پاک کردن"}
              </Button>
              <DialogTrigger asChild>
                <Button>اعمال فیلتر</Button>
              </DialogTrigger>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
