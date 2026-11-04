<script>
  import { sitePath } from '$lib/site-path.js';
  import SeoHead from '$lib/SeoHead.svelte';
  import { onMount } from 'svelte';
  import { markProjectCompleted, markProjectStarted } from '$lib/services/progress.js';

  let { data } = $props();
  let started = $state(false);
  let completed = $state(false);
  let tasks = $state([]);
  let newTask = $state('');
  let notice = $state('');
  const storageKey = $derived(`webschool-project-${data.project.id}`);
  const isTodo = $derived(data.project.id === 'todo-list');
  const isAvailable = $derived(data.project.status === 'available');

  onMount(() => {
    try {
      const progress = JSON.parse(localStorage.getItem('webschool-progress-v1') ?? '{}');
      const saved = progress.projects?.[data.project.id];
      started = saved?.status === 'started' || saved?.status === 'completed';
      completed = saved?.status === 'completed';
      if (isTodo) {
        const savedTasks = JSON.parse(localStorage.getItem(storageKey) ?? '[]');
        if (Array.isArray(savedTasks)) tasks = savedTasks.filter((task) => task && typeof task.text === 'string' && typeof task.done === 'boolean');
      }
    } catch { /* La fiche reste utilisable sans stockage local. */ }
  });

  function beginProject() {
    if (!isAvailable) return;
    started = true;
    markProjectStarted(data.project.id);
    notice = 'Projet commencé. Ta progression est enregistrée sur cet appareil.';
  }

  function persistTasks() {
    try { localStorage.setItem(storageKey, JSON.stringify(tasks)); }
    catch { notice = 'La liste fonctionne, mais le navigateur ne permet pas de la sauvegarder.'; }
  }

  function addTask(event) {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;
    tasks = [...tasks, { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, done: false }];
    newTask = '';
    persistTasks();
    beginProject();
  }

  function toggleTask(id) {
    tasks = tasks.map((task) => task.id === id ? { ...task, done: !task.done } : task);
    persistTasks();
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    persistTasks();
  }

  function completeProject() {
    completed = markProjectCompleted(data.project.id);
    started = true;
    notice = completed ? 'Bravo, projet marqué comme terminé !' : 'Impossible d’enregistrer la progression dans ce navigateur.';
  }
</script>

<SeoHead title={`${data.project.title} : projet pratique — CodeCraft`} description={data.project.description} path={`/projets/${data.project.id}`} noindex={data.project.status !== 'available'} />

