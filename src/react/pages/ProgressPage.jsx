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
  const [lastActivity, setLastActivity] = useState(null);

  useEffect(() => {
    function refresh() {
      const progress = readProgress();
      setSummary(getProgressSummary(progress));
      setProjectSummary(getProjectProgressSummary(progress));
      if (progress.lastLessonId) {
        setLastActivity(progress.lastLessonId);
      }
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
      <SeoHead title="Tableau de bord — CodeCraft" description="Suis ta progression et reprends là où tu t'es arrêté." noindex />
      <header className="page-heading">
        <span className="eyebrow">TON TABLEAU DE BORD</span><h1>Ma progression</h1>
        <p>Suis ton avancement sur cet appareil. Reprends tes leçons là où tu les as laissées.</p>
      </header>
      {summary ? (
        <>
          <section className="progress-hero">
            <div className="progress-hero-main">
              <div><span className="eyebrow">AVANCEMENT GLOBAL</span><h2>{summary.totals.completed} / {summary.totals.lessons} leçons terminées</h2></div>
              <div className="progress-hero-percent">{summary.percent}%</div>
            </div>
            <div className="progress-track large" role="progressbar" aria-label="Progression globale" aria-valuemin="0" aria-valuemax="100" aria-valuenow={summary.percent}><span style={{ width: `${summary.percent}%` }} /></div>
            <div className="progress-stats">
              <div className="progress-stat"><span className="stat-value">{summary.totals.completed}</span><span className="stat-label">Terminées</span></div>
              <div className="progress-stat"><span className="stat-value">{summary.totals.started}</span><span className="stat-label">En cours</span></div>
              <div className="progress-stat"><span className="stat-value">{summary.totals.notStarted}</span><span className="stat-label">À découvrir</span></div>
            </div>
          </section>
          <section className="course-progress">
            <div className="section-header">
              <h2>Mes parcours</h2>
              <p>Reprends l'apprentissage au bon endroit</p>
            </div>
            <div className="course-progress-list">{summary.courses.map((course) => (
              <article className="course-card enhanced" key={course.id}>
                <div className="course-top">
                  <span className="course-symbol" data-course={course.id}>{course.title === 'JavaScript' ? 'JS' : course.title[0]}</span>
                  <div className="course-heading"><h3>{course.title}</h3><p>{course.completed} terminées · {course.started} commencées · {course.notStarted} restantes</p></div>
                  <span className="course-percent-badge">{course.percent}%</span>
                </div>
                <div className="progress-track" role="progressbar" aria-label={`Progression ${course.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={course.percent}><span style={{ width: `${course.percent}%` }} /></div>
                <div className="course-actions">
                  <span className="course-count">{course.completed} / {course.lessons} leçons</span>
                  <a className="resume-button" href={sitePath(resumeHref(course))}>Continuer {course.lastLesson ? `: ${course.lastLesson.title.substring(0, 40)}${course.lastLesson.title.length > 40 ? '...' : ''}` : 'le parcours'} →</a>
                </div>
                <details className="chapter-details">
                  <summary>Voir le détail par chapitre</summary>
                  <div className="chapter-list">{course.modules.map((module) => (
                    <article key={module.id}>
                      <div><strong>{module.title}</strong><span>{module.completed} / {module.lessons} · {module.status === 'completed' ? 'Terminé' : module.status === 'started' ? 'En cours' : 'À faire'}</span></div>
                      <span className="chapter-percent">{module.percent}%</span>
                      <div className="progress-track mini" role="progressbar" aria-label={`Progression ${module.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={module.percent}><span style={{ width: `${module.percent}%` }} /></div>
                    </article>
                  ))}</div>
                </details>
              </article>
            ))}</div>
          </section>
          {projectSummary && (
            <section className="projects-progress">
              <div className="projects-progress-heading">
                <div><h2>Projets pratiques</h2><p>{projectSummary.completed} terminés · {projectSummary.started} en cours · {projectSummary.notStarted} à réaliser</p></div>
                <a href={sitePath('/projets')}>Tous les projets →</a>
              </div>
              <div className="progress-track" role="progressbar" aria-label="Projets terminés" aria-valuemin="0" aria-valuemax="100" aria-valuenow={projectSummary.percent}><span style={{ width: `${projectSummary.percent}%` }} /></div>
              <div className="project-progress-grid">
                {projectSummary.projects.filter((project) => project.status !== 'not-started').map((project) => (
                  <a className="project-progress-item" href={sitePath(project.href)} key={project.id}>
                    <span className={project.status === 'completed' ? 'status-done' : 'status-inprogress'}>{project.status === 'completed' ? '✓ Terminé' : '⟳ En cours'}</span><strong>{project.title}</strong>
                    <small>{project.status === 'completed'
                      ? `Terminé le ${new Date(project.completedAt).toLocaleDateString('fr-FR')}`
                      : project.startedAt ? `Commencé le ${new Date(project.startedAt).toLocaleDateString('fr-FR')}` : 'En cours'}</small>
                  </a>
                ))}
              </div>
              {projectSummary.started === 0 && projectSummary.completed === 0 && <p className="no-projects-started">Pas encore de projet commencé. <a href={sitePath('/projets')}>Découvrir les projets pratiques</a>.</p>}
            </section>
          )}
        </>
      ) : <p className="loading-state" role="status">Chargement de ta progression…</p>}
      <p className="local-note">La progression est enregistrée localement dans ton navigateur. Elle n'est pas synchronisée entre appareils.</p>
    </>
  );
}

