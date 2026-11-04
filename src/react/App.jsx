import { lazy, Suspense } from 'react';
import SeoHead from './components/SeoHead.jsx';
import PlatformLayout from './PlatformLayout.jsx';
import { resolveRoute } from './routing.js';
import { sitePath } from '../lib/site-path.js';

const pages = {
  home: lazy(() => import('./pages/HomePage.jsx')),
  courses: lazy(() => import('./pages/CoursesPage.jsx')),
  course: lazy(() => import('./pages/CoursePage.jsx')),
  lesson: lazy(() => import('./pages/LessonPage.jsx')),
  projects: lazy(() => import('./pages/ProjectsPage.jsx')),
  project: lazy(() => import('./pages/ProjectPage.jsx')),
  search: lazy(() => import('./pages/SearchPage.jsx')),
  reference: lazy(() => import('./pages/ReferencePage.jsx')),
  progress: lazy(() => import('./pages/ProgressPage.jsx')),
  about: lazy(() => import('./pages/AboutPage.jsx')),
  'legacy-learning': lazy(() => import('./pages/LegacyLearningPage.jsx'))
};

function NotFound() {
  return (
    <>
      <SeoHead title="Page introuvable — CodeCraft" description="Cette page n’existe pas." noindex />
      <section className="empty-state">
        <h1>Page introuvable</h1>
        <p>Cette page n’existe pas ou a été déplacée.</p>
        <a href={sitePath('/')}>Retour à l’accueil</a>
      </section>
    </>
  );
}

export default function App() {
  const route = resolveRoute(window.location.pathname, window.location.search);
  const Page = pages[route.name];
  const page = Page
    ? <Suspense fallback={<p role="status">Chargement…</p>}><Page {...route} /></Suspense>
    : <NotFound />;

  if (route.name === 'legacy-learning') return page;
  return <PlatformLayout>{page}</PlatformLayout>;
}
