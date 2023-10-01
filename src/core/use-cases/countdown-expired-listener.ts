import { tickCountdown } from '../countdown/countdown-slice';
import { type AppStartListening } from '../store';
import { submitAnswer } from './submit-answer';

export const countdownExpiredListener = (startAppListening: AppStartListening) =>
  startAppListening({
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
