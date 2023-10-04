import { type AnswerLetter, type Question } from '../core/question/question';
import { type QuestionGateway } from '../core/question/question-gateway';

export class StubQuestionGateway implements QuestionGateway {
  private _question?: Question;
  private _answer: Record<Question['id'], AnswerLetter> = {};
  private _fiftyLifelineOtherAnswer: Record<Question['id'], AnswerLetter> = {};

  async loadNext(): Promise<Question> {
    return this._question!;
  }

  async getCorrectAnswer(questionId: Question['id']): Promise<AnswerLetter> {
    return this._answer[questionId];
  }

  async getFiftyLifelineResult(questionId: Question['id']): Promise<[AnswerLetter, AnswerLetter]> {
    return [this._answer[questionId], this._fiftyLifelineOtherAnswer[questionId]];
  }

  setQuestion({
    question,
    correctAnswer,
    fiftyLifelineOtherAnswer,
  }: {
    question: Question;
    correctAnswer?: AnswerLetter;
    fiftyLifelineOtherAnswer?: AnswerLetter;
  }) {
    this._question = question;
    if (correctAnswer) {
      this._answer[question.id] = correctAnswer;
    }
    if (fiftyLifelineOtherAnswer) {
      this._fiftyLifelineOtherAnswer[question.id] = fiftyLifelineOtherAnswer;
    }
  }
}
