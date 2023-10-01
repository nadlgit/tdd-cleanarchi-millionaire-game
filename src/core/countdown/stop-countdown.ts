import { type AppThunk } from '../store';
import { countdownStopped } from './countdown-slice';

export const stopCountdown =
  (): AppThunk =>
  (dispatch, getState, { timerProvider }) => {
    const timerId = getState().countdown.timerId;
    if (timerId) {
      timerProvider.stop(timerId);
    }
    dispatch(countdownStopped());
  };
