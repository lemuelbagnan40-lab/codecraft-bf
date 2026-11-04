<script>
  import { sitePath } from '$lib/site-path.js';
  import { goto } from '$app/navigation';
  import { searchResources } from '$lib/services/search.js';

  let query = $state('');
  let focused = $state(false);
  let activeIndex = $state(0);
  const suggestions = $derived(query.trim().length >= 2 ? searchResources(query, { limit: 6 }) : []);
  const expanded = $derived(focused && suggestions.length > 0);

  function handleKeydown(event) {
    if (event.key === 'ArrowDown' && suggestions.length) {
      event.preventDefault();
      focused = true;
      activeIndex = (activeIndex + 1) % suggestions.length;
    } else if (event.key === 'ArrowUp' && suggestions.length) {
      event.preventDefault();
      activeIndex = (activeIndex - 1 + suggestions.length) % suggestions.length;
    } else if (event.key === 'Escape') {
      query = '';
      focused = false;
    } else if (event.key === 'Enter' && expanded) {
      event.preventDefault();
      goto(suggestions[activeIndex]?.href ?? `/recherche?q=${encodeURIComponent(query)}`);
    }
  }
</script>

<form class="global-search" action={sitePath('/recherche')} method="get" role="search" onsubmit={() => focused = false}>
  <label class="visually-hidden" for="global-search-input">Rechercher un cours, une leçon ou une notion</label>
  <span aria-hidden="true">⌕</span>
  <input id="global-search-input" bind:value={query} type="search" name="q" placeholder="Chercher une notion…" autocomplete="off" role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls="global-search-results" aria-activedescendant={expanded ? `global-search-option-${activeIndex}` : undefined} onfocus={() => focused = true} oninput={() => activeIndex = 0} onkeydown={handleKeydown} />
  {#if query}<button class="clear-search" type="button" aria-label="Effacer la recherche" onclick={() => { query = ''; focused = true; document.querySelector('#global-search-input')?.focus(); }}>×</button>{:else}<kbd>Entrée</kbd>{/if}
  {#if expanded}
    <ul id="global-search-results" class="search-suggestions" role="listbox" aria-label="Suggestions de recherche">
      {#each suggestions as result, index (result.id)}
        <li role="presentation"><a id={`global-search-option-${index}`} role="option" aria-selected={index === activeIndex} href={sitePath(result.href)} onclick={() => focused = false}><span class="suggestion-type">{result.technologies?.join(' · ') ?? result.technology.toUpperCase()} · {result.type === 'lesson' ? 'LEÇON' : result.type === 'exercise' ? 'EXERCICE' : result.type === 'reference' ? 'RÉFÉRENCE' : result.type === 'module' ? 'CHAPITRE' : result.type === 'project' ? 'PROJET' : 'COURS'}</span><strong>{result.title}</strong><small>{result.description}</small></a></li>
      {/each}
      <li class="all-results"><a href={sitePath(`/recherche?q=${encodeURIComponent(query)}`)}>Voir tous les résultats pour « {query} » →</a></li>
    </ul>
  {/if}
</form>

<style>
  .global-search{position:relative;height:39px;max-width:390px;min-width:170px;flex:1;display:flex;align-items:center;gap:8px;padding:0 10px;border:1px solid var(--line);border-radius:9px;background:var(--surface-soft);color:var(--muted)}.global-search>span{font-size:20px}.global-search input{width:100%;min-width:0;border:0;outline:0;background:transparent;color:var(--text);font-size:12px}.global-search input::placeholder{color:var(--muted)}.global-search kbd{white-space:nowrap;padding:3px 5px;border:1px solid var(--line);border-radius:4px;color:var(--muted);font:9px 'DM Sans',sans-serif}.clear-search{border:0;background:transparent;color:var(--muted);font-size:18px;cursor:pointer}.search-suggestions{position:absolute;z-index:50;top:calc(100% + 8px);left:0;width:min(520px,90vw);max-height:min(70vh,520px);overflow:auto;margin:0;padding:6px;border:1px solid var(--line);border-radius:11px;background:var(--surface);box-shadow:0 14px 36px #18291a20;list-style:none}.search-suggestions a{display:grid;gap:3px;padding:9px 10px;border-radius:7px;color:var(--text);text-decoration:none}.search-suggestions [role="option"][aria-selected="true"],.search-suggestions a:hover{background:var(--surface-soft)}.suggestion-type{color:var(--accent);font-size:8px;font-weight:800;letter-spacing:.7px}.search-suggestions strong{font-size:11px}.search-suggestions small{overflow:hidden;color:var(--muted);font-size:9px;text-overflow:ellipsis;white-space:nowrap}.search-suggestions .all-results{margin-top:4px;border-top:1px solid var(--line)}.search-suggestions .all-results a{color:var(--accent);font-size:10px;font-weight:700}.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
</style>
