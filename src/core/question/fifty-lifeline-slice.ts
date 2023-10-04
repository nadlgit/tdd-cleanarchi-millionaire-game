import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { type AnswerLetter, type Question } from './question';

type FiftyLifelineState = {
  questionId: Question['id'];
  remainingAnswers: [AnswerLetter, AnswerLetter];
};

const initialState = null as FiftyLifelineState | null;

const fiftyLifelineSlice = createSlice({
  name: 'fiftyLifeline',
  initialState,
  reducers: {
    used: (state, action: PayloadAction<FiftyLifelineState>) => state || action.payload,
  },
});

export default fiftyLifelineSlice.reducer;

export const { used: fiftyLifelineUsed } = fiftyLifelineSlice.actions;
