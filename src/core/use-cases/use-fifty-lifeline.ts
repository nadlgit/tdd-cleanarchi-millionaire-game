import { createAsyncThunk } from '@reduxjs/toolkit';
import { fiftyLifelineUsed } from '../question/fifty-lifeline-slice';
import { type AppCreateAsyncThunk } from '../store';

export const useFiftyLifeline = (createAsyncThunk as AppCreateAsyncThunk)(
  'fiftyLifeline/using',
  async (_, { dispatch, getState, extra: { questionGateway } }) => {
    const questionId = getState().currentQuestion?.id ?? '';
    const remainingAnswers = await questionGateway.getFiftyLifelineResult(questionId);
    dispatch(fiftyLifelineUsed({ questionId, remainingAnswers }));
  }
);
