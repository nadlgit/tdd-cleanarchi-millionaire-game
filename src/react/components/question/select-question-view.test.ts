import { initTestStore } from '../../../core/store';
import { selectQuestionView } from './select-question-view';

describe('Question view selector', () => {
  it('gets question view', () => {
    const question = {
      id: 'id1',
      label: 'Question?',
      answers: { A: 'Answer A', B: 'Answer B', C: 'Answer C', D: 'Answer D' },
    };
    const store = initTestStore({ initialState: { currentQuestion: question } });
    const questionView = selectQuestionView(store.getState());
    expect(questionView).toEqual({
      questionId: question.id,
      questionLabel: question.label,
      answers: [
        { letter: 'A', label: question.answers['A'], status: undefined },
        { letter: 'B', label: question.answers['B'], status: undefined },
        { letter: 'C', label: question.answers['C'], status: undefined },
        { letter: 'D', label: question.answers['D'], status: undefined },
      ],
    });
  });
});
