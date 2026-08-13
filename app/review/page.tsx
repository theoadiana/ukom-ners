"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuestionsDB } from "@/lib/questions";
import { loadQuizResult } from "@/lib/store";
import { QuizResult, Question } from "@/lib/types";
import { ChevronLeft, ChevronRight, Home, RotateCcw } from "lucide-react";
import Link from "next/link";

type FilterType = "all" | "wrong" | "unanswered";

function ReviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filterParam = (searchParams.get("filter") as FilterType) || "all";

  const [result, setResult] = useState<QuizResult | null>(null);
  const [filter, setFilter] = useState<FilterType>(filterParam);
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const saved = loadQuizResult();
    if (!saved) {
      router.push("/");
      return;
    }
    setResult(saved);
  }, [router]);

  const filteredQuestions = useMemo(() => {
    if (!result) return [];

    return QuestionsDB.filter((q) => {
      if (!result.answers[q.id]) {
        return filter === "unanswered" || filter === "all";
      }
      const isWrong = result.answers[q.id] !== q.correctAnswer;
      return (filter === "wrong" && isWrong) || filter === "all";
    });
  }, [result, filter]);

  const counts = useMemo(() => {
    if (!result) return { all: 0, wrong: 0, unanswered: 0 };
    const sessionIds = Object.keys(result.answers);
    const sessionQuestions = QuestionsDB.filter((q) => sessionIds.includes(q.id));
    const answered = sessionQuestions.filter((q) => result.answers[q.id]);
    const wrong = answered.filter((q) => result.answers[q.id] !== q.correctAnswer);
    const unanswered = sessionQuestions.filter((q) => !result.answers[q.id]);
    return {
      all: sessionQuestions.length,
      wrong: wrong.length,
      unanswered: unanswered.length,
    };
  }, [result]);

  useEffect(() => {
    setCurrentIdx(0);
  }, [filter]);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("filter", filter);
    window.history.replaceState(null, "", url.toString());
  }, [filter]);

  if (!result) return null;

  const currentQuestion = filteredQuestions[currentIdx];
  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-content mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg font-bold text-primary">Review Jawaban</h1>
              <p className="text-xs text-stone-500">
                {filteredQuestions.length} soal — {filter === "all" ? "Semua" : filter === "wrong" ? "Yang Salah" : "Belum Dijawab"}
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/result">
                <Button variant="ghost" size="sm">
                  <Home className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-1 mt-3">
            {(["all", "wrong", "unanswered"] as FilterType[]).map((f) => {
              const count = counts[f];
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                    filter === f
                      ? "bg-primary text-white"
                      : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}
                >
                  {f === "all" ? "Semua" : f === "wrong" ? "Salah" : "Belum Dijawab"} ({count})
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="flex-1 max-w-content mx-auto px-6 py-6 w-full">
        <Card>
          <CardContent className="p-6">
            <QuestionCard
              question={currentQuestion}
              questionNumber={currentIdx + 1}
              totalQuestions={filteredQuestions.length}
              userAnswer={result.answers[currentQuestion.id]}
              onSelectAnswer={() => {}}
              onToggleFlag={() => {}}
              reviewMode
            />
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <Button
            variant="secondary"
            onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
            disabled={currentIdx === 0}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Sebelumnya
          </Button>

          <span className="text-sm text-stone-500">
            {currentIdx + 1} / {filteredQuestions.length}
          </span>

          <Button
            variant="secondary"
            onClick={() => setCurrentIdx((i) => Math.min(filteredQuestions.length - 1, i + 1))}
            disabled={currentIdx === filteredQuestions.length - 1}
          >
            Selanjutnya
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </main>
    </div>
  );
}

export default function ReviewPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-stone-500">Memuat...</div>
      </div>
    }>
      <ReviewContent />
    </Suspense>
  );
}
