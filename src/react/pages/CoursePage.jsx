import SeoHead from '../components/SeoHead.jsx';
import { getLearningPath } from '../../lib/data/catalog.js';
import { courseCurricula, detailedLessons } from '../../lib/data/lessons/course-index.js';
import { sitePath } from '../../lib/site-path.js';
import './CoursePage.css';

const levels = ['Débutant', 'Intermédiaire', 'Avancé'];

export default function CoursePage({ params }) {
  const path = getLearningPath(params.id);
  const curriculum = courseCurricula.find((course) => course.id === params.id);
  if (!path || !curriculum) return <p>Ce parcours n’existe pas.</p>;

  const lessons = detailedLessons.filter((lesson) => lesson.courseId === params.id);
  const modules = curriculum.modules.filter((module) => !module.id.startsWith('legacy-'));
  const legacyLessons = curriculum.modules.find((module) => module.id.startsWith('legacy-'))?.lessons ?? [];
  const lessonCounts = Object.fromEntries(levels.map((level) => [level, lessons.filter((lesson) => lesson.level === level).length]));
  const legacyLessonCounts = Object.fromEntries(levels.map((level) => [level, legacyLessons.filter((lesson) => lesson.level === level).length]));
  const legacyCourseId = path.legacyId || path.id;
  const firstLesson = lessons[0];

  return (
    <>
      <SeoHead
        title={`Cours ${path.title} : ${path.subtitle} — CodeCraft`}
        description={path.description}
        path={`/cours/${path.id}`}
      />
      <a className="back-link" href={sitePath('/cours')}>← Tous les parcours</a>
      <header className="course-hero" style={{ '--course-color': path.color }}>
        <span className="course-symbol">{path.symbol}</span>
        <span className="eyebrow">PARCOURS · {path.subtitle.toUpperCase()}</span>
        <h1>Apprendre {path.title}</h1>
        <p>{path.description}</p>
        <div className="hero-actions">
          {firstLesson && <a className="primary-button" href={sitePath(`/cours/${path.id}/lecons/${firstLesson.slug}`)}>Commencer le parcours détaillé <span aria-hidden="true">→</span></a>}
          <a className="reference-link" href={path.referenceUrl} target="_blank" rel="noreferrer">Lire le parcours MDN ↗</a>
        </div>
      </header>

      <section className="course-section curriculum-section">
        <span className="eyebrow">PARCOURS DÉTAILLÉ · {lessons.length} LEÇONS</span>
        <h2>Les chapitres</h2>
        <div className="module-grid">
          {modules.map((module) => (
            <article key={module.id}>
              <span>{module.lessons.length} leçon{module.lessons.length > 1 ? 's' : ''}</span>
              <h3>{module.title}</h3>
              <ul>{module.lessons.map((lesson) => (
                <li key={lesson.id}><a href={sitePath(`/cours/${path.id}/lecons/${lesson.slug}`)}><span className="module-lesson-title">{lesson.title}</span><span aria-hidden="true">→</span></a></li>
              ))}</ul>
            </article>
          ))}
        </div>
        <p className="legacy-note">Les ateliers interactifs déjà présents restent accessibles depuis <a href={sitePath(`/apprendre?cours=${legacyCourseId}`)}>l’ancien espace de pratique</a>.</p>
      </section>

      <section className="course-section">
        <span className="eyebrow">OBJECTIFS DU PARCOURS</span>
        <h2>À la fin de ce parcours, tu pourras…</h2>
        <ul>{path.outcomes.map((outcome) => <li key={outcome}><span>✓</span>{outcome}</li>)}</ul>
      </section>

      <section className="course-section level-section">
        <span className="eyebrow">TROIS ÉTAPES</span><h2>Choisis ton niveau</h2>
        <div className="level-grid">
          {levels.map((level, index) => {
            const count = lessonCounts[level];
            const legacyCount = legacyLessonCounts[level];
            const firstAtLevel = lessons.find((lesson) => lesson.level === level);
            const firstLegacyAtLevel = legacyLessons.find((lesson) => lesson.level === level);
            const legacyHref = firstLegacyAtLevel
              ? `/apprendre?cours=${legacyCourseId}&niveau=${encodeURIComponent(level)}&lecon=${encodeURIComponent(firstLegacyAtLevel.title)}`
              : `/apprendre?cours=${legacyCourseId}&niveau=${encodeURIComponent(level)}`;
            return (
              <article key={level}>
                <span>0{index + 1}</span><h3>{level}</h3>
                <p>{count} leçon{count === 1 ? '' : 's'} détaillée{count === 1 ? '' : 's'} dans ce niveau.</p>
                {count > 0
                  ? <a href={sitePath(`/cours/${path.id}/lecons/${firstAtLevel.slug}`)}>Commencer ce niveau <span aria-hidden="true">→</span></a>
                  : legacyCount > 0
                    ? <><p className="legacy-level">{legacyCount} atelier{legacyCount > 1 ? 's' : ''} interactif{legacyCount > 1 ? 's' : ''} disponible{legacyCount > 1 ? 's' : ''}.</p><a href={sitePath(legacyHref)}>Ouvrir un atelier <span aria-hidden="true">→</span></a></>
                    : <span className="level-empty">Aucune leçon disponible.</span>}
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
