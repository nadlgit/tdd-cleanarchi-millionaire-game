import { useEffect } from 'react';
import { retrieveQuestion } from '../../../core/use-cases/retrieve-question';
import { useAppDispatch } from '../../store/use-app-dispatch';
import { useAppSelector } from '../../store/use-app-selector';
import { selectQuestionView } from './select-question-view';
import jfoucault from './jfoucault.jpeg';

export const Question = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(retrieveQuestion());
  }, [dispatch]);
  const { questionLabel, answers } = useAppSelector(selectQuestionView);
  return (
    <div className="question">
      <img className="question-image" src={jfoucault} alt="Jean-Pierre Foucault" />
      <div className="countdown">00:59</div>
      <div className="question-wrapper">
        <div className="question-label">{questionLabel}</div>
        <div className="answers">
          {answers.map(({ letter, label, status }) => (
            <button key={letter} className={'answer' + (status ? ` answer-${status}` : '')}>
              <span className="answer-letter">{`${letter}:`}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
