import { useEffect, useMemo, useState } from 'react';
import SeoHead from '../components/SeoHead.jsx';
import { detailedLessons } from '../../lib/data/lessons/course-index.js';
import { getProject } from '../../lib/data/projects.js';
import { markProjectCompleted, markProjectStarted, readProgress } from '../../lib/services/progress.js';
import { sitePath } from '../../lib/site-path.js';
import './ProjectPage.css';

function validTasks(value) {
  return Array.isArray(value)
    ? value.filter((task) => task && typeof task.text === 'string' && typeof task.done === 'boolean')
    : [];
}

export default function ProjectPage({ params }) {
  const project = useMemo(() => {
    const entry = getProject(params.slug);
    if (!entry) return null;
    return {
      ...entry,
      lessons: entry.lessons.map((id) => detailedLessons.find((lesson) => lesson.id === id)).filter(Boolean)
    };
  }, [params.slug]);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [notice, setNotice] = useState('');
  const isTodo = project?.id === 'todo-list';
  const isAvailable = project?.status === 'available';
  const storageKey = `webschool-project-${project?.id}`;

  useEffect(() => {
    if (!project) return;
    const progress = readProgress().projects?.[project.id];
    setStarted(progress?.status === 'started' || progress?.status === 'completed');
    setCompleted(progress?.status === 'completed');
    if (project.id === 'todo-list') {
      try {
        setTasks(validTasks(JSON.parse(localStorage.getItem(storageKey) ?? '[]')));
      } catch (error) {
        console.error('Impossible de restaurer les tâches du projet.', error);
        setNotice('La liste enregistrée est illisible; tu peux créer une nouvelle liste.');
      }
    }
  }, [project, storageKey]);

  if (!project) return <p>Projet introuvable.</p>;

  function beginProject() {
    if (!isAvailable) return;
    setStarted(true);
    const saved = markProjectStarted(project.id);
    if (!saved) console.error(`Impossible d’enregistrer le début du projet "${project.id}".`);
    setNotice('Projet commencé. Ta progression est enregistrée sur cet appareil.');
  }

  function saveTasks(nextTasks) {
    setTasks(nextTasks);
    try {
      localStorage.setItem(storageKey, JSON.stringify(nextTasks));
    } catch (error) {
      console.error('Impossible de sauvegarder les tâches du projet.', error);
      setNotice('La liste fonctionne, mais le navigateur ne permet pas de la sauvegarder.');
    }
  }

  function addTask(event) {
    event.preventDefault();
    const text = newTask.trim();
    if (!text) return;
    const nextTasks = [...tasks, { id: `${Date.now()}-${Math.random().toString(16).slice(2)}`, text, done: false }];
    saveTasks(nextTasks);
    setNewTask('');
    beginProject();
  }

  function completeProject() {
    const saved = markProjectCompleted(project.id);
    setCompleted(saved);
    setStarted(true);
    setNotice(saved ? 'Bravo, projet marqué comme terminé !' : 'Impossible d’enregistrer la progression dans ce navigateur.');
  }

  return (
    <>
      <SeoHead
        title={`${project.title} : projet pratique — CodeCraft`}
        description={project.description}
        path={`/projets/${project.id}`}
        noindex={project.status !== 'available'}
      />
      <a className="back-link" href={sitePath('/projets')}>← Tous les projets</a>
      <header className="project-heading">
        <span className="eyebrow">PROJET · {project.level.toUpperCase()} · {project.duration}</span>
        <h1>{project.title}</h1><p>{project.description}</p>
        <div className="tech-list">{project.technologies.map((technology) => <span key={technology}>{technology}</span>)}</div>
      </header>
      <div className="project-layout">
        <section className="project-content">
          <section className="panel">
            <span className="eyebrow">OBJECTIF</span><h2>Ce que tu vas construire</h2>
            <p>{isTodo
              ? 'Une liste de tâches simple et personnelle : ajoute un élément, marque-le comme réalisé et retire-le si besoin. Les tâches restent enregistrées localement dans ce navigateur.'
              : 'Un projet guidé pour appliquer les notions des cours et bâtir progressivement une réalisation à montrer dans ton portfolio.'}</p>
            {!isAvailable
              ? <p className="coming-note">Le parcours guidé de ce projet est encore en préparation.</p>
              : !started
                ? <button className="primary-button" type="button" onClick={beginProject}>Commencer ce projet →</button>
                : <p className="started-note">✓ Projet commencé</p>}
          </section>

          {isTodo ? (
            <>
              <section className="todo-panel" aria-labelledby="todo-title">
                <div className="todo-title"><div><span className="eyebrow">ATELIER PRATIQUE</span><h2 id="todo-title">Ma liste de tâches</h2></div><span className="task-count">{tasks.filter((task) => !task.done).length} à faire</span></div>
                <form onSubmit={addTask}>
                  <label htmlFor="new-task">Nouvelle tâche</label>
                  <div className="add-row"><input id="new-task" value={newTask} onChange={(event) => setNewTask(event.target.value)} maxLength={120} placeholder="Ex. Réviser les événements" /><button type="submit">Ajouter</button></div>
                </form>
                {tasks.length > 0 ? (
                  <ul className="task-list">{tasks.map((task) => (
                    <li key={task.id}>
                      <label><input type="checkbox" checked={task.done} onChange={() => saveTasks(tasks.map((item) => item.id === task.id ? { ...item, done: !item.done } : item))} /><span className={task.done ? 'done' : ''}>{task.text}</span></label>
                      <button className="delete-button" type="button" aria-label={`Supprimer : ${task.text}`} onClick={() => saveTasks(tasks.filter((item) => item.id !== task.id))}>Supprimer</button>
                    </li>
                  ))}</ul>
                ) : <p className="empty-tasks">Ta liste est vide. Ajoute une tâche pour commencer.</p>}
                <p className="storage-hint">Les tâches sont sauvegardées sur cet appareil avec localStorage.</p>
              </section>
              <section className="panel steps">
                <span className="eyebrow">ÉTAPES DU DÉFI</span><h2>À toi d’aller plus loin</h2>
                <ol><li>Ajoute plusieurs tâches et marque-en une comme terminée.</li><li>Supprime une tâche dont tu n’as plus besoin.</li><li>Observe la liste après actualisation : les données persistent.</li><li>Quand tu as terminé et compris les interactions, marque le projet comme terminé.</li></ol>
                {!completed
                  ? <button className="complete-button" type="button" onClick={completeProject}>J’ai terminé le projet</button>
                  : <p className="completed-note">✓ Projet terminé. Tu peux revenir modifier ta liste quand tu veux.</p>}
              </section>
            </>
          ) : (
            <section className="panel steps">
              <span className="eyebrow">PARCOURS EN PRÉPARATION</span><h2>Ce projet n’a pas encore son atelier guidé</h2>
              <p>Cette fiche présente les objectifs et les notions à mobiliser. Le parcours détaillé sera ajouté ultérieurement.</p>
              <h3>Notions à pratiquer</h3><ul>{project.concepts.map((concept) => <li key={concept}>{concept}</li>)}</ul>
            </section>
          )}
          {notice && <p className="notice" role="status">{notice}</p>}
        </section>
        <aside className="side-panel">
          <section className="panel"><span className="eyebrow">NOTIONS TRAVAILLÉES</span><ul className="concept-list">{project.concepts.map((concept) => <li key={concept}><span>✓</span>{concept}</li>)}</ul></section>
          <section className="panel">
            <span className="eyebrow">LEÇONS ASSOCIÉES</span>
            {project.lessons.length > 0
              ? <ul className="lesson-list">{project.lessons.map((lesson) => <li key={lesson.id}><a href={sitePath(`/cours/${lesson.courseId}/lecons/${lesson.slug}`)}><small>{lesson.courseId === 'javascript' ? 'JAVASCRIPT' : lesson.courseId.toUpperCase()}</small><span>{lesson.title} →</span></a></li>)}</ul>
              : <p>Aucune leçon associée n’est encore disponible.</p>}
          </section>
        </aside>
      </div>
    </>
  );
}
