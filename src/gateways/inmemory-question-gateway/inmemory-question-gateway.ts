import { type AnswerLetter, type Question } from '../../core/question/question';
import { type QuestionGateway } from '../../core/question/question-gateway';
import { type ArrayIndexProvider } from './array-index-provider';
import { type QuestionPool } from './question-pool';

export class InmemoryQuestionGateway implements QuestionGateway {
  private _remainingQuestionPool = [...this._questionPool];

  constructor(
    private readonly _questionPool: QuestionPool,
    private readonly _indexProvider: ArrayIndexProvider
  ) {}

  async loadNext(): Promise<Question> {
    const index = this._indexProvider(this._remainingQuestionPool.length);
    const question = this._remainingQuestionPool[index];
    this._remainingQuestionPool =
      this._remainingQuestionPool.length > 1
        ? this._remainingQuestionPool.filter((item) => item !== question)
        : [...this._questionPool];
    return question;
  }

  async getCorrectAnswer(questionId: Question['id']): Promise<AnswerLetter> {
    return this._questionPool.find(({ id }) => id === questionId)!.correctAnswer;
  }
}
