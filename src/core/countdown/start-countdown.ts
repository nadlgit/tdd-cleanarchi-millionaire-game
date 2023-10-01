import { type AppThunk } from '../store';
import { countdownStarted, setCountdown, tickCountdown } from './countdown-slice';

export const startCountdown =
  (): AppThunk =>
  (dispatch, getState, { timerProvider, countdownSeconds }) => {
    const oldTimerId = getState().countdown.timerId;
    if (oldTimerId) {
      timerProvider.stop(oldTimerId);
    }

    dispatch(setCountdown(countdownSeconds));
    const timerId = timerProvider.start(1000, () => dispatch(tickCountdown()));
    dispatch(countdownStarted(timerId));
  };
