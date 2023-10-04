import { createAsyncThunk } from '@reduxjs/toolkit';
import { answerSubmitted, validateAnswer } from '../question/current-answer-slice';
import { type AnswerLetter } from '../question/question';
import { type AppCreateAsyncThunk } from '../store';

export const submitAnswer = (createAsyncThunk as AppCreateAsyncThunk)(
  'currentQuestion/answerSubmitting',
  async (givenAnswer: AnswerLetter | null, { dispatch, getState, extra: { questionGateway } }) => {
    if (getState().gameStatus !== 'PLAYING') {
      return;
    }
    const questionId = getState().currentQuestion?.id ?? '';
    dispatch(answerSubmitted(givenAnswer));
    const correctAnswer = await questionGateway.getCorrectAnswer(questionId);
    dispatch(validateAnswer({ correctAnswer, givenAnswer }));
  }
);
