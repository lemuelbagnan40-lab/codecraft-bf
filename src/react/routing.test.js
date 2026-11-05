import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveRoute } from './routing.js';

test('resolves the main static pages', () => {
  assert.equal(resolveRoute('/').name, 'home');
  assert.equal(resolveRoute('/cours/').name, 'courses');
  assert.equal(resolveRoute('/projets').name, 'projects');
  assert.equal(resolveRoute('/reference/').name, 'reference');
  assert.equal(resolveRoute('/progression').name, 'progress');
  assert.equal(resolveRoute('/a-propos/').name, 'about');
  assert.equal(resolveRoute('/apprendre').name, 'legacy-learning');
});

test('resolves course and lesson parameters', () => {
  assert.deepEqual(resolveRoute('/cours/html/').params, { id: 'html' });
  assert.deepEqual(resolveRoute('/cours/javascript/lecons/js-dom-manipulation/').params, {
    id: 'javascript',
    slug: 'js-dom-manipulation'
  });
});

test('resolves project and preserves search parameters', () => {
  assert.deepEqual(resolveRoute('/projets/todo-list').params, { slug: 'todo-list' });
  assert.equal(resolveRoute('/recherche/', '?q=flexbox').search, '?q=flexbox');
});

test('returns not-found for unknown and incomplete paths', () => {
  assert.equal(resolveRoute('/cours/unknown/lecons').name, 'not-found');
  assert.equal(resolveRoute('/unknown').name, 'not-found');
});

test('returns not-found instead of throwing for malformed encoded paths', () => {
  assert.deepEqual(resolveRoute('/cours/%E0%A4%A'), {
    name: 'not-found',
    params: {},
    search: ''
  });
});
