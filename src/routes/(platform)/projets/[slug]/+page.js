import { error } from '@sveltejs/kit';
import { getProject } from '$lib/data/projects.js';
import { detailedLessons } from '$lib/data/lessons/course-index.js';

export function load({ params }) {
  const project = getProject(params.slug);
  if (!project) error(404, 'Projet introuvable.');
  return { project: { ...project, lessons: project.lessons.map((id) => detailedLessons.find((lesson) => lesson.id === id)).filter(Boolean) } };
}
