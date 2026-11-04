import { useMemo, useState } from 'react';
import SeoHead from '../components/SeoHead.jsx';
import { references, referenceEntries } from '../../lib/data/references.js';
import './ReferencePage.css';

function normalize(value) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('fr');
}

function categorySlug(value) {
  return normalize(value).replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export default function ReferencePage() {
  const [query, setQuery] = useState('');
  const [technology, setTechnology] = useState('all');
  const filteredEntries = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    return referenceEntries.filter((entry) => {
      const text = normalize(`${entry.title} ${entry.description} ${entry.category} ${entry.example}`);
      return (technology === 'all' || entry.technology === technology) && (!normalizedQuery || text.includes(normalizedQuery));
    });
  }, [query, technology]);
  const groups = useMemo(() => {
    const keys = [...new Set(filteredEntries.map((entry) => `${entry.technology}:${entry.category}`))];
    return keys.map((key) => {
      const [entryTechnology, category] = key.split(':');
      return {
        id: categorySlug(key),
        technology: entryTechnology,
        category,
        entries: filteredEntries.filter((entry) => entry.technology === entryTechnology && entry.category === category)
      };
    });
  }, [filteredEntries]);

  return (
    <>
      <SeoHead
        title="Références HTML, CSS, JavaScript et APIs Web — CodeCraft"
        description="Consulte des fiches de référence HTML, CSS, JavaScript et APIs Web, reliées à la documentation MDN."
        path="/reference"
      />
      <header className="page-heading">
        <span className="eyebrow">GARDER SOUS LA MAIN</span><h1>Documentation de référence</h1>
        <p>Des liens vers les références MDN officielles. Elles détaillent la syntaxe, les paramètres, la compatibilité et les cas particuliers.</p>
      </header>
      <div className="reference-grid">
        {references.map((reference) => (
          <section
            id={reference.id}
            className="reference-card"
            key={reference.id}
            style={{ '--reference-color': reference.technology === 'html' ? '#b84f2c' : reference.technology === 'css' ? '#2569a8' : reference.technology === 'javascript' ? '#956e11' : '#54745a' }}
          >
            <span className="reference-symbol">&lt;/&gt;</span><h2>{reference.title}</h2><p>{reference.description}</p>
            <ul>{reference.links.map((link) => <li key={link.href}><a href={link.href} target="_blank" rel="noreferrer">{link.label}<span aria-hidden="true">↗</span></a></li>)}</ul>
          </section>
        ))}
      </div>
      <section className="quick-reference">
        <div className="reference-heading">
          <div><span className="eyebrow">INDEX PÉDAGOGIQUE</span><h2>Références par catégorie</h2><p>{referenceEntries.length} fiches avec syntaxe, exemple et lien vers MDN.</p></div>
          <label htmlFor="reference-search">Chercher une propriété ou méthode
            <input id="reference-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Ex. : map, clamp, Fetch" />
          </label>
        </div>
        <label className="technology-filter" htmlFor="reference-technology">Technologie
          <select id="reference-technology" value={technology} onChange={(event) => setTechnology(event.target.value)}>
            <option value="all">Toutes</option><option value="css">CSS</option><option value="javascript">JavaScript</option><option value="web">APIs Web</option>
          </select>
        </label>
        <div className="reference-categories">
          {groups.map((group) => (
            <details id={`category-${group.id}`} key={group.id}>
              <summary><span>{group.category}</span><small>{group.entries.length} notions · {group.technology.toUpperCase()}</small></summary>
              <div>{group.entries.map((entry) => (
                <article id={entry.id} key={entry.id}>
                  <div><h3>{entry.title}</h3><p>{entry.description}</p><pre><code>{entry.example}</code></pre></div>
                  <a href={entry.href} target="_blank" rel="noreferrer">Référence MDN ↗</a>
                </article>
              ))}</div>
            </details>
          ))}
          {groups.length === 0 && <p className="no-reference-results">Aucune référence ne correspond à cette recherche.</p>}
        </div>
      </section>
      <p className="reference-note">Les références complètes sont publiées et maintenues par MDN Web Docs. CodeCraft y renvoie pour les détails exhaustifs.</p>
    </>
  );
}
