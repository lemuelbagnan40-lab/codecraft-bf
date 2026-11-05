import { useEffect, useMemo, useRef, useState } from 'react';
import SeoHead from '../components/SeoHead.jsx';
import { courses } from '../../lib/data/legacy-courses.js';
import { getLegacyLessonId } from '../../lib/data/lessons/course-index.js';
import { markLessonCompleted, markLessonStarted, readProgress } from '../../lib/services/progress.js';
import { sitePath } from '../../lib/site-path.js';
import './LegacyLearningPage.css';

const levels = ['Débutant', 'Intermédiaire', 'Avancé'];
const quizzes = {
  html: { question: 'Quelle balise sert au titre principal d’une page ?', options: ['<h1>', '<p>', '<img>'], answer: 0 },
  css: { question: 'Quelle propriété CSS change la couleur du texte ?', options: ['src', 'color', 'font-style'], answer: 1 },
  js: { question: 'Quel mot-clé déclare une constante en JavaScript ?', options: ['const', 'style', 'return'], answer: 0 }
};

function getInitialSelection() {
  const requested = new URLSearchParams(window.location.search);
  const courseId = requested.get('cours') === 'javascript' ? 'js' : requested.get('cours');
  const course = courses.find((item) => item.id === courseId) ?? courses[0];
  const lessonIndex = requested.has('lecon')
    ? course.lessons.findIndex((entry) => entry.title === requested.get('lecon'))
    : -1;
  const requestedLevel = requested.get('niveau');
  const activeLevel = lessonIndex >= 0
    ? course.lessons[lessonIndex].level
    : levels.includes(requestedLevel) ? requestedLevel : course.lessons[0].level;
  const index = lessonIndex >= 0
    ? lessonIndex
    : Math.max(0, course.lessons.findIndex((entry) => entry.level === activeLevel));
  return { courseId: course.id, index, level: activeLevel };
}

