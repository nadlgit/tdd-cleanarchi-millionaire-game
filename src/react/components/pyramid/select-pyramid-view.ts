import { createSelector } from '@reduxjs/toolkit';
import { type AppState } from '../../../core/store';

export const selectPyramidView = createSelector(
  (state: AppState) => state.pyramid,
  ({ values, milestones, currentValue }) =>
    values
      .map((val, idx) => ({
        label: val,
        isMilestone: milestones.includes(val) || idx === values.length - 1,
        isCurrent: val === currentValue,
      }))
      .reverse()
);
