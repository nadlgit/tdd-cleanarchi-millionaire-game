import { createAsyncThunk } from '@reduxjs/toolkit';
import { pyramidRetrieved } from '../pyramid/pyramid-slice';
import { type AppCreateAsyncThunk } from '../store';

export const retrievePyramid = (createAsyncThunk as AppCreateAsyncThunk)(
  'pyramid/retrieving',
  async (_, { dispatch, extra: { pyramidGateway } }) => {
    const pyramid = await pyramidGateway.load();
    dispatch(pyramidRetrieved(pyramid));
  }
);
