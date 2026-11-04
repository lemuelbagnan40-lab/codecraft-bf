<script>
  import { sitePath } from '$lib/site-path.js';
  import SeoHead from '$lib/SeoHead.svelte';
  import { onMount } from 'svelte';
  import CodePlayground from '$lib/components/CodePlayground.svelte';
  import LessonExercise from '$lib/components/LessonExercise.svelte';
  import { validateExercise } from '$lib/services/exercise-validation.js';
  import { markLessonCompleted, markLessonStarted, PROGRESS_EVENT, readProgress } from '$lib/services/progress.js';

  let { data } = $props();
  let { lesson, previous, next, lessonNumber, totalLessons, modules } = $derived(data);
  let exerciseResults = $state({});
  let isCompleted = $state(false);
  let progressSnapshot = $state({ lessons: {} });

  $effect(() => {
    const lessonId = lesson.id;
    markLessonStarted(lessonId);
    progressSnapshot = readProgress();
    isCompleted = progressSnapshot.lessons[lessonId]?.status === 'completed';
  });

  onMount(() => {
    const refresh = () => {
      progressSnapshot = readProgress();
      isCompleted = progressSnapshot.lessons[lesson.id]?.status === 'completed';
    };
    window.addEventListener(PROGRESS_EVENT, refresh);
    window.addEventListener('storage', refresh);
    refresh();
    return () => {
      window.removeEventListener(PROGRESS_EVENT, refresh);
      window.removeEventListener('storage', refresh);
    };
  });

  function checkExercise(exercise, answer) {
    exerciseResults[exercise.id] = validateExercise(exercise, answer);
  }

  function completeLesson() {
    const saved = markLessonCompleted(lesson.id);
    progressSnapshot = readProgress();
    isCompleted = saved || progressSnapshot.lessons[lesson.id]?.status === 'completed';
  }
</script>

<SeoHead title={`${lesson.title} : cours ${lesson.courseId === 'javascript' ? 'JavaScript' : lesson.courseId.toUpperCase()} — CodeCraft`} description={lesson.introduction} path={`/cours/${lesson.courseId}/lecons/${lesson.slug}`} />

