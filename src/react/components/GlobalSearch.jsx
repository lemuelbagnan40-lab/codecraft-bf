import { useMemo, useState } from 'react';
import { searchResources } from '../../lib/services/search.js';
import { sitePath } from '../../lib/site-path.js';
import './GlobalSearch.css';

const typeLabels = {
  lesson: 'LEÇON',
  exercise: 'EXERCICE',
  reference: 'RÉFÉRENCE',
  module: 'CHAPITRE',
  project: 'PROJET',
  course: 'COURS'
};

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const suggestions = useMemo(
    () => query.trim().length >= 2 ? searchResources(query, { limit: 6 }) : [],
    [query]
  );
  const expanded = focused && suggestions.length > 0;

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      setFocused(true);
      setActiveIndex((index) => (index + 1) % suggestions.length);
    } else if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      setActiveIndex((index) => (index - 1 + suggestions.length) % suggestions.length);
    } else if (event.key === 'Escape') {
      setQuery('');
      setFocused(false);
    } else if (event.key === 'Enter' && expanded) {
      event.preventDefault();
      window.location.assign(sitePath(
        suggestions[activeIndex]?.href ?? `/recherche?q=${encodeURIComponent(query)}`
      ));
    }
  }

  return (
    <form
      className="global-search"
      action={sitePath('/recherche')}
      method="get"
      role="search"
      onSubmit={() => setFocused(false)}
    >
      <label className="visually-hidden" htmlFor="global-search-input">
        Rechercher un cours, une leçon, un exercice ou une notion
      </label>
      <span aria-hidden="true">⌕</span>
      <input
        id="global-search-input"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setActiveIndex(0);
        }}
        type="search"
        name="q"
        placeholder="Chercher une notion, une leçon…"
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={expanded}
        aria-controls="global-search-results"
        aria-activedescendant={expanded ? `global-search-option-${activeIndex}` : undefined}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        onKeyDown={handleKeyDown}
      />
      {query
        ? <button className="clear-search" type="button" aria-label="Effacer la recherche" onClick={() => {
            setQuery('');
            setFocused(true);
            document.querySelector('#global-search-input')?.focus();
          }}>×</button>
        : <kbd>Entrée</kbd>}
      {expanded && (
        <ul id="global-search-results" className="search-suggestions" role="listbox" aria-label="Suggestions de recherche">
          {suggestions.map((result, index) => (
            <li key={result.id} role="presentation">
              <a
                id={`global-search-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                href={sitePath(result.href)}
                onClick={() => setFocused(false)}
              >
                <span className="suggestion-type">
                  {result.technologies?.join(' · ') ?? result.technology?.toUpperCase()} · {typeLabels[result.type] ?? 'COURS'}
                </span>
                <strong>{result.title}</strong>
                <small>{result.description}</small>
              </a>
            </li>
          ))}
          <li className="all-results">
            <a href={sitePath(`/recherche?q=${encodeURIComponent(query)}`)}>
              Voir tous les résultats pour « {query} » →
            </a>
          </li>
        </ul>
      )}
    </form>
  );
}

