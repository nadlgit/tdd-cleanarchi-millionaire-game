import { questionRetrieved } from '../question/current-question-slice';
import { createAppAsyncThunk } from '../store';

export const retrieveQuestion = createAppAsyncThunk(
  'currentQuestion/retrieving',
  async (_, { dispatch, extra: { questionGateway } }) => {
    const question = await questionGateway.loadNext();
    dispatch(questionRetrieved(question));
  }
);
