/**
 * Catalogue éditorial léger utilisé par l'accueil, la recherche et les routes
 * de cours. Le contenu détaillé reste séparé dans les chapitres pédagogiques.
 */
import { getCourseLessons } from './lessons/course-index.js';

function lessonCountsFor(courseId) {
  const lessons = getCourseLessons(courseId);
  return {
    'Débutant': lessons.filter((lesson) => lesson.level === 'Débutant').length,
    'Intermédiaire': lessons.filter((lesson) => lesson.level === 'Intermédiaire').length,
    'Avancé': lessons.filter((lesson) => lesson.level === 'Avancé').length
  };
}

export const learningPaths = [
  {
    id: 'html',
    title: 'HTML',
    subtitle: 'La structure du Web',
    description: 'Organise le contenu de tes pages avec des éléments sémantiques, des liens, des images et des formulaires accessibles.',
    color: '#b84f2c',
    symbol: 'H',
    lessonCount: getCourseLessons('html').length,
    lessonCounts: lessonCountsFor('html'),
    referenceUrl: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Structuring_content',
    topics: ['éléments', 'balises', 'attributs', 'titres', 'paragraphes', 'liens', 'images', 'listes', 'sémantique', 'formulaires', 'tableaux', 'métadonnées'],
    outcomes: ['Écrire une page HTML bien structurée', 'Choisir des éléments selon leur sens', 'Créer des formulaires plus accessibles']
  },
  {
    id: 'css',
    title: 'CSS',
    subtitle: 'Le style et la mise en page',
    description: 'Travaille les couleurs, la typographie et les mises en page flexibles, puis adapte tes interfaces aux différentes tailles d’écran.',
    color: '#2569a8',
    symbol: '✳',
    lessonCount: getCourseLessons('css').length,
    lessonCounts: lessonCountsFor('css'),
    referenceUrl: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Styling_basics',
    topics: ['sélecteurs', 'couleurs', 'typographie', 'margin', 'padding', 'box model', 'flexbox', 'grid', 'responsive', 'cascade', 'animations', 'variables'],
    outcomes: ['Créer une mise en page avec Flexbox et Grid', 'Comprendre la cascade et la spécificité', 'Rendre une page responsive']
  },
  {
    id: 'javascript',
    legacyId: 'js',
    title: 'JavaScript',
    subtitle: 'Le comportement et les interactions',
    description: 'Apprends les bases du langage, manipule le DOM et réagis aux actions de la personne qui utilise la page.',
    color: '#956e11',
    symbol: 'JS',
    lessonCount: getCourseLessons('javascript').length,
    lessonCounts: lessonCountsFor('javascript'),
    referenceUrl: 'https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Scripting',
    topics: ['variables', 'types', 'fonctions', 'conditions', 'boucles', 'tableaux', 'objets', 'DOM', 'événements', 'promesses', 'modules'],
    outcomes: ['Écrire des fonctions et utiliser des tableaux', 'Mettre à jour une page avec le DOM', 'Réagir aux événements du navigateur']
  }
];

export function getLearningPath(id) {
  return learningPaths.find((path) => path.id === id);
}

function normalizeText(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr');
}

export function searchLearningPaths(query) {
  const normalizedQuery = normalizeText(query.trim());
  if (!normalizedQuery) return [];

  return learningPaths
    .map((path) => {
      const searchableText = normalizeText([
        path.title,
        path.subtitle,
        path.description,
        ...path.topics,
        ...path.outcomes
      ].join(' '));

      return searchableText.includes(normalizedQuery) ? path : null;
    })
    .filter(Boolean);
}
