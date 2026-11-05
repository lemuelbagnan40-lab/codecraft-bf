/** Évalue des réponses simples sans exécuter le code de l'apprenant. */
export function validateExercise(exercise, answer) {
  if (exercise.type === 'multiple-choice') {
    return answer === exercise.correctOptionId;
  }

  const response = String(answer ?? '').trim().toLocaleLowerCase('fr');

  if (exercise.type === 'short-answer') {
    const normalizedAnswers = exercise.acceptedAnswers.map((item) => item.trim().toLocaleLowerCase('fr'));
    return normalizedAnswers.includes(response);
  }

  if (exercise.type === 'code') {
    const source = String(answer ?? '').toLocaleLowerCase('fr');
    return exercise.requiredSnippets.every((snippet) => source.includes(snippet.toLocaleLowerCase('fr')));
  }

  return false;
}
