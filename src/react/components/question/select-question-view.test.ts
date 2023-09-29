import { type AnswerLetter } from '../../../core/question/question';
import { initTestStore } from '../../../core/store';
import { selectQuestionView } from './select-question-view';

describe('Question view selector', () => {
  const question = {
    id: 'id1',
    label: 'Question?',
    answers: { A: 'Answer A', B: 'Answer B', C: 'Answer C', D: 'Answer D' },
  };

  const expectedQuestionView = (
    expectedStatus: Record<AnswerLetter, undefined | 'selected' | 'correct'>
  ) => ({
    questionId: question.id,
    questionLabel: question.label,
    answers: [
      { letter: 'A', label: question.answers['A'], status: expectedStatus['A'] },
      { letter: 'B', label: question.answers['B'], status: expectedStatus['B'] },
      { letter: 'C', label: question.answers['C'], status: expectedStatus['C'] },
      { letter: 'D', label: question.answers['D'], status: expectedStatus['D'] },
    ],
  });

  it('gets question view for unanswered question', () => {
    const store = initTestStore({
      initialState: {
        currentQuestion: question,
        currentAnswer: { status: 'unvalidated', givenValue: null, correctValue: null },
      },
    });
    const questionView = selectQuestionView(store.getState());
    expect(questionView).toEqual(
      expectedQuestionView({ A: undefined, B: undefined, C: undefined, D: undefined })
    );
  });

  it('gets question view for submitted answer', () => {
    const store = initTestStore({
      initialState: {
        currentQuestion: question,
        currentAnswer: { status: 'unvalidated', givenValue: 'A', correctValue: null },
      },
    });
    const questionView = selectQuestionView(store.getState());
    expect(questionView).toEqual(
      expectedQuestionView({ A: 'selected', B: undefined, C: undefined, D: undefined })
    );
  });

  it('gets question view for correct answer', () => {
    const store = initTestStore({
      initialState: {
        currentQuestion: question,
        currentAnswer: { status: 'correct', givenValue: 'A', correctValue: 'A' },
      },
    });
    const questionView = selectQuestionView(store.getState());
    expect(questionView).toEqual(
      expectedQuestionView({ A: 'correct', B: undefined, C: undefined, D: undefined })
    );
  });

  it('gets question view for wrong answer', () => {
    const store = initTestStore({
      initialState: {
        currentQuestion: question,
        currentAnswer: { status: 'wrong', givenValue: 'A', correctValue: 'B' },
      },
    });
    const questionView = selectQuestionView(store.getState());
    expect(questionView).toEqual(
      expectedQuestionView({ A: 'selected', B: 'correct', C: undefined, D: undefined })
    );
  });
});
