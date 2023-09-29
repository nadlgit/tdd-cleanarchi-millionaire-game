import { type Question } from '../core/question/question';
import { type QuestionGateway } from '../core/question/question-gateway';

export class StubQuestionGateway implements QuestionGateway {
  private _question?: Question;

  async loadNext(): Promise<Question> {
    return this._question!;
  }

  setQuestion(question: Question) {
    this._question = question;
  }
}
