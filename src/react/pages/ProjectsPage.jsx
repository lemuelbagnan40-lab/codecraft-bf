import { useEffect, useMemo, useState } from 'react';
import SeoHead from '../components/SeoHead.jsx';
import { allLessons, detailedLessons } from '../../lib/data/lessons/course-index.js';
import { projects, projectLevels, projectTechnologies } from '../../lib/data/projects.js';
import { getProjectProgressSummary, PROGRESS_EVENT, readProgress } from '../../lib/services/progress.js';
import { sitePath } from '../../lib/site-path.js';
import './ProjectsPage.css';

export default function ProjectsPage() {
  const [technology, setTechnology] = useState('Tous');
  const [level, setLevel] = useState('Tous');
  const [summary, setSummary] = useState(null);
  const [resumeHref, setResumeHref] = useState('/cours');
  const projectList = useMemo(() => projects.map((project) => ({
    ...project,
    lessons: project.lessons.map((id) => detailedLessons.find((lesson) => lesson.id === id)).filter(Boolean)
  })), []);
  const filteredProjects = projectList.filter((project) =>
    (technology === 'Tous' || project.technologies.includes(technology)) &&
    (level === 'Tous' || project.level === level)
  );

  useEffect(() => {
    function refresh() {
      const progress = readProgress();
      setSummary(getProjectProgressSummary(progress));
      const last = allLessons.find((lesson) => lesson.id === progress.lastLessonId)
        ?? allLessons
          .map((lesson) => ({ lesson, visited: progress.lessons[lesson.id]?.lastVisitedAt }))
          .filter((item) => item.visited)
          .sort((a, b) => b.visited.localeCompare(a.visited))[0]?.lesson;
      if (last) {
        setResumeHref(last.type === 'legacy-lesson'
          ? `/apprendre?cours=${last.legacyCourseId}&lecon=${encodeURIComponent(last.title)}`
          : `/cours/${last.courseId}/lecons/${last.slug}`);
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

  function stateFor(id) {
    return summary?.projects.find((entry) => entry.id === id);
  }

  function clearFilters() {
    setTechnology('Tous');
    setLevel('Tous');
  }

  return (
    <>
      <SeoHead
        title="Projets pratiques HTML, CSS et JavaScript — CodeCraft"
        description="Mets en pratique HTML, CSS et JavaScript avec des projets guidés et un suivi local de ta progression."
        path="/projets"
      />
      <section className="projects-hero">
        <div className="hero-copy">
          <span className="eyebrow">APPRENDRE EN CONSTRUISANT</span>
          <h1>Transforme tes connaissances en <em>vrais projets.</em></h1>
          <p>Assemble les notions HTML, CSS et JavaScript pour créer des choses concrètes, à ton rythme et étape par étape.</p>
          <div className="hero-actions"><a className="primary-button" href="#catalogue">Explorer les projets <span aria-hidden="true">→</span></a><a className="quiet-link" href={sitePath(resumeHref)}>Reprendre ma dernière leçon</a></div>
        </div>
        <div className="code-visual" aria-label="Aperçu stylisé de code">
          <div className="window-bar"><i /><i /><i /><span>mon-projet</span></div>
          <div className="code-lines"><span><b>01</b> <i>&lt;main&gt;</i></span><span><b>02</b> &nbsp; <i>&lt;h1&gt;</i>Mon idée<i>&lt;/h1&gt;</i></span><span><b>03</b> &nbsp; <u>Construisons-la.</u></span><span><b>04</b> <i>&lt;/main&gt;</i></span><span className="code-cursor">▍</span></div>
          <div className="floating-chip">✦ Petit projet, grand progrès</div>
        </div>
      </section>
      <section className="benefits" aria-label="Pourquoi apprendre par projet">
        <article><span>01</span><h2>Apprends en construisant</h2><p>Chaque notion prend du sens quand tu l’utilises dans une réalisation.</p></article>
        <article><span>02</span><h2>Relie les technologies</h2><p>Découvre comment HTML, CSS et JavaScript travaillent ensemble.</p></article>
        <article><span>03</span><h2>Fais grandir ton portfolio</h2><p>Garde une trace de tes projets et des compétences mobilisées.</p></article>
      </section>
      <section id="catalogue" className="catalogue">
        <div className="section-heading">
          <div><span className="eyebrow">TON PROCHAIN DÉFI</span><h2>Choisis ton prochain projet</h2><p>Des idées progressives pour mettre en pratique les cours.</p></div>
          <span className="catalogue-count">{filteredProjects.length} projet{filteredProjects.length === 1 ? '' : 's'}</span>
        </div>
        <div className="filters" aria-label="Filtres des projets">
          <div className="filter-group" aria-label="Filtrer par technologie">
            {['Tous', ...projectTechnologies].map((item) => <button key={item} type="button" className={technology === item ? 'active' : ''} aria-pressed={technology === item} onClick={() => setTechnology(item)}>{item}</button>)}
          </div>
          <div className="filter-group level-filters" aria-label="Filtrer par niveau">
            {['Tous', ...projectLevels].map((item) => <button key={item} type="button" className={level === item ? 'active' : ''} aria-pressed={level === item} onClick={() => setLevel(item)}>{item}</button>)}
          </div>
        </div>
        {filteredProjects.length > 0 ? (
          <div className="project-grid">
            {filteredProjects.map((project) => {
              const progress = stateFor(project.id);
              return (
                <article className="project-card" data-level={project.level} key={project.id}>
                  <div className="project-art" data-project={project.id}><span className="art-symbol" aria-hidden="true">{project.symbol}</span><span className="art-caption">{project.technologies.join(' · ')}</span><span className="art-state">{project.status === 'available' ? 'Atelier disponible' : 'Projet à réaliser'}</span></div>
                  <div className="project-body">
                    <div className="card-meta"><span className="level-badge" data-level={project.level}>{project.level}</span><span>{project.duration}</span></div>
                    <h3>{project.title}</h3><p className="project-description">{project.description}</p>
                    <div className="tech-list">{project.technologies.map((item) => <span key={item}>{item}</span>)}</div>
                    <p className="concepts"><strong>Tu vas pratiquer</strong>{project.concepts.join(' · ')}</p>
                    {progress?.status === 'completed' && <p className="project-progress done">✓ Projet terminé</p>}
                    {progress?.status === 'started' && <p className="project-progress">En cours · commencé {new Date(progress.startedAt).toLocaleDateString('fr-FR')}</p>}
                    <a className={`card-link${project.status !== 'available' ? ' muted-link' : ''}`} href={sitePath(`/projets/${project.id}`)}>
                      {project.status === 'available'
                        ? progress?.status === 'started' ? 'Reprendre le projet' : 'Découvrir le projet'
                        : 'Voir la fiche du projet'} <span aria-hidden="true">→</span>
                    </a>
                    {project.status !== 'available' && <span className="coming-soon">Parcours à réaliser</span>}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-state"><span aria-hidden="true">⌕</span><h3>Aucun projet pour ces filtres</h3><p>Essaie une autre technologie ou un autre niveau.</p><button type="button" onClick={clearFilters}>Effacer les filtres</button></div>
        )}
      </section>
      <aside className="course-note"><span aria-hidden="true">✦</span><div><h2>Un projet te semble difficile ?</h2><p>Tu peux revoir les notions associées avant de continuer. Les fiches de projet pointent vers les leçons disponibles.</p></div><a href={sitePath('/cours')}>Revoir les cours →</a></aside>
    </>
  );
}
