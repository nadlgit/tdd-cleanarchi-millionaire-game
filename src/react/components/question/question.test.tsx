import { Provider } from 'react-redux';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { initTestStore } from '../../../core/store';
import { Question } from './question';
import {
  InmemoryQuestionGateway,
  type QuestionPool,
} from '../../../gateways/inmemory-question-gateway';

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
    const store = initTestStore({ dependencies: { questionGateway } });
    render(
      <Provider store={store}>
        <Question />
      </Provider>
    );
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
});