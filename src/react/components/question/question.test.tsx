import { Provider } from 'react-redux';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { initTestStore } from '../../../core/store';
import { applyFiftyLifeline } from '../../../core/use-cases/apply-fifty-lifeline';
import {
  InmemoryQuestionGateway,
  type QuestionPool,
} from '../../../gateways/inmemory-question-gateway';
import { StubTimerProvider } from '../../../gateways/stub-timer-provider';
import { Question } from './question';

describe('Question component', () => {
  const questionPool: QuestionPool = [
    {
      id: 'id1',
      label: 'Question Q1',
      answers: { A: 'Answer A1', B: 'Answer B1', C: 'Answer C1', D: 'Answer D1' },
      correctAnswer: 'A',
    },
    {
      id: 'id2',
      label: 'Question Q2',
      answers: { A: 'Answer A2', B: 'Answer B2', C: 'Answer C2', D: 'Answer D2' },
      correctAnswer: 'B',
    },
  ];

  const renderComponent = () => {
    const questionGateway = new InmemoryQuestionGateway(questionPool, () => 0);
    const timerProvider = new StubTimerProvider();
    const store = initTestStore({
      dependencies: { questionGateway, timerProvider, countdownSeconds: 1 },
    });
    const fakeNextTimerId = 1234;
    timerProvider.setNextTimerId(fakeNextTimerId);
    render(
      <Provider store={store}>
        <Question />
      </Provider>
    );
    return {
      tickTimer: () => timerProvider.tick(fakeNextTimerId),
      applyFiftyLifeline: () => store.dispatch(applyFiftyLifeline()),
      getFiftyLifelineResult: () => {
        const allAnswers: (keyof QuestionPool[0]['answers'])[] = ['A', 'B', 'C', 'D'];
        const remainingAnswers =
          store.getState().fiftyLifeline?.remainingAnswers ??
          ([] as (keyof QuestionPool[0]['answers'])[]);
        const eliminatedAnswers = allAnswers.filter((letter) => !remainingAnswers.includes(letter));
        return { remainingAnswers, eliminatedAnswers };
      },
    };
  };

  const getQuestionLabelElt = (question: QuestionPool[0]) => screen.getByText(question.label);

  const getAnswerElt = (question: QuestionPool[0], letter: keyof QuestionPool[0]['answers']) =>
    screen.getByRole('button', { name: new RegExp(question.answers[letter]) });

  it('displays first question', async () => {
    renderComponent();

    const expectedQuestion = questionPool[0];
    await waitFor(() => expect(getQuestionLabelElt(expectedQuestion)).toBeInTheDocument());
    expect(getAnswerElt(expectedQuestion, 'A')).toBeInTheDocument();
    expect(getAnswerElt(expectedQuestion, 'B')).toBeInTheDocument();
    expect(getAnswerElt(expectedQuestion, 'C')).toBeInTheDocument();
    expect(getAnswerElt(expectedQuestion, 'D')).toBeInTheDocument();
  });

  it('retrieves next question on correct answer', async () => {
    const user = userEvent.setup();
    renderComponent();
    await screen.findByText(questionPool[0].label);
    vi.useFakeTimers({ shouldAdvanceTime: true });
    await user.click(getAnswerElt(questionPool[0], questionPool[0].correctAnswer));
    vi.runAllTimers();
    vi.useRealTimers();

    const expectedQuestion = questionPool[1];
    await waitFor(() => expect(getQuestionLabelElt(expectedQuestion)).toBeInTheDocument());
    expect(getAnswerElt(expectedQuestion, 'A')).toBeInTheDocument();
    expect(getAnswerElt(expectedQuestion, 'B')).toBeInTheDocument();
    expect(getAnswerElt(expectedQuestion, 'C')).toBeInTheDocument();
    expect(getAnswerElt(expectedQuestion, 'D')).toBeInTheDocument();
  });

  it('initially enables answers', async () => {
    renderComponent();

    const expectedQuestion = questionPool[0];
    await waitFor(() => expect(getQuestionLabelElt(expectedQuestion)).toBeInTheDocument());
    expect(getAnswerElt(expectedQuestion, 'A')).toBeEnabled();
    expect(getAnswerElt(expectedQuestion, 'B')).toBeEnabled();
    expect(getAnswerElt(expectedQuestion, 'C')).toBeEnabled();
    expect(getAnswerElt(expectedQuestion, 'D')).toBeEnabled();
  });

  it('disables answers on answer submitted', async () => {
    const user = userEvent.setup();
    renderComponent();
    const expectedQuestion = questionPool[0];
    await screen.findByText(expectedQuestion.label);
    await user.click(getAnswerElt(expectedQuestion, 'A'));

    expect(getAnswerElt(expectedQuestion, 'A')).toBeDisabled();
    expect(getAnswerElt(expectedQuestion, 'B')).toBeDisabled();
    expect(getAnswerElt(expectedQuestion, 'C')).toBeDisabled();
    expect(getAnswerElt(expectedQuestion, 'D')).toBeDisabled();
  });

  it('disables answers on countdown expired', async () => {
    const { tickTimer } = renderComponent();
    const expectedQuestion = questionPool[0];
    await screen.findByText(expectedQuestion.label);
    act(() => {
      tickTimer();
    });

    await waitFor(() => expect(getAnswerElt(expectedQuestion, 'A')).toBeDisabled());
    expect(getAnswerElt(expectedQuestion, 'B')).toBeDisabled();
    expect(getAnswerElt(expectedQuestion, 'C')).toBeDisabled();
    expect(getAnswerElt(expectedQuestion, 'D')).toBeDisabled();
  });

  it('disables answers eliminated by 50:50 lifeline', async () => {
    const { applyFiftyLifeline, getFiftyLifelineResult } = renderComponent();
    const expectedQuestion = questionPool[0];
    await screen.findByText(expectedQuestion.label);
    await act(async () => {
      applyFiftyLifeline();
    });
    const { remainingAnswers, eliminatedAnswers } = getFiftyLifelineResult();

    expect(getAnswerElt(expectedQuestion, remainingAnswers[0])).toBeEnabled();
    expect(getAnswerElt(expectedQuestion, remainingAnswers[1])).toBeEnabled();
    expect(getAnswerElt(expectedQuestion, eliminatedAnswers[0])).toBeDisabled();
    expect(getAnswerElt(expectedQuestion, eliminatedAnswers[1])).toBeDisabled();
  });
});
