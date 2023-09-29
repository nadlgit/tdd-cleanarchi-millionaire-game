import jfoucault from './jfoucault.jpeg';

export const Question = () => (
  <div className="question">
    <img className="question-image" src={jfoucault} alt="Jean-Pierre Foucault" />
    <div className="countdown">00:59</div>
    <div className="question-wrapper">
      <div className="question-label">{"Qu'est-ce que le TDD ?"}</div>
      <div className="answers">
        <Answer letter="A" label="Une technique de développement" />
        <Answer letter="B" label="Une pratique de CSS" />
        <Answer letter="C" label="Un langage de programmation" />
        <Answer letter="D" label="Une pratique de gestion de projet" />
      </div>
    </div>
  </div>
);

const Answer = ({
  letter,
  label,
  status,
}: {
  letter: string;
  label: string;
  status?: 'selected' | 'correct';
}) => (
  <button className={'answer' + (status ? ` answer-${status}` : '')}>
    <span className="answer-letter">{`${letter}:`}</span>
    <span>{label}</span>
  </button>
);
