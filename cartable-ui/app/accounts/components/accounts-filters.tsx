/**
 * Accounts Filters Component
 * کامپوننت فیلترهای صفحه حساب‌ها
 */

"use client";

import { Search, Filter, X, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

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
          <SelectTrigger size="lg">
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
          <SelectTrigger size="lg">
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
    <div className="flex w-full flex-row content-between justify-between gap-6">
      {/* جستجو */}
      <div className=" flex-col">
        <InputGroup>
          <InputGroupInput
            className="min-w-80"
            placeholder={t("accounts.searchPlaceholder")}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className=" flex-col">
        {/* دکمه فیلتر */}
        {isMobile ? (
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">
                <Filter />
                {t("common.buttons.filter") || "فیلتر"}
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="text-xs rounded-full">
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
              <Button variant="outline">
                <Filter />
                {t("common.buttons.filter") || "فیلتر"}
                {activeFiltersCount > 0 && (
                  <Badge variant="destructive" className="rounded-full text-xs">
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
    </div>
  );
}
