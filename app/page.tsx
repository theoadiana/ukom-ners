"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { TOPICS, DEFAULT_QUESTION_COUNT, MAX_QUESTIONS } from "@/lib/constants";
import { QuestionsDB } from "@/lib/questions";
import { shuffle } from "@/lib/utils";
import { ChevronRight, BookOpen, Clock } from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [questionCount, setQuestionCount] = useState(DEFAULT_QUESTION_COUNT);

  const totalQuestions = selectedTopic === "all"
    ? QuestionsDB.length
    : QuestionsDB.filter((q) => q.topicId === selectedTopic).length;

  const handleStart = () => {
    const topic = selectedTopic === "all" ? "all" : selectedTopic;
    router.push(`/quiz?topic=${topic}&count=${questionCount}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-content mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/icons/cbt_ners_logo.png" alt="UKOM Ners CBT" className="h-10 w-10 object-contain" />
            <div>
              <h1 className="text-lg font-bold text-primary">UKOM Ners CBT</h1>
              <p className="text-xs text-stone-500">Latihan Soal Profesi Ners Indonesia</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 max-w-content mx-auto px-6 py-12 w-full space-y-10">
        {/* Hero */}
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold text-stone-900">
            Siap UKOM Profesi Ners?
          </h2>
          <p className="text-stone-500 max-w-md mx-auto">
            Latihan soal pilihan ganda dengan {TOPICS.length} domain kompetensi sesuai standar
            ujian kompetensi keperawatan Indonesia.
          </p>
        </div>

        {/* Setup Card */}
        <Card className="max-w-lg mx-auto">
          <CardContent className="space-y-6">
            {/* Topic Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-stone-700">
                Pilih Domain Soal
              </label>
              <select
                value={selectedTopic}
                onChange={(e) => {
                  const newTopic = e.target.value;
                  setSelectedTopic(newTopic);
                  const available = newTopic === "all"
                    ? QuestionsDB.length
                    : QuestionsDB.filter((q) => q.topicId === newTopic).length;
                  const cap = Math.min(available, 50);
                  setQuestionCount(Math.min(questionCount, Math.max(1, cap)));
                }}
                className="w-full h-10 px-3 rounded-md border border-stone-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
              >
                <option value="all">Semua Domain ({QuestionsDB.length} soal)</option>
                {TOPICS.map((t) => {
                  const count = QuestionsDB.filter((q) => q.topicId === t.id).length;
                  return (
                    <option key={t.id} value={t.id}>
                      {t.name} ({count} soal)
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Count Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-stone-700">
                  Jumlah Soal
                </label>
                <span className="text-sm font-mono font-semibold text-primary">
                  {questionCount}
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={totalQuestions}
                value={questionCount}
                onChange={(e) => setQuestionCount(Number(e.target.value))}
                className="w-full h-2 rounded-full bg-stone-200 appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-stone-400">
                <span>1</span>
                <span>{totalQuestions}</span>
              </div>
            </div>

            {/* Start Button */}
            <Button size="lg" className="w-full gap-2" onClick={handleStart}>
              Mulai Latihan
              <ChevronRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
          <div className="flex items-start gap-3 p-4 rounded-lg border border-stone-200 bg-white">
            <BookOpen className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-stone-800">{QuestionsDB.length} Soal</div>
              <div className="text-xs text-stone-500">8 domain kompetensi</div>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 rounded-lg border border-stone-200 bg-white">
            <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-semibold text-stone-800">
                ~{Math.round(questionCount * 1.5)} menit
              </div>
              <div className="text-xs text-stone-500">Estimasi waktu</div>
            </div>
          </div>
        </div>

        {/* Topics Preview */}
        <div className="space-y-3 max-w-lg mx-auto">
          <h3 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">
            {TOPICS.length} Domain Kompetensi
          </h3>
          <div className="flex flex-wrap gap-2">
            {TOPICS.map((t) => {
              const count = QuestionsDB.filter((q) => q.topicId === t.id).length;
              return (
                <Badge key={t.id} variant="info">
                  {t.name} ({count})
                </Badge>
              );
            })}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-4">
        <div className="max-w-content mx-auto px-6 text-center text-xs text-stone-400">
          UKOM Ners CBT — Untuk persiapan ujian kompetensi profesi ners Indonesia
        </div>
      </footer>
    </div>
  );
}
