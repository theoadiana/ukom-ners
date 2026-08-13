"use client";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";

interface ScoreDisplayProps {
  score: number;
  correctCount: number;
  totalQuestions: number;
  passed: boolean;
  topicName: string;
  className?: string;
}

export function ScoreDisplay({
  score,
  correctCount,
  totalQuestions,
  passed,
  topicName,
  className,
}: ScoreDisplayProps) {
  return (
    <div className={cn("text-center space-y-6", className)}>
      {/* Score Hero */}
      <div className="space-y-2">
        <div className="text-7xl font-bold tabular-nums">
          <span className={passed ? "text-primary" : "text-red-600"}>
            {score}
          </span>
          <span className="text-4xl text-stone-400">%</span>
        </div>
        <Badge variant={passed ? "success" : "error"} className="text-sm px-4 py-1">
          {passed ? "LULUS" : "BELUM LULUS"}
        </Badge>
      </div>

      {/* Detail */}
      <div className="flex justify-center gap-8">
        <div className="text-center">
          <div className="text-2xl font-bold text-stone-800">{correctCount}</div>
          <div className="text-xs text-stone-500 uppercase tracking-wide">Benar</div>
        </div>
        <div className="h-10 w-px bg-stone-200" />
        <div className="text-center">
          <div className="text-2xl font-bold text-stone-800">
            {totalQuestions - correctCount}
          </div>
          <div className="text-xs text-stone-500 uppercase tracking-wide">Salah</div>
        </div>
        <div className="h-10 w-px bg-stone-200" />
        <div className="text-center">
          <div className="text-2xl font-bold text-stone-800">{totalQuestions}</div>
          <div className="text-xs text-stone-500 uppercase tracking-wide">Total</div>
        </div>
      </div>

      <p className="text-sm text-stone-500">
        {topicName} — Passing grade: 60%
      </p>
    </div>
  );
}
