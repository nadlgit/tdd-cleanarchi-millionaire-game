import { StubQuestionGateway } from '../../gateways/stub-question-gateway';
import { type AnswerLetter } from '../question/question';
import { type AppState, initTestStore } from '../store';
import { applyFiftyLifeline } from './apply-fifty-lifeline';

describe('Apply 50:50 lifeline', () => {
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
    const question = {
      id: questionId,
      label: 'Question?',
      answers: { A: 'Answer A', B: 'Answer B', C: 'Answer C', D: 'Answer D' },
    };
    const questionGateway = new StubQuestionGateway();
    const store = initTestStore({
      dependencies: { questionGateway },
      initialState: { currentQuestion: question, ...partialState },
    });
    const initialState = store.getState();
    questionGateway.setQuestion({
      question,
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
    await store.dispatch(applyFiftyLifeline());
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
    await store.dispatch(applyFiftyLifeline());
    expect(store.getState()).toEqual(initialState);
  });
});
