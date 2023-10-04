import { createSelector } from '@reduxjs/toolkit';
import { type AnswerLetter } from '../../../core/question/question';
import { type AppState } from '../../../core/store';

export const selectQuestionView = createSelector(
  [
    (state: AppState) => state.currentQuestion,
    (state: AppState) => state.currentAnswer,
    (state: AppState) => state.fiftyLifeline,
  ],
  (currentQuestion, currentAnswer, fiftyLifeline) => ({
    questionLabel: currentQuestion?.label ?? '',
    answers: Object.entries(currentQuestion?.answers ?? {}).map(([letter, label]) => {
      switch (letter) {
        case currentAnswer.correctValue:
          return { letter, label, status: 'correct' };
        case currentAnswer.givenValue:
          return { letter, label, status: 'selected' };
        default:
          return {
            letter,
            label,
            status:
              fiftyLifeline &&
              fiftyLifeline.questionId === currentQuestion?.id &&
              !fiftyLifeline.remainingAnswers.includes(letter as AnswerLetter)
                ? 'eliminated'
                : undefined,
          };
      }
    }),
    isSubmitted: !!currentAnswer.givenValue,
  })
);
