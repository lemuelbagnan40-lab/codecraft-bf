import { useEffect, useState } from 'react';
import GlobalSearch from './components/GlobalSearch.jsx';
import { sitePath } from '../lib/site-path.js';
import './layout.css';

function isActive(path, currentPath) {
  return path === '/' ? currentPath === '/' : currentPath.startsWith(path);
}

function NavigationLink({ path, currentPath, children, className = '', onClick }) {
  const active = isActive(path, currentPath);
  return (
    <a
      className={`${className}${active ? ' active' : ''}`.trim()}
      href={sitePath(path)}
      aria-current={active ? 'page' : undefined}
      onClick={onClick}
    >
      {children}
    </a>
  );
}

export default function PlatformLayout({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('webschool-theme') ?? localStorage.getItem('weblearn-theme');
      if (savedTheme === 'dark' || savedTheme === 'light') return savedTheme;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (error) {
      console.error('Impossible de charger le thème enregistré.', error);
      return 'light';
    }
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const currentPath = window.location.pathname.slice(
    (import.meta.env.BASE_URL ?? '/').replace(/\/+$/g, '').length
  ) || '/';

  useEffect(() => {
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#17201a' : '#f5f6f2');
    let icon = document.querySelector('link[rel="icon"]');
    if (!icon) {
      icon = document.createElement('link');
      icon.rel = 'icon';
      icon.type = 'image/svg+xml';
      document.head.append(icon);
    }
    icon.href = sitePath('/logo-webschool.svg');
    try {
      localStorage.setItem('webschool-theme', theme);
    } catch (error) {
      console.error('Impossible d’enregistrer le thème.', error);
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((currentTheme) => currentTheme === 'light' ? 'dark' : 'light');
  }

  const themeIcon = theme === 'dark'
    ? <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" /></svg>
    : <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z" /></svg>;

  return (
    <div className="platform-shell" data-theme={theme}>
      <a className="skip-link" href="#contenu">Aller au contenu</a>
      <header className="topbar">
        <a className="brand" href={sitePath('/')} aria-label="CodeCraft, accueil">
          <img className="brand-mark" src={sitePath('/logo-webschool.svg')} alt="" />
          <span className="brand-name">CodeCraft<small>APPRENDRE EN PRATIQUANT</small></span>
        </a>

        <GlobalSearch />

        <nav className="top-nav" aria-label="Navigation principale">
          <NavigationLink path="/cours" currentPath={currentPath}>Cours</NavigationLink>
          <NavigationLink path="/projets" currentPath={currentPath}>Projets</NavigationLink>
          <NavigationLink path="/reference" currentPath={currentPath}>Références</NavigationLink>
          <NavigationLink path="/progression" currentPath={currentPath}>Ma progression</NavigationLink>
        </nav>

        <div className="top-controls">
          <button
            className="theme-button"
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'}
            title={theme === 'dark' ? 'Thème clair' : 'Thème sombre'}
          >
            {themeIcon}
          </button>
          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className={`menu-glyph${menuOpen ? ' open' : ''}`} aria-hidden="true"><i /><i /></span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-navigation" aria-label="Navigation mobile">
          <NavigationLink path="/cours" currentPath={currentPath} onClick={() => setMenuOpen(false)}>
            Cours HTML, CSS et JavaScript
          </NavigationLink>
          <NavigationLink path="/projets" currentPath={currentPath} onClick={() => setMenuOpen(false)}>Projets</NavigationLink>
          <NavigationLink path="/reference" currentPath={currentPath} onClick={() => setMenuOpen(false)}>Références</NavigationLink>
          <NavigationLink path="/progression" currentPath={currentPath} onClick={() => setMenuOpen(false)}>Ma progression</NavigationLink>
        </nav>
      )}

      <div className="workspace">
        <aside className="side-nav" aria-label="Espace d’apprentissage">
          <p className="side-label">APPRENDRE</p>
          <NavigationLink path="/" currentPath={currentPath} className="side-link">Accueil</NavigationLink>
          <NavigationLink path="/cours" currentPath={currentPath} className="side-link">Tous les cours</NavigationLink>
          <NavigationLink path="/projets" currentPath={currentPath} className="side-link">Projets pratiques</NavigationLink>
          <div className="side-divider" />
          <p className="side-label">FONDAMENTAUX</p>
          <NavigationLink path="/cours/html" currentPath={currentPath} className="side-link"><span className="course-dot html-dot" />HTML</NavigationLink>
          <NavigationLink path="/cours/css" currentPath={currentPath} className="side-link"><span className="course-dot css-dot" />CSS</NavigationLink>
          <NavigationLink path="/cours/javascript" currentPath={currentPath} className="side-link"><span className="course-dot js-dot" />JavaScript</NavigationLink>
          <div className="side-divider" />
          <NavigationLink path="/reference" currentPath={currentPath} className="side-link">Documentation de référence</NavigationLink>
          <NavigationLink path="/progression" currentPath={currentPath} className="side-link">Progression personnelle</NavigationLink>
          <div className="side-note"><span className="note-mark" aria-hidden="true" /><p>Tu avances à ton rythme. Reviens à une leçon quand tu en as besoin.</p></div>
        </aside>

        <main id="contenu" className="page-content">{children}</main>
      </div>

      <footer className="site-footer">
        <a className="footer-brand" href={sitePath('/')}>CodeCraft</a>
        <span>Une notion à la fois, un exemple après l’autre.</span>
        <div className="footer-contact">
          <span>Tél&nbsp;:</span>
          <a href="tel:66913322">66913322</a>
          <span className="footer-sep">/</span>
          <a href="tel:73308997">73308997</a>
        </div>
        <div className="footer-links">
          <a href={sitePath('/cours')}>Cours</a>
          <a href={sitePath('/reference')}>Références</a>
          <a href={sitePath('/a-propos')}>À propos</a>
        </div>
      </footer>
    </div>
  );
}
