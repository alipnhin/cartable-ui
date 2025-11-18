"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";

interface NavigationProgressContextType {
  startProgress: () => void;
  completeProgress: () => void;
  isNavigating: boolean;
}

const NavigationProgressContext = createContext<NavigationProgressContextType>({
  startProgress: () => {},
  completeProgress: () => {},
  isNavigating: false,
});

export function useNavigationProgress() {
  return useContext(NavigationProgressContext);
}

export function NavigationProgressProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [timers, setTimers] = useState<NodeJS.Timeout[]>([]);

  const clearTimers = useCallback(() => {
    timers.forEach(clearTimeout);
    setTimers([]);
  }, [timers]);

  const startProgress = useCallback(() => {
    clearTimers();
    setIsNavigating(true);
    setProgress(0);

    // Animate progress with incremental steps
    const newTimers: NodeJS.Timeout[] = [];
    newTimers.push(setTimeout(() => setProgress(20), 50));
    newTimers.push(setTimeout(() => setProgress(40), 150));
    newTimers.push(setTimeout(() => setProgress(60), 350));
    newTimers.push(setTimeout(() => setProgress(75), 600));
    newTimers.push(setTimeout(() => setProgress(85), 1000));
    newTimers.push(setTimeout(() => setProgress(90), 2000));

    setTimers(newTimers);
  }, [clearTimers]);

  const completeProgress = useCallback(() => {
    clearTimers();
    setProgress(100);

    const timer = setTimeout(() => {
      setIsNavigating(false);
      setProgress(0);
    }, 300);

    setTimers([timer]);
  }, [clearTimers]);

  // Complete progress when pathname changes
  useEffect(() => {
    if (isNavigating) {
      completeProgress();
    }
  }, [pathname]);

  return (
    <NavigationProgressContext.Provider
      value={{ startProgress, completeProgress, isNavigating }}
    >
      {children}

      {/* Progress Bar */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            className="fixed top-0 left-0 right-0 z-[9999] h-0.5 bg-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { delay: 0.2 } }}
          >
            <motion.div
              className="h-full bg-primary"
              style={{
                boxShadow: "0 0 10px rgba(39, 174, 96, 0.7), 0 0 5px rgba(39, 174, 96, 0.5)",
              }}
              initial={{ width: "0%" }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: progress === 100 ? 0.2 : 0.4,
                ease: progress === 100 ? "easeOut" : "easeInOut"
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </NavigationProgressContext.Provider>
  );
}
