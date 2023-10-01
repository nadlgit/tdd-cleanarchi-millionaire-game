import { stopCountdown } from '../countdown/stop-countdown';
import { answerSubmitted } from '../question/current-answer-slice';
import { type AppStartListening } from '../store';

export const answerSubmittedListener = (startAppListening: AppStartListening) =>
  startAppListening({
    actionCreator: answerSubmitted,
    effect: (_, { dispatch }) => {
      dispatch(stopCountdown());
    },
  });
