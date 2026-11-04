import { error } from '@sveltejs/kit';
import { getLearningPath } from '$lib/data/catalog.js';
import { courseCurricula, detailedLessons } from '$lib/data/lessons/course-index.js';

export function load({ params }) {
  const path = getLearningPath(params.id);
  if (!path) error(404, 'Ce parcours n’existe pas.');
  const curriculum = courseCurricula.find((course) => course.id === params.id);
  const lessons = detailedLessons.filter((lesson) => lesson.courseId === params.id);
  const lessonCounts = Object.fromEntries(['Débutant', 'Intermédiaire', 'Avancé'].map((level) => [level, lessons.filter((lesson) => lesson.level === level).length]));
  const legacyLessons = curriculum.modules.find((module) => module.id.startsWith('legacy-'))?.lessons ?? [];
  const legacyLessonCounts = Object.fromEntries(['Débutant', 'Intermédiaire', 'Avancé'].map((level) => [level, legacyLessons.filter((lesson) => lesson.level === level).length]));
  return { path, modules: curriculum.modules.filter((module) => !module.id.startsWith('legacy-')), lessons, lessonCounts, detailedLessonCount: lessons.length, legacyLessonCounts, legacyLessons };
}
