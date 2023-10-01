import { createSelector } from '@reduxjs/toolkit';
import { type AppState } from '../../../core/store';

export const selectQuestionView = createSelector(
  [(state: AppState) => state.currentQuestion, (state: AppState) => state.currentAnswer],
  (currentQuestion, currentAnswer) => ({
    questionId: currentQuestion?.id ?? '',
    questionLabel: currentQuestion?.label ?? '',
    answers: Object.entries(currentQuestion?.answers ?? {}).map(([letter, label]) => {
      switch (letter) {
        case currentAnswer.correctValue:
          return { letter, label, status: 'correct' };
        case currentAnswer.givenValue:
          return { letter, label, status: 'selected' };
        default:
          return { letter, label, status: undefined };
      }
    }),
    isSubmitted: !!currentAnswer.givenValue,
  })
);
