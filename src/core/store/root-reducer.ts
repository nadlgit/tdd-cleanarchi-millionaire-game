import countdown from '../countdown/countdown-slice';
import pyramid from '../pyramid/pyramid-slice';
import currentAnswer from '../question/current-answer-slice';
import currentQuestion from '../question/current-question-slice';

export const rootReducer = { currentQuestion, currentAnswer, pyramid, countdown };
