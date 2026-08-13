"use client";

import { useEffect, useState, useCallback, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ProgressBar } from "@/components/quiz/ProgressBar";
import { Timer } from "@/components/quiz/Timer";
import { MiniMap } from "@/components/quiz/MiniMap";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuestionsDB } from "@/lib/questions";
import { TOPICS, TIME_PER_QUESTION } from "@/lib/constants";
import { shuffle } from "@/lib/utils";
import {
  saveQuizState,
  loadQuizState,
  clearQuizState,
  saveQuizResult,
  buildQuizResult,
} from "@/lib/store";
import { QuizState } from "@/lib/types";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";

function QuizContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const topicId = searchParams.get("topic") || "all";
  const countParam = searchParams.get("count");
  const questionCount = countParam ? parseInt(countParam) : 10;

  const [quiz, setQuiz] = useState<QuizState | null>(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showBackConfirm, setShowBackConfirm] = useState(false);
  const [topicName, setTopicName] = useState("Semua Domain");
  const backConfirmHandled = useRef(false);
  const setBackConfirmRef = useRef(setShowBackConfirm);
  useEffect(() => { setBackConfirmRef.current = setShowBackConfirm; });

  useEffect(() => {
    const saved = loadQuizState();
    if (saved) {
      const elapsed = Math.floor((Date.now() - saved.startedAt) / 1000);
      const remaining = Math.max(0, saved.timeRemaining - elapsed);

      if (remaining === 0) {
        clearQuizState();
        const result = buildQuizResult(saved);
        saveQuizResult(result);
        router.push("/result");
        return;
      }

      setQuiz({ ...saved, timeRemaining: remaining });
      const name = TOPICS.find((t) => t.id === saved.topicId)?.name || "Semua Domain";
      setTopicName(name);
      return;
    }

    const pool =
      topicId === "all"
        ? [...QuestionsDB]
        : QuestionsDB.filter((q) => q.topicId === topicId);

    const shuffled = shuffle(pool);
    const selected = shuffled.slice(0, Math.min(questionCount, shuffled.length));

    const newQuiz: QuizState = {
      topicId,
      questionIds: selected.map((q) => q.id),
      answers: {},
      flaggedQuestions: [],
      currentIndex: 0,
      startedAt: Date.now(),
      timeRemaining: selected.length * TIME_PER_QUESTION,
    };

    setQuiz(newQuiz);
    saveQuizState(newQuiz);

    const name = TOPICS.find((t) => t.id === topicId)?.name || "Semua Domain";
    setTopicName(name);
  }, [topicId, questionCount]);

  const handleSelectAnswer = useCallback(
    (answer: "A" | "B" | "C" | "D" | "E") => {
      if (!quiz) return;
      const updated = {
        ...quiz,
        answers: { ...quiz.answers, [quiz.questionIds[quiz.currentIndex]]: answer },
      };
      setQuiz(updated);
      saveQuizState(updated);
    },
    [quiz]
  );

  const handleToggleFlag = useCallback(() => {
    if (!quiz) return;
    const qId = quiz.questionIds[quiz.currentIndex];
    const flagged = quiz.flaggedQuestions.includes(qId)
      ? quiz.flaggedQuestions.filter((id) => id !== qId)
      : [...quiz.flaggedQuestions, qId];
    const updated = { ...quiz, flaggedQuestions: flagged };
    setQuiz(updated);
    saveQuizState(updated);
  }, [quiz]);

  const handleNavigate = useCallback(
    (index: number) => {
      if (!quiz) return;
      if (index < 0 || index >= quiz.questionIds.length) return;
      const updated = { ...quiz, currentIndex: index };
      setQuiz(updated);
      saveQuizState(updated);
    },
    [quiz]
  );

  const handleSubmit = useCallback(() => {
    if (!quiz) return;
    clearQuizState();
    const result = buildQuizResult(quiz);
    saveQuizResult(result);
    router.push("/result");
  }, [quiz, router]);

  const handleTimeUp = useCallback(() => {
    if (!quiz) return;
    clearQuizState();
    const result = buildQuizResult(quiz);
    saveQuizResult(result);
    router.push("/result");
  }, [quiz, router]);

  useEffect(() => {
    if (!quiz) return;

    backConfirmHandled.current = false;
    const popHandler = () => {
      if (backConfirmHandled.current) return;
      backConfirmHandled.current = true;
      history.pushState(null, "", location.href);
      setBackConfirmRef.current(true);
    };
    history.pushState(null, "", location.href);
    window.addEventListener("popstate", popHandler);

    return () => {
      window.removeEventListener("popstate", popHandler);
    };
  }, [quiz]);

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-stone-500">Memuat...</div>
      </div>
    );
  }

  const currentQuestion = QuestionsDB.find(
    (q) => q.id === quiz.questionIds[quiz.currentIndex]
  );
  const currentAnswer = quiz.answers[quiz.questionIds[quiz.currentIndex]];
  const answeredCount = Object.keys(quiz.answers).filter(
    (id) => quiz.questionIds.includes(id) && quiz.answers[id]
  ).length;
  const isLastQuestion = quiz.currentIndex === quiz.questionIds.length - 1;
  const unansweredCount = quiz.questionIds.length - answeredCount;

  if (!currentQuestion) return null;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white border-b border-stone-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <button
                onClick={() => setShowBackConfirm(true)}
                className="flex items-center gap-1 text-xs text-stone-500 hover:text-stone-700 transition-colors mb-1"
              >
                <ChevronLeft className="h-3 w-3" />
                Kembali
              </button>
              <div className="text-sm font-semibold text-primary truncate">{topicName}</div>
            </div>
            <Timer
              initialSeconds={quiz.timeRemaining}
              onTimeUp={handleTimeUp}
            />
          </div>
          <div className="mt-2">
            <ProgressBar
              current={quiz.currentIndex + 1}
              total={quiz.questionIds.length}
            />
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 max-w-5xl mx-auto w-full px-4 py-6">
        <div className="flex gap-6">
          {/* Question Area */}
          <div className="flex-1 min-w-0">
            <Card>
              <CardContent className="p-6">
                <QuestionCard
                  question={currentQuestion}
                  questionNumber={quiz.currentIndex + 1}
                  totalQuestions={quiz.questionIds.length}
                  selectedAnswer={currentAnswer}
                  isFlagged={quiz.flaggedQuestions.includes(currentQuestion.id)}
                  onSelectAnswer={handleSelectAnswer}
                  onToggleFlag={handleToggleFlag}
                />
              </CardContent>
            </Card>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="secondary"
                onClick={() => handleNavigate(quiz.currentIndex - 1)}
                disabled={quiz.currentIndex === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Sebelumnya
              </Button>

              <div className="flex gap-2">
                {!isLastQuestion ? (
                  <Button
                    variant="secondary"
                    onClick={() => handleNavigate(quiz.currentIndex + 1)}
                  >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => setShowSubmitConfirm(true)}
                  >
                    <Send className="h-4 w-4 mr-1" />
                    Submit
                  </Button>
                )}
              </div>
            </div>

            {/* MiniMap — Mobile */}
            <div className="md:hidden mt-6">
              <Card>
                <CardContent className="p-4">
                  <MiniMap
                    total={quiz.questionIds.length}
                    currentIndex={quiz.currentIndex}
                    answeredCount={answeredCount}
                    flaggedIds={quiz.flaggedQuestions}
                    questionIds={quiz.questionIds}
                    answers={quiz.answers}
                    onNavigate={handleNavigate}
                  />
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sidebar — Desktop */}
          <div className="hidden md:block w-48 shrink-0">
            <div className="sticky top-24">
              <Card>
                <CardContent className="p-4">
                  <MiniMap
                    total={quiz.questionIds.length}
                    currentIndex={quiz.currentIndex}
                    answeredCount={answeredCount}
                    flaggedIds={quiz.flaggedQuestions}
                    questionIds={quiz.questionIds}
                    answers={quiz.answers}
                    onNavigate={handleNavigate}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-w-sm w-full">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-stone-900">Konfirmasi Submit</h3>
              <div className="text-sm text-stone-600 space-y-1">
                <p>Total soal dijawab: <strong>{answeredCount}</strong> dari <strong>{quiz.questionIds.length}</strong></p>
                {unansweredCount > 0 && (
                  <p className="text-amber-600">
                    {unansweredCount} soal belum dijawab
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowSubmitConfirm(false)}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={handleSubmit}
                >
                  Ya, Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Back Confirmation Modal */}
      {showBackConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="max-w-sm w-full">
            <CardContent className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-stone-900">Keluar dari Ujian?</h3>
              <p className="text-sm text-stone-600">
                Anda yakin ingin keluar dari sesi ujian? Semua progres akan tetap tersimpan dan bisa dilanjutkan nanti.
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => { backConfirmHandled.current = false; setShowBackConfirm(false); }}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    clearQuizState();
                    router.push("/");
                  }}
                >
                  Ya, Keluar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-stone-500">Memuat...</div>
      </div>
    }>
      <QuizContent />
    </Suspense>
  );
}
