import { StubQuestionGateway } from '../../gateways/stub-question-gateway';
import { type GameStatus } from '../game-status/game-status';
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
    questionGateway.setQuestion({
      question: {
        id: questionId,
        label: 'Question?',
        answers: { A: 'Answer A', B: 'Answer B', C: 'Answer C', D: 'Answer D' },
      },
      correctAnswer: fakeCorrectAnswer,
    });
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
      pyramid: store.getState().pyramid,
      gameStatus: store.getState().gameStatus,
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
        pyramid: store.getState().pyramid,
        gameStatus: store.getState().gameStatus,
      });
    }
  );

  describe('updates pyramid', () => {
    it('climbs on first correct answer', async () => {
      const correctAnswer = 'A';
      const givenAnswer = correctAnswer;
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
        currentAnswer: store.getState().currentAnswer,
        pyramid: { ...initialState.pyramid, currentValue: '10 €' },
        gameStatus: store.getState().gameStatus,
      });
    });

    it('climbs on further correct answer', async () => {
      const correctAnswer = 'A';
      const givenAnswer = correctAnswer;
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
        currentAnswer: store.getState().currentAnswer,
        pyramid: { ...initialState.pyramid, currentValue: '50 €' },
        gameStatus: store.getState().gameStatus,
      });
    });

    it('sets milestone if reached on correct answer', async () => {
      const correctAnswer = 'A';
      const givenAnswer = correctAnswer;
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
        currentAnswer: store.getState().currentAnswer,
        pyramid: { ...initialState.pyramid, currentValue: '50 €', currentMilestone: '50 €' },
        gameStatus: store.getState().gameStatus,
      });
    });

    it('falls to bottom if no milestone reached on wrong answer', async () => {
      const correctAnswer = 'A';
      const givenAnswer = 'B';
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
        currentAnswer: store.getState().currentAnswer,
        pyramid: { ...initialState.pyramid, currentValue: null },
        gameStatus: store.getState().gameStatus,
      });
    });

    it('falls to reached milestone on wrong answer', async () => {
      const correctAnswer = 'A';
      const givenAnswer = 'B';
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
        currentAnswer: store.getState().currentAnswer,
        pyramid: { ...initialState.pyramid, currentValue: '10 €' },
        gameStatus: store.getState().gameStatus,
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
      currentAnswer: store.getState().currentAnswer,
      countdown: { remainingSeconds: initialState.countdown.remainingSeconds, timerId: null },
      gameStatus: store.getState().gameStatus,
    });
  });

  describe('handles game status', async () => {
    it.each<GameStatus>(['GAME_OVER', 'VICTORY'])(
      'does nothing if not playing: %s',
      async (gameStatus) => {
        const givenAnswer = 'A';
        const { store, initialState } = initTest({ partialState: { gameStatus } });
        await store.dispatch(submitAnswer({ questionId, givenAnswer }));
        expect(store.getState()).toEqual(initialState);
      }
    );

    it('sets game over on wrong answer', async () => {
      const correctAnswer = 'A';
      const givenAnswer = 'B';
      const { store, initialState } = initTest({
        partialState: { gameStatus: 'PLAYING' },
        fakeCorrectAnswer: correctAnswer,
      });
      await store.dispatch(submitAnswer({ questionId, givenAnswer }));
      expect(store.getState()).toEqual({
        ...initialState,
        currentAnswer: store.getState().currentAnswer,
        pyramid: store.getState().pyramid,
        gameStatus: 'GAME_OVER',
      });
    });

    it('sets victory on correct answer to last question', async () => {
      const correctAnswer = 'A';
      const givenAnswer = correctAnswer;
      const { store, initialState } = initTest({
        partialState: {
          pyramid: {
            values: ['10 €', '50 €', '100 €'],
            milestones: [],
            currentValue: '50 €',
            currentMilestone: null,
          },
          gameStatus: 'PLAYING',
        },
        fakeCorrectAnswer: correctAnswer,
      });
      await store.dispatch(submitAnswer({ questionId, givenAnswer }));
      expect(store.getState()).toEqual({
        ...initialState,
        currentAnswer: store.getState().currentAnswer,
        pyramid: store.getState().pyramid,
        gameStatus: 'VICTORY',
      });
    });

    it('keeps playing on correct answer to not last question', async () => {
      const correctAnswer = 'A';
      const givenAnswer = correctAnswer;
      const { store, initialState } = initTest({
        partialState: {
          pyramid: {
            values: ['10 €', '50 €', '100 €'],
            milestones: [],
            currentValue: '10 €',
            currentMilestone: null,
          },
          gameStatus: 'PLAYING',
        },
        fakeCorrectAnswer: correctAnswer,
      });
      await store.dispatch(submitAnswer({ questionId, givenAnswer }));
      expect(store.getState()).toEqual({
        ...initialState,
        currentAnswer: store.getState().currentAnswer,
        pyramid: store.getState().pyramid,
        gameStatus: initialState.gameStatus,
      });
    });
  });
});
