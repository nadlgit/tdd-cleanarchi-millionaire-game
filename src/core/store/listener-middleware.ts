import { createListenerMiddleware } from '@reduxjs/toolkit';
import { tickCountdown } from '../countdown/countdown-slice';
import { startCountdown } from '../countdown/start-countdown';
import { stopCountdown } from '../countdown/stop-countdown';
import { type Dependencies } from '../dependencies';
import { answerSubmitted } from '../question/current-answer-slice';
import { questionRetrieved } from '../question/current-question-slice';
import { submitAnswer } from '../use-cases/submit-answer';
import { type AppListenerMiddlewareInstance } from './store';

export const createAppListenerMiddleware = (dependencies: Dependencies) => {
  const listener: AppListenerMiddlewareInstance = createListenerMiddleware({ extra: dependencies });

  listener.startListening({
    actionCreator: questionRetrieved,
    effect: (_, { dispatch }) => {
      dispatch(startCountdown());
    },
  });

  listener.startListening({
    actionCreator: answerSubmitted,
    effect: (_, { dispatch }) => {
      dispatch(stopCountdown());
    },
  });

  listener.startListening({
    predicate: (action, currentState, previousState) =>
      tickCountdown.match(action) &&
      previousState.countdown.remainingSeconds > 0 &&
      currentState.countdown.remainingSeconds === 0,
    effect: async (_, { dispatch, getOriginalState }) => {
      dispatch(
        submitAnswer({
          questionId: getOriginalState().currentQuestion?.id ?? '',
          givenAnswer: null,
        })
      );
    },
  });

  return listener.middleware;
};
