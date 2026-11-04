<script>
  import { sitePath } from '$lib/site-path.js';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { getLegacyLessonId } from '$lib/data/lessons/course-index.js';
  import { markLessonCompleted, markLessonStarted, readProgress } from '$lib/services/progress.js';

  import { courses } from '$lib/data/legacy-courses.js';

  const levels = ['DÃ©butant', 'IntermÃ©diaire', 'AvancÃ©'];

  let activeCourse = $state('html');
  let activeLevel = $state('DÃ©butant');
  let lessonIndex = $state(0);
  let code = $state('');
  let query = $state('');
  let notice = $state('');
  let completed = $state([]);
  let mobileMenuOpen = $state(false);
  let searchField;

  const course = $derived(courses.find((item) => item.id === activeCourse));
  const lesson = $derived(course.lessons[lessonIndex]);
  const lessonsForLevel = $derived(course.lessons.map((entry, index) => ({ ...entry, index })).filter((entry) => entry.level === activeLevel));
  const lessonPosition = $derived(lessonsForLevel.findIndex((entry) => entry.index === lessonIndex));
  const flatLessons = $derived(courses.flatMap((item) => item.lessons.map((entry, index) => ({ ...entry, courseId: item.id, index }))));
  const filteredLessons = $derived(flatLessons.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()) || item.courseId.includes(query.toLowerCase())));
  const progress = $derived(Math.round((completed.length / flatLessons.length) * 100));
  const lessonsAtLevel = $derived(flatLessons.filter((item) => item.level === activeLevel));
  const completedAtLevel = $derived(lessonsAtLevel.filter((item) => completed.includes(`${item.courseId}:${item.title}`)).length);
  const levelProgress = $derived(lessonsAtLevel.length ? Math.round((completedAtLevel / lessonsAtLevel.length) * 100) : 0);
  const quizzes = {
    html: { question: 'Quelle balise sert au titre principal dâ€™une page ?', options: ['<h1>', '<p>', '<img>'], answer: 0 },
    css: { question: 'Quelle propriÃ©tÃ© CSS change la couleur du texte ?', options: ['src', 'color', 'font-style'], answer: 1 },
    js: { question: 'Quel mot-clÃ© dÃ©clare une constante en JavaScript ?', options: ['const', 'style', 'return'], answer: 0 }
  };
  let quizChoice = $state(-1);
  let quizMessage = $state('');
  const quiz = $derived(quizzes[activeCourse]);
  const currentLessonId = $derived(`${activeCourse}:${lesson.title}`);
  const previewDoc = $derived(`<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font:16px Arial,sans-serif;color:#28352f;padding:20px;line-height:1.6} ${activeCourse === 'css' ? code : ''}button{padding:9px 14px;border:0;border-radius:7px;background:#198754;color:white;cursor:pointer}</style></head><body>${activeCourse === 'html' ? code : activeCourse === 'css' ? '<div class="card"><h1>Bonjour le web !</h1><p>Personnalise ce style avec le code CSS.</p></div><div class="row"><div class="item">HTML</div><div class="item">CSS</div><div class="item">JavaScript</div></div>' : '<h1>DÃ©mo JavaScript</h1><p id="message">Modifie le code puis regarde le rÃ©sultat.</p><button id="action">Clique ici</button>'}${activeCourse === 'js' ? `<script>
  import { sitePath } from '$lib/site-path.js';${code.replace(/<\/script/gi, '<\\/script')}<\/script>` : ''}</body></html>`);

  function selectCourse(id) {
    activeCourse = id;
    const nextCourse = courses.find((item) => item.id === id);
    lessonIndex = nextCourse.lessons.findIndex((entry) => entry.level === activeLevel);
    code = nextCourse.lessons[lessonIndex].code;
    mobileMenuOpen = false;
    notice = '';
    quizChoice = -1;
    quizMessage = '';
    trackLesson(nextCourse.id, nextCourse.lessons[lessonIndex]);
  }

  function selectLesson(item) {
    activeCourse = item.courseId;
    activeLevel = item.level;
    lessonIndex = item.index;
    code = courses.find((entry) => entry.id === item.courseId).lessons[item.index].code;
    mobileMenuOpen = false;
    notice = '';
    quizChoice = -1;
    quizMessage = '';
    trackLesson(item.courseId, courses.find((entry) => entry.id === item.courseId).lessons[item.index]);
  }

  function changeLesson(step) {
    const nextPosition = Math.max(0, Math.min(lessonsForLevel.length - 1, lessonPosition + step));
    const nextLesson = lessonsForLevel[nextPosition];
    lessonIndex = nextLesson.index;
    code = nextLesson.code;
    notice = '';
    quizChoice = -1;
    quizMessage = '';
    trackLesson(activeCourse, nextLesson);
  }

  function selectLevel(level) {
    activeLevel = level;
    lessonIndex = course.lessons.findIndex((entry) => entry.level === level);
    code = course.lessons[lessonIndex].code;
    quizChoice = -1;
    quizMessage = '';
    notice = '';
    trackLesson(activeCourse, course.lessons[lessonIndex]);
  }

  function trackLesson(courseId, entry, completedLesson = false) {
    if (!entry) return;
    const id = getLegacyLessonId(courseId, entry.title);
    if (completedLesson) markLessonCompleted(id);
    else markLessonStarted(id);
  }

  function answerQuiz(index) {
    quizChoice = index;
    quizMessage = index === quiz.answer ? 'Bonne rÃ©ponse ! Tu as compris cette notion.' : 'Pas tout Ã  fait. Relis le conseil ci-dessus et rÃ©essaie.';
    if (index === quiz.answer) {
      if (!completed.includes(currentLessonId)) completed = [...completed, currentLessonId];
      trackLesson(activeCourse, lesson, true);
    }
  }

  function markComplete() {
    if (!completed.includes(currentLessonId)) completed = [...completed, currentLessonId];
    trackLesson(activeCourse, lesson, true);
    notice = 'LeÃ§on terminÃ©e ! Continue comme Ã§a.';
  }

  onMount(() => {
    const requestedCourse = page.url.searchParams.get('cours');
    const requestedLevel = page.url.searchParams.get('niveau');
    const requestedLesson = page.url.searchParams.get('lecon');
    const courseId = requestedCourse === 'javascript' ? 'js' : requestedCourse;
    const selectedCourse = courses.find((item) => item.id === courseId) ?? courses[0];
    activeCourse = selectedCourse.id;
    const requestedLessonIndex = requestedLesson ? selectedCourse.lessons.findIndex((entry) => entry.title === requestedLesson) : -1;
    if (requestedLessonIndex >= 0) activeLevel = selectedCourse.lessons[requestedLessonIndex].level;
    else if (levels.includes(requestedLevel)) activeLevel = requestedLevel;
    lessonIndex = requestedLessonIndex >= 0 ? requestedLessonIndex : selectedCourse.lessons.findIndex((entry) => entry.level === activeLevel);
    code = selectedCourse.lessons[lessonIndex]?.code ?? selectedCourse.lessons[0].code;
    trackLesson(activeCourse, selectedCourse.lessons[lessonIndex]);
    try {
      const savedProgress = JSON.parse(localStorage.getItem('weblab-progress') || '[]');
      const validIds = new Set(courses.flatMap((item) => item.lessons.map((entry) => `${item.id}:${entry.title}`)));
      const restored = Array.isArray(savedProgress) ? savedProgress.flatMap((id) => {
        if (typeof id !== 'string') return [];
        if (validIds.has(id)) return [id];
        const legacyId = /^(html|css|js)-(\d+)$/.exec(id);
        if (!legacyId) return [];
        const oldLesson = courses.find((item) => item.id === legacyId[1])?.lessons[Number(legacyId[2])];
        return oldLesson?.level === 'DÃ©butant' ? [`${legacyId[1]}:${oldLesson.title}`] : [];
      }) : [];
      const structuredProgress = readProgress();
      const migrated = courses.flatMap((item) => item.lessons
        .filter((entry) => structuredProgress.lessons[getLegacyLessonId(item.id, entry.title)]?.status === 'completed')
        .map((entry) => `${item.id}:${entry.title}`));
      completed = [...new Set([...restored, ...migrated])];
    } catch { completed = []; }
    const handleShortcuts = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchField?.focus();
      }
      if (event.key === 'Escape' && query) {
        query = '';
        searchField?.blur();
      }
    };
    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  });

  $effect(() => {
    if (typeof localStorage !== 'undefined') localStorage.setItem('weblab-progress', JSON.stringify(completed));
  });
