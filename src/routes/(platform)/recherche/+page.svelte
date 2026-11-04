<script>
  import { sitePath } from '$lib/site-path.js';
  import SeoHead from '$lib/SeoHead.svelte';
  import { searchResources } from '$lib/services/search.js';

  let { data } = $props();
  let technology = $state('all');
  let type = $state('all');
  let results = $derived(searchResources(data.query, { technology, type }));

  $effect(() => {
    technology = data.technology ?? 'all';
    type = data.type ?? 'all';
  });

  const technologies = [
    { id: 'all', label: 'Toutes les technologies' },
    { id: 'html', label: 'HTML' }, { id: 'css', label: 'CSS' },
    { id: 'javascript', label: 'JavaScript' }, { id: 'web', label: 'APIs Web' }
  ];
  const types = [
    { id: 'all', label: 'Tous les contenus' }, { id: 'course', label: 'Cours' },
    { id: 'module', label: 'Chapitres' }, { id: 'lesson', label: 'Leçons' },
    { id: 'exercise', label: 'Exercices' }, { id: 'reference', label: 'Références' },
    { id: 'project', label: 'Projets' }
  ];

  function resultType(result) {
    return ({ course: 'Cours', module: 'Chapitre', lesson: 'Leçon', exercise: 'Exercice', reference: 'Référence', project: 'Projet' })[result.type] ?? 'Ressource';
  }
</script>

<SeoHead title="Recherche — CodeCraft" description="Recherche dans les parcours, leçons, exercices et références CodeCraft." noindex />
<header class="search-heading"><span class="eyebrow">RECHERCHER DANS CODECRAFT</span><h1>Résultats de recherche</h1>{#if data.query}<p>Pour « {data.query} »</p>{:else}<p>Recherche dans les parcours, les leçons et les références.</p>{/if}</header>
<form class="search-form" action={sitePath('/recherche')} method="get" role="search"><label for="search-page-query">Notion à rechercher</label><div class="query-row"><input id="search-page-query" name="q" type="search" value={data.query} placeholder="Ex. : flex, tableau, addEventListener" /><button type="submit">Rechercher</button>{#if data.query}<a href={sitePath('/recherche')} aria-label="Effacer la recherche">Effacer</a>{/if}</div></form>
{#if data.query.trim()}
  <div class="filters"><label for="technology-filter">Technologie<select id="technology-filter" bind:value={technology}>{#each technologies as item}<option value={item.id}>{item.label}</option>{/each}</select></label><label for="type-filter">Type de contenu<select id="type-filter" bind:value={type}>{#each types as item}<option value={item.id}>{item.label}</option>{/each}</select></label><p class="result-count" role="status">{results.length} résultat{results.length === 1 ? '' : 's'}</p></div>
  {#if results.length}
    <ol class="results">{#each results as result (result.id)}<li><article><div class="result-top"><span class="result-type">{resultType(result)}</span><span class="result-tech">{result.technologies?.join(' · ') ?? result.technology.toUpperCase()}</span></div><h2><a href={sitePath(result.href)}>{result.title}</a></h2><p>{result.description}</p>{#if result.excerpt}<p class="excerpt">{result.excerpt}</p>{/if}<div class="result-bottom">{#each result.keywords.slice(0, 5) as keyword}<span>{keyword}</span>{/each}<a class="open-result" href={sitePath(result.href)}>Ouvrir <span aria-hidden="true">→</span></a></div></article></li>{/each}</ol>
  {:else}
    <section class="empty-state"><span aria-hidden="true">⌕</span><h2>Aucun résultat pour « {data.query} »</h2><p>Essaie une partie du nom, sans accent si besoin, ou modifie les filtres.</p><a href={sitePath('/cours')}>Parcourir les cours</a></section>
  {/if}
{/if}

<style>
  .eyebrow{color:#688774;font-size:10px;font-weight:800;letter-spacing:1.3px}.search-heading h1{margin:8px 0;font:800 31px Manrope,system-ui,sans-serif;letter-spacing:-1px;color:#29372e}.search-heading p{margin:0;color:#718076;font-size:13px}.search-form{max-width:800px;margin-top:23px}.search-form>label,.filters label{display:grid;gap:6px;color:#536257;font-size:10px;font-weight:700}.query-row{display:flex;align-items:center;gap:8px;margin-top:6px}.query-row input{min-width:0;flex:1;padding:11px 12px;border:1px solid #dfe7df;border-radius:8px;background:#fff;color:#344239;font-size:12px}.query-row button{padding:11px 14px;border:0;border-radius:8px;background:#197749;color:white;font-size:11px;font-weight:700;cursor:pointer}.query-row>a{color:#607365;font-size:10px}.filters{display:flex;align-items:end;flex-wrap:wrap;gap:12px;margin:20px 0 12px}.filters select{min-width:175px;padding:9px;border:1px solid #dfe7df;border-radius:7px;background:#fff;color:#35443a;font-size:11px}.result-count{margin:0 0 2px auto;color:#738177;font-size:10px}.results{display:grid;gap:10px;margin:0;padding:0;list-style:none}.results article{padding:15px 17px;border:1px solid #e5ebe5;border-radius:11px;background:#fff}.result-top{display:flex;gap:8px;align-items:center}.result-type{color:#267849;font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:.7px}.result-tech{padding:3px 6px;border-radius:10px;background:#eff4ef;color:#607264;font-size:8px}.results h2{margin:6px 0;color:#2b392f;font:800 16px Manrope,system-ui,sans-serif}.results h2 a{color:inherit;text-decoration:none}.results h2 a:hover{text-decoration:underline}.results article>p{margin:0;color:#718076;font-size:11px;line-height:1.65}.results article>p.excerpt{margin-top:5px;color:#53685a}.result-bottom{display:flex;align-items:center;flex-wrap:wrap;gap:5px;margin-top:10px}.result-bottom>span{padding:3px 7px;border-radius:20px;background:#f0f5f0;color:#55705b;font-size:8px}.result-bottom .open-result{display:flex;gap:8px;align-items:center;margin-left:auto;color:#267849;font-size:10px;font-weight:700;text-decoration:none}.empty-state{max-width:600px;margin:30px auto;padding:25px;border:1px solid #e4ebe4;border-radius:14px;background:#fff;text-align:center}.empty-state>span{color:#43865a;font-size:30px}.empty-state h2{margin:8px 0;color:#2e3c32;font:750 18px Manrope,system-ui,sans-serif}.empty-state p{color:#7b887f;font-size:11px;line-height:1.65}.empty-state>a{color:#267748;font-size:11px;font-weight:700;text-decoration:none}:global(.platform-shell[data-theme="dark"]) .search-heading h1,:global(.platform-shell[data-theme="dark"]) .results h2,:global(.platform-shell[data-theme="dark"]) .empty-state h2{color:#eef4ee}:global(.platform-shell[data-theme="dark"]) .search-form>label,:global(.platform-shell[data-theme="dark"]) .filters label{color:#d5e0d7}:global(.platform-shell[data-theme="dark"]) .query-row input,:global(.platform-shell[data-theme="dark"]) .filters select,:global(.platform-shell[data-theme="dark"]) .results article,:global(.platform-shell[data-theme="dark"]) .empty-state{border-color:#35443a;background:#202a23;color:#e6eee7}@media(max-width:600px){.search-heading h1{font-size:27px}.query-row{flex-wrap:wrap}.query-row input{flex-basis:100%}.filters label{flex:1}.filters select{min-width:130px}.result-count{width:100%;margin:0}}
</style>
