import { type PayloadAction, createSlice } from '@reduxjs/toolkit';
import { questionRetrieved } from './current-question-slice';
import { type AnswerLetter } from './question';

type AnswerState = {
  status: 'unvalidated' | 'correct' | 'wrong';
  givenValue: AnswerLetter | null;
  correctValue: AnswerLetter | null;
};

const initialState = { status: 'unvalidated', givenValue: null, correctValue: null } as AnswerState;

const currentAnswerSlice = createSlice({
  name: 'currentAnswer',
  initialState,
  reducers: {
    submitted: (state, action: PayloadAction<AnswerLetter | null>) => ({
      ...state,
      givenValue: action.payload,
    }),
    validate: (
      state,
      action: PayloadAction<{ correctAnswer: AnswerLetter; givenAnswer: AnswerLetter | null }>
    ) => ({
      ...state,
      correctValue: action.payload.correctAnswer,
      status: action.payload.givenAnswer === action.payload.correctAnswer ? 'correct' : 'wrong',
    }),
  },
  extraReducers: (builder) => {
    builder.addCase(questionRetrieved, () => initialState);
  },
});

export default currentAnswerSlice.reducer;

export const { submitted: answerSubmitted, validate: validateAnswer } = currentAnswerSlice.actions;
