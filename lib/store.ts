import { QuizState, QuizResult } from "./types";
import { PASSING_GRADE } from "./constants";
import { QuestionsDB } from "./questions";

const QUIZ_STATE_KEY = "ukom_quiz_state";
const QUIZ_RESULT_KEY = "ukom_quiz_result";

export function saveQuizState(state: QuizState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUIZ_STATE_KEY, JSON.stringify(state));
}

export function loadQuizState(): QuizState | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(QUIZ_STATE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizState;
  } catch {
    return null;
  }
}

export function clearQuizState(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(QUIZ_STATE_KEY);
}

export function saveQuizResult(result: QuizResult): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(QUIZ_RESULT_KEY, JSON.stringify(result));
}

export function loadQuizResult(): QuizResult | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(QUIZ_RESULT_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as QuizResult;
  } catch {
    return null;
  }
}

export function clearQuizResult(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(QUIZ_RESULT_KEY);
}

export function buildQuizResult(state: QuizState): QuizResult {
  const questions = state.questionIds
    .map((id) => QuestionsDB.find((q) => q.id === id))
    .filter(Boolean) as { id: string; correctAnswer: "A" | "B" | "C" | "D" | "E" }[];

  let correctCount = 0;
  for (const q of questions) {
    if (state.answers[q.id] === q.correctAnswer) correctCount++;
  }

  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  return {
    topicId: state.topicId,
    totalQuestions: questions.length,
    correctCount,
    score,
    passed: score >= PASSING_GRADE,
    answers: { ...state.answers },
    completedAt: new Date().toISOString(),
  };
}
