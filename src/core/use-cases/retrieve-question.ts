import { createAsyncThunk } from '@reduxjs/toolkit';
import { questionRetrieved } from '../question/current-question-slice';
import { type CreateAppAsyncThunk } from '../store';

export const retrieveQuestion = (createAsyncThunk as CreateAppAsyncThunk)(
  'currentQuestion/retrieving',
  async (_, { dispatch, extra: { questionGateway } }) => {
    const question = await questionGateway.loadNext();
    dispatch(questionRetrieved(question));
  }
);
