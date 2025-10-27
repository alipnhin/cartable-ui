"use client";

import { ChevronRight } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  const router = useRouter();

  return (
    <div className={cn("space-y-4 pb-4", className)}>
      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center space-x-2 text-sm text-muted-foreground rtl:space-x-reverse">
          {breadcrumbs.map((item, index) => {
            const isLast = index === breadcrumbs.length - 1;

            return (
              <div key={index} className="flex items-center gap-2">
                {index > 0 && (
                  <ChevronRight className="h-4 w-4 rtl:rotate-180" />
                )}
                {item.href && !isLast ? (
                  <button
                    onClick={() => router.push(item.href!)}
                    className="hover:text-foreground transition-colors"
                  >
                    {item.label}
                  </button>
                ) : (
                  <span className={isLast ? "text-foreground font-medium" : ""}>
                    {item.label}
                  </span>
                )}
              </div>
            );
          })}
        </nav>
      )}

      {/* Title & Description */}
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h4 className="font-bold tracking-tight ">{title}</h4>
          {description && (
            <p className="text-muted-foreground text-xs">{description}</p>
          )}
        </div>

        {/* Actions */}
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
