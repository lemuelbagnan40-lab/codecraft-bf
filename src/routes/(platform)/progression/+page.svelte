<script>
  import { sitePath } from '$lib/site-path.js';
  import SeoHead from '$lib/SeoHead.svelte';
  import { onMount } from 'svelte';
  import { courseCurricula } from '$lib/data/lessons/course-index.js';
  import { getProgressSummary, getProjectProgressSummary, getCourseLastLesson, PROGRESS_EVENT, readProgress } from '$lib/services/progress.js';

  let summary = $state(null);
  let projectSummary = $state(null);

  onMount(() => {
    const refresh = () => { const progress = readProgress(); summary = getProgressSummary(progress); projectSummary = getProjectProgressSummary(progress); };
    refresh();
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  });

  function lessonHref(lesson) {
    if (!lesson) return '/cours';
    if (lesson.type === 'legacy-lesson') return `/apprendre?cours=${lesson.legacyCourseId}&lecon=${encodeURIComponent(lesson.title)}`;
    return `/cours/${lesson.courseId}/lecons/${lesson.slug}`;
  }

  function resumeHref(course) {
    const last = getCourseLastLesson(course.id);
    if (last) return lessonHref(last);
    const first = courseCurricula.find((item) => item.id === course.id)?.modules[0]?.lessons[0];
    return lessonHref(first);
  }
</script>

