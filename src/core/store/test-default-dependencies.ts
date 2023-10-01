import { StubPyramidGateway } from '../../gateways/stub-pyramid-gateway';
import { StubQuestionGateway } from '../../gateways/stub-question-gateway';
import { StubTimerProvider } from '../../gateways/stub-timer-provider';
import { type Dependencies } from '../dependencies';

export const testDefaultDependencies: Dependencies = {
  questionGateway: new StubQuestionGateway(),
  pyramidGateway: new StubPyramidGateway(),
  timerProvider: new StubTimerProvider(),
  countdownSeconds: 1,
};
