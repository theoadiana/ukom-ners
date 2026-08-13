"use client";

import { cn } from "@/lib/utils";

interface MiniMapProps {
  total: number;
  currentIndex: number;
  answeredCount: number;
  flaggedIds: string[];
  questionIds: string[];
  answers: Record<string, "A" | "B" | "C" | "D" | "E">;
  onNavigate: (index: number) => void;
  className?: string;
}

export function MiniMap({
  total,
  currentIndex,
  answeredCount,
  flaggedIds,
  questionIds,
  answers,
  onNavigate,
  className,
}: MiniMapProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="text-xs font-medium text-stone-500 uppercase tracking-wide">
        Navigasi Soal
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const qId = questionIds[i];
          const isCurrent = i === currentIndex;
          const isAnswered = qId && Boolean(answers[qId]);
          const isFlagged = qId && flaggedIds.includes(qId);

          return (
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={cn(
                "h-7 w-7 rounded text-xs font-medium flex items-center justify-center transition-all cursor-pointer",
                isCurrent && "ring-2 ring-primary ring-offset-1",
                !isAnswered && !isFlagged && "bg-stone-200 text-stone-500",
                isAnswered && !isFlagged && "bg-green-100 text-green-700",
                isFlagged && "bg-yellow-100 text-yellow-700"
              )}
              title={`Soal ${i + 1}${isFlagged ? " (Flag)" : ""}${isAnswered ? " (Terjawab)" : ""}`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <div className="h-2 w-2 rounded bg-stone-200" />
          <span>Belum dijawab ({total - answeredCount})</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <div className="h-2 w-2 rounded bg-green-200" />
          <span>Terjawab ({answeredCount})</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-stone-500">
          <div className="h-2 w-2 rounded bg-yellow-200" />
          <span>Di-flag ({flaggedIds.length})</span>
        </div>
      </div>
    </div>
  );
}