</script>

<svelte:head>
  <title>Ateliers interactifs HTML, CSS et JavaScript — CodeCraft</title>
  <meta name="description" content="Essaie les ateliers interactifs HTML, CSS et JavaScript avec des exemples modifiables et un aperÃ§u en direct." />
  <meta name="robots" content="noindex, follow" />
</svelte:head>

<div class="site-shell">
  <a class="skip-link" href="#accueil">Aller au contenu</a>
  <header class="topbar">
    <a class="brand" href={sitePath('/')} aria-label="CodeCraft, accueil"><img class="brand-mark" src={sitePath('/logo-webschool.svg')} alt="" /><span class="brand-name">CodeCraft<small>APPRENDRE EN PRATIQUANT</small></span></a>
    <nav class="top-links" aria-label="Cours principaux">
      {#each courses as item}<button class:chosen={activeCourse === item.id} aria-pressed={activeCourse === item.id} onclick={() => selectCourse(item.id)}>{item.name}</button>{/each}
    </nav>
    <div class="top-actions"><span class="progress-chip"><span class="progress-dot"></span>{progress}% terminÃ©</span><button class="menu-toggle" aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={mobileMenuOpen} onclick={() => mobileMenuOpen = !mobileMenuOpen}>â˜°</button></div>
  </header>

  <div class="layout">
    <aside class:mobile-open={mobileMenuOpen} class="sidebar">
      <div class="search-wrap"><span aria-hidden="true">âŒ•</span><input bind:this={searchField} aria-label="Chercher une leÃ§on" bind:value={query} placeholder="Chercher un cours..." /><kbd>âŒ˜ / Ctrl K</kbd></div>
      {#if query}
        <div class="sidebar-section"><p class="sidebar-heading">RÃ‰SULTATS ({filteredLessons.length})</p>{#each filteredLessons as item}<button class="lesson-link" onclick={() => selectLesson(item)}><span class="result-dot" style={`--course-color:${courses.find((c) => c.id === item.courseId).color}`}></span>{item.title}<small>{item.courseId.toUpperCase()}</small></button>{/each}{#if filteredLessons.length === 0}<p class="no-results">Aucune leÃ§on trouvÃ©e.</p>{/if}</div>
      {:else}
        <div class="sidebar-welcome"><span class="eyebrow">TON PARCOURS</span><h2>On apprend mieux en pratiquant.</h2><p>Lis une notion, teste le code, puis observe ce qui change. Tu peux recommencer autant de fois que tu veux.</p></div>
        <div class="sidebar-section"><p class="sidebar-heading">FONDAMENTAUX</p>
          {#each courses as item}
            <div class="course-group"><button class:course-active={activeCourse === item.id} class="course-heading" onclick={() => selectCourse(item.id)}><span class="course-icon" style={`--course-color:${item.color}`}>{item.icon}</span><span>{item.name}<small>{item.description}</small></span><span class="chevron">â€º</span></button>
              {#if activeCourse === item.id}<div class="lesson-list">{#each item.lessons as entry, index}{#if entry.level === activeLevel}<button class:lesson-active={lessonIndex === index} class="lesson-link" onclick={() => selectLesson({ courseId: item.id, index, level: entry.level })}><span class="lesson-status">{completed.includes(`${item.id}:${entry.title}`) ? 'âœ“' : ''}</span>{entry.title}<small>{entry.duration}</small></button>{/if}{/each}</div>{/if}
            </div>
          {/each}
        </div>
        <div class="sidebar-note"><span>âœ¦</span><div><strong>Tu bloques ?</strong><p>Change une seule chose Ã  la fois. Câ€™est souvent le meilleur moyen de comprendre ce qui se passe.</p></div></div>
      {/if}
      <div class="sidebar-footer"><span class="avatar">W</span><span><strong>Mon espace</strong><small>Progression enregistrÃ©e ici</small></span><span class="settings">âš™</span></div>
    </aside>

    <main id="accueil" class="main-content">
      <div class="breadcrumb"><span>Parcours</span><span>â€º</span><span>{course.name}</span><span>â€º</span><strong>{lesson.title}</strong></div>
      <section class="welcome-banner" style={`--course-color:${course.color}`}>
        <div class="banner-copy"><span class="eyebrow">COURS INTERACTIF Â· {course.name.toUpperCase()}</span><h1>Le web, Ã§a sâ€™apprend <em>en faisant.</em></h1><p>Comprends les bases, teste tes idÃ©es et vois tes crÃ©ations prendre vie.</p><div class="banner-meta"><span>â—· Environ 20 min</span><span>â—Ž Niveau dÃ©butant</span></div></div>
        <div class="banner-art" aria-hidden="true"><div class="art-window"><div class="window-top"><i></i><i></i><i></i><span>ma-page.html</span></div><div class="window-lines"><b></b><b></b><b></b><b></b><b></b></div></div><div class="art-badge">{course.icon}</div><span class="art-spark spark-one">âœ³</span><span class="art-spark spark-two">âœ¦</span></div>
      </section>

      <section class="level-selector" aria-label="Choisir le niveau dâ€™apprentissage"><div class="level-intro"><span class="eyebrow">CHOISIS TON NIVEAU</span><p>Avance Ã  ton rythme : tu peux changer de niveau quand tu veux.</p></div><div class="level-options">{#each levels as level}<button class:level-selected={activeLevel === level} aria-pressed={activeLevel === level} onclick={() => selectLevel(level)}><strong>{level}</strong><small>{course.lessons.filter((entry) => entry.level === level).length} leÃ§ons</small></button>{/each}</div></section>

      <div class="course-tabs" aria-label="Choisir un cours">{#each courses as item}<button class:tab-active={activeCourse === item.id} aria-pressed={activeCourse === item.id} onclick={() => selectCourse(item.id)}><span class="tab-icon" style={`--course-color:${item.color}`}>{item.icon}</span>{item.name}<small>{item.label}</small></button>{/each}</div>

      <section class="course-overview"><div><span class="eyebrow">CE QUE TU VAS APPRENDRE</span><p>{course.description}</p><ul>{#each course.outcomes as outcome}<li>{outcome}</li>{/each}</ul></div><a href={course.reference} target="_blank" rel="noreferrer">Approfondir sur MDN <span aria-hidden="true">â†—</span></a></section>

      <section class="path-progress" aria-label="Progression du niveau sÃ©lectionnÃ©"><div><strong>Ton parcours {activeLevel.toLowerCase()}</strong><span>{completedAtLevel} / {lessonsAtLevel.length} leÃ§ons terminÃ©es <b>Â·</b> {levelProgress}%</span></div><div class="progress-track" role="progressbar" aria-label={`Progression niveau ${activeLevel}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={levelProgress}><span style={`width:${levelProgress}%`}></span></div></section>

      <section class="lesson-heading"><div><div class="lesson-kicker"><span class="level-tag">{lesson.level}</span><span>LeÃ§on {lessonPosition + 1} sur {lessonsForLevel.length}</span><span>Â·</span><span>{lesson.duration}</span></div><h2>{lesson.title}</h2><p>{lesson.intro}</p></div><button class:done={completed.includes(currentLessonId)} class="complete-button" onclick={markComplete}>{completed.includes(currentLessonId) ? 'âœ“ LeÃ§on terminÃ©e' : 'Marquer comme terminÃ©'}</button></section>

      <div class="learning-grid">
        <div class="lesson-column">
          <article class="concept-card"><div class="card-icon" style={`--course-color:${course.color}`}>âœ¦</div><div><h3>Ã€ retenir</h3><p>{lesson.concept}</p></div></article>
          <article class="practice-card"><div class="practice-heading"><div><span class="eyebrow">Ã€ TOI DE JOUER</span><h3>Petit dÃ©fi</h3></div><span class="challenge-icon">âŒ˜</span></div><p>{lesson.task}</p><button onclick={markComplete}>Jâ€™ai compris <span>â†’</span></button></article>
          <div class="lesson-navigation"><button onclick={() => changeLesson(-1)} disabled={lessonPosition === 0}>← PrÃ©cÃ©dent</button><span>{lessonPosition + 1} / {lessonsForLevel.length}</span><button onclick={() => changeLesson(1)} disabled={lessonPosition === lessonsForLevel.length - 1}>LeÃ§on suivante â†’</button></div>
        </div>

        <section class="playground" aria-label="Ã‰diteur de code et aperÃ§u"><div class="playground-head"><div><span class="live-indicator"></span><strong>Zone de pratique</strong></div><button class="reset-button" onclick={() => code = lesson.code}>â†º RÃ©initialiser</button></div><div class="editor-label"><div><span class="file-icon" style={`--course-color:${course.color}`}>{course.name === 'JavaScript' ? 'JS' : course.name.slice(0, 3).toUpperCase()}</span><span>exemple.{activeCourse === 'html' ? 'html' : activeCourse === 'css' ? 'css' : 'js'}</span></div><span class="editable">Ã¢â€”Â Modifiable</span></div><div class="editor-wrap"><div class="line-numbers">{#each code.split('\n') as _, i}<span>{i + 1}</span>{/each}</div><textarea aria-label="Ã‰diteur de code" spellcheck="false" autocapitalize="off" bind:value={code}></textarea></div><div class="preview-head"><span>APERÃ‡U EN DIRECT</span><span class="preview-dots">â€¢â€¢â€¢</span></div><iframe title="AperÃ§u du code" sandbox="allow-scripts" srcdoc={previewDoc}></iframe><div class="playground-foot"><span><span class="tip-icon">Ã¢Å’Â</span> Modifie le code pour voir le rÃ©sultat.</span><span class="language-label">{course.name}</span></div></section>
      </div>

      <section class="quiz-card"><div class="quiz-title"><span class="quiz-mark">?</span><div><span class="eyebrow">VÃ‰RIFIE TES CONNAISSANCES</span><h3>Question rapide</h3></div></div><p>{quiz.question}</p><div class="quiz-options">{#each quiz.options as option, index}<button class:correct={quizChoice === index && index === quiz.answer} class:incorrect={quizChoice === index && index !== quiz.answer} onclick={() => answerQuiz(index)}>{option}<span>{quizChoice === index ? (index === quiz.answer ? 'âœ“' : 'â†»') : 'â—‹'}</span></button>{/each}</div>{#if quizMessage}<p class:success={quizChoice === quiz.answer} class="quiz-feedback" role="status">{quizMessage}</p>{/if}</section>

      {#if notice}<div class="toast" role="status">âœ“ {notice}</div>{/if}
      <footer><span>Fait pour apprendre, une ligne Ã  la fois.</span><span>CodeCraft <b>Â·</b> Cours gratuits <b>Â·</b> Tél&nbsp;: <a href="tel:66913322">66913322</a> / <a href="tel:73308997">73308997</a></span></footer>
    </main>
  </div>
</div>

<style>
  .skip-link{position:fixed;top:10px;left:10px;z-index:50;transform:translateY(-150%);padding:10px 14px;border-radius:8px;background:#155d38;color:white;font-size:13px;text-decoration:none}
  .skip-link:focus{transform:translateY(0)}
  .path-progress{margin:-10px 0 22px;padding:12px 14px;background:#fff;border:1px solid #e8ede8;border-radius:10px}.path-progress>div:first-child{display:flex;justify-content:space-between;gap:10px;font-size:9px}.path-progress strong{color:#526156}.path-progress span{color:#98a39b}.path-progress b{margin:0 4px;color:#c3ccc4}.progress-track{height:5px;margin-top:9px;border-radius:9px;background:#edf2ed;overflow:hidden}.progress-track span{display:block;height:100%;border-radius:inherit;background:#4aab6c;transition:width .25s}
  .quiz-card{margin-top:15px;padding:18px 20px;background:#fff;border:1px solid #e8ede8;border-radius:12px}.quiz-title{display:flex;align-items:center;gap:10px}.quiz-mark{width:28px;height:28px;display:grid;place-items:center;border-radius:9px;background:#eef6ef;color:#22844f;font-weight:800}.quiz-title h3{font-size:13px;margin:4px 0 0}.quiz-card>p{font-size:11px;font-weight:650;color:#45554a;margin:14px 0 10px}.quiz-options{display:flex;flex-wrap:wrap;gap:8px}.quiz-options button{min-width:110px;display:flex;justify-content:space-between;align-items:center;gap:18px;padding:9px 11px;border:1px solid #e3eae4;border-radius:8px;background:#fbfcfb;color:#526157;font:10px ui-monospace,monospace}.quiz-options button:hover{border-color:#a8d0b3;background:#f5faf6}.quiz-options button.correct{border-color:#8bc59a;background:#eff8f0;color:#237846}.quiz-options button.incorrect{border-color:#e3b0a7;background:#fff5f3;color:#a54d3e}.quiz-feedback{margin:10px 0 0!important;color:#a54d3e!important;font-size:9px!important;font-weight:500!important}.quiz-feedback.success{color:#27804d!important}
  :global(*){box-sizing:border-box} :global(body){margin:0;background:#f7f9f7;color:#24322b;font-family:Inter,"DM Sans",-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;font-size:14px} :global(button),:global(input),:global(textarea){font:inherit} :global(button){cursor:pointer}
  .site-shell{min-height:100vh}.topbar{height:68px;display:flex;align-items:center;gap:44px;padding:0 30px;background:#fff;border-bottom:1px solid #e8eee9;position:sticky;top:0;z-index:10}.brand{display:flex;align-items:center;gap:10px;text-decoration:none;color:#1d3126;min-width:198px}.brand-mark{height:37px;width:40px;display:block;border-radius:11px}.brand-name{font-size:16px;font-weight:850;letter-spacing:-1.2px;line-height:1}.brand-name>span{color:#168454}.brand-name small{display:block;color:#99a59c;font-size:7px;letter-spacing:1.25px;font-weight:750;margin-top:5px}.top-links{display:flex;align-items:center;gap:26px;height:100%}.top-links button{height:100%;padding:0 3px;border:0;border-bottom:2px solid transparent;background:none;color:#68766d;font-size:12px;font-weight:700}.top-links button.chosen{color:#168454;border-bottom-color:#168454}.top-actions{margin-left:auto;display:flex;align-items:center;gap:12px}.progress-chip{display:flex;align-items:center;gap:7px;background:#edf7f0;color:#24754d;padding:8px 11px;border-radius:30px;font-size:10px;font-weight:750}.progress-dot,.live-indicator{width:7px;height:7px;border-radius:50%;background:#31a365}.menu-toggle{display:none;border:0;background:none;font-size:20px}.layout{display:grid;grid-template-columns:258px minmax(0,1fr);max-width:1600px;margin:auto}.sidebar{height:calc(100vh - 68px);min-height:680px;position:sticky;top:68px;display:flex;flex-direction:column;padding:21px 15px 12px;background:#fff;border-right:1px solid #e8eee9;overflow-y:auto}.search-wrap{display:flex;align-items:center;gap:8px;height:37px;border:1px solid #e7ede8;border-radius:8px;padding:0 9px;color:#91a097}.search-wrap>span{font-size:19px}.search-wrap input{min-width:0;flex:1;border:0;outline:0;color:#34443a;font-size:10px}.search-wrap input::placeholder{color:#a0aaa3}.search-wrap kbd{font-size:8px;color:#a0aaa3;background:#f4f6f4;border:1px solid #e9eeea;border-radius:4px;padding:3px}.sidebar-welcome{padding:23px 7px 18px}.eyebrow{font-size:8px;letter-spacing:1.25px;font-weight:800;color:#95a098}.sidebar-welcome h2{font-size:17px;line-height:1.35;letter-spacing:-.5px;margin:9px 0 7px;max-width:190px}.sidebar-welcome p{font-size:10px;line-height:1.65;color:#89958d;margin:0}.sidebar-heading{font-size:8px;font-weight:800;letter-spacing:1.1px;color:#9ca79f;padding:0 8px;margin:10px 0 8px}.course-group{margin:2px 0}.course-heading{width:100%;display:flex;align-items:center;gap:10px;text-align:left;background:none;border:0;padding:9px 8px;border-radius:8px;color:#37473c}.course-heading:hover,.course-heading.course-active{background:#f4f8f4}.course-icon{flex:none;width:28px;height:28px;display:grid;place-items:center;border-radius:8px;color:white;background:var(--course-color);font:800 10px ui-monospace,monospace}.course-heading>span:nth-child(2){font-size:11px;font-weight:750;flex:1}.course-heading small{display:block;color:#9ba49d;font-size:8px;font-weight:450;margin-top:3px}.chevron{font-size:20px;color:#a3ada6;transform:rotate(90deg)}.lesson-list{margin:2px 0 8px 22px;padding-left:10px;border-left:1px solid #e7ede8;display:grid;gap:1px}.lesson-link{width:100%;display:flex;align-items:center;gap:8px;text-align:left;padding:7px 7px;border:0;border-radius:6px;background:none;color:#6f7d73;font-size:9px}.lesson-link:hover,.lesson-link.lesson-active{background:#f0f7f2;color:#16784d;font-weight:700}.lesson-status{width:13px;height:13px;flex:none;display:grid;place-items:center;border:1px solid #dfe8e1;border-radius:50%;font-size:8px;color:#168454}.lesson-active .lesson-status{border-color:#a8d3b7}.lesson-link small{margin-left:auto;color:#a7b0a9;font-size:8px}.sidebar-note{display:flex;gap:9px;padding:11px;margin:18px 2px;background:#fbf8ee;border:1px solid #f1ebd5;border-radius:9px}.sidebar-note>span{color:#cb9d39}.sidebar-note strong{font-size:9px}.sidebar-note p{font-size:8px;line-height:1.5;color:#918b78;margin:4px 0 0}.sidebar-footer{display:flex;align-items:center;gap:9px;margin-top:auto;padding:12px 5px 2px;border-top:1px solid #edf0ed}.avatar{width:29px;height:29px;border-radius:9px;background:#e5f3e8;color:#388359;display:grid;place-items:center;font-weight:800;font-size:11px}.sidebar-footer strong,.sidebar-footer small{display:block}.sidebar-footer strong{font-size:9px}.sidebar-footer small{font-size:8px;color:#9ca69e;margin-top:3px}.settings{margin-left:auto;color:#99a39c}.no-results{font-size:10px;color:#939e96;padding:8px}.result-dot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--course-color)}
  .main-content{width:min(100%,1120px);padding:24px 42px 0;margin:0 auto;min-width:0}.breadcrumb{display:flex;gap:9px;align-items:center;color:#9ba59e;font-size:9px;margin-bottom:17px}.breadcrumb strong{color:#536258;font-weight:650}.welcome-banner{min-height:190px;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:space-between;padding:26px 32px;border-radius:15px;background:linear-gradient(110deg,#eff7f0,#f7f8ee 70%,#f1f6e9);border:1px solid #e8f0e6}.welcome-banner:before{content:"";position:absolute;width:280px;height:280px;border:1px solid #dceadd;border-radius:50%;right:22px;top:-112px;box-shadow:0 0 0 25px #e5efe233,0 0 0 52px #e5efe222}.banner-copy{position:relative;z-index:1;max-width:510px}.banner-copy .eyebrow{color:#4d9a6c}.banner-copy h1{font-size:29px;letter-spacing:-1.3px;line-height:1.2;margin:9px 0 8px}.banner-copy h1 em{font-style:normal;color:#168454}.banner-copy p{margin:0;color:#78877d;font-size:11px}.banner-meta{display:flex;gap:16px;margin-top:17px;color:#7e8b81;font-size:9px}.banner-art{position:relative;width:210px;height:146px;display:grid;place-items:center;margin-right:16px}.art-window{position:relative;z-index:1;width:168px;height:116px;background:#fff;border:1px solid #dfe8df;border-radius:10px;box-shadow:0 12px 30px #284c3014;transform:rotate(3deg);overflow:hidden}.window-top{height:24px;background:#f5f7f5;border-bottom:1px solid #edf0ed;display:flex;align-items:center;gap:4px;padding:0 9px}.window-top i{width:5px;height:5px;border-radius:50%;background:#e99d89}.window-top i:nth-child(2){background:#e4c66f}.window-top i:nth-child(3){background:#81bd8c}.window-top span{font:7px ui-monospace,monospace;color:#a0aaa1;margin-left:8px}.window-lines{padding:15px 14px;display:grid;gap:8px}.window-lines b{height:5px;width:75%;border-radius:5px;background:#e4eee7}.window-lines b:first-child{width:42%;background:#7bb68d}.window-lines b:nth-child(3){width:60%;margin-left:15px;background:#f2d8ab}.window-lines b:nth-child(4){width:80%;margin-left:15px}.window-lines b:nth-child(5){width:48%;background:#dce8de}.art-badge{position:absolute;z-index:2;right:4px;bottom:10px;width:43px;height:43px;display:grid;place-items:center;border:3px solid white;border-radius:14px;background:var(--course-color);color:white;font:800 14px ui-monospace,monospace;box-shadow:0 5px 14px #29442e22}.art-spark{position:absolute;color:#9fc5a3}.spark-one{top:2px;right:20px;font-size:22px}.spark-two{bottom:12px;left:4px;font-size:17px}.course-tabs{display:flex;gap:9px;margin:17px 0 26px}.course-tabs button{flex:1;display:flex;align-items:center;gap:9px;min-width:0;padding:11px 13px;border:1px solid #e8ede8;border-radius:10px;background:#fff;text-align:left;font-size:11px;font-weight:750;color:#46554a}.course-tabs button.tab-active{border-color:#acd1b5;box-shadow:0 0 0 2px #e8f4eb}.tab-icon{width:26px;height:26px;display:grid;place-items:center;border-radius:8px;background:var(--course-color);color:#fff;font:800 9px ui-monospace,monospace}.course-tabs small{margin-left:auto;color:#9ba59d;font-size:8px;font-weight:500}.lesson-heading{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;margin-bottom:18px}.lesson-kicker{display:flex;align-items:center;gap:8px;color:#9aa49d;font-size:9px}.level-tag{background:#edf7ef;color:#318052;padding:4px 7px;border-radius:5px;font-size:8px;font-weight:700}.lesson-heading h2{font-size:24px;letter-spacing:-.8px;margin:10px 0 6px}.lesson-heading p{max-width:650px;font-size:11px;color:#7d8980;line-height:1.75;margin:0}.complete-button{flex:none;background:#fff;border:1px solid #dce8de;color:#4d7659;padding:9px 12px;border-radius:8px;font-size:9px;font-weight:700}.complete-button.done{background:#edf7ef;color:#27804d;border-color:#d1e8d7}.learning-grid{display:grid;grid-template-columns:minmax(0,.9fr) minmax(340px,1.1fr);gap:15px;align-items:start}.lesson-column{display:grid;gap:12px}.concept-card,.practice-card{border:1px solid #e8ede8;background:#fff;border-radius:12px;padding:18px}.concept-card{display:flex;gap:12px;align-items:flex-start}.card-icon{width:27px;height:27px;flex:none;border-radius:8px;display:grid;place-items:center;background:color-mix(in srgb,var(--course-color),white 88%);color:var(--course-color);font-size:14px}.concept-card h3,.practice-card h3{font-size:12px;margin:1px 0 7px}.concept-card p,.practice-card>p{font-size:10px;color:#748178;line-height:1.75;margin:0}.practice-card{background:#fbfcfb}.practice-heading{display:flex;align-items:center;justify-content:space-between}.practice-heading h3{font-size:13px;margin:5px 0 8px}.challenge-icon{width:28px;height:28px;border-radius:8px;background:#f1f5ef;color:#6b9374;display:grid;place-items:center}.practice-card>p{margin:2px 0 14px}.practice-card>button{border:0;border-radius:7px;padding:8px 11px;background:#eaf5ed;color:#337b4f;font-size:9px;font-weight:750}.practice-card>button span{margin-left:7px}.lesson-navigation{display:flex;justify-content:space-between;align-items:center;margin-top:3px}.lesson-navigation button{background:none;border:0;color:#527b5c;padding:7px 3px;font-size:9px;font-weight:700}.lesson-navigation button:disabled{color:#b9c2bb;cursor:default}.lesson-navigation>span{color:#a0aaa2;font-size:9px}
  .playground{background:#fff;border:1px solid #e4eae5;border-radius:12px;overflow:hidden;box-shadow:0 4px 14px #263a2c06}.playground-head{height:43px;display:flex;align-items:center;justify-content:space-between;padding:0 13px;border-bottom:1px solid #edf0ed}.playground-head>div{display:flex;align-items:center;gap:8px}.live-indicator{box-shadow:0 0 0 3px #e4f4e8}.playground-head strong{font-size:10px}.reset-button{border:0;background:none;color:#839087;font-size:9px}.editor-label{height:34px;display:flex;align-items:center;justify-content:space-between;padding:0 13px;background:#fafbfa;color:#77837a;font-size:8px}.editor-label>div{display:flex;align-items:center;gap:7px}.file-icon{width:18px;height:18px;display:grid;place-items:center;border-radius:4px;background:color-mix(in srgb,var(--course-color),white 87%);color:var(--course-color);font:800 7px ui-monospace,monospace}.editable{color:#37905b}.editor-wrap{height:190px;display:grid;grid-template-columns:32px minmax(0,1fr);background:#fbfcfb;border-top:1px solid #f0f2f0;border-bottom:1px solid #e9eeea}.line-numbers{display:flex;flex-direction:column;align-items:center;gap:0;padding-top:12px;background:#f6f8f6;color:#bdc5be;font:10px/19px ui-monospace,monospace}.editor-wrap textarea{width:100%;height:100%;resize:vertical;border:0;outline:0;padding:10px 12px;background:transparent;color:#405c4a;font:10px/19px ui-monospace,SFMono-Regular,Consolas,monospace;tab-size:2;white-space:pre;overflow:auto}.preview-head{height:32px;padding:0 12px;display:flex;align-items:center;justify-content:space-between;color:#9ba49d;font-size:7px;font-weight:800;letter-spacing:1px}.preview-dots{font-size:11px;letter-spacing:2px;color:#b4beb6}.playground iframe{display:block;width:calc(100% - 20px);height:160px;margin:0 10px;border:1px solid #e8ede8;border-radius:7px;background:white}.playground-foot{height:33px;display:flex;justify-content:space-between;align-items:center;padding:0 12px;color:#9aa49c;font-size:8px}.tip-icon{font-size:15px;vertical-align:-2px;color:#5d9d70;margin-right:3px}.language-label{color:#718077}.toast{position:fixed;right:24px;bottom:22px;z-index:20;padding:12px 16px;border-radius:9px;background:#1c7248;color:#fff;box-shadow:0 8px 24px #193f292c;font-size:11px}footer{display:flex;justify-content:space-between;border-top:1px solid #e8ede8;margin-top:27px;padding:15px 0 20px;color:#a1aaa3;font-size:8px}footer b{margin:0 4px;color:#c4ccc5}footer a{color:inherit;text-decoration:none}footer a:hover{color:#168454}
  @media(max-width:1050px){.topbar{gap:25px}.layout{grid-template-columns:230px minmax(0,1fr)}.main-content{padding:22px 25px 0}.learning-grid{grid-template-columns:1fr}.lesson-column{grid-template-columns:1fr 1fr}.lesson-navigation{grid-column:1/-1}.playground{grid-row:1}.sidebar{padding-left:11px;padding-right:11px}}
  @media(max-width:700px){.topbar{height:59px;padding:0 15px;gap:10px}.brand{min-width:0}.brand-mark{width:35px;height:34px}.brand-name{font-size:11px;letter-spacing:-.3px}.top-links{display:none}.progress-chip{font-size:9px}.menu-toggle{display:block}.layout{display:block}.sidebar{display:none;position:fixed;z-index:9;left:0;top:59px;width:280px;height:calc(100vh - 59px);min-height:0;box-shadow:8px 0 30px #1d382321}.sidebar.mobile-open{display:flex}.main-content{padding:17px 16px 0}.breadcrumb{overflow:hidden;white-space:nowrap;font-size:8px}.welcome-banner{min-height:170px;padding:21px 19px}.banner-copy h1{font-size:23px;max-width:340px}.banner-copy p{max-width:280px;line-height:1.6}.banner-art{position:absolute;right:-35px;bottom:-20px;transform:scale(.72);opacity:.5}.banner-meta{font-size:8px}.course-tabs{gap:6px;margin:13px 0 22px}.course-tabs button{padding:9px 7px;gap:5px;font-size:10px}.course-tabs small{display:none}.tab-icon{width:23px;height:23px}.lesson-heading{align-items:flex-start;flex-direction:column;gap:11px}.lesson-heading h2{font-size:21px}.lesson-heading p{font-size:10px}.complete-button{align-self:flex-start}.learning-grid{grid-template-columns:minmax(0,1fr)}.playground{grid-row:auto}.lesson-column{grid-template-columns:1fr}.lesson-navigation{grid-column:auto}.editor-wrap{height:180px}.playground iframe{height:145px}footer{gap:10px;font-size:7px}}
  @media(max-width:380px){.course-tabs button{flex-direction:column;align-items:flex-start}.welcome-banner{padding-left:15px}.banner-copy h1{font-size:21px}.banner-meta{gap:8px}}
  /* Typographie et rythme de lecture */
  :global(body){font-size:15px;line-height:1.55;background:#f7f7f3}
  .main-content{max-width:1240px;padding-top:30px}
  .eyebrow{font-size:10px;letter-spacing:1.35px}
  .sidebar-welcome h2{font-size:19px;line-height:1.35}
  .sidebar-welcome p,.sidebar-note p{font-size:12px;line-height:1.7}
  .sidebar-heading{font-size:10px}
  .course-heading>span:nth-child(2){font-size:13px}
  .course-heading small,.sidebar-footer small,.lesson-link small{font-size:10px}
  .lesson-link{font-size:12px;padding:9px 8px}
  .banner-copy h1{font-size:clamp(30px,3.2vw,40px);line-height:1.16}
  .banner-copy p{font-size:14px;line-height:1.65}
  .banner-meta{font-size:11px}
  .course-overview{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 16px;margin:-10px 0 18px;background:#fff;border:1px solid #e8ede8;border-radius:10px}
  .course-overview p{margin:4px 0 0;color:#65736a;font-size:13px;line-height:1.6}
  .course-overview a{flex:none;color:#287a4b;text-decoration:none;font-size:12px;font-weight:700}
  .course-overview a:hover{text-decoration:underline}
  .course-tabs button{font-size:14px;min-height:54px}
  .course-tabs small{font-size:10px}
  .path-progress>div:first-child{font-size:12px}
  .lesson-heading h2{font-size:clamp(27px,3vw,34px)}
  .lesson-heading p{font-size:15px;line-height:1.8;color:#65736a}
  .lesson-kicker{font-size:11px}
  .complete-button{font-size:11px;padding:11px 14px}
  .concept-card,.practice-card{padding:21px}
  .concept-card h3,.practice-card h3{font-size:16px}
  .concept-card p,.practice-card>p{font-size:13px;line-height:1.8}
  .practice-card>button,.lesson-navigation button{font-size:12px}
  .playground-head strong{font-size:13px}
  .editor-wrap{height:245px}
  .line-numbers{font-size:12px;line-height:22px}
  .editor-wrap textarea{font-size:13px;line-height:22px}
  .playground iframe{height:190px}
  .quiz-title h3{font-size:16px}
  .quiz-card>p{font-size:14px}
  .quiz-options button{font-size:13px;padding:11px 13px}
  .quiz-feedback{font-size:12px!important}
  footer{font-size:10px}
  :global(button:focus-visible),:global(a:focus-visible),:global(input:focus-visible),:global(textarea:focus-visible){outline:3px solid #8dc99b;outline-offset:2px}
  @media(max-width:700px){.main-content{padding-top:18px}.course-overview{align-items:flex-start;flex-direction:column;gap:7px}.course-tabs button{font-size:12px}.course-tabs small{display:none}.lesson-heading p{font-size:14px}.editor-wrap{height:220px}.playground iframe{height:170px}}
  .course-overview ul{display:flex;flex-wrap:wrap;gap:7px 16px;list-style:none;margin:9px 0 0;padding:0}
  .course-overview li{font-size:11px;color:#4c7559}
  .course-overview li:before{content:'âœ“';color:#299252;font-weight:800;margin-right:6px}
  @media(prefers-reduced-motion:reduce){:global(*),:global(*:before),:global(*:after){scroll-behavior:auto!important;transition:none!important}}
  .level-selector{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:14px 16px;margin:14px 0 12px;background:#fff;border:1px solid #e8ede8;border-radius:12px}
  .level-intro{min-width:200px}.level-intro p{margin:4px 0 0;color:#68766d;font-size:12px;line-height:1.5}
  .level-options{display:flex;gap:7px}.level-options button{min-width:125px;display:flex;align-items:center;justify-content:space-between;gap:9px;padding:10px 12px;border:1px solid #e5ebe6;border-radius:9px;background:#fbfcfb;color:#45564a;text-align:left}
  .level-options button strong{font-size:12px}.level-options button small{font-size:10px;color:#8a968d;white-space:nowrap}.level-options button:hover{border-color:#a9d0b4}.level-options button.level-selected{border-color:#67ad7c;background:#eef7f0;color:#1f7041;box-shadow:0 0 0 2px #e6f2e8}
  @media(max-width:700px){.level-selector{align-items:stretch;flex-direction:column;gap:10px}.level-options{display:grid;grid-template-columns:repeat(3,minmax(0,1fr))}.level-options button{min-width:0;align-items:flex-start;flex-direction:column;gap:3px;padding:9px}.level-options button strong{font-size:11px}.level-options button small{font-size:9px}}
</style>
