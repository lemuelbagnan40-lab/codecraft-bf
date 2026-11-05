import test from 'node:test';
import assert from 'node:assert/strict';
import { validateExercise } from './exercise-validation.js';

test('validates a multiple choice response by stable option id', () => {
  const exercise = { type: 'multiple-choice', correctOptionId: 'body' };
  assert.equal(validateExercise(exercise, 'body'), true);
  assert.equal(validateExercise(exercise, 'head'), false);
});

test('normalizes short answers without case sensitivity', () => {
  const exercise = { type: 'short-answer', acceptedAnswers: ['lang'] };
  assert.equal(validateExercise(exercise, ' LANG '), true);
  assert.equal(validateExercise(exercise, 'href'), false);
});

test('checks code requirements without evaluating the submitted code', () => {
  const exercise = { type: 'code', requiredSnippets: ['<h1', 'Portfolio', '</h1>'] };
  assert.equal(validateExercise(exercise, '<h1>Mon portfolio</h1>'), true);
  assert.equal(validateExercise(exercise, '<h2>Mon portfolio</h2>'), false);
});

test('rejects unknown exercise formats', () => {
  assert.equal(validateExercise({ type: 'unknown' }, 'anything'), false);
});
