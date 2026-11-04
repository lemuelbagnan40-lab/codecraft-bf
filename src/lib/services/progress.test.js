import test from 'node:test';
import assert from 'node:assert/strict';
import { allLessons } from '../data/lessons/course-index.js';
import { courseCurricula } from '../data/lessons/course-index.js';
import { getProgressSummary, getProjectProgressSummary, markLessonCompleted, markLessonStarted, markProjectCompleted, markProjectStarted, readProgress, summarizeLessons, PROGRESS_STORAGE_KEY, LEGACY_PROGRESS_STORAGE_KEY } from './progress.js';
import { projects } from '../data/projects.js';

function createStorage(initial = {}) {
  const values = new Map(Object.entries(initial));
  return {
    getItem(key) { return values.get(key) ?? null; },
    setItem(key, value) { values.set(key, String(value)); },
    removeItem(key) { values.delete(key); }
  };
}

test('migrates completed lessons from the existing legacy localStorage format', () => {
  const storage = createStorage({ [LEGACY_PROGRESS_STORAGE_KEY]: JSON.stringify(['css:Premiers pas en CSS', 'js:Variables']) });
  const progress = readProgress(storage);
  assert.equal(progress.lessons['legacy:css:premiers-pas-en-css'].status, 'completed');
  assert.equal(progress.lessons['legacy:javascript:variables'].status, 'completed');
});

test('tracks project status separately while preserving existing lesson progress', () => {
  const storage = createStorage({ [PROGRESS_STORAGE_KEY]: JSON.stringify({ version: 1, lessons: { 'js-first-script': { status: 'completed' } }, lastLessonId: 'js-first-script' }) });
  assert.equal(markProjectStarted('todo-list', storage), true);
  assert.equal(markProjectCompleted('todo-list', storage), true);
  const progress = readProgress(storage);
  assert.equal(progress.lessons['js-first-script'].status, 'completed');
  assert.equal(progress.projects['todo-list'].status, 'completed');
  const summary = getProjectProgressSummary(progress);
  assert.equal(summary.completed, 1);
  assert.equal(summary.started, 0);
  assert.equal(summary.total, projects.length);
});

test('does not mark an unopened project complete or count it twice', () => {
  const storage = createStorage();
  assert.equal(markProjectCompleted('todo-list', storage), true);
  assert.equal(markProjectCompleted('todo-list', storage), true);
  const summary = getProjectProgressSummary(readProgress(storage));
  assert.equal(summary.completed, 1);
  assert.equal(summary.percent, Math.round(100 / projects.length));
  assert.equal(markProjectStarted('unknown-project', storage), false);
});

test('marks a lesson started then completed without counting duplicates', () => {
  const storage = createStorage();
  const lesson = allLessons.find((entry) => entry.courseId === 'css');
  assert.equal(markLessonStarted(lesson.id, storage), true);
  assert.equal(markLessonCompleted(lesson.id, storage), true);
  assert.equal(markLessonCompleted(lesson.id, storage), true);
  const progress = readProgress(storage);
  assert.equal(progress.lessons[lesson.id].status, 'completed');
  assert.equal(Object.keys(progress.lessons).length, 1);
  assert.ok(storage.getItem(PROGRESS_STORAGE_KEY));
});

test('calculates course and chapter progress from stable lesson ids', () => {
  const lesson = allLessons.find((entry) => entry.courseId === 'javascript');
  const summary = getProgressSummary({ version: 1, lastLessonId: lesson.id, lessons: { [lesson.id]: { status: 'completed' } } });
  const javascript = summary.courses.find((course) => course.id === 'javascript');
  assert.equal(javascript.completed, 1);
  assert.equal(javascript.notStarted, javascript.lessons - 1);
  assert.equal(javascript.lastLesson.id, lesson.id);
  assert.equal(summary.totals.completed, 1);
});

test('an empty chapter has zero progress instead of dividing by zero', () => {
  assert.deepEqual(summarizeLessons([], { lessons: {} }), { lessons: 0, completed: 0, started: 0, notStarted: 0, percent: 0 });
});

test('a chapter is complete only when all of its lessons are complete', () => {
  const storage = createStorage();
  const module = courseCurricula.flatMap((course) => course.modules).find((item) => item.lessons.length > 1);
  assert.ok(module);
  for (const lesson of module.lessons.slice(0, -1)) markLessonCompleted(lesson.id, storage);
  let summary = getProgressSummary(readProgress(storage));
  let chapter = summary.courses.flatMap((course) => course.modules).find((item) => item.id === module.id);
  assert.notEqual(chapter.status, 'completed');
  markLessonCompleted(module.lessons.at(-1).id, storage);
  summary = getProgressSummary(readProgress(storage));
  chapter = summary.courses.flatMap((course) => course.modules).find((item) => item.id === module.id);
  assert.equal(chapter.status, 'completed');
});

