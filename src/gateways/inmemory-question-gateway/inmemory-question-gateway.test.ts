import { type AnswerLetter } from '../../core/question/question';
import { InmemoryQuestionGateway } from './inmemory-question-gateway';
import { type QuestionPool } from './question-pool';

describe('In memory question gateway', () => {
  const questionPool: QuestionPool = [
    {
      id: 'id1',
      label: 'Question 1?',
      answers: { A: 'Answer A1', B: 'Answer B1', C: 'Answer C1', D: 'Answer D1' },
      correctAnswer: 'A',
    },
    {
      id: 'id2',
      label: 'Question 2?',
      answers: { A: 'Answer A2', B: 'Answer B2', C: 'Answer C2', D: 'Answer D2' },
      correctAnswer: 'B',
    },
    {
      id: 'id3',
      label: 'Question 3?',
      answers: { A: 'Answer A3', B: 'Answer B3', C: 'Answer C3', D: 'Answer D3' },
      correctAnswer: 'C',
    },
  ];

  it('loads a question from the pool', async () => {
    const indexProvider = () => 0;
    const questionGateway = new InmemoryQuestionGateway(questionPool, indexProvider);
    const question = await questionGateway.loadNext();
    expect(questionPool).toContainEqual(question);
  });

  it('picks question according to index provider', async () => {
    const index = questionPool.length - 1;
    const indexProvider = () => index;
    const questionGateway = new InmemoryQuestionGateway(questionPool, indexProvider);
    const question = await questionGateway.loadNext();
    expect(question).toEqual(questionPool[index]);
  });

  it('picks a different question each time', async () => {
    const indexProvider = () => 0;
    const questionGateway = new InmemoryQuestionGateway(questionPool, indexProvider);
    const question1 = await questionGateway.loadNext();
    const question2 = await questionGateway.loadNext();
    const question3 = await questionGateway.loadNext();
    expect(question1).not.toEqual(question2);
    expect(question1).not.toEqual(question3);
    expect(question2).not.toEqual(question3);
  });

  it('loops over pool when its size is reached', async () => {
    const indexProvider = () => 0;
    const questionGateway = new InmemoryQuestionGateway(questionPool, indexProvider);
    for (let i = 0; i < questionPool.length; i++) {
      await questionGateway.loadNext();
    }
    const question = await questionGateway.loadNext();
    expect(questionPool).toContainEqual(question);
  });

  it('gets correct answer', async () => {
    const question = questionPool[0];
    const indexProvider = () => 0;
    const questionGateway = new InmemoryQuestionGateway([question], indexProvider);
    const correctAnswer = await questionGateway.getCorrectAnswer(question.id);
    expect(correctAnswer).toEqual(question.correctAnswer);
  });

  describe('gets 50:50 lifeline result', () => {
    it('gets correct answer and 1 wrong answer', async () => {
      const question = questionPool[0];
      const indexProvider = () => 0;
      const questionGateway = new InmemoryQuestionGateway([question], indexProvider);
      const fiftyLifelineResult = await questionGateway.getFiftyLifelineResult(question.id);
      expect(fiftyLifelineResult).toHaveLength(2);
      expect(fiftyLifelineResult[1]).not.toEqual(fiftyLifelineResult[0]);
      expect(fiftyLifelineResult).toContain(question.correctAnswer);
    });

    it.each<AnswerLetter>(['A', 'D'])(
      'sorts answers alphabetically : correct answer %s',
      async (correctAnswer) => {
        const question: QuestionPool[0] = {
          id: 'id1',
          label: 'Question 1?',
          answers: { A: 'Answer A1', B: 'Answer B1', C: 'Answer C1', D: 'Answer D1' },
          correctAnswer,
        };
        const indexProvider = () => 0;
        const questionGateway = new InmemoryQuestionGateway([question], indexProvider);
        const fiftyLifelineResult = await questionGateway.getFiftyLifelineResult(question.id);
        expect(fiftyLifelineResult[1].charCodeAt(0)).toBeGreaterThan(
          fiftyLifelineResult[0].charCodeAt(0)
        );
      }
    );
  });
});
