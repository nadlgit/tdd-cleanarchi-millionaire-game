import { type AnswerLetter, type Question } from '../core/question/question';
import { type QuestionGateway } from '../core/question/question-gateway';

export class StubQuestionGateway implements QuestionGateway {
  private _question?: Question;
  private _answer: Record<Question['id'], AnswerLetter> = {};

  async loadNext(): Promise<Question> {
    return this._question!;
  }

  async getCorrectAnswer(questionId: Question['id']): Promise<AnswerLetter> {
    return this._answer[questionId];
  }

  setQuestion(question: Question, correctAnswer?: AnswerLetter) {
    this._question = question;
    if (correctAnswer) {
      this._answer[question.id] = correctAnswer;
    }
  }
}
