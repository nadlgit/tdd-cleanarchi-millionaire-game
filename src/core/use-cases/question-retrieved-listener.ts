import { startCountdown } from '../countdown/start-countdown';
import { questionRetrieved } from '../question/current-question-slice';
import { type AppStartListening } from '../store';

export const questionRetrievedListener = (startAppListening: AppStartListening) =>
  startAppListening({
    actionCreator: questionRetrieved,
    effect: (_, { dispatch }) => {
      dispatch(startCountdown());
    },
  });
