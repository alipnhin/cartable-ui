"use client";

import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AccountGroup {
  id: string;
  name: string;
  accountsCount: number;
}

interface AccountGroupDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: AccountGroup[];
  selectedGroup: string | null;
  onSelectGroup: (groupId: string) => void;
}

export function AccountGroupDrawer({
  open,
  onOpenChange,
  groups,
  selectedGroup,
  onSelectGroup,
}: AccountGroupDrawerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (groupId: string) => {
    onSelectGroup(groupId);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
        <SheetHeader>
          <SheetTitle>انتخاب گروه حساب</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="جستجو در گروه‌ها..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>

          <div className="space-y-2 max-h-[calc(85vh-200px)] overflow-y-auto">
            {filteredGroups.map((group) => (
              <button
                key={group.id}
                onClick={() => handleSelect(group.id)}
                className={cn(
                  "w-full flex items-center justify-between p-4 rounded-lg border transition-colors",
                  selectedGroup === group.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-accent"
                )}
              >
                <div className="text-right">
                  <div className="font-medium">{group.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {group.accountsCount} حساب
                  </div>
                </div>
                {selectedGroup === group.id && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}

            {filteredGroups.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                گروهی یافت نشد
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
