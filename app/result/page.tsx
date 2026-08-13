"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ScoreDisplay } from "@/components/result/ScoreDisplay";
import { TOPICS } from "@/lib/constants";
import { loadQuizResult, clearQuizResult } from "@/lib/store";
import { QuizResult } from "@/lib/types";
import { RotateCcw, BookOpen, Home } from "lucide-react";

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [topicName, setTopicName] = useState("");

  useEffect(() => {
    const saved = loadQuizResult();
    if (!saved) {
      router.push("/");
      return;
    }
    setResult(saved);
    const name = TOPICS.find((t) => t.id === saved.topicId)?.name || "Semua Domain";
    setTopicName(name);
  }, [router]);

  const handleRestart = () => {
    clearQuizResult();
    router.push("/");
  };

  if (!result) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-content mx-auto px-6 py-4">
          <h1 className="text-lg font-bold text-primary">UKOM Ners CBT</h1>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-content mx-auto px-6 py-12 w-full">
        <div className="max-w-md mx-auto space-y-8">
          {/* Score */}
          <Card>
            <CardContent className="p-8">
              <ScoreDisplay
                score={result.score}
                correctCount={result.correctCount}
                totalQuestions={result.totalQuestions}
                passed={result.passed}
                topicName={topicName}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button size="lg" className="w-full gap-2" onClick={() => router.push("/review")}>
              <BookOpen className="h-4 w-4" />
              Review Jawaban
            </Button>
            <Button variant="secondary" size="lg" className="w-full gap-2" onClick={handleRestart}>
              <RotateCcw className="h-4 w-4" />
              Mulai Ulang
            </Button>
            <Button variant="ghost" size="lg" className="w-full gap-2" onClick={() => router.push("/")}>
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
