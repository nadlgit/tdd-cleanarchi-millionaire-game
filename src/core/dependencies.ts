import { type TimerProvider } from './countdown/timer-provider';
import { type PyramidGateway } from './pyramid/pyramid-gateway';
import { type QuestionGateway } from './question/question-gateway';

export type Dependencies = {
  questionGateway: QuestionGateway;
  pyramidGateway: PyramidGateway;
  timerProvider: TimerProvider;
  countdownSeconds: number;
};
