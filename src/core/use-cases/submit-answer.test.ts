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
      pyramid: { ...store.getState().pyramid },
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
        pyramid: { ...store.getState().pyramid },
      });
    }
  );

  describe('updates pyramid on correct answer', () => {
    const correctAnswer = 'A';
    const givenAnswer = correctAnswer;

    it('climbs on first answer', async () => {
      const { store, initialState } = initTest({
        partialState: {
          pyramid: {
            values: ['10 €', '50 €', '100 €'],
            milestones: [],
            currentValue: null,
            currentMilestone: null,
          },
        },
        fakeCorrectAnswer: correctAnswer,
      });
      await store.dispatch(submitAnswer({ questionId, givenAnswer }));
      expect(store.getState()).toEqual({
        ...initialState,
        currentAnswer: { ...store.getState().currentAnswer },
        pyramid: { ...initialState.pyramid, currentValue: '10 €' },
      });
    });

    it('climbs on further answer', async () => {
      const { store, initialState } = initTest({
        partialState: {
          pyramid: {
            values: ['10 €', '50 €', '100 €'],
            milestones: [],
            currentValue: '10 €',
            currentMilestone: null,
          },
        },
        fakeCorrectAnswer: correctAnswer,
      });
      await store.dispatch(submitAnswer({ questionId, givenAnswer }));
      expect(store.getState()).toEqual({
        ...initialState,
        currentAnswer: { ...store.getState().currentAnswer },
        pyramid: { ...initialState.pyramid, currentValue: '50 €' },
      });
    });

    it('sets milestone if reached', async () => {
      const { store, initialState } = initTest({
        partialState: {
          pyramid: {
            values: ['10 €', '50 €', '100 €'],
            milestones: ['50 €'],
            currentValue: '10 €',
            currentMilestone: null,
          },
        },
        fakeCorrectAnswer: correctAnswer,
      });
      await store.dispatch(submitAnswer({ questionId, givenAnswer }));
      expect(store.getState()).toEqual({
        ...initialState,
        currentAnswer: { ...store.getState().currentAnswer },
        pyramid: { ...initialState.pyramid, currentValue: '50 €', currentMilestone: '50 €' },
      });
    });
  });

  describe('updates pyramid on wrong answer', () => {
    const correctAnswer = 'A';
    const givenAnswer = 'B';

    it('falls to bottom if no milestone reached', async () => {
      const { store, initialState } = initTest({
        partialState: {
          pyramid: {
            values: ['10 €', '50 €', '100 €'],
            milestones: [],
            currentValue: '50 €',
            currentMilestone: null,
          },
        },
        fakeCorrectAnswer: correctAnswer,
      });
      await store.dispatch(submitAnswer({ questionId, givenAnswer }));
      expect(store.getState()).toEqual({
        ...initialState,
        currentAnswer: { ...store.getState().currentAnswer },
        pyramid: { ...initialState.pyramid, currentValue: null },
      });
    });

    it('falls to reached milestone', async () => {
      const { store, initialState } = initTest({
        partialState: {
          pyramid: {
            values: ['10 €', '50 €', '100 €'],
            milestones: ['10 €'],
            currentValue: '50 €',
            currentMilestone: '10 €',
          },
        },
        fakeCorrectAnswer: correctAnswer,
      });
      await store.dispatch(submitAnswer({ questionId, givenAnswer }));
      expect(store.getState()).toEqual({
        ...initialState,
        currentAnswer: { ...store.getState().currentAnswer },
        pyramid: { ...initialState.pyramid, currentValue: '10 €' },
      });
    });
  });

  it('stops countdown', async () => {
    const givenAnswer = 'A';
    const { store, initialState } = initTest({
      partialState: { countdown: { remainingSeconds: 2, timerId: 1234 } },
    });
    await store.dispatch(submitAnswer({ questionId, givenAnswer }));
    expect(store.getState()).toEqual({
      ...initialState,
      currentAnswer: { ...store.getState().currentAnswer },
      countdown: { remainingSeconds: initialState.countdown.remainingSeconds, timerId: null },
    });
  });
});
