import { useEffect } from 'react';
import { type AnswerLetter } from '../../../core/question/question';
import { retrieveQuestion } from '../../../core/use-cases/retrieve-question';
import { submitAnswer } from '../../../core/use-cases/submit-answer';
import { useAppDispatch } from '../../store/use-app-dispatch';
import { useAppSelector } from '../../store/use-app-selector';
import { selectQuestionView } from './select-question-view';
import jfoucault from './jfoucault.jpeg';

export const Question = () => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(retrieveQuestion());
  }, [dispatch]);
  const isCorrectAnswer = useAppSelector((state) => state.currentAnswer.status === 'correct');
  useEffect(() => {
    if (isCorrectAnswer) {
      const timeoutId = setTimeout(() => {
        dispatch(retrieveQuestion());
      }, 1500);
      return () => clearTimeout(timeoutId);
    }
  }, [dispatch, isCorrectAnswer]);
  const { questionId, questionLabel, answers } = useAppSelector(selectQuestionView);
  return (
    <div className="question">
      <img className="question-image" src={jfoucault} alt="Jean-Pierre Foucault" />
      <div className="countdown">00:59</div>
      <div className="question-wrapper">
        <div className="question-label">{questionLabel}</div>
        <div className="answers">
          {answers.map(({ letter, label, status }) => (
            <button
              key={letter}
              className={'answer' + (status ? ` answer-${status}` : '')}
              onClick={() =>
                dispatch(submitAnswer({ questionId, givenAnswer: letter as AnswerLetter }))
              }
            >
              <span className="answer-letter">{`${letter}:`}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
