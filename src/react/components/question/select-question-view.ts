import { createSelector } from '@reduxjs/toolkit';
import { type AppState } from '../../../core/store';

export const selectQuestionView = createSelector(
  (state: AppState) => state.currentQuestion,
  (currentQuestion) => ({
    questionId: currentQuestion?.id ?? '',
    questionLabel: currentQuestion?.label ?? '',
    answers: Object.entries(currentQuestion?.answers ?? {}).map(([letter, label]) => ({
      letter,
      label,
      status: undefined,
    })),
  })
);
