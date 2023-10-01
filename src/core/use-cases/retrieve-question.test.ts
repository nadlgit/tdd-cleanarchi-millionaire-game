import { StubQuestionGateway } from '../../gateways/stub-question-gateway';
import { StubTimerProvider } from '../../gateways/stub-timer-provider';
import { type Question } from '../question/question';
import { type AppState, initTestStore } from '../store';
import { retrieveQuestion } from './retrieve-question';

describe('Retrieve question', () => {
  type InitTestConfig = {
    partialState?: Partial<AppState>;
    fakeQuestion?: Question;
    fakeCountdownSeconds?: number;
    fakeNextTimerId?: number;
  };
  const initTest = ({
    partialState,
    fakeQuestion,
    fakeCountdownSeconds,
    fakeNextTimerId,
  }: InitTestConfig) => {
    const questionGateway = new StubQuestionGateway();
    const timerProvider = new StubTimerProvider();
    const store = initTestStore({
      dependencies:
        fakeCountdownSeconds || fakeCountdownSeconds === 0
          ? { questionGateway, timerProvider, countdownSeconds: fakeCountdownSeconds }
          : { questionGateway, timerProvider },
      initialState: partialState,
    });
    const initialState = store.getState();
    if (fakeQuestion) {
      questionGateway.setQuestion(fakeQuestion);
    }
    if (fakeNextTimerId) {
      timerProvider.setNextTimerId(fakeNextTimerId);
    }
    return { store, initialState };
  };

  const question: Question = {
    id: 'id1',
    label: 'Question?',
    answers: { A: 'Answer A', B: 'Answer B', C: 'Answer C', D: 'Answer D' },
  };

  it('retrieves a question from the pool', async () => {
    const { store, initialState } = initTest({
      partialState: { currentQuestion: null },
      fakeQuestion: question,
    });
    await store.dispatch(retrieveQuestion());
    expect(store.getState()).toEqual({
      ...initialState,
      currentQuestion: question,
      countdown: store.getState().countdown,
    });
  });

  it('resets answer', async () => {
    const { store, initialState } = initTest({
      partialState: { currentAnswer: { status: 'correct', givenValue: 'A', correctValue: 'A' } },
    });
    await store.dispatch(retrieveQuestion());
    expect(store.getState()).toEqual({
      ...initialState,
      currentAnswer: { status: 'unvalidated', givenValue: null, correctValue: null },
      countdown: store.getState().countdown,
    });
  });

  it('starts countdown', async () => {
    const fakeCountdownSeconds = 10;
    const fakeNextTimerId = 1234;
    const { store, initialState } = initTest({
      partialState: { countdown: { remainingSeconds: 0, timerId: null } },
      fakeCountdownSeconds,
      fakeNextTimerId,
    });
    await store.dispatch(retrieveQuestion());
    expect(store.getState()).toEqual({
      ...initialState,
      countdown: { remainingSeconds: fakeCountdownSeconds, timerId: fakeNextTimerId },
    });
  });
});
