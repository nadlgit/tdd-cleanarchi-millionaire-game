import { createSelector } from '@reduxjs/toolkit';
import { type AppState } from '../../../core/store';

export const selectCountdownView = createSelector(
  (state: AppState) => state.countdown,
  ({ remainingSeconds }) => ({
    minutes: Math.floor(remainingSeconds / 60)
      .toString()
      .padStart(2, '0'),
    seconds: (remainingSeconds % 60).toString().padStart(2, '0'),
    isExpired: remainingSeconds === 0,
  })
);
