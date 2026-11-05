import { courses as legacyCourses } from '../legacy-courses.js';
import { cssCourse, cssLessons, cssModules } from './css.js';
import { htmlLessons } from './html.js';
import { javascriptCourse, javascriptLessons, javascriptModules } from './javascript.js';

const slugify = (value) => value
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-|-$/g, '');

const htmlModuleNames = [
  { id: 'html-foundations', title: '1. Structure et éléments HTML', lessonIds: ['structure-document', 'elements-attributs'] },
  { id: 'html-semantics', title: '2. Sémantique et accessibilité', lessonIds: ['titres-semantique'] }
];

for (const lesson of htmlLessons) {
  const module = htmlModuleNames.find((item) => item.lessonIds.includes(lesson.id)) ?? htmlModuleNames[0];
  lesson.moduleId = module.id;
  lesson.moduleTitle = module.title;
  lesson.keywords = [lesson.title, lesson.level, ...lesson.objectives];
  lesson.related = lesson.related ?? [];
}

export const detailedLessons = [...htmlLessons, ...cssLessons, ...javascriptLessons];

export const legacyLessons = legacyCourses.flatMap((course) => {
  const courseId = course.id === 'js' ? 'javascript' : course.id;
  return course.lessons.map((lesson, index) => ({
    id: `legacy:${courseId}:${slugify(lesson.title)}`,
    slug: slugify(lesson.title),
    legacyId: `${course.id}:${lesson.title}`,
    legacyCourseId: course.id,
    legacyIndex: index,
    courseId,
    title: lesson.title,
    introduction: lesson.intro,
    explanation: lesson.concept,
    level: lesson.level,
    duration: lesson.duration,
    code: lesson.code,
    task: lesson.task,
    moduleId: `legacy-${courseId}`,
    moduleTitle: 'Ateliers interactifs',
    keywords: [course.name, lesson.title, lesson.level, lesson.intro, lesson.concept, lesson.task],
    related: [],
    type: 'legacy-lesson'
  }));
});

export const allLessons = [...detailedLessons, ...legacyLessons];

function modulesFor(courseId, title, moduleSource, lessons) {
  const detailedModules = moduleSource.map((module) => ({
    id: module.id,
    title: module.title,
    lessons: lessons.filter((lesson) => lesson.moduleId === module.id)
  }));
  const legacy = lessons.filter((lesson) => lesson.type === 'legacy-lesson' && lesson.courseId === courseId);
  if (legacy.length) detailedModules.push({ id: `legacy-${courseId}`, title: 'Ateliers interactifs existants', lessons: legacy });
  return { id: courseId, title, modules: detailedModules.filter((module) => module.lessons.length) };
}

const htmlModules = htmlModuleNames.map((module) => ({ id: module.id, title: module.title }));
export const courseCurricula = [
  modulesFor('html', 'HTML', htmlModules, allLessons.filter((lesson) => lesson.courseId === 'html')),
  modulesFor('css', 'CSS', cssModules, allLessons.filter((lesson) => lesson.courseId === 'css')),
  modulesFor('javascript', 'JavaScript', javascriptModules, allLessons.filter((lesson) => lesson.courseId === 'javascript'))
];

export function getDetailedLesson(courseId, slug) {
  return detailedLessons.find((lesson) => lesson.courseId === courseId && lesson.slug === slug);
}

export function getCourseLessons(courseId) {
  return allLessons.filter((lesson) => lesson.courseId === courseId);
}

export function getLessonCount(courseId) {
  return getCourseLessons(courseId).length;
}

export function getLegacyLessonId(courseId, title) {
  const canonicalCourseId = courseId === 'js' ? 'javascript' : courseId;
  return `legacy:${canonicalCourseId}:${slugify(title)}`;
}
