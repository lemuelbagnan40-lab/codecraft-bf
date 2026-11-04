import test from 'node:test';
import assert from 'node:assert/strict';
import { searchResources } from './search.js';

test('searches lesson titles and partial words with French accent normalization', () => {
  assert.ok(searchResources('flex').some((entry) => entry.title.includes('Flexbox')));
  assert.ok(searchResources('evenements').some((entry) => entry.title.includes('Événements')));
});

test('finds specific JavaScript concepts in lesson keywords and content', () => {
  const result = searchResources('addEventListener', { technology: 'javascript' });
  assert.ok(result.some((entry) => entry.title === 'Réagir aux événements'));
});

test('filters by resource type and technology', () => {
  const lessons = searchResources('tableau', { technology: 'javascript', type: 'lesson' });
  assert.ok(lessons.length > 0);
  assert.ok(lessons.every((entry) => entry.technology === 'javascript' && entry.type === 'lesson'));
});

test('returns useful direct links for lesson matches', () => {
  const result = searchResources('responsive', { type: 'lesson' });
  assert.ok(result.some((entry) => entry.href === '/cours/css/lecons/css-responsive-layout'));
});

test('indexes reference entries and links to the relevant MDN page', () => {
  const result = searchResources('box-sizing', { technology: 'css', type: 'reference' });
  assert.ok(result.some((entry) => entry.href.endsWith('/Web/CSS/box-sizing')));
});

test('finds practical projects by title and filters them by their technologies', () => {
  const result = searchResources('todo list', { technology: 'javascript', type: 'project' });
  assert.equal(result.length, 1);
  assert.equal(result[0].href, '/projets/todo-list');
  assert.ok(searchResources('portfolio', { technology: 'css', type: 'project' }).some((entry) => entry.href === '/projets/portfolio-responsive'));
});
