"use client";

import { useEffect, useState } from "react";

export function CircularToastProgress({ duration }: { duration: number }) {
  const [progress, setProgress] = useState(100);
  const [seconds, setSeconds] = useState(Math.ceil(duration / 1000));

  useEffect(() => {
    const start = Date.now();

    const timer = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.max(0, 100 - (elapsed / duration) * 100);

      setProgress(percent);
      setSeconds(Math.max(0, Math.ceil((duration - elapsed) / 1000)));

      if (elapsed >= duration) clearInterval(timer);
    }, 100);

    return () => clearInterval(timer);
  }, [duration]);

  const radius = 16;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative w-10 h-10 shrink-0">
      <svg width="40" height="40" className="-rotate-90">
        <circle
          cx="20"
          cy="20"
          r={radius}
          strokeWidth="3"
          fill="transparent"
          className="stroke-muted/30 dark:stroke-muted/20"
        />
        <circle
          cx="20"
          cy="20"
          r={radius}
          strokeWidth="3"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="stroke-current transition-all"
        />
      </svg>

      <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground/80 dark:text-foreground/90">
        {seconds}
      </span>
    </div>
  );
}
