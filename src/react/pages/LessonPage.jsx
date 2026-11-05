import { useEffect, useMemo, useState } from 'react';
import SeoHead from '../components/SeoHead.jsx';
import LessonExercise from '../components/LessonExercise.jsx';
import { courseCurricula, detailedLessons } from '../../lib/data/lessons/course-index.js';
import { validateExercise } from '../../lib/services/exercise-validation.js';
import { markLessonCompleted, markLessonStarted, PROGRESS_EVENT, readProgress } from '../../lib/services/progress.js';
import { sitePath } from '../../lib/site-path.js';
import './LessonPage.css';

export default function LessonPage({ params }) {
  const { id, slug } = params;
  const courseLessons = useMemo(() => detailedLessons.filter((item) => item.courseId === id), [id]);
  const lessonIndex = courseLessons.findIndex((item) => item.slug === slug);
  const lesson = courseLessons[lessonIndex];
  const curriculum = courseCurricula.find((item) => item.id === id);
  const modules = curriculum?.modules.filter((module) => !module.id.startsWith('legacy-')) ?? [];
  const previous = courseLessons[lessonIndex - 1] ?? null;
  const next = courseLessons[lessonIndex + 1] ?? null;
  const [exerciseResults, setExerciseResults] = useState({});
  const [progressSnapshot, setProgressSnapshot] = useState({ lessons: {} });
  const isCompleted = progressSnapshot.lessons?.[lesson?.id]?.status === 'completed';

  useEffect(() => {
    if (!lesson) return undefined;
    markLessonStarted(lesson.id);
    const refresh = () => setProgressSnapshot(readProgress());
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [lesson?.id]);

  if (!lesson) return <p>Leçon introuvable.</p>;

  const technology = id === 'javascript' ? 'JavaScript' : id.toUpperCase();
  const lessonNumber = lessonIndex + 1;

  function checkExercise(exercise, answer) {
    const result = validateExercise(exercise, answer);
    setExerciseResults((current) => ({ ...current, [exercise.id]: result }));
  }

  function completeLesson() {
    const saved = markLessonCompleted(lesson.id);
    const progress = readProgress();
    if (!saved && progress.lessons[lesson.id]?.status !== 'completed') {
      console.error(`Impossible d’enregistrer la fin de la leçon "${lesson.id}".`);
    }
    setProgressSnapshot(progress);
  }

  return (
    <>
      <SeoHead
        title={`${lesson.title} : cours ${technology} — CodeCraft`}
        description={lesson.introduction}
        path={`/cours/${lesson.courseId}/lecons/${lesson.slug}`}
      />
      <nav className="breadcrumb" aria-label="Fil d’Ariane">
        <a href={sitePath('/cours')}>Cours</a><span aria-hidden="true">/</span>
        <a href={sitePath(`/cours/${id}`)}>{technology}</a><span aria-hidden="true">/</span>
        <span aria-current="page">{lesson.title}</span>
      </nav>
      <div className="lesson-layout">
        <aside className="lesson-sidebar" aria-label={`Leçons ${technology}`}>
          <div className="sidebar-heading"><span>PARCOURS {technology.toUpperCase()}</span><strong>{lessonNumber} / {courseLessons.length}</strong></div>
          {modules.map((module) => (
            <details className="module-nav" key={module.id} open={module.id === lesson.moduleId}>
              <summary>
                {module.title}
                <span>{module.lessons.filter((item) => item.id === lesson.id || progressSnapshot.lessons?.[item.id]?.status === 'completed').length}/{module.lessons.length}</span>
              </summary>
              <div className="lesson-list">
                {module.lessons.map((item) => {
                  const active = item.id === lesson.id;
                  const completed = progressSnapshot.lessons?.[item.id]?.status === 'completed';
                  return (
                    <a className={active ? 'active' : ''} aria-current={active ? 'page' : undefined} href={sitePath(`/cours/${id}/lecons/${item.slug}`)} key={item.id}>
                      <span className="lesson-marker">{active ? '●' : completed ? '✓' : '○'}</span>{item.title}
                    </a>
                  );
                })}
              </div>
            </details>
          ))}
          <a className="all-courses" href={sitePath(`/cours/${id}`)}>Voir la vue d’ensemble →</a>
        </aside>

        <article className="lesson-content">
          <div className="lesson-meta"><span>{technology} · {lesson.level}</span><span>{lesson.duration} de lecture</span></div>
          <h1>{lesson.title}</h1>
          <p className="lesson-intro">{lesson.introduction}</p>
          <section className="learning-goals">
            <h2>À la fin de cette leçon</h2>
            <ul>{lesson.objectives.map((objective) => <li key={objective}><span aria-hidden="true">✓</span>{objective}</li>)}</ul>
            <p><strong>Prérequis :</strong> {lesson.prerequisites}</p>
          </section>
          {lesson.sections.map((section, index) => (
            <section className="lesson-section" key={`${section.title}-${index}`}>
              <span className="section-number">0{index + 1}</span><h2>{section.title}</h2><p>{section.body}</p>
              {section.code && <pre><code>{section.code}</code></pre>}
              {section.explanation && <p className="explanation"><strong>À retenir :</strong> {section.explanation}</p>}
              {section.callout && <aside className="callout">{section.callout}</aside>}
            </section>
          ))}
          <section className="example-section">
            <span className="eyebrow">À TOI DE JOUER</span><h2>Modifie et exécute l’exemple</h2>
            <p>{lesson.example.expectedResult}</p>
            <pre><code>{lesson.example.files?.javascript || lesson.example.files?.html || JSON.stringify(lesson.example.files, null, 2)}</code></pre>
          </section>
          <section className="exercises-section">
            <span className="eyebrow">VÉRIFIER SES ACQUIS</span><h2>Exercices</h2><p>Essaie de répondre avant de consulter l’explication.</p>
            {lesson.exercises.map((exercise) => (
              <LessonExercise
                key={exercise.id}
                exercise={exercise}
                result={exerciseResults[exercise.id] ?? null}
                onCheck={(answer) => checkExercise(exercise, answer)}
              />
            ))}
          </section>
          <section className="summary"><h2>Les idées à retenir</h2><ul>{lesson.summary.map((item) => <li key={item}>{item}</li>)}</ul></section>
          {lesson.related?.length > 0 && <section className="related"><h2>Notions liées</h2>{lesson.related.map((item) => <span key={item}>{item}</span>)}</section>}
          <button className={`complete-lesson${isCompleted ? ' completed' : ''}`} type="button" onClick={completeLesson}>
            {isCompleted ? '✓ Leçon terminée' : 'Marquer la leçon comme terminée'}
          </button>
          <nav className="lesson-pagination" aria-label="Navigation entre les leçons">
            <a href={sitePath(previous ? `/cours/${id}/lecons/${previous.slug}` : `/cours/${id}`)}>
              <span>{previous ? '← Leçon précédente' : '← Parcours'}</span>
              <strong>{previous?.title ?? `Vue d’ensemble ${technology}`}</strong>
            </a>
            <a className="next-link" href={sitePath(next ? `/cours/${id}/lecons/${next.slug}` : `/cours/${id}`)}>
              <span>{next ? 'Leçon suivante →' : 'Fin du parcours →'}</span>
              <strong>{next?.title ?? 'Revoir les chapitres'}</strong>
            </a>
          </nav>
        </article>
      </div>
    </>
  );
}
