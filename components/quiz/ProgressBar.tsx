"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between text-xs text-stone-500">
        <span>Soal {current} dari {total}</span>
        <span>{Math.round(percentage)}%</span>
      </div>
      <div className="h-1 w-full rounded-full bg-stone-200 overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
