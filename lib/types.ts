export type Topic = {
  id: string;
  name: string;
  description: string;
};

export type Question = {
  id: string;
  topicId: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  explanation?: string;
};

export type QuizState = {
  topicId: string;
  questionIds: string[];
  answers: Record<string, "A" | "B" | "C" | "D" | "E">;
  flaggedQuestions: string[];
  currentIndex: number;
  startedAt: number;
  timeRemaining: number;
};

export type QuizResult = {
  topicId: string;
  totalQuestions: number;
  correctCount: number;
  score: number;
  passed: boolean;
  answers: Record<string, "A" | "B" | "C" | "D" | "E">;
  completedAt: string;
};
