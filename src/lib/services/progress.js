import { courseCurricula, allLessons, getCourseLessons } from '../data/lessons/course-index.js';
import { projects } from '../data/projects.js';

export const PROGRESS_STORAGE_KEY = 'webschool-progress-v1';
export const LEGACY_PROGRESS_STORAGE_KEY = 'weblab-progress';
export const PROGRESS_EVENT = 'webschool:progress';

function emptyProgress() {
  return { version: 1, lessons: {}, projects: {}, lastLessonId: null };
}

function safeParse(value) {
  try { return JSON.parse(value); } catch { return null; }
}

function browserStorage() {
  try { return typeof localStorage === 'undefined' ? null : localStorage; } catch { return null; }
}

function legacyIdFor(rawId) {
  const direct = allLessons.find((lesson) => lesson.legacyId === rawId);
  if (direct) return direct.id;

  const indexed = /^(html|css|js)-(\d+)$/.exec(rawId);
  if (indexed) {
    const course = indexed[1] === 'js' ? 'javascript' : indexed[1];
    const lesson = allLessons.find((item) => item.type === 'legacy-lesson' && item.legacyCourseId === indexed[1] && item.legacyIndex === Number(indexed[2]));
    if (lesson) return lesson.id;
    return allLessons.find((item) => item.courseId === course && item.legacyIndex === Number(indexed[2]))?.id ?? null;
  }

  const named = /^(html|css|js):(.*)$/.exec(rawId);
  if (named) {
    const lesson = allLessons.find((item) => item.legacyId === rawId);
    return lesson?.id ?? null;
  }
  return null;
}

export function readProgress(storage = browserStorage()) {
  const progress = emptyProgress();
  if (!storage) return progress;

  let saved;
  let oldList;
  try {
    saved = safeParse(storage.getItem(PROGRESS_STORAGE_KEY));
    oldList = safeParse(storage.getItem(LEGACY_PROGRESS_STORAGE_KEY));
  } catch {
    return progress;
  }
  if (saved?.version === 1 && saved.lessons && typeof saved.lessons === 'object' && !Array.isArray(saved.lessons)) {
    for (const [id, entry] of Object.entries(saved.lessons)) {
      if (allLessons.some((lesson) => lesson.id === id) && ['started', 'completed'].includes(entry?.status)) {
        progress.lessons[id] = {
          status: entry.status,
          startedAt: entry.startedAt ?? null,
          completedAt: entry.completedAt ?? null,
          lastVisitedAt: entry.lastVisitedAt ?? null
        };
      }
    }
    if (allLessons.some((lesson) => lesson.id === saved.lastLessonId)) progress.lastLessonId = saved.lastLessonId;
    if (saved.projects && typeof saved.projects === 'object' && !Array.isArray(saved.projects)) {
      for (const [id, entry] of Object.entries(saved.projects)) {
        if (projects.some((project) => project.id === id) && ['started', 'completed'].includes(entry?.status)) {
          progress.projects[id] = {
            status: entry.status,
            startedAt: entry.startedAt ?? null,
            completedAt: entry.completedAt ?? null,
            lastVisitedAt: entry.lastVisitedAt ?? null
          };
        }
      }
    }
  }

  if (Array.isArray(oldList)) {
    for (const rawId of oldList) {
      if (typeof rawId !== 'string') continue;
      const id = legacyIdFor(rawId);
      if (id) progress.lessons[id] = { status: 'completed', startedAt: null, completedAt: null, lastVisitedAt: null };
    }
  }

  return progress;
}

export function saveProgress(progress, storage = browserStorage()) {
  if (!storage) return false;
  try {
    storage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
    if (typeof window !== 'undefined') window.dispatchEvent(new CustomEvent(PROGRESS_EVENT));
    return true;
  } catch {
    return false;
  }
}

function updateLesson(id, status, storage) {
  if (!allLessons.some((lesson) => lesson.id === id)) return false;
  const progress = readProgress(storage);
  const old = progress.lessons[id] ?? { status: 'not-started', startedAt: null, completedAt: null, lastVisitedAt: null };
  const now = new Date().toISOString();
  progress.lessons[id] = {
    status: old.status === 'completed' ? 'completed' : status,
    startedAt: old.startedAt ?? now,
    completedAt: status === 'completed' ? (old.completedAt ?? now) : old.completedAt,
    lastVisitedAt: now
  };
  progress.lastLessonId = id;
  return saveProgress(progress, storage);
}

