import SeoHead from '../components/SeoHead.jsx';
import { learningPaths } from '../../lib/data/catalog.js';
import { projects } from '../../lib/data/projects.js';
import { sitePath } from '../../lib/site-path.js';
import './HomePage.css';

const firstProject = projects.find((project) => project.status === 'available');

export default function HomePage() {
  return (
    <>
      <SeoHead
        title="Apprendre HTML, CSS et JavaScript par la pratique — CodeCraft"
        description="Découvre des parcours HTML, CSS et JavaScript avec des leçons, exemples interactifs, exercices et projets pratiques."
        path="/"
      />
      <section className="welcome">
        <div className="welcome-copy">
          <span className="eyebrow">APPRENDRE EN FAISANT</span>
          <h1>Le Web s’apprend <em>une étape à la fois.</em></h1>
          <p>Tu n’as pas besoin de tout savoir pour commencer. Choisis un sujet, essaie un exemple et construis peu à peu tes repères.</p>
          <div className="welcome-actions">
            <a className="primary-button" href={sitePath('/cours')}>Explorer les cours <span aria-hidden="true">→</span></a>
            <a className="quiet-link" href={sitePath('/apprendre')}>Reprendre les exercices interactifs</a>
          </div>
        </div>
        <div className="welcome-illustration" aria-hidden="true">
          <div className="illustration-paper"><span>&lt;h1&gt;</span><b>Bonjour, le Web.</b><i>&lt;/h1&gt;</i><hr /><span>.page {'{'}</span><b>  display: flex;</b><i>{'}'}</i></div>
          <div className="illustration-mark mark-a" /><div className="illustration-mark mark-b" />
        </div>
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div><span className="eyebrow">TON PARCOURS</span><h2>Choisis ton point de départ</h2></div>
          <a href={sitePath('/cours')}>Voir tous les cours <span aria-hidden="true">→</span></a>
        </div>
        <div className="path-grid">
          {learningPaths.map((path) => (
            <article className="path-card" key={path.id} style={{ '--path-color': path.color }}>
              <div className="path-card-top"><span className="path-symbol">{path.symbol}</span><span className="path-duration">{path.lessonCount} leçons</span></div>
              <p className="path-subtitle">{path.subtitle}</p><h3>{path.title}</h3>
              <p className="path-description">{path.description}</p>
              <a href={sitePath(`/cours/${path.id}`)}>Découvrir le parcours <span aria-hidden="true">→</span></a>
            </article>
          ))}
        </div>
      </section>

      {firstProject && (
        <section className="project-invitation">
          <div>
            <span className="eyebrow">APPRENDRE EN PRATIQUANT</span>
            <h2>La prochaine étape peut être un projet.</h2>
            <p>{firstProject.description} Tu peux avancer en construisant, puis revenir aux leçons quand tu en as besoin.</p>
            <div className="project-invitation-meta"><span>{firstProject.level}</span><span>{firstProject.technologies.join(' · ')}</span><span>{firstProject.duration}</span></div>
          </div>
          <div className="project-invitation-actions">
            <a className="primary-button" href={sitePath(`/projets/${firstProject.id}`)}>Essayer le projet <span aria-hidden="true">→</span></a>
            <a href={sitePath('/projets')}>Voir tous les projets</a>
          </div>
        </section>
      )}

      <section className="human-note">
        <span className="note-dot" aria-hidden="true" />
        <div><h2>Une petite étape suffit pour aujourd’hui.</h2><p>Tu peux revenir autant de fois que tu veux. Ta progression est enregistrée sur cet appareil quand tu suis les leçons interactives.</p></div>
        <a href={sitePath('/progression')}>Voir ma progression</a>
      </section>
    </>
  );
}
