import { error } from '@sveltejs/kit';
import { detailedLessons } from '$lib/data/lessons/course-index.js';
import { courseCurricula } from '$lib/data/lessons/course-index.js';

export function load({ params }) {
  const lesson = detailedLessons.find((item) => item.courseId === params.id && item.slug === params.slug);
  if (!lesson) error(404, 'Leçon introuvable.');

  const courseLessons = detailedLessons.filter((item) => item.courseId === params.id);
  const index = courseLessons.findIndex((item) => item.id === lesson.id);
  const curriculum = courseCurricula.find((item) => item.id === params.id);
  return {
    lesson,
    previous: courseLessons[index - 1] ?? null,
    next: courseLessons[index + 1] ?? null,
    modules: curriculum.modules.filter((module) => !module.id.startsWith('legacy-')),
    lessonNumber: index + 1,
    totalLessons: courseLessons.length
  };
}
