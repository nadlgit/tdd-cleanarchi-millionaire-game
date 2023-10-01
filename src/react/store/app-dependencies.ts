import { type Dependencies } from '../../core/dependencies';
import { BrowserTimerProvider } from '../../gateways/browser-timer-provider';
import { InmemoryPyramidGateway } from '../../gateways/inmemory-pyramid-gateway';
import {
  InmemoryQuestionGateway,
  randomArrayIndexProvider,
} from '../../gateways/inmemory-question-gateway';
import { pyramid } from './pyramid';
import { questionPool } from './question-pool';

export const appDependencies: Dependencies = {
  questionGateway: new InmemoryQuestionGateway(questionPool, randomArrayIndexProvider),
  pyramidGateway: new InmemoryPyramidGateway(pyramid),
  timerProvider: new BrowserTimerProvider(),
  countdownSeconds: 15,
};