<a class="back-link" href={sitePath('/projets')}>â† Tous les projets</a>
<header class="project-heading"><span class="eyebrow">PROJET · {data.project.level.toUpperCase()} · {data.project.duration}</span><h1>{data.project.title}</h1><p>{data.project.description}</p><div class="tech-list">{#each data.project.technologies as tech}<span>{tech}</span>{/each}</div></header>

<div class="project-layout">
  <section class="project-content">
    <section class="panel"><span class="eyebrow">OBJECTIF</span><h2>Ce que tu vas construire</h2><p>{isTodo ? 'Une liste de tâches simple et personnelle : ajoute un élément, marque-le comme réalisé et retire-le si besoin. Les tâches restent enregistrées localement dans ce navigateur.' : 'Un projet guidé pour appliquer les notions des cours et bâtir progressivement une réalisation à montrer dans ton portfolio.'}</p>
      {#if !isAvailable}<p class="coming-note">Le parcours guidé de ce projet est encore en préparation.</p>{:else if !started}<button class="primary-button" type="button" onclick={beginProject}>Commencer ce projet →</button>{:else}<p class="started-note">✓ Projet commencé</p>{/if}
    </section>

    {#if isTodo}
      <section class="todo-panel" aria-labelledby="todo-title"><div class="todo-title"><div><span class="eyebrow">ATELIER PRATIQUE</span><h2 id="todo-title">Ma liste de tâches</h2></div><span class="task-count">{tasks.filter((task) => !task.done).length} à faire</span></div>
        <form onsubmit={addTask}><label for="new-task">Nouvelle tâche</label><div class="add-row"><input id="new-task" bind:value={newTask} maxlength="120" placeholder="Ex. Réviser les événements" /><button type="submit">Ajouter</button></div></form>
        {#if tasks.length}<ul class="task-list">{#each tasks as task (task.id)}<li><label><input type="checkbox" checked={task.done} onchange={() => toggleTask(task.id)} /><span class:done={task.done}>{task.text}</span></label><button class="delete-button" type="button" aria-label={`Supprimer : ${task.text}`} onclick={() => deleteTask(task.id)}>Supprimer</button></li>{/each}</ul>{:else}<p class="empty-tasks">Ta liste est vide. Ajoute une tâche pour commencer.</p>{/if}
        <p class="storage-hint">Les tâches sont sauvegardées sur cet appareil avec localStorage.</p>
      </section>
      <section class="panel steps"><span class="eyebrow">ÉTAPES DU DÉFI</span><h2>À toi d’aller plus loin</h2><ol><li>Ajoute plusieurs tâches et marque-en une comme terminée.</li><li>Supprime une tâche dont tu n’as plus besoin.</li><li>Observe la liste après actualisation : les données persistent.</li><li>Quand tu as terminé et compris les interactions, marque le projet comme terminé.</li></ol>{#if !completed}<button class="complete-button" type="button" onclick={completeProject}>J’ai terminé le projet</button>{:else}<p class="completed-note">✓ Projet terminé. Tu peux revenir modifier ta liste quand tu veux.</p>{/if}</section>
    {:else}
      <section class="panel steps"><span class="eyebrow">PARCOURS EN PRÉPARATION</span><h2>Ce projet n’a pas encore son atelier guidé</h2><p>Cette fiche présente les objectifs et les notions à mobiliser. Le parcours détaillé sera ajouté ultérieurement.</p><h3>Notions à pratiquer</h3><ul>{#each data.project.concepts as concept}<li>{concept}</li>{/each}</ul></section>
    {/if}
    {#if notice}<p class="notice" role="status">{notice}</p>{/if}
  </section>
  <aside class="side-panel"><section class="panel"><span class="eyebrow">NOTIONS TRAVAILLÉES</span><ul class="concept-list">{#each data.project.concepts as concept}<li><span>✓</span>{concept}</li>{/each}</ul></section><section class="panel"><span class="eyebrow">LEÇONS ASSOCIÉES</span>{#if data.project.lessons.length}<ul class="lesson-list">{#each data.project.lessons as lesson}<li><a href={sitePath(`/cours/${lesson.courseId}/lecons/${lesson.slug}`)}><small>{lesson.courseId === 'javascript' ? 'JAVASCRIPT' : lesson.courseId.toUpperCase()}</small><span>{lesson.title} →</span></a></li>{/each}</ul>{:else}<p>Aucune leçon associée n’est encore disponible.</p>{/if}</section></aside>
</div>

<style>
  .back-link{display:inline-block;margin-bottom:18px;color:#55705d;font-size:11px;font-weight:700;text-decoration:none}.back-link:hover{text-decoration:underline}.project-heading{padding:28px 30px;border:1px solid #e3eae2;border-radius:15px;background:linear-gradient(115deg,#edf6ed,#f8f4e8)}.eyebrow{color:#688774;font-size:9px;font-weight:800;letter-spacing:1.2px}.project-heading h1{margin:10px 0 7px;color:#27372d;font:800 clamp(28px,4vw,40px)/1.12 Manrope,system-ui,sans-serif;letter-spacing:-1.3px}.project-heading>p{max-width:700px;margin:0;color:#6c7a70;font-size:13px;line-height:1.7}.tech-list{display:flex;gap:6px;margin-top:13px}.tech-list span{padding:5px 8px;border:1px solid #e2e9e1;border-radius:5px;background:#fff;color:#52675a;font-size:9px;font-weight:750}.project-layout{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(220px,.8fr);align-items:start;gap:15px;margin-top:18px}.project-layout .project-content,.side-panel{display:grid;gap:14px}.panel,.todo-panel{padding:20px;border:1px solid #e3eae2;border-radius:12px;background:#fff}.panel h2,.todo-panel h2{margin:6px 0 8px;color:#2a3a30;font:750 19px Manrope,system-ui,sans-serif}.panel p{color:#6e7b72;font-size:12px;line-height:1.7}.primary-button,.complete-button,.add-row button{padding:10px 13px;border:0;border-radius:8px;background:#197749;color:white;font-size:11px;font-weight:750;cursor:pointer}.primary-button:hover,.complete-button:hover,.add-row button:hover{background:#125d38}.started-note,.completed-note{color:#277246!important;font-weight:700}.coming-note{padding:9px 11px;border-left:3px solid #c9a653;background:#faf7eb;color:#75643c!important;font-size:10px!important}.todo-title{display:flex;align-items:center;justify-content:space-between;gap:10px}.task-count{padding:6px 8px;border-radius:20px;background:#eef5ee;color:#37744c;font-size:9px;font-weight:750}.todo-panel form{margin-top:17px}.todo-panel form>label{display:block;margin-bottom:6px;color:#4b5e50;font-size:10px;font-weight:700}.add-row{display:flex;gap:7px}.add-row input{min-width:0;flex:1;padding:10px;border:1px solid #dce5dc;border-radius:7px;background:#fff;color:#2b3a30;font:12px 'DM Sans',system-ui,sans-serif}.add-row input:focus-visible{outline:3px solid #b9d8bf;outline-offset:1px}.task-list{display:grid;gap:5px;margin:13px 0;padding:0;list-style:none}.task-list li{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:9px 10px;border:1px solid #e8ede7;border-radius:7px}.task-list li>label{display:flex;align-items:center;gap:8px;min-width:0;color:#405146;font-size:11px}.task-list input{accent-color:#197749}.task-list .done{text-decoration:line-through;color:#849188}.delete-button{border:0;background:transparent;color:#a55349;font-size:9px;cursor:pointer}.empty-tasks,.storage-hint{color:#829087;font-size:10px}.storage-hint{margin:13px 0 0}.steps ol,.steps ul{padding-left:20px;color:#627167;font-size:11px;line-height:1.8}.steps h3{color:#3c5142;font-size:13px}.complete-button{margin-top:8px}.concept-list,.lesson-list{display:grid;gap:9px;margin:13px 0 0;padding:0;list-style:none}.concept-list li{display:flex;gap:8px;color:#637268;font-size:10px}.concept-list li>span{color:#337b4a;font-weight:800}.lesson-list li a{display:grid;gap:4px;padding:8px;border:1px solid #e9eee8;border-radius:7px;color:#3d5143;text-decoration:none}.lesson-list li a:hover{border-color:#a4c5a8;background:#f8fbf8}.lesson-list small{color:#7c8b7e;font-size:8px;font-weight:800;letter-spacing:.6px}.lesson-list span{font-size:10px;line-height:1.45}.side-panel>.panel>p{font-size:10px}.notice{padding:11px 13px;border:1px solid #dbe9d9;border-radius:8px;background:#f3f8f1;color:#39704a;font-size:10px}.completed-note{font-size:11px!important}
  :global(.platform-shell[data-theme="dark"]) .project-heading{border-color:#35443a;background:linear-gradient(115deg,#20362a,#2c3026)}:global(.platform-shell[data-theme="dark"]) .project-heading h1,:global(.platform-shell[data-theme="dark"]) .panel h2,:global(.platform-shell[data-theme="dark"]) .todo-panel h2{color:#eef4ee}:global(.platform-shell[data-theme="dark"]) .panel,:global(.platform-shell[data-theme="dark"]) .todo-panel{border-color:#35443a;background:#202a23}:global(.platform-shell[data-theme="dark"]) .tech-list span,:global(.platform-shell[data-theme="dark"]) .add-row input{border-color:#3a493e;background:#263329;color:#e7efe7}:global(.platform-shell[data-theme="dark"]) .task-list li,:global(.platform-shell[data-theme="dark"]) .lesson-list li a{border-color:#35443a;color:#e2ebe2}:global(.platform-shell[data-theme="dark"]) .notice{border-color:#38533d;background:#243327;color:#aad2ae}
  @media(max-width:760px){.project-layout{grid-template-columns:1fr}.side-panel{grid-row:1}.project-heading{padding:22px}.panel,.todo-panel{padding:16px}}
</style>
