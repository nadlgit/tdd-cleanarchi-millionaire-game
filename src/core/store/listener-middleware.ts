import { createListenerMiddleware } from '@reduxjs/toolkit';
import { type Dependencies } from '../dependencies';
import { answerSubmittedListener } from '../use-cases/answer-submitted-listener';
import { countdownExpiredListener } from '../use-cases/countdown-expired-listener';
import { questionRetrievedListener } from '../use-cases/question-retrieved-listener';
import { type AppStartListening } from './store';

export const createAppListenerMiddleware = (dependencies: Dependencies) => {
  const listener = createListenerMiddleware({ extra: dependencies });
  const startAppListening = listener.startListening as AppStartListening;
  questionRetrievedListener(startAppListening);
  answerSubmittedListener(startAppListening);
  countdownExpiredListener(startAppListening);
  return listener.middleware;
};
