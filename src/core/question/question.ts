export type Question = {
  id: string;
  label: string;
  answers: Record<AnswerLetter, string>;
};

export type AnswerLetter = 'A' | 'B' | 'C' | 'D';
