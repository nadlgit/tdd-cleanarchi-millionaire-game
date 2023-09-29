import { type AnswerLetter, type Question } from '../../core/question/question';

export type QuestionPool = (Question & { correctAnswer: AnswerLetter })[];
