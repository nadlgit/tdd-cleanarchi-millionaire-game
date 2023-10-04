import countdown from '../countdown/countdown-slice';
import gameStatus from '../game-status/game-status-slice';
import pyramid from '../pyramid/pyramid-slice';
import currentAnswer from '../question/current-answer-slice';
import currentQuestion from '../question/current-question-slice';
import fiftyLifeline from '../question/fifty-lifeline-slice';

export const rootReducer = {
  currentQuestion,
  currentAnswer,
  pyramid,
  countdown,
  gameStatus,
  fiftyLifeline,
};
