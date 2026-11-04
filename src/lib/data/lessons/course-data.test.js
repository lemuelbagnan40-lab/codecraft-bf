import test from 'node:test';
import assert from 'node:assert/strict';
import { cssLessons } from './css.js';
import { javascriptLessons } from './javascript.js';
import { courseCurricula, allLessons } from './course-index.js';

test('CSS and JavaScript curricula contain the planned module counts', () => {
  assert.equal(cssLessons.length, 14);
  assert.equal(javascriptLessons.length, 18);
});

test('every detailed lesson has an example and three progressive exercises', () => {
  for (const lesson of [...cssLessons, ...javascriptLessons]) {
    assert.equal(typeof lesson.example.files.html, 'string', `${lesson.id} has an HTML panel`);
    assert.equal(typeof lesson.example.files.css, 'string', `${lesson.id} has a CSS panel`);
    assert.equal(typeof lesson.example.files.javascript, 'string', `${lesson.id} has a JavaScript panel`);
    assert.equal(lesson.exercises.length, 3, `${lesson.id} has three exercises`);
    assert.ok(lesson.objectives.length >= 3);
    assert.ok(lesson.sections.length >= 3);
  }
});

test('course navigation contains every detailed lesson under unique stable ids', () => {
  const ids = allLessons.map((lesson) => lesson.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const courseId of ['css', 'javascript']) {
    const course = courseCurricula.find((item) => item.id === courseId);
    const count = course.modules.filter((module) => !module.id.startsWith('legacy-')).flatMap((module) => module.lessons).length;
    assert.equal(count, courseId === 'css' ? 14 : 18);
  }
});
