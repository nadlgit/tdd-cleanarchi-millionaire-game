import { type AnswerLetter, type Question } from './question';

export type QuestionGateway = {
  loadNext(): Promise<Question>;
  getCorrectAnswer(questionId: Question['id']): Promise<AnswerLetter>;
};