export function markLessonStarted(id, storage) {
  return updateLesson(id, 'started', storage);
}

export function markLessonCompleted(id, storage) {
  return updateLesson(id, 'completed', storage);
}

function updateProject(id, status, storage) {
  if (!projects.some((project) => project.id === id)) return false;
  const progress = readProgress(storage);
  const old = progress.projects[id] ?? { status: 'not-started', startedAt: null, completedAt: null, lastVisitedAt: null };
  const now = new Date().toISOString();
  progress.projects[id] = {
    status: old.status === 'completed' ? 'completed' : status,
    startedAt: old.startedAt ?? now,
    completedAt: status === 'completed' ? (old.completedAt ?? now) : old.completedAt,
    lastVisitedAt: now
  };
  return saveProgress(progress, storage);
}

export function markProjectStarted(id, storage) { return updateProject(id, 'started', storage); }
export function markProjectCompleted(id, storage) { return updateProject(id, 'completed', storage); }

export function getProjectProgressSummary(progress = readProgress()) {
  const entries = projects.map((project) => ({
    id: project.id,
    title: project.title,
    href: `/projets/${project.id}`,
    status: progress.projects?.[project.id]?.status ?? 'not-started',
    startedAt: progress.projects?.[project.id]?.startedAt ?? null,
    completedAt: progress.projects?.[project.id]?.completedAt ?? null,
    lastVisitedAt: progress.projects?.[project.id]?.lastVisitedAt ?? null
  }));
  const completed = entries.filter((entry) => entry.status === 'completed').length;
  const started = entries.filter((entry) => entry.status === 'started').length;
  return { projects: entries, total: entries.length, completed, started, notStarted: entries.length - completed - started, percent: entries.length ? Math.round(completed / entries.length * 100) : 0 };
}

export function summarizeLessons(lessons, progress) {
  const summary = { lessons: lessons.length, completed: 0, started: 0, notStarted: 0, percent: 0 };
  for (const lesson of lessons) {
    const status = progress.lessons[lesson.id]?.status;
    if (status === 'completed') summary.completed += 1;
    else if (status === 'started') summary.started += 1;
    else summary.notStarted += 1;
  }
  summary.percent = summary.lessons ? Math.round((summary.completed / summary.lessons) * 100) : 0;
  return summary;
}

export function getProgressSummary(progress = readProgress()) {
  const courses = courseCurricula.map((course) => {
    const lessons = getCourseLessons(course.id);
    const counts = summarizeLessons(lessons, progress);
    const percent = counts.percent;
    const lastLesson = lessons.find((lesson) => lesson.id === progress.lastLessonId)
      ?? lessons.map((lesson) => ({ lesson, visited: progress.lessons[lesson.id]?.lastVisitedAt }))
        .filter((item) => item.visited)
        .sort((a, b) => b.visited.localeCompare(a.visited))[0]?.lesson
      ?? null;
    return {
      id: course.id, title: course.title, lessons: lessons.length, ...counts, percent,
      lastLesson,
      modules: course.modules.map((module) => {
        const moduleLessons = module.lessons;
        const moduleSummary = summarizeLessons(moduleLessons, progress);
        const { completed } = moduleSummary;
        const started = moduleLessons.some((lesson) => progress.lessons[lesson.id]);
        return {
          id: module.id, title: module.title, lessons: moduleLessons.length, completed,
          percent: moduleSummary.percent,
          status: moduleLessons.length && completed === moduleLessons.length ? 'completed' : started ? 'started' : 'not-started'
        };
      })
    };
  });
  const totals = courses.reduce((sum, course) => ({
    lessons: sum.lessons + course.lessons,
    completed: sum.completed + course.completed,
    started: sum.started + course.started,
    notStarted: sum.notStarted + course.notStarted
  }), { lessons: 0, completed: 0, started: 0, notStarted: 0 });
  return { courses, totals, percent: totals.lessons ? Math.round((totals.completed / totals.lessons) * 100) : 0 };
}

export function getCourseLastLesson(courseId, progress = readProgress()) {
  const lesson = allLessons.find((item) => item.id === progress.lastLessonId && item.courseId === courseId);
  if (lesson) return lesson;
  const mostRecent = getCourseLessons(courseId)
    .map((item) => ({ lesson: item, visited: progress.lessons[item.id]?.lastVisitedAt }))
    .filter((item) => item.visited)
    .sort((a, b) => b.visited.localeCompare(a.visited))[0];
  return mostRecent?.lesson ?? null;
}
