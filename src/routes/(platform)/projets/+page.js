import { projects } from '$lib/data/projects.js';
import { detailedLessons } from '$lib/data/lessons/course-index.js';

export function load() {
  return {
    projects: projects.map((project) => ({
      ...project,
      lessons: project.lessons.map((id) => detailedLessons.find((lesson) => lesson.id === id)).filter(Boolean)
    }))
  };
}
