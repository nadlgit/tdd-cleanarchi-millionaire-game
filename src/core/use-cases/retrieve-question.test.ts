import { StubQuestionGateway } from '../../gateways/stub-question-gateway';
import { type Question } from '../question/question';
import { type AppState, initTestStore } from '../store';
import { retrieveQuestion } from './retrieve-question';

describe('Retrieve question', () => {
  type InitTestConfig = {
    partialState?: Partial<AppState>;
    fakeQuestion?: Question;
  };
  const initTest = ({ partialState, fakeQuestion }: InitTestConfig) => {
    const questionGateway = new StubQuestionGateway();
    const store = initTestStore({
      dependencies: { questionGateway },
      initialState: partialState,
    });
    const initialState = store.getState();
    if (fakeQuestion) {
      questionGateway.setQuestion(fakeQuestion);
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
    expect(store.getState()).toEqual({ ...initialState, currentQuestion: question });
  });

  it('resets answer', async () => {
    const { store, initialState } = initTest({
      partialState: { currentAnswer: { status: 'correct', givenValue: 'A', correctValue: 'A' } },
    });
    await store.dispatch(retrieveQuestion());
    expect(store.getState()).toEqual({
      ...initialState,
      currentAnswer: { status: 'unvalidated', givenValue: null, correctValue: null },
    });
  });
});
