import { setGameOver, setVictory } from '../game-status/game-status-slice';
import { validateAnswer } from '../question/current-answer-slice';
import { type AppStartListening } from '../store';

export const validateAnswerListener = (startAppListening: AppStartListening) =>
  startAppListening({
    actionCreator: validateAnswer,
    effect: (_, { dispatch, getState }) => {
      const { currentAnswer, pyramid } = getState();
      switch (currentAnswer.status) {
        case 'wrong':
          dispatch(setGameOver());
          break;
        case 'correct':
          if (pyramid.currentValue === pyramid.values[pyramid.values.length - 1]) {
            dispatch(setVictory());
          }
          break;
      }
    },
  });
