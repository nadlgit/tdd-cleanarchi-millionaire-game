import { type Question } from './question';

export type QuestionGateway = {
  loadNext(): Promise<Question>;
};
