"use client";

import { useEffect, useLayoutEffect } from "react";
import { usePathname } from "next/navigation";

interface PageTitleProps {
  title: string;
}

export function PageTitle({ title }: PageTitleProps) {
  const pathname = usePathname();
  useLayoutEffect(() => {
    const newTitle = title ? `${title} | Tadbir Pay` : "Tadbir Pay";
    document.title = newTitle;
  }, [title, pathname]);

  return null;
}