<SeoHead title="Ma progression — CodeCraft" description="Consulte le suivi de tes leçons sur cet appareil." noindex />
<header class="page-heading"><span class="eyebrow">TON CHEMIN, À TON RYTHME</span><h1>Ma progression</h1><p>Le suivi est enregistré dans le stockage local de ce navigateur. Tes leçons commencées et terminées restent sur cet appareil.</p></header>
{#if summary}
  <section class="progress-card"><div class="progress-top"><div><span class="eyebrow">LEÇONS TERMINÉES</span><h2>{summary.totals.completed} / {summary.totals.lessons}</h2></div><span class="progress-percent">{summary.percent}%</span></div><div class="progress-track" role="progressbar" aria-label="Progression globale" aria-valuemin="0" aria-valuemax="100" aria-valuenow={summary.percent}><span style={`width:${summary.percent}%`}></span></div><p>{summary.totals.started} leçons commencées · {summary.totals.notStarted} à découvrir</p></section>
  <section class="course-progress"><h2>Progression par technologie</h2><div>{#each summary.courses as course}<article class="course-card"><div class="course-top"><span class="course-symbol" data-course={course.id}>{course.title === 'JavaScript' ? 'JS' : course.title[0]}</span><div class="course-heading"><h3>{course.title}</h3><p>{course.completed} terminées · {course.started} commencées · {course.notStarted} non commencées</p></div><span class="course-percent">{course.percent}%</span></div><div class="progress-track" role="progressbar" aria-label={`Progression ${course.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={course.percent}><span style={`width:${course.percent}%`}></span></div><div class="course-actions"><span>{course.completed} / {course.lessons} leçons terminées</span><a href={sitePath(resumeHref(course))}>Reprendre {course.lastLesson ? `: ${course.lastLesson.title}` : 'le parcours'} →</a></div>
      <details class="chapter-details"><summary>Voir la progression par chapitre</summary><div class="chapter-list">{#each course.modules as module}<article><div><strong>{module.title}</strong><span>{module.completed} / {module.lessons} · {module.status === 'completed' ? 'Terminé' : module.status === 'started' ? 'En cours' : 'Non commencé'}</span></div><span class="chapter-percent">{module.percent}%</span><div class="progress-track" role="progressbar" aria-label={`Progression ${module.title}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={module.percent}><span style={`width:${module.percent}%`}></span></div></article>{/each}</div></details>
    </article>{/each}</div></section>
  {#if projectSummary}<section class="projects-progress"><div class="projects-progress-heading"><div><h2>Progression des projets</h2><p>{projectSummary.completed} terminés · {projectSummary.started} commencés · {projectSummary.notStarted} à découvrir</p></div><a href={sitePath('/projets')}>Explorer les projets →</a></div><div class="progress-track" role="progressbar" aria-label="Projets terminés" aria-valuemin="0" aria-valuemax="100" aria-valuenow={projectSummary.percent}><span style={`width:${projectSummary.percent}%`}></span></div><div class="project-progress-grid">{#each projectSummary.projects.filter((project) => project.status !== 'not-started') as project}<a class="project-progress-item" href={sitePath(project.href)}><span>{project.status === 'completed' ? '✓ Terminé' : 'En cours'}</span><strong>{project.title}</strong><small>{project.status === 'completed' ? `Terminé le ${new Date(project.completedAt).toLocaleDateString('fr-FR')}` : `Commencé le ${new Date(project.startedAt).toLocaleDateString('fr-FR')}`}</small></a>{/each}</div>{#if projectSummary.started === 0 && projectSummary.completed === 0}<p class="no-projects-started">Tu n’as pas encore commencé de projet. <a href={sitePath('/projets')}>Choisir un premier projet</a>.</p>{/if}</section>{/if}
{:else}
  <p class="loading-state" role="status">Chargement de ta progression locale…</p>
{/if}
<p class="local-note">La plateforme n’a pas de compte ni de synchronisation distante. Effacer les données du navigateur peut supprimer cette progression.</p>

<style>
  .page-heading{max-width:720px;margin-bottom:24px}.eyebrow{color:#688774;font-size:10px;font-weight:800;letter-spacing:1.3px}.page-heading h1{margin:8px 0;font:800 34px Manrope,system-ui,sans-serif;letter-spacing:-1px;color:#29372e}.page-heading p{margin:0;color:#718076;font-size:13px;line-height:1.75}.progress-card{max-width:900px;padding:22px;border:1px solid #e3eae3;border-radius:14px;background:#fff}.progress-top{display:flex;align-items:center;justify-content:space-between}.progress-top h2{margin:7px 0;color:#29372e;font:800 30px Manrope,system-ui,sans-serif}.progress-percent{color:#287a4b;font:800 24px Manrope,system-ui,sans-serif}.progress-track{height:9px;overflow:hidden;border-radius:8px;background:#edf2ed}.progress-track span{display:block;height:100%;border-radius:inherit;background:#45a768;transition:width .25s}.progress-card>p{margin:12px 0 0;color:#7c887f;font-size:11px}.course-progress{max-width:900px;margin-top:29px}.course-progress>h2{color:#2e3b32;font:750 19px Manrope,system-ui,sans-serif}.course-progress>div{display:grid;gap:12px}.course-card{display:grid;gap:12px;padding:16px;border:1px solid #e5ebe5;border-radius:12px;background:#fff}.course-top{display:flex;align-items:center;gap:11px}.course-symbol{width:38px;height:38px;flex:0 0 38px;display:grid;place-items:center;border-radius:10px;background:#edf5ee;color:#267849;font:800 12px ui-monospace,monospace}.course-symbol[data-course="css"]{background:#edf4fb;color:#2569a8}.course-symbol[data-course="javascript"]{background:#faf4dc;color:#956e11}.course-heading{flex:1}.course-heading h3{margin:0;color:#344239;font-size:13px}.course-heading p{margin:4px 0 0;color:#849087;font-size:10px}.course-percent{color:#287a4b;font:800 17px Manrope,system-ui,sans-serif}.course-actions{display:flex;justify-content:space-between;gap:10px;color:#7c887f;font-size:10px}.course-actions a{color:#267849;font-weight:700;text-decoration:none}.chapter-details{padding-top:10px;border-top:1px solid #edf0ed;color:#536258;font-size:11px}.chapter-details summary{cursor:pointer;font-weight:700}.chapter-list{display:grid;gap:9px;margin-top:12px}.chapter-list article{display:grid;grid-template-columns:1fr auto;gap:7px;padding:10px;border:1px solid #e8ede8;border-radius:8px;background:#fafcf9}.chapter-list article>div:first-child{display:grid;gap:4px}.chapter-list strong{color:#3d4e42;font-size:10px}.chapter-list article span{color:#7d8a80;font-size:9px}.chapter-list .progress-track{grid-column:1/-1;height:6px}.chapter-percent{font-weight:750}.loading-state{color:#758279;font-size:12px}.local-note{max-width:900px;margin-top:17px;color:#879189;font-size:10px;line-height:1.6}.projects-progress{max-width:900px;margin-top:27px;padding:20px;border:1px solid #e4eae3;border-radius:13px;background:var(--surface,#fff)}.projects-progress-heading{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:15px}.projects-progress-heading h2{margin:0;color:var(--text,#25342b);font:750 18px Manrope,system-ui,sans-serif}.projects-progress-heading p{margin:5px 0 0;color:var(--muted,#78867c);font-size:10px}.projects-progress-heading>a{color:var(--accent,#197749);font-size:10px;font-weight:750;text-decoration:none}.project-progress-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;margin-top:14px}.project-progress-item{display:grid;gap:4px;padding:10px;border:1px solid var(--line,#e5ebe5);border-radius:8px;color:var(--text,#25342b);text-decoration:none}.project-progress-item:hover{border-color:var(--accent,#197749)}.project-progress-item span{color:var(--accent,#197749);font-size:8px;font-weight:800;text-transform:uppercase;letter-spacing:.5px}.project-progress-item strong{font-size:10px}.project-progress-item small,.no-projects-started{color:var(--muted,#78867c);font-size:9px}.no-projects-started a{color:var(--accent,#197749);font-weight:700;text-decoration:none}:global(.platform-shell[data-theme="dark"] .projects-progress){border-color:#35443a;background:#202a23}
  @media(max-width:600px){.project-progress-grid{grid-template-columns:1fr}.projects-progress-heading{align-items:flex-start;flex-direction:column}}
</style>
