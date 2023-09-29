import { StubQuestionGateway } from '../../gateways/stub-question-gateway';
import { type AnswerLetter } from '../question/question';
import { type AppState, initTestStore } from '../store';
import { submitAnswer } from './submit-answer';

describe('Submit answer', () => {
  const questionId = 'id1';

  type InitTestConfig = {
    partialState?: Partial<AppState>;
    fakeCorrectAnswer?: AnswerLetter;
  };
  const initTest = ({ partialState, fakeCorrectAnswer }: InitTestConfig) => {
    const questionGateway = new StubQuestionGateway();
    const store = initTestStore({
      dependencies: { questionGateway },
      initialState: partialState,
    });
    const initialState = store.getState();
    questionGateway.setQuestion(
      {
        id: questionId,
        label: 'Question?',
        answers: { A: 'Answer A', B: 'Answer B', C: 'Answer C', D: 'Answer D' },
      },
      fakeCorrectAnswer
    );
    return { store, initialState };
  };

  it('stores given answer', async () => {
    const { store, initialState } = initTest({
      partialState: {
        currentAnswer: { status: 'unvalidated', givenValue: null, correctValue: null },
      },
    });
    const givenAnswer = 'A';
    await store.dispatch(submitAnswer({ questionId, givenAnswer }));
    expect(store.getState()).toEqual({
      ...initialState,
      currentAnswer: { ...store.getState().currentAnswer, givenValue: givenAnswer },
    });
  });

  it.each<{
    correctAnswer: AnswerLetter;
    givenAnswer: AnswerLetter;
    expectedStatus: AppState['currentAnswer']['status'];
  }>([
    { correctAnswer: 'A', givenAnswer: 'A', expectedStatus: 'correct' },
    { correctAnswer: 'A', givenAnswer: 'B', expectedStatus: 'wrong' },
  ])(
    'validates answer: $expectedStatus',
    async ({ correctAnswer, givenAnswer, expectedStatus }) => {
      const { store, initialState } = initTest({
        partialState: {
          currentAnswer: { status: 'unvalidated', givenValue: null, correctValue: null },
        },
        fakeCorrectAnswer: correctAnswer,
      });
      await store.dispatch(submitAnswer({ questionId, givenAnswer }));
      expect(store.getState()).toEqual({
        ...initialState,
        currentAnswer: {
          status: expectedStatus,
          givenValue: givenAnswer,
          correctValue: correctAnswer,
        },
      });
    }
  );
});
