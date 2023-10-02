import { createAsyncThunk } from '@reduxjs/toolkit';
import { questionRetrieved } from '../question/current-question-slice';
import { type AppCreateAsyncThunk } from '../store';

export const retrieveQuestion = (createAsyncThunk as AppCreateAsyncThunk)(
  'currentQuestion/retrieving',
  async (_, { dispatch, getState, extra: { questionGateway } }) => {
    if (getState().gameStatus !== 'PLAYING') {
      return;
    }
    const question = await questionGateway.loadNext();
    dispatch(questionRetrieved(question));
  }
);
