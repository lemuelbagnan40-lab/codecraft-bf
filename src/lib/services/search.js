import { allLessons, courseCurricula } from '../data/lessons/course-index.js';
import { learningPaths } from '../data/catalog.js';
import { references, referenceEntries } from '../data/references.js';
import { projects } from '../data/projects.js';

export function normalizeSearchText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('fr')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function lessonPath(lesson) {
  return lesson.type === 'legacy-lesson'
    ? `/apprendre?cours=${lesson.legacyCourseId}&lecon=${encodeURIComponent(lesson.title)}`
    : `/cours/${lesson.courseId}/lecons/${lesson.slug}`;
}

function makeIndex() {
  const entries = [];

  for (const path of learningPaths) {
    entries.push({
      id: `course:${path.id}`, title: `Cours ${path.title}`, description: path.description,
      technology: path.id === 'javascript' ? 'javascript' : path.id, category: 'course', type: 'course',
      keywords: path.topics, href: `/cours/${path.id}`, excerpt: path.outcomes.join(' · '),
      corpus: [path.title, path.description, ...path.topics, ...path.outcomes].join(' ')
    });
  }

  for (const course of courseCurricula) {
    for (const module of course.modules) {
      const firstLesson = module.lessons[0];
      if (!firstLesson) continue;
      entries.push({
        id: `module:${course.id}:${module.id}`, title: module.title, description: `Chapitre du parcours ${course.title}.`,
        technology: course.id, category: 'module', type: 'module', keywords: module.lessons.flatMap((lesson) => lesson.keywords ?? []),
        href: lessonPath(firstLesson), excerpt: module.lessons.map((lesson) => lesson.title).join(' · '),
        corpus: [course.title, module.title, ...module.lessons.map((lesson) => lesson.title), ...module.lessons.flatMap((lesson) => lesson.keywords ?? [])].join(' ')
      });
    }
  }

  for (const lesson of allLessons) {
    const tech = lesson.courseId;
    const category = lesson.type === 'legacy-lesson' ? 'lesson' : 'lesson';
    const keywords = lesson.keywords ?? [];
    const description = lesson.introduction ?? lesson.intro ?? '';
    entries.push({
      id: `lesson:${lesson.id}`, title: lesson.title, description, technology: tech,
      category, type: 'lesson', keywords, href: lessonPath(lesson),
      excerpt: lesson.explanation ?? lesson.concept ?? description,
      corpus: [lesson.title, description, lesson.explanation, lesson.concept, lesson.task, lesson.moduleTitle, ...keywords].filter(Boolean).join(' ')
    });

    for (const exercise of lesson.exercises ?? []) {
      entries.push({
        id: `exercise:${exercise.id}`, title: `Exercice — ${lesson.title}`, description: exercise.prompt,
        technology: tech, category: 'exercise', type: 'exercise', keywords: [lesson.title, ...keywords],
        href: lessonPath(lesson), excerpt: exercise.hint ?? exercise.explanation,
        corpus: [lesson.title, exercise.prompt, exercise.hint, exercise.explanation, ...keywords].filter(Boolean).join(' ')
      });
    }
  }

  for (const reference of references) {
    entries.push({
      id: `reference:${reference.id}`, title: `Référence ${reference.title}`, description: reference.description,
      technology: reference.technology, category: 'reference', type: 'reference', keywords: reference.keywords,
      href: `/reference#${reference.id}`, excerpt: reference.links.map((link) => link.label).join(' · '),
      corpus: [reference.title, reference.description, ...reference.keywords, ...reference.links.map((link) => link.label)].join(' ')
    });
  }

  for (const reference of referenceEntries) {
    entries.push({
      id: `reference-entry:${reference.id}`, title: reference.title, description: reference.description,
      technology: reference.technology, category: 'reference', type: 'reference', keywords: reference.keywords,
      href: reference.href, excerpt: reference.example,
      corpus: [reference.title, reference.description, reference.example, reference.category, ...reference.keywords].join(' ')
    });
  }

  for (const project of projects) {
    entries.push({
      id: `project:${project.id}`, title: project.title,
      description: project.description, technology: 'web', technologies: project.technologies.map((item) => item.toLowerCase()), category: 'project', type: 'project',
      keywords: [...project.concepts, project.level, project.duration], href: `/projets/${project.id}`,
      excerpt: `${project.level} · ${project.duration} · ${project.concepts.join(' · ')}`,
      corpus: [project.title, project.description, project.level, project.duration, ...project.technologies, ...project.concepts].join(' ')
    });
  }

  return entries.map((entry) => ({ ...entry, normalized: normalizeSearchText(`${entry.title} ${entry.description} ${entry.corpus} ${entry.keywords.join(' ')}`), normalizedTitle: normalizeSearchText(entry.title), normalizedKeywords: normalizeSearchText(entry.keywords.join(' ')) }));
}

export const searchIndex = makeIndex();

function relevance(entry, query, terms) {
  if (entry.normalizedTitle === query) return 100;
  if (entry.normalizedTitle.startsWith(query)) return 75;
  if (entry.normalizedTitle.includes(query)) return 60;
  if (entry.normalizedKeywords.includes(query)) return 45;
  if (entry.normalized.includes(query)) return 35;
  if (!terms.every((term) => entry.normalized.includes(term))) return 0;
  return 10 + terms.reduce((score, term) => score + (entry.normalizedTitle.includes(term) ? 5 : 1), 0);
}

export function searchResources(query, { technology = 'all', type = 'all', limit = Infinity } = {}) {
  const normalizedQuery = normalizeSearchText(query);
  if (!normalizedQuery) return [];
  const terms = normalizedQuery.split(/\s+/).filter(Boolean);

  return searchIndex
    .filter((entry) => (technology === 'all' || entry.technology === technology || entry.technologies?.includes(technology)) && (type === 'all' || entry.type === type))
    .map((entry, index) => ({ entry, score: relevance(entry, normalizedQuery, terms), index }))
    .filter((result) => result.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map(({ entry, score }) => ({ ...entry, score, normalized: undefined, normalizedTitle: undefined, normalizedKeywords: undefined }));
}