<nav class="breadcrumb" aria-label="Fil d’Ariane"><a href={sitePath('/cours')}>Cours</a><span aria-hidden="true">/</span><a href={sitePath(`/cours/${lesson.courseId}`)}>{lesson.courseId === 'javascript' ? 'JavaScript' : lesson.courseId.toUpperCase()}</a><span aria-hidden="true">/</span><span aria-current="page">{lesson.title}</span></nav>
<div class="lesson-layout">
  <aside class="lesson-sidebar" aria-label={`Leçons ${lesson.courseId}`}><div class="sidebar-heading"><span>PARCOURS {lesson.courseId === 'javascript' ? 'JAVASCRIPT' : lesson.courseId.toUpperCase()}</span><strong>{lessonNumber} / {totalLessons}</strong></div>{#each modules as module}<details class="module-nav" open={module.id === lesson.moduleId}><summary>{module.title}<span>{module.lessons.filter((item) => item.id === lesson.id || progressSnapshot.lessons[item.id]?.status === 'completed').length}/{module.lessons.length}</span></summary><div class="lesson-list">{#each module.lessons as item}<a class:active={item.id === lesson.id} aria-current={item.id === lesson.id ? 'page' : undefined} href={sitePath(`/cours/${lesson.courseId}/lecons/${item.slug}`)}><span class="lesson-marker">{item.id === lesson.id ? 'â—' : progressSnapshot.lessons[item.id]?.status === 'completed' ? '✓' : '○'}</span>{item.title}</a>{/each}</div></details>{/each}<a class="all-courses" href={sitePath(`/cours/${lesson.courseId}`)}>Voir la vue d’ensemble →</a></aside>
  <article class="lesson-content">
    <div class="lesson-meta"><span>HTML · {lesson.level}</span><span>{lesson.duration} de lecture</span></div>
    <h1>{lesson.title}</h1><p class="lesson-intro">{lesson.introduction}</p>
    <section class="learning-goals"><h2>À la fin de cette leçon</h2><ul>{#each lesson.objectives as objective}<li><span aria-hidden="true">✓</span>{objective}</li>{/each}</ul><p><strong>Prérequis :</strong> {lesson.prerequisites}</p></section>
    {#each lesson.sections as section, index}<section class="lesson-section"><span class="section-number">0{index + 1}</span><h2>{section.title}</h2><p>{section.body}</p>{#if section.code}<pre><code>{section.code}</code></pre>{/if}{#if section.explanation}<p class="explanation"><strong>À retenir :</strong> {section.explanation}</p>{/if}{#if section.callout}<aside class="callout">{section.callout}</aside>{/if}</section>{/each}
    <section class="example-section"><span class="eyebrow">À TOI DE JOUER</span><h2>Modifie et exécute l’exemple</h2><p>{lesson.example.expectedResult}</p><CodePlayground example={lesson.example} title={`Atelier ${lesson.courseId === 'javascript' ? 'JavaScript' : lesson.courseId.toUpperCase()}`} /></section>
    <section class="exercises-section"><span class="eyebrow">VÉRIFIER SES ACQUIS</span><h2>Exercices</h2><p>Essaie de répondre avant de consulter l’explication.</p>{#each lesson.exercises as exercise (exercise.id)}<LessonExercise {exercise} result={exerciseResults[exercise.id]} onCheck={(answer) => checkExercise(exercise, answer)} />{/each}</section>
    <section class="summary"><h2>Les idées à retenir</h2><ul>{#each lesson.summary as item}<li>{item}</li>{/each}</ul></section>
    {#if lesson.related?.length}<section class="related"><h2>Notions liées</h2>{#each lesson.related as item}<span>{item}</span>{/each}</section>{/if}
    <button class="complete-lesson" class:completed={isCompleted} type="button" onclick={completeLesson}>{isCompleted ? '✓ Leçon terminée' : 'Marquer la leçon comme terminée'}</button>
    <nav class="lesson-pagination" aria-label="Navigation entre les leçons">{#if previous}<a href={sitePath(`/cours/${lesson.courseId}/lecons/${previous.slug}`)}><span>â† Leçon précédente</span><strong>{previous.title}</strong></a>{:else}<a href={sitePath(`/cours/${lesson.courseId}`)}><span>â† Parcours</span><strong>Vue d’ensemble {lesson.courseId === 'javascript' ? 'JavaScript' : lesson.courseId.toUpperCase()}</strong></a>{/if}{#if next}<a class="next-link" href={sitePath(`/cours/${lesson.courseId}/lecons/${next.slug}`)}><span>Leçon suivante →</span><strong>{next.title}</strong></a>{:else}<a class="next-link" href={sitePath(`/cours/${lesson.courseId}`)}><span>Fin du parcours →</span><strong>Revoir les chapitres</strong></a>{/if}</nav>
  </article>
</div>

<style>
  .breadcrumb{display:flex;gap:9px;align-items:center;margin:2px 0 20px;color:#9aa59c;font-size:11px}.breadcrumb a{color:#50745a;text-decoration:none}.breadcrumb a:hover{text-decoration:underline}.lesson-layout{display:grid;grid-template-columns:245px minmax(0,1fr);gap:28px;align-items:start}.lesson-sidebar{position:sticky;top:20px;max-height:calc(100vh - 40px);overflow:auto;padding:12px;border:1px solid #e5ebe5;border-radius:12px;background:#fff}.sidebar-heading{display:flex;justify-content:space-between;gap:5px;margin-bottom:10px;color:#708176;font-size:9px;font-weight:800;letter-spacing:.7px}.sidebar-heading strong{color:#328252}.module-nav{border-top:1px solid #edf0ed}.module-nav summary{display:flex;justify-content:space-between;gap:8px;padding:9px 4px;color:#54665a;font-size:10px;font-weight:700;cursor:pointer}.module-nav summary span{color:#7f8e82;font-size:9px}.lesson-list{display:grid;gap:3px;padding-bottom:5px}.lesson-list a{display:flex;gap:7px;align-items:flex-start;padding:7px 6px;border-radius:7px;color:#68756b;font-size:9px;line-height:1.45;text-decoration:none}.lesson-list a:hover,.lesson-list a.active{background:#eff6ef;color:#267547}.lesson-marker{flex:0 0 11px;color:#57946a}.all-courses{display:block;margin-top:10px;padding-top:10px;border-top:1px solid #edf0ed;color:#347b4d;font-size:10px;text-decoration:none}.lesson-content{max-width:830px;min-width:0}.lesson-meta{display:flex;gap:10px;color:#6b8b73;font-size:10px;font-weight:700}.lesson-meta span+span:before{content:'·';margin-right:10px;color:#aab4aa}.lesson-content h1{margin:9px 0 12px;color:#29382e;font:800 clamp(29px,4vw,41px)/1.15 Manrope,system-ui,sans-serif;letter-spacing:-1.2px}.lesson-intro{max-width:710px;color:#66746a;font-size:15px;line-height:1.8}.learning-goals,.summary{margin:23px 0;padding:17px 19px;border:1px solid #e2ebe1;border-radius:11px;background:#f7faf5}.learning-goals h2,.summary h2{margin:0 0 11px;color:#35453a;font-size:14px}.learning-goals ul,.summary ul{display:grid;gap:8px;margin:0;padding:0;list-style:none}.learning-goals li,.summary li{display:flex;gap:9px;color:#58685d;font-size:12px;line-height:1.6}.learning-goals li span{color:#2d8b50}.learning-goals>p{margin:12px 0 0;color:#748177;font-size:11px}.lesson-section{position:relative;margin:33px 0}.section-number{color:#398556;font:700 10px ui-monospace,monospace}.lesson-section h2,.example-section h2,.exercises-section h2{margin:5px 0 10px;color:#35443a;font:750 21px Manrope,system-ui,sans-serif}.lesson-section>p,.example-section>p,.exercises-section>p{color:#606e64;font-size:13px;line-height:1.8}.lesson-section pre{overflow:auto;padding:14px;border:1px solid #e6ece6;border-radius:8px;background:#f6f8f6;color:#335941;font:12px/1.7 ui-monospace,Consolas,monospace;white-space:pre}.explanation{padding:12px;border-left:3px solid #61a774;background:#f5f9f4}.callout{padding:13px;border:1px solid #dcebdc;border-radius:8px;background:#f2f8f0;color:#45634c;font-size:12px;line-height:1.7}.example-section,.exercises-section{margin-top:37px}.eyebrow{color:#64846b;font-size:9px;font-weight:800;letter-spacing:1px}.example-section>h2,.exercises-section>h2{margin-top:6px}.summary{margin-top:35px}.related{display:flex;align-items:center;flex-wrap:wrap;gap:7px;margin:20px 0}.related h2{width:100%;color:#35443a;font-size:13px}.related span{padding:5px 8px;border-radius:20px;background:#eef5ee;color:#4f7057;font-size:10px}.complete-lesson{margin:12px 0;padding:11px 15px;border:0;border-radius:8px;background:#197749;color:#fff;font-size:11px;font-weight:750;cursor:pointer}.complete-lesson.completed{background:#eaf5ec;color:#267547}.lesson-pagination{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin:26px 0}.lesson-pagination a{display:grid;gap:6px;padding:13px;border:1px solid #e3eae3;border-radius:9px;color:#54665a;text-decoration:none}.lesson-pagination a:hover{border-color:#70a17a}.lesson-pagination span{color:#718675;font-size:9px}.lesson-pagination strong{font-size:11px}.lesson-pagination .next-link{text-align:right}
  :global(.platform-shell[data-theme="dark"]) .lesson-sidebar,:global(.platform-shell[data-theme="dark"]) .learning-goals,:global(.platform-shell[data-theme="dark"]) .summary{border-color:#35443a;background:#202a23}:global(.platform-shell[data-theme="dark"]) .lesson-content h1,:global(.platform-shell[data-theme="dark"]) .lesson-section h2,:global(.platform-shell[data-theme="dark"]) .example-section h2,:global(.platform-shell[data-theme="dark"]) .exercises-section h2,:global(.platform-shell[data-theme="dark"]) .related h2{color:#edf4ee}:global(.platform-shell[data-theme="dark"]) .lesson-section pre{border-color:#35443a;background:#202a23;color:#cfdfd1}:global(.platform-shell[data-theme="dark"]) .module-nav summary{color:#d5e0d7}:global(.platform-shell[data-theme="dark"]) .related span{background:#2a3c2d;color:#d5e0d7}
  @media(max-width:1000px){.lesson-layout{grid-template-columns:200px minmax(0,1fr);gap:18px}}@media(max-width:800px){.lesson-layout{grid-template-columns:1fr}.lesson-sidebar{position:static;max-height:360px}.lesson-pagination .next-link{text-align:left}}@media(max-width:550px){.lesson-sidebar{padding:10px}.lesson-pagination{grid-template-columns:1fr}}
</style>
