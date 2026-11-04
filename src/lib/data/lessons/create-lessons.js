export function createCourseLessons(courseId, modules) {
  return modules.flatMap((module, moduleIndex) => module.lessons.map((lesson, lessonIndex) => {
    const id = lesson.id;
    const exercises = lesson.exercises.map((exercise, index) => ({
      id: `${id}-exercise-${index + 1}`,
      type: 'code',
      level: ['Facile', 'Intermédiaire', 'Défi'][index],
      prompt: exercise.prompt,
      requiredSnippets: exercise.requiredSnippets,
      hint: exercise.hint,
      explanation: exercise.explanation
    }));

    return {
      ...lesson,
      courseId,
      slug: id,
      moduleId: module.id,
      moduleTitle: module.title,
      moduleIndex,
      lessonIndex,
      duration: lesson.duration ?? '12 min',
      prerequisites: lesson.prerequisites ?? 'Aucune connaissance préalable requise.',
      objectives: lesson.objectives ?? [`Comprendre ${lesson.title.toLocaleLowerCase('fr')}`, 'Lire et modifier un exemple concret', 'Repérer les erreurs courantes'],
      sections: [
        { title: 'Comprendre la notion', body: lesson.introduction, code: lesson.syntax, explanation: lesson.explanation },
        { title: 'Lire l’exemple pas à pas', body: lesson.lineByLine, code: lesson.example.files[courseId === 'javascript' ? 'javascript' : 'css'], explanation: lesson.goodPractice },
        { title: 'Erreurs fréquentes et méthode', body: lesson.commonMistakes, callout: lesson.callout }
      ],
      exercises,
      summary: lesson.summary ?? [lesson.explanation, lesson.goodPractice],
      related: lesson.related ?? [],
      keywords: lesson.keywords ?? []
    };
  }));
}

export function groupLessonsIntoModules(courseId, courseTitle, lessons) {
  const grouped = new Map();
  for (const lesson of lessons) {
    if (!grouped.has(lesson.moduleId)) {
      grouped.set(lesson.moduleId, { id: lesson.moduleId, title: lesson.moduleTitle, lessons: [] });
    }
    grouped.get(lesson.moduleId).lessons.push(lesson);
  }
  return { id: courseId, title: courseTitle, modules: [...grouped.values()] };
}
