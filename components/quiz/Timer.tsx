"use client";

import { useEffect, useState } from "react";
import { formatTime } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface TimerProps {
  initialSeconds: number;
  onTimeUp: () => void;
  className?: string;
}

export function Timer({ initialSeconds, onTimeUp, className }: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp();
      return;
    }
    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, onTimeUp]);

  const isWarning = seconds < 300 && seconds >= 60;
  const isCritical = seconds < 60;

  return (
    <div
      className={cn(
        "font-mono text-lg font-semibold tabular-nums",
        isWarning && "text-amber-600",
        isCritical && "text-red-600 animate-pulse",
        !isWarning && !isCritical && "text-stone-500",
        className
      )}
    >
      {formatTime(seconds)}
    </div>
  );
}
