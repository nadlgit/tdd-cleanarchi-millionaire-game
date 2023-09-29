import { pyramidRetrieved } from '../pyramid/pyramid-slice';
import { createAppAsyncThunk } from '../store';

export const retrievePyramid = createAppAsyncThunk(
  'pyramid/retrieving',
  async (_, { dispatch, extra: { pyramidGateway } }) => {
    const pyramid = await pyramidGateway.load();
    dispatch(pyramidRetrieved(pyramid));
  }
);
