import { StubQuestionGateway } from '../../gateways/stub-question-gateway';
import { type AnswerLetter } from '../question/question';
import { type AppState, initTestStore } from '../store';
import { useFiftyLifeline } from './use-fifty-lifeline';

describe('Use 50:50 lifeline', () => {
  const questionId = 'id1';

  type InitTestConfig = {
    partialState?: Partial<AppState>;
    fakeCorrectAnswer?: AnswerLetter;
    fakeFiftyLifelineOtherAnswer?: AnswerLetter;
  };
  const initTest = ({
    partialState,
    fakeCorrectAnswer,
    fakeFiftyLifelineOtherAnswer,
  }: InitTestConfig) => {
    const questionGateway = new StubQuestionGateway();
    const store = initTestStore({
      dependencies: { questionGateway },
      initialState: partialState,
    });
    const initialState = store.getState();
    questionGateway.setQuestion({
      question: {
        id: questionId,
        label: 'Question?',
        answers: { A: 'Answer A', B: 'Answer B', C: 'Answer C', D: 'Answer D' },
      },
      correctAnswer: fakeCorrectAnswer,
      fiftyLifelineOtherAnswer: fakeFiftyLifelineOtherAnswer,
    });
    return { store, initialState };
  };

  it('eliminates 2 wrong answers', async () => {
    const correctAnswer = 'A';
    const fiftyLifelineOtherAnswer = 'B';
    const { store, initialState } = initTest({
      partialState: { fiftyLifeline: null },
      fakeCorrectAnswer: correctAnswer,
      fakeFiftyLifelineOtherAnswer: fiftyLifelineOtherAnswer,
    });
    await store.dispatch(useFiftyLifeline(questionId));
    expect(store.getState()).toEqual({
      ...initialState,
      fiftyLifeline: { questionId, remainingAnswers: [correctAnswer, fiftyLifelineOtherAnswer] },
    });
  });

  it('does nothing if lifeline was already used', async () => {
    const { store, initialState } = initTest({
      partialState: {
        fiftyLifeline: { questionId, remainingAnswers: ['A', 'B'] },
      },
    });
    await store.dispatch(useFiftyLifeline(questionId));
    expect(store.getState()).toEqual(initialState);
  });
});
