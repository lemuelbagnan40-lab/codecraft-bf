import SeoHead from '../components/SeoHead.jsx';
import { learningPaths } from '../../lib/data/catalog.js';
import { sitePath } from '../../lib/site-path.js';
import './CoursesPage.css';

export default function CoursesPage() {
  return (
    <>
      <SeoHead
        title="Cours HTML, CSS et JavaScript — CodeCraft"
        description="Explore les parcours CodeCraft : des cours progressifs de HTML, CSS et JavaScript avec notions, exemples et exercices."
        path="/cours"
      />
      <header className="page-heading">
        <span className="eyebrow">APPRENDRE À TON RYTHME</span>
        <h1>Les parcours</h1>
        <p>Chaque parcours part des bases et avance vers des notions plus solides. Commence par celui qui t’intéresse le plus.</p>
      </header>
      <section className="catalog-list" aria-label="Parcours disponibles">
        {learningPaths.map((path) => (
          <article className="catalog-card" key={path.id} style={{ '--path-color': path.color }}>
            <span className="catalog-symbol">{path.symbol}</span>
            <div className="catalog-copy">
              <span>{path.subtitle} · {path.lessonCount} leçons</span><h2>{path.title}</h2><p>{path.description}</p>
              <ul>{path.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul>
            </div>
            <a href={sitePath(`/cours/${path.id}`)}>Voir le parcours <span aria-hidden="true">→</span></a>
          </article>
        ))}
      </section>
    </>
  );
}
