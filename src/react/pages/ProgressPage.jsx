import { useEffect, useState } from 'react';
import SeoHead from '../components/SeoHead.jsx';
import { courseCurricula } from '../../lib/data/lessons/course-index.js';
import {
  getCourseLastLesson,
  getProgressSummary,
  getProjectProgressSummary,
  PROGRESS_EVENT,
  readProgress
} from '../../lib/services/progress.js';
import { sitePath } from '../../lib/site-path.js';
import './ProgressPage.css';

function lessonHref(lesson) {
  if (!lesson) return '/cours';
  if (lesson.type === 'legacy-lesson') {
    return `/apprendre?cours=${lesson.legacyCourseId}&lecon=${encodeURIComponent(lesson.title)}`;
  }
  return `/cours/${lesson.courseId}/lecons/${lesson.slug}`;
}

function resumeHref(course) {
  const last = getCourseLastLesson(course.id);
  if (last) return lessonHref(last);
  const first = courseCurricula.find((item) => item.id === course.id)?.modules[0]?.lessons[0];
  return lessonHref(first);
}

export default function ProgressPage() {
  const [summary, setSummary] = useState(null);
  const [projectSummary, setProjectSummary] = useState(null);

  useEffect(() => {
    function refresh() {
      const progress = readProgress();
      setSummary(getProgressSummary(progress));
      setProjectSummary(getProjectProgressSummary(progress));
    }
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);

  return (
    <>
      <SeoHead title="Ma progression — CodeCraft" description="Consulte le suivi de tes leçons sur cet appareil." noindex />
      <header className="page-heading">
        <span className="eyebrow">TON CHEMIN, À TON RYTHME</span><h1>Ma progression</h1>
        <p>Le suivi est enregistré dans le stockage local de ce navigateur. Tes leçons commencées et terminées restent sur cet appareil.</p>
      </header>
      {summary ? (
        <>
          <section className="progress-card">
            <div className="progress-top"><div><span className="eyebrow">LEÇONS TERMINÉES</span><h2>{summary.totals.completed} / {summary.totals.lessons}</h2></div><span className="progress-percent">{summary.percent}%</span></div>
            <div className="progress-track" role="progressbar" aria-label="Progression globale" aria-valuemin="0" aria-valuemax="100" aria-valuenow={summary.percent}><span style={{ width: `${summary.percent}%` }} /></div>
            <p>{summary.totals.started} leçons commencées · {summary.totals.notStarted} à découvrir</p>
          </section>
          <section className="course-progress">
            <h2>Progression par technologie</h2>
            <div>{summary.courses.map((course) => (
              <article className="course-card" key={course.id}>
                <div className="course-top">
                  <span className="course-symbol" data-course={course.id}>{course.title === 'JavaScript' ? 'JS' : course.title[0]}</span>
                  <div className="course-heading"><h3>{course.title}</h3><p>{course.completed} terminées · {course.started} commencées · {course.notStarted} non commencées</p></div>
                  <span className="course-percent">{course.percent}%</span>
                </div>
                <div className="progress-track" role="progressbar" aria-label={`Progression ${course.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={course.percent}><span style={{ width: `${course.percent}%` }} /></div>
                <div className="course-actions">
                  <span>{course.completed} / {course.lessons} leçons terminées</span>
                  <a href={sitePath(resumeHref(course))}>Reprendre {course.lastLesson ? `: ${course.lastLesson.title}` : 'le parcours'} →</a>
                </div>
                <details className="chapter-details">
                  <summary>Voir la progression par chapitre</summary>
                  <div className="chapter-list">{course.modules.map((module) => (
                    <article key={module.id}>
                      <div><strong>{module.title}</strong><span>{module.completed} / {module.lessons} · {module.status === 'completed' ? 'Terminé' : module.status === 'started' ? 'En cours' : 'Non commencé'}</span></div>
                      <span className="chapter-percent">{module.percent}%</span>
                      <div className="progress-track" role="progressbar" aria-label={`Progression ${module.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={module.percent}><span style={{ width: `${module.percent}%` }} /></div>
                    </article>
                  ))}</div>
                </details>
              </article>
            ))}</div>
          </section>
          {projectSummary && (
            <section className="projects-progress">
              <div className="projects-progress-heading">
                <div><h2>Progression des projets</h2><p>{projectSummary.completed} terminés · {projectSummary.started} commencés · {projectSummary.notStarted} à découvrir</p></div>
                <a href={sitePath('/projets')}>Explorer les projets →</a>
              </div>
              <div className="progress-track" role="progressbar" aria-label="Projets terminés" aria-valuemin="0" aria-valuemax="100" aria-valuenow={projectSummary.percent}><span style={{ width: `${projectSummary.percent}%` }} /></div>
              <div className="project-progress-grid">
                {projectSummary.projects.filter((project) => project.status !== 'not-started').map((project) => (
                  <a className="project-progress-item" href={sitePath(project.href)} key={project.id}>
                    <span>{project.status === 'completed' ? '✓ Terminé' : 'En cours'}</span><strong>{project.title}</strong>
                    <small>{project.status === 'completed'
                      ? `Terminé le ${new Date(project.completedAt).toLocaleDateString('fr-FR')}`
                      : `Commencé le ${new Date(project.startedAt).toLocaleDateString('fr-FR')}`}</small>
                  </a>
                ))}
              </div>
              {projectSummary.started === 0 && projectSummary.completed === 0 && <p className="no-projects-started">Tu n’as pas encore commencé de projet. <a href={sitePath('/projets')}>Choisir un premier projet</a>.</p>}
            </section>
          )}
        </>
      ) : <p className="loading-state" role="status">Chargement de ta progression locale…</p>}
      <p className="local-note">La plateforme n’a pas de compte ni de synchronisation distante. Effacer les données du navigateur peut supprimer cette progression.</p>
    </>
  );
}
