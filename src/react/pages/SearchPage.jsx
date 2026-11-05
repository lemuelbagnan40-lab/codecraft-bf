import { useMemo, useState } from 'react';
import SeoHead from '../components/SeoHead.jsx';
import { searchResources } from '../../lib/services/search.js';
import { sitePath } from '../../lib/site-path.js';
import './SearchPage.css';

const technologies = [
  { id: 'all', label: 'Toutes les technologies' },
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'javascript', label: 'JavaScript' },
  { id: 'web', label: 'APIs Web' }
];
const types = [
  { id: 'all', label: 'Tous les contenus' },
  { id: 'course', label: 'Cours' },
  { id: 'module', label: 'Chapitres' },
  { id: 'lesson', label: 'Leçons' },
  { id: 'exercise', label: 'Exercices' },
  { id: 'reference', label: 'Références' },
  { id: 'project', label: 'Projets' }
];
const typeNames = {
  course: 'Cours',
  module: 'Chapitre',
  lesson: 'Leçon',
  exercise: 'Exercice',
  reference: 'Référence',
  project: 'Projet'
};

export default function SearchPage({ search = window.location.search }) {
  const searchParams = new URLSearchParams(search);
  const query = searchParams.get('q') ?? '';
  const [technology, setTechnology] = useState(searchParams.get('technologie') ?? 'all');
  const [type, setType] = useState(searchParams.get('type') ?? 'all');
  const results = useMemo(
    () => searchResources(query, { technology, type }),
    [query, technology, type]
  );

  return (
    <>
      <SeoHead title="Recherche — CodeCraft" description="Recherche dans les parcours, leçons, exercices et références CodeCraft." noindex />
      <header className="search-heading">
        <span className="eyebrow">RECHERCHER DANS CODECRAFT</span>
        <h1>Résultats de recherche</h1>
        <p>{query ? `Pour « ${query} »` : 'Recherche dans les parcours, les leçons et les références.'}</p>
      </header>
      <form className="search-form" action={sitePath('/recherche')} method="get" role="search">
        <label htmlFor="search-page-query">Notion à rechercher</label>
        <div className="query-row">
          <input id="search-page-query" name="q" type="search" defaultValue={query} placeholder="Ex. : flex, tableau, addEventListener" />
          <button type="submit">Rechercher</button>
          {query && <a href={sitePath('/recherche')} aria-label="Effacer la recherche">Effacer</a>}
        </div>
      </form>
      {query.trim() && (
        <>
          <div className="filters">
            <label htmlFor="technology-filter">Technologie
              <select id="technology-filter" value={technology} onChange={(event) => setTechnology(event.target.value)}>
                {technologies.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            <label htmlFor="type-filter">Type de contenu
              <select id="type-filter" value={type} onChange={(event) => setType(event.target.value)}>
                {types.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            <p className="result-count" role="status">{results.length} résultat{results.length === 1 ? '' : 's'}</p>
          </div>
          {results.length > 0 ? (
            <ol className="results">
              {results.map((result) => (
                <li key={result.id}>
                  <article>
                    <div className="result-top">
                      <span className="result-type">{typeNames[result.type] ?? 'Ressource'}</span>
                      <span className="result-tech">{result.technologies?.join(' · ') ?? result.technology?.toUpperCase()}</span>
                    </div>
                    <h2><a href={sitePath(result.href)}>{result.title}</a></h2>
                    <p>{result.description}</p>
                    {result.excerpt && <p className="excerpt">{result.excerpt}</p>}
                    <div className="result-bottom">
                      {result.keywords.slice(0, 5).map((keyword) => <span key={keyword}>{keyword}</span>)}
                      <a className="open-result" href={sitePath(result.href)}>Ouvrir <span aria-hidden="true">→</span></a>
                    </div>
                  </article>
                </li>
              ))}
            </ol>
          ) : (
            <section className="empty-state">
              <span aria-hidden="true">⌕</span><h2>Aucun résultat pour « {query} »</h2>
              <p>Essaie une partie du nom, sans accent si besoin, ou modifie les filtres.</p>
              <a href={sitePath('/cours')}>Parcourir les cours</a>
            </section>
          )}
        </>
      )}
    </>
  );
}
