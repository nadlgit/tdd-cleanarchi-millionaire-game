import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type Pyramid, type PyramidStep } from './pyramid';

type PyramidState = Pyramid & {
  currentValue: PyramidStep | null;
  currentMilestone: PyramidStep | null;
};

const initialState = {
  values: [],
  milestones: [],
  currentValue: null,
  currentMilestone: null,
} as PyramidState;

const pyramidSlice = createSlice({
  name: 'pyramid',
  initialState,
  reducers: {
    retrieved: (_, action: PayloadAction<Pyramid>) => ({
      ...action.payload,
      currentValue: null,
      currentMilestone: null,
    }),
  },
});

export default pyramidSlice.reducer;

export const { retrieved: pyramidRetrieved } = pyramidSlice.actions;
