import { createAsyncThunk } from '@reduxjs/toolkit';
import { type Question } from '../question/question';
import { fiftyLifelineUsed } from '../question/fifty-lifeline-slice';
import { type AppCreateAsyncThunk } from '../store';

export const useFiftyLifeline = (createAsyncThunk as AppCreateAsyncThunk)(
  'fiftyLifeline/using',
  async (questionId: Question['id'], { dispatch, extra: { questionGateway } }) => {
    const remainingAnswers = await questionGateway.getFiftyLifelineResult(questionId);
    dispatch(fiftyLifelineUsed({ questionId, remainingAnswers }));
  }
);
