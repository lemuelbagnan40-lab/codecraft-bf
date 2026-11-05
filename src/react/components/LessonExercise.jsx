import { useState } from 'react';
import './LessonExercise.css';

export default function LessonExercise({ exercise, result = null, onCheck }) {
  const [answer, setAnswer] = useState('');
  const [hintVisible, setHintVisible] = useState(false);

  function checkAnswer() {
    onCheck(answer);
  }

  return (
    <article className="exercise-card">
      <div className="exercise-header">
        <span className="exercise-number">{exercise.level}</span>
        <div>
          <span className="exercise-meta">
            {exercise.type === 'multiple-choice' ? 'QCM' : exercise.type === 'code' ? 'Code' : 'Réponse courte'} · {exercise.level}
          </span>
          <h3>{exercise.prompt}</h3>
        </div>
      </div>
      {exercise.type === 'multiple-choice' ? (
        <fieldset>
          <legend>Choisis une réponse</legend>
          {exercise.options.map((option) => (
            <label className={answer === option.id ? 'chosen' : ''} key={option.id}>
              <input
                type="radio"
                name={exercise.id}
                value={option.id}
                checked={answer === option.id}
                onChange={(event) => setAnswer(event.target.value)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </fieldset>
      ) : exercise.type === 'short-answer' ? (
        <>
          <label className="answer-label" htmlFor={`${exercise.id}-answer`}>Ta réponse</label>
          <input
            className="text-answer"
            id={`${exercise.id}-answer`}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Écris ta réponse ici"
            onKeyDown={(event) => event.key === 'Enter' && checkAnswer()}
          />
        </>
      ) : (
        <>
          <label className="answer-label" htmlFor={`${exercise.id}-answer`}>Ton code</label>
          <textarea
            className="code-answer"
            id={`${exercise.id}-answer`}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Écris ton code ici"
            spellCheck="false"
          />
        </>
      )}
      <div className="exercise-actions">
        <button className="check-button" type="button" onClick={checkAnswer}>Vérifier ma réponse</button>
        <button
          className="hint-button"
          type="button"
          aria-expanded={hintVisible}
          onClick={() => setHintVisible((visible) => !visible)}
        >
          {hintVisible ? 'Masquer l’indice' : 'Besoin d’un indice ?'}
        </button>
      </div>
      {hintVisible && <p className="hint" role="note"><strong>Indice :</strong> {exercise.hint}</p>}
      {result !== null && (
        <>
          <p className={`feedback${result ? ' success' : ''}`} role="status">
            {result ? 'Bonne réponse !' : 'Ce n’est pas encore ça. Relis l’explication puis réessaie.'} {exercise.explanation}
          </p>
          <details className="solution">
            <summary>Voir la correction détaillée</summary>
            <p>{exercise.explanation}</p>
          </details>
        </>
      )}
    </article>
  );
}
