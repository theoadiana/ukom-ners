"use client";

import { Question } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Check, X, Flag, FlagOff } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer?: "A" | "B" | "C" | "D" | "E";
  isFlagged?: boolean;
  onSelectAnswer: (answer: "A" | "B" | "C" | "D" | "E") => void;
  onToggleFlag: () => void;
  reviewMode?: boolean;
  userAnswer?: "A" | "B" | "C" | "D" | "E";
}

const optionLabels = ["A", "B", "C", "D", "E"] as const;

export function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  isFlagged,
  onSelectAnswer,
  onToggleFlag,
  reviewMode = false,
  userAnswer,
}: QuestionCardProps) {
  const options = Object.entries(question.options) as [string, string][];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-primary text-sm font-semibold text-white">
            {questionNumber}
          </span>
          <span className="text-sm text-stone-500">
            dari {totalQuestions}
          </span>
        </div>
        {!reviewMode && (
          <button
            onClick={onToggleFlag}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md transition-colors",
              isFlagged
                ? "bg-amber-100 text-amber-600"
                : "text-stone-400 hover:bg-stone-100 hover:text-stone-600"
            )}
            title={isFlagged ? "Hapus flag" : "Flag soal"}
          >
            {isFlagged ? <Flag className="h-4 w-4 fill-amber-400" /> : <FlagOff className="h-4 w-4" />}
          </button>
        )}
      </div>

      {/* Question Text */}
      <div className="text-lg font-medium text-stone-900 leading-relaxed">
        {question.question}
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map(([key, value]) => {
          const label = key as "A" | "B" | "C" | "D" | "E";
          const isSelected = selectedAnswer === label;
          const isCorrect = label === question.correctAnswer;
          const isUserAnswer = userAnswer === label;
          const isWrong = reviewMode && isUserAnswer && !isCorrect;
          const isRight = reviewMode && isCorrect && (isUserAnswer || !userAnswer);

          let optionClass =
            "flex items-start gap-3 p-4 rounded-md border cursor-pointer transition-all";

          if (reviewMode) {
            if (isRight) {
              optionClass += " border-green-400 bg-green-50";
            } else if (isWrong) {
              optionClass += " border-red-400 bg-red-50";
            } else {
              optionClass += " border-stone-200 bg-white";
            }
          } else {
            optionClass += isSelected
              ? " border-primary bg-primary-light"
              : " border-stone-200 bg-white hover:border-stone-300";
          }

          return (
            <div
              key={key}
              onClick={() => !reviewMode && onSelectAnswer(label)}
              className={cn(optionClass, reviewMode && "cursor-default")}
            >
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded border text-xs font-semibold",
                  isRight && "border-green-400 bg-green-500 text-white",
                  isWrong && "border-red-400 bg-red-500 text-white",
                  !reviewMode && isSelected && "border-primary bg-primary text-white",
                  !reviewMode && !isSelected && "border-stone-300 text-stone-500",
                  reviewMode && !isRight && !isWrong && "border-stone-300 text-stone-500"
                )}
              >
                {reviewMode && isRight && <Check className="h-3.5 w-3.5" />}
                {reviewMode && isWrong && <X className="h-3.5 w-3.5" />}
                {!reviewMode && label}
              </span>
              <span
                className={cn(
                  "flex-1 text-sm leading-relaxed",
                  isRight && "text-green-800 font-medium",
                  isWrong && "text-red-800",
                  !isRight && !isWrong && "text-stone-700"
                )}
              >
                {value}
              </span>
            </div>
          );
        })}
      </div>

      {/* Explanation (review mode) */}
      {reviewMode && question.explanation && (
        <div className="mt-4 rounded-md border border-stone-200 bg-stone-50 p-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-stone-500 mb-1">
            Penjelasan
          </div>
          <p className="text-sm text-stone-700">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