function createPreview(courseId, code) {
  const css = courseId === 'css' ? code : '';
  const content = courseId === 'html'
    ? code
    : courseId === 'css'
      ? '<div class="card"><h1>Bonjour le web !</h1><p>Personnalise ce style avec le code CSS.</p></div><div class="row"><div class="item">HTML</div><div class="item">CSS</div><div class="item">JavaScript</div></div>'
      : '<h1>Démonstration JavaScript</h1><p id="message">Modifie le code puis regarde le résultat.</p><button id="action">Clique ici</button>';
  const script = courseId === 'js'
    ? `<script>${code.replace(/<\/script/gi, '<\\/script')}<\/script>`
    : '';
  const policy = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src data:; form-action 'none'; base-uri 'none'";
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="${policy}"><style>body{font:16px Arial,sans-serif;color:#28352f;padding:20px;line-height:1.6} ${css}button{padding:9px 14px;border:0;border-radius:7px;background:#198754;color:white;cursor:pointer}</style></head><body>${content}${script}</body></html>`;
}

function lessonId(courseId, lesson) {
  return `${courseId}:${lesson.title}`;
}

export default function LegacyLearningPage() {
  const initial = useMemo(getInitialSelection, []);
  const [activeCourse, setActiveCourse] = useState(initial.courseId);
  const [activeLevel, setActiveLevel] = useState(initial.level);
  const [lessonIndex, setLessonIndex] = useState(initial.index);
  const [code, setCode] = useState(courses.find((item) => item.id === initial.courseId).lessons[initial.index].code);
  const [query, setQuery] = useState('');
  const [notice, setNotice] = useState('');
  const [completed, setCompleted] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quizChoice, setQuizChoice] = useState(-1);
  const [quizMessage, setQuizMessage] = useState('');
  const searchField = useRef(null);
  const course = courses.find((item) => item.id === activeCourse);
  const lesson = course.lessons[lessonIndex];
  const lessonsForLevel = course.lessons.map((entry, index) => ({ ...entry, index })).filter((entry) => entry.level === activeLevel);
  const lessonPosition = lessonsForLevel.findIndex((entry) => entry.index === lessonIndex);
  const flatLessons = courses.flatMap((item) => item.lessons.map((entry, index) => ({ ...entry, courseId: item.id, index })));
  const filteredLessons = flatLessons.filter((item) => item.title.toLocaleLowerCase('fr').includes(query.toLocaleLowerCase('fr')) || item.courseId.includes(query.toLocaleLowerCase('fr')));
  const progress = Math.round((completed.length / flatLessons.length) * 100);
  const lessonsAtLevel = flatLessons.filter((item) => item.level === activeLevel);
  const completedAtLevel = lessonsAtLevel.filter((item) => completed.includes(lessonId(item.courseId, item))).length;
  const levelProgress = lessonsAtLevel.length ? Math.round((completedAtLevel / lessonsAtLevel.length) * 100) : 0;
  const quiz = quizzes[activeCourse];
  const currentLessonId = lessonId(activeCourse, lesson);
  const previewDoc = createPreview(activeCourse, code);

  useEffect(() => {
    try {
      const savedProgress = JSON.parse(localStorage.getItem('weblab-progress') || '[]');
      const validIds = new Set(flatLessons.map((item) => lessonId(item.courseId, item)));
      const restored = Array.isArray(savedProgress) ? savedProgress.flatMap((id) => {
        if (typeof id !== 'string') return [];
        if (validIds.has(id)) return [id];
        const oldLesson = /^(html|css|js)-(\d+)$/.exec(id);
        if (!oldLesson) return [];
        const migratedLesson = courses.find((item) => item.id === oldLesson[1])?.lessons[Number(oldLesson[2])];
        return migratedLesson?.level === 'Débutant' ? [lessonId(oldLesson[1], migratedLesson)] : [];
      }) : [];
      const structured = readProgress();
      const migrated = courses.flatMap((item) => item.lessons
        .filter((entry) => structured.lessons[getLegacyLessonId(item.id, entry.title)]?.status === 'completed')
        .map((entry) => lessonId(item.id, entry)));
      setCompleted([...new Set([...restored, ...migrated])]);
    } catch (error) {
      console.error('Impossible de restaurer la progression des ateliers.', error);
      setNotice('La progression précédente n’a pas pu être restaurée.');
    }

  }, []);

  useEffect(() => {
    const handleShortcuts = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        searchField.current?.focus();
      }
      if (event.key === 'Escape' && query) {
        setQuery('');
        searchField.current?.blur();
      }
    };
    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [query]);

  useEffect(() => {
    try {
      localStorage.setItem('weblab-progress', JSON.stringify(completed));
    } catch (error) {
      console.error('Impossible de sauvegarder la progression des ateliers.', error);
      setNotice('La progression ne peut pas être enregistrée dans ce navigateur.');
    }
  }, [completed]);

  useEffect(() => {
    markLessonStarted(getLegacyLessonId(activeCourse, lesson.title));
  }, [activeCourse, lesson.title]);

  function resetQuiz() {
    setQuizChoice(-1);
    setQuizMessage('');
  }

  function selectLesson(selection) {
    const nextCourse = courses.find((item) => item.id === selection.courseId);
    const nextLesson = nextCourse.lessons[selection.index];
    setActiveCourse(selection.courseId);
    setActiveLevel(nextLesson.level);
    setLessonIndex(selection.index);
    setCode(nextLesson.code);
    setMobileMenuOpen(false);
    setNotice('');
    resetQuiz();
  }

  function selectCourse(id) {
    const nextCourse = courses.find((item) => item.id === id);
    const index = Math.max(0, nextCourse.lessons.findIndex((entry) => entry.level === activeLevel));
    selectLesson({ courseId: id, index });
  }

  function selectLevel(level) {
    const index = Math.max(0, course.lessons.findIndex((entry) => entry.level === level));
    setActiveLevel(level);
    setLessonIndex(index);
    setCode(course.lessons[index].code);
    setNotice('');
    resetQuiz();
  }

  function changeLesson(step) {
    const nextPosition = Math.max(0, Math.min(lessonsForLevel.length - 1, lessonPosition + step));
    const nextLesson = lessonsForLevel[nextPosition];
    if (nextLesson) selectLesson({ courseId: activeCourse, index: nextLesson.index });
  }

  function markComplete() {
    const id = getLegacyLessonId(activeCourse, lesson.title);
    const saved = markLessonCompleted(id);
    if (!saved) setNotice('La leçon est terminée, mais la progression ne peut pas être enregistrée.');
    else setNotice('Leçon terminée ! Continue comme ça.');
    setCompleted((items) => items.includes(currentLessonId) ? items : [...items, currentLessonId]);
  }

  function answerQuiz(index) {
    setQuizChoice(index);
    if (index === quiz.answer) {
      setQuizMessage('Bonne réponse ! Tu as compris cette notion.');
      markComplete();
    } else {
      setQuizMessage('Pas tout à fait. Relis le conseil ci-dessus et réessaie.');
    }
  }

  return (
    <div className="legacy-shell">
      <SeoHead
        title="Ateliers interactifs HTML, CSS et JavaScript — CodeCraft"
        description="Essaie les ateliers interactifs HTML, CSS et JavaScript avec des exemples modifiables et un aperçu en direct."
        noindex
      />
      <a className="legacy-skip-link" href="#legacy-content">Aller au contenu</a>
      <header className="legacy-topbar">
        <a className="legacy-brand" href={sitePath('/')} aria-label="CodeCraft, accueil"><img src={sitePath('/logo-webschool.svg')} alt="" /><span>CodeCraft<small>APPRENDRE EN PRATIQUANT</small></span></a>
        <nav className="legacy-top-links" aria-label="Cours principaux">
          {courses.map((item) => <button key={item.id} className={activeCourse === item.id ? 'chosen' : ''} aria-pressed={activeCourse === item.id} onClick={() => selectCourse(item.id)}>{item.name}</button>)}
        </nav>
        <div className="legacy-top-actions">
          <span className="legacy-progress-chip"><span />{progress}% terminé</span>
          <button className="legacy-menu-toggle" aria-label={mobileMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} aria-expanded={mobileMenuOpen} onClick={() => setMobileMenuOpen((open) => !open)}>☰</button>
        </div>
      </header>
      <div className="legacy-layout">
        <aside className={`legacy-sidebar${mobileMenuOpen ? ' mobile-open' : ''}`}>
          <div className="legacy-search">
            <label className="visually-hidden" htmlFor="legacy-search">Chercher une leçon</label>
            <span aria-hidden="true">⌕</span>
            <input id="legacy-search" ref={searchField} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Chercher un cours..." />
            <kbd>Ctrl K</kbd>
          </div>
          {query ? (
            <div className="legacy-sidebar-section">
              <p className="legacy-sidebar-heading">RÉSULTATS ({filteredLessons.length})</p>
              {filteredLessons.map((item) => (
                <button className="legacy-lesson-link" key={`${item.courseId}:${item.title}`} onClick={() => selectLesson(item)}>
                  <span className="legacy-result-dot" style={{ '--course-color': courses.find((entry) => entry.id === item.courseId).color }} />{item.title}<small>{item.courseId.toUpperCase()}</small>
                </button>
              ))}
              {filteredLessons.length === 0 && <p className="legacy-no-results">Aucune leçon trouvée.</p>}
            </div>
          ) : (
            <>
              <div className="legacy-sidebar-welcome"><span className="legacy-eyebrow">TON PARCOURS</span><h2>On apprend mieux en pratiquant.</h2><p>Lis une notion, teste le code, puis observe ce qui change. Tu peux recommencer autant de fois que tu veux.</p></div>
              <div className="legacy-sidebar-section">
                <p className="legacy-sidebar-heading">FONDAMENTAUX</p>
                {courses.map((item) => (
                  <div className="legacy-course-group" key={item.id}>
                    <button className={`legacy-course-heading${activeCourse === item.id ? ' course-active' : ''}`} onClick={() => selectCourse(item.id)}>
                      <span className="legacy-course-icon" style={{ '--course-color': item.color }}>{item.icon}</span>
                      <span>{item.name}<small>{item.description}</small></span><span className="legacy-chevron">›</span>
                    </button>
                    {activeCourse === item.id && (
                      <div className="legacy-lesson-list">
                        {item.lessons.map((entry, index) => entry.level === activeLevel && (
                          <button key={entry.title} className={`legacy-lesson-link${lessonIndex === index ? ' lesson-active' : ''}`} onClick={() => selectLesson({ courseId: item.id, index })}>
                            <span className="legacy-lesson-status">{completed.includes(lessonId(item.id, entry)) ? '✓' : ''}</span>{entry.title}<small>{entry.duration}</small>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <div className="legacy-sidebar-note"><span>✦</span><div><strong>Tu bloques ?</strong><p>Change une seule chose à la fois. C’est souvent le meilleur moyen de comprendre ce qui se passe.</p></div></div>
            </>
          )}
          <div className="legacy-sidebar-footer"><span className="legacy-avatar">W</span><span><strong>Mon espace</strong><small>Progression enregistrée ici</small></span><span className="legacy-settings">⚙</span></div>
        </aside>
        <main className="legacy-main-content" id="legacy-content">
          <div className="legacy-breadcrumb"><span>Parcours</span><span>›</span><span>{course.name}</span><span>›</span><strong>{lesson.title}</strong></div>
          <section className="legacy-welcome-banner" style={{ '--course-color': course.color }}>
            <div className="legacy-banner-copy"><span className="legacy-eyebrow">COURS INTERACTIF · {course.name.toUpperCase()}</span><h1>Le web, ça s’apprend <em>en faisant.</em></h1><p>Comprends les bases, teste tes idées et vois tes créations prendre vie.</p><div className="legacy-banner-meta"><span>◷ Environ 20 min</span><span>◉ Niveau débutant</span></div></div>
            <div className="legacy-banner-art" aria-hidden="true"><div className="legacy-art-window"><div className="legacy-window-top"><i /><i /><i /><span>ma-page.html</span></div><div className="legacy-window-lines"><b /><b /><b /><b /><b /></div></div><div className="legacy-art-badge">{course.icon}</div><span className="legacy-art-spark">✳</span></div>
          </section>
          <section className="legacy-level-selector" aria-label="Choisir le niveau d’apprentissage">
            <div><span className="legacy-eyebrow">CHOISIS TON NIVEAU</span><p>Avance à ton rythme : tu peux changer de niveau quand tu veux.</p></div>
            <div className="legacy-level-options">{levels.map((item) => <button key={item} className={activeLevel === item ? 'level-selected' : ''} aria-pressed={activeLevel === item} onClick={() => selectLevel(item)}><strong>{item}</strong><small>{course.lessons.filter((entry) => entry.level === item).length} leçons</small></button>)}</div>
          </section>
          <div className="legacy-course-tabs" aria-label="Choisir un cours">{courses.map((item) => <button key={item.id} className={activeCourse === item.id ? 'tab-active' : ''} aria-pressed={activeCourse === item.id} onClick={() => selectCourse(item.id)}><span style={{ '--course-color': item.color }}>{item.icon}</span>{item.name}<small>{item.label}</small></button>)}</div>
          <section className="legacy-course-overview"><div><span className="legacy-eyebrow">CE QUE TU VAS APPRENDRE</span><p>{course.description}</p><ul>{course.outcomes.map((outcome) => <li key={outcome}>{outcome}</li>)}</ul></div><a href={course.reference} target="_blank" rel="noreferrer">Approfondir sur MDN ↗</a></section>
          <section className="legacy-path-progress" aria-label="Progression du niveau sélectionné"><div><strong>Ton parcours {activeLevel.toLowerCase()}</strong><span>{completedAtLevel} / {lessonsAtLevel.length} leçons terminées · {levelProgress}%</span></div><div className="legacy-progress-track" role="progressbar" aria-label={`Progression niveau ${activeLevel}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={levelProgress}><span style={{ width: `${levelProgress}%` }} /></div></section>
          <section className="legacy-lesson-heading">
            <div><div className="legacy-lesson-kicker"><span className="legacy-level-tag">{lesson.level}</span><span>Leçon {lessonPosition + 1} sur {lessonsForLevel.length}</span><span>·</span><span>{lesson.duration}</span></div><h2>{lesson.title}</h2><p>{lesson.intro}</p></div>
            <button className={`legacy-complete-button${completed.includes(currentLessonId) ? ' done' : ''}`} onClick={markComplete}>{completed.includes(currentLessonId) ? '✓ Leçon terminée' : 'Marquer comme terminée'}</button>
          </section>
          <div className="legacy-learning-grid">
            <div className="legacy-lesson-column">
              <article className="legacy-concept-card"><div style={{ '--course-color': course.color }}>✦</div><section><h3>À retenir</h3><p>{lesson.concept}</p></section></article>
              <article className="legacy-practice-card"><span className="legacy-eyebrow">À TOI DE JOUER</span><h3>Petit défi</h3><p>{lesson.task}</p><button onClick={markComplete}>J’ai compris <span>→</span></button></article>
              <div className="legacy-lesson-navigation"><button onClick={() => changeLesson(-1)} disabled={lessonPosition === 0}>← Précédent</button><span>{lessonPosition + 1} / {lessonsForLevel.length}</span><button onClick={() => changeLesson(1)} disabled={lessonPosition === lessonsForLevel.length - 1}>Leçon suivante →</button></div>
            </div>
            <section className="legacy-playground" aria-label="Éditeur de code et aperçu">
              <div className="legacy-playground-head"><strong><span />Zone de pratique</strong><button onClick={() => setCode(lesson.code)}>↻ Réinitialiser</button></div>
              <div className="legacy-editor-label"><span>{course.name === 'JavaScript' ? 'JS' : course.name.slice(0, 3).toUpperCase()}</span><span>exemple.{activeCourse === 'html' ? 'html' : activeCourse === 'css' ? 'css' : 'js'}</span><small>● Modifiable</small></div>
              <textarea aria-label="Éditeur de code" spellCheck="false" autoCapitalize="off" value={code} onChange={(event) => setCode(event.target.value)} />
              <div className="legacy-preview-head"><span>APERÇU EN DIRECT</span><span>•••</span></div>
              <iframe title="Aperçu du code" sandbox="allow-scripts" srcDoc={previewDoc} />
              <p>Modifie le code pour voir le résultat. <span>{course.name}</span></p>
            </section>
          </div>
          <section className="legacy-quiz-card">
            <div className="legacy-quiz-title"><span>?</span><div><span className="legacy-eyebrow">VÉRIFIE TES CONNAISSANCES</span><h3>Question rapide</h3></div></div>
            <p>{quiz.question}</p>
            <div className="legacy-quiz-options">{quiz.options.map((option, index) => <button key={option} className={quizChoice === index ? index === quiz.answer ? 'correct' : 'incorrect' : ''} onClick={() => answerQuiz(index)}>{option}<span>{quizChoice === index ? index === quiz.answer ? '✓' : '↻' : '○'}</span></button>)}</div>
            {quizMessage && <p className={quizChoice === quiz.answer ? 'legacy-quiz-feedback success' : 'legacy-quiz-feedback'} role="status">{quizMessage}</p>}
          </section>
          {notice && <div className="legacy-toast" role="status">✓ {notice}</div>}
          <footer className="legacy-footer"><span>Fait pour apprendre, une ligne à la fois.</span><span>CodeCraft · Cours gratuits · Tél&nbsp;: <a href="tel:66913322">66913322</a> / <a href="tel:73308997">73308997</a></span></footer>
        </main>
      </div>
    </div>
  );
}
