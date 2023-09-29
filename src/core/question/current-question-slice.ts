import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type Question } from './question';

const initialState = null as Question | null;

const currentQuestionSlice = createSlice({
  name: 'currentQuestion',
  initialState,
  reducers: {
    retrieved: (_, action: PayloadAction<Question>) => action.payload,
  },
});

export default currentQuestionSlice.reducer;

export const { retrieved: questionRetrieved } = currentQuestionSlice.actions;
