import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type TimerId } from './timer-provider';

type CountdownState = {
  remainingSeconds: number;
  timerId: number | null;
};

const initialState: CountdownState = {
  remainingSeconds: 0,
  timerId: null,
};

const countdownSlice = createSlice({
  name: 'countdown',
  initialState,
  reducers: {
    set: (state, action: PayloadAction<number>) => ({
      ...state,
      remainingSeconds: Math.max(0, action.payload),
    }),
    started: (state, action: PayloadAction<TimerId>) => ({ ...state, timerId: action.payload }),
    stopped: (state) => ({ ...state, timerId: null }),
    tick: (state) => ({ ...state, remainingSeconds: Math.max(0, state.remainingSeconds - 1) }),
  },
});

export default countdownSlice.reducer;

export const {
  set: setCountdown,
  started: countdownStarted,
  stopped: countdownStopped,
  tick: tickCountdown,
} = countdownSlice.actions;
