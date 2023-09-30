import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { validateAnswer } from '../question/current-answer-slice';
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
  extraReducers: (builder) => {
    builder.addCase(validateAnswer, (state, action) => {
      if (action.payload.givenAnswer === action.payload.correctAnswer) {
        const currentValueIndex = state.values.findIndex((item) => item === state.currentValue);
        const nextCurrentValue = state.values[currentValueIndex + 1] ?? null;
        return {
          ...state,
          currentValue: nextCurrentValue,
          currentMilestone: state.milestones.includes(nextCurrentValue)
            ? nextCurrentValue
            : state.currentMilestone,
        };
      }
      return { ...state, currentValue: state.currentMilestone };
    });
  },
});

export default pyramidSlice.reducer;

export const { retrieved: pyramidRetrieved } = pyramidSlice.actions;
