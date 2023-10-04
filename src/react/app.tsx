import { useEffect } from 'react';
import { createSelector } from '@reduxjs/toolkit';
import { type AppState } from '../core/store';
import { Lifelines } from './components/lifelines/lifelines';
import { Pyramid } from './components/pyramid/pyramid';
import { Question } from './components/question/question';
import { useAppSelector } from './store/use-app-selector';

const selectGameEndedView = createSelector(
  [(state: AppState) => state.gameStatus, (state: AppState) => state.pyramid],
  (gameStatus, pyramid) => {
    switch (gameStatus) {
      case 'VICTORY':
      case 'GAME_OVER':
        return {
          isEnded: true,
          message: `Terminé, votre gain est ${pyramid.currentValue ?? '0 €'}`,
        };
      default:
        return { isEnded: false };
    }
  }
);

const App = () => {
  const { isEnded, message } = useAppSelector(selectGameEndedView);
  useEffect(() => {
    if (isEnded) {
      setTimeout(() => {
        window.alert(message);
      }, 200);
    }
  }, [isEnded, message]);
  return (
    <main>
      <h1>Qui veut gagner des millions ?</h1>
      <div className="app-zone">
        <div className="main-zone">
          <Question />
        </div>
        <div className="side-zone">
          <Lifelines />
          <Pyramid />
        </div>
      </div>
    </main>
  );
};

export default App;
