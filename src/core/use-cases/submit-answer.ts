import { createAsyncThunk } from '@reduxjs/toolkit';
import { answerSubmitted, validateAnswer } from '../question/current-answer-slice';
import { type AnswerLetter, type Question } from '../question/question';
import { type AppCreateAsyncThunk } from '../store';

export const submitAnswer = (createAsyncThunk as AppCreateAsyncThunk)(
  'currentQuestion/answerSubmitting',
  async (
    { questionId, givenAnswer }: { questionId: Question['id']; givenAnswer: AnswerLetter | null },
    { dispatch, extra: { questionGateway } }
  ) => {
    dispatch(answerSubmitted(givenAnswer));
    const correctAnswer = await questionGateway.getCorrectAnswer(questionId);
    dispatch(validateAnswer({ correctAnswer, givenAnswer }));
  }
);

// export const submitAnswer = createAppAsyncThunk(
//   'currentQuestion/answerSubmitting',
//   async (
//     { questionId, givenAnswer }: { questionId: Question['id']; givenAnswer: AnswerLetter | null },
//     { dispatch, extra: { questionGateway } }
//   ) => {
//     dispatch(answerSubmitted(givenAnswer));
//     const correctAnswer = await questionGateway.getCorrectAnswer(questionId);
//     dispatch(validateAnswer({ correctAnswer, givenAnswer }));
//   }
// );
