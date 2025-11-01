"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

export default function ReportsPage() {
  useEffect(() => {
    redirect("/reports/transactions");
  }, []);

  return null;
}
