"use client";

import { useState, useEffect } from "react";

export function usePinnedColumns(tableId: string) {
  const [pinnedColumns, setPinnedColumns] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem(`pinned-columns-${tableId}`);
    if (saved) {
      try {
        setPinnedColumns(JSON.parse(saved));
      } catch (e) {
        console.error("Error loading pinned columns:", e);
      }
    }
  }, [tableId]);

  const togglePin = (columnId: string) => {
    setPinnedColumns((prev) => {
      const newPinned = prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId];

      localStorage.setItem(
        `pinned-columns-${tableId}`,
        JSON.stringify(newPinned)
      );
      return newPinned;
    });
  };

  const isPinned = (columnId: string) => pinnedColumns.includes(columnId);

  const clearAllPins = () => {
    setPinnedColumns([]);
    localStorage.removeItem(`pinned-columns-${tableId}`);
  };

  return {
    pinnedColumns,
    togglePin,
    isPinned,
    clearAllPins,
  };
}
