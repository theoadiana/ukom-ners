export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function calculateScore(
  answers: Record<string, "A" | "B" | "C" | "D" | "E">,
  questions: { id: string; correctAnswer: "A" | "B" | "C" | "D" | "E" }[]
): { correctCount: number; score: number } {
  let correctCount = 0;
  for (const q of questions) {
    if (answers[q.id] === q.correctAnswer) {
      correctCount++;
    }
  }
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  return { correctCount, score };
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
