<script>
  import { sitePath } from '$lib/site-path.js';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { base } from '$app/paths';
  import GlobalSearch from '$lib/components/GlobalSearch.svelte';

  let { children } = $props();
  let theme = $state('light');
  let menuOpen = $state(false);
  const currentPath = $derived(page.url.pathname.slice(base.length) || '/');

  onMount(() => {
    try {
      const savedTheme = localStorage.getItem('webschool-theme') ?? localStorage.getItem('weblearn-theme');
      theme = savedTheme === 'dark' || savedTheme === 'light'
        ? savedTheme
        : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      if (savedTheme) localStorage.setItem('webschool-theme', savedTheme);
    } catch {
      theme = 'light';
    }
  });

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    try { localStorage.setItem('webschool-theme', theme); } catch { /* Le thème reste actif jusqu'au rechargement. */ }
  }
</script>

<svelte:head>
  <meta name="theme-color" content={theme === 'dark' ? '#17201a' : '#f5f6f2'} />
  <link rel="icon" type="image/svg+xml" href={`${base}/logo-webschool.svg`} />
</svelte:head>

<div class="platform-shell" data-theme={theme}>
  <a class="skip-link" href="#contenu">Aller au contenu</a>
  <header class="topbar">
    <a class="brand" href={sitePath('/')} aria-label="CodeCraft, accueil">
      <img class="brand-mark" src={`${base}/logo-webschool.svg`} alt="" />
      <span class="brand-name">CodeCraft<small>APPRENDRE EN PRATIQUANT</small></span>
    </a>

    <GlobalSearch />

    <nav class="top-nav" aria-label="Navigation principale">
      <a href={sitePath('/cours')} class:active={currentPath.startsWith('/cours')} aria-current={currentPath.startsWith('/cours') ? 'page' : undefined}>Cours</a>
      <a href={sitePath('/projets')} class:active={currentPath.startsWith('/projets')} aria-current={currentPath.startsWith('/projets') ? 'page' : undefined}>Projets</a>
      <a href={sitePath('/reference')} class:active={currentPath === '/reference'} aria-current={currentPath === '/reference' ? 'page' : undefined}>Références</a>
      <a href={sitePath('/progression')} class:active={currentPath === '/progression'} aria-current={currentPath === '/progression' ? 'page' : undefined}>Ma progression</a>
    </nav>
    <div class="top-controls">
      <button class="theme-button" type="button" onclick={toggleTheme} aria-label={theme === 'dark' ? 'Activer le thème clair' : 'Activer le thème sombre'} title={theme === 'dark' ? 'Thème clair' : 'Thème sombre'}>
        {#if theme === 'dark'}<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/></svg>{:else}<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 15.5A8.5 8.5 0 0 1 8.5 3.5 8.5 8.5 0 1 0 20.5 15.5Z"/></svg>{/if}
      </button>
      <button class="menu-button" type="button" aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'} onclick={() => menuOpen = !menuOpen}><span class:open={menuOpen} class="menu-glyph" aria-hidden="true"><i></i><i></i></span></button>
    </div>
  </header>

  {#if menuOpen}
    <nav id="mobile-navigation" class="mobile-navigation" aria-label="Navigation mobile">
      <a href={sitePath('/cours')} aria-current={currentPath.startsWith('/cours') ? 'page' : undefined} onclick={() => menuOpen = false}>Cours HTML, CSS et JavaScript</a>
      <a href={sitePath('/projets')} aria-current={currentPath.startsWith('/projets') ? 'page' : undefined} onclick={() => menuOpen = false}>Projets</a>
      <a href={sitePath('/reference')} aria-current={currentPath === '/reference' ? 'page' : undefined} onclick={() => menuOpen = false}>Références</a>
      <a href={sitePath('/progression')} aria-current={currentPath === '/progression' ? 'page' : undefined} onclick={() => menuOpen = false}>Ma progression</a>
    </nav>
  {/if}

  <div class="workspace">
    <aside class="side-nav" aria-label="Espace d’apprentissage">
      <p class="side-label">APPRENDRE</p>
      <a class="side-link" class:active={currentPath === '/'} href={sitePath('/')} aria-current={currentPath === '/' ? 'page' : undefined}>Accueil</a>
      <a class="side-link" class:active={currentPath.startsWith('/cours')} href={sitePath('/cours')} aria-current={currentPath.startsWith('/cours') ? 'page' : undefined}>Tous les cours</a>
      <a class="side-link" class:active={currentPath.startsWith('/projets')} href={sitePath('/projets')} aria-current={currentPath.startsWith('/projets') ? 'page' : undefined}>Projets pratiques</a>
      <div class="side-divider"></div>
      <p class="side-label">FONDAMENTAUX</p>
      <a class="side-link" class:active={currentPath.startsWith('/cours/html')} href={sitePath('/cours/html')} aria-current={currentPath.startsWith('/cours/html') ? 'page' : undefined}><span class="course-dot html-dot"></span>HTML</a>
      <a class="side-link" class:active={currentPath.startsWith('/cours/css')} href={sitePath('/cours/css')} aria-current={currentPath.startsWith('/cours/css') ? 'page' : undefined}><span class="course-dot css-dot"></span>CSS</a>
      <a class="side-link" class:active={currentPath.startsWith('/cours/javascript')} href={sitePath('/cours/javascript')} aria-current={currentPath.startsWith('/cours/javascript') ? 'page' : undefined}><span class="course-dot js-dot"></span>JavaScript</a>
      <div class="side-divider"></div>
      <a class="side-link" class:active={currentPath === '/reference'} href={sitePath('/reference')} aria-current={currentPath === '/reference' ? 'page' : undefined}>Documentation de référence</a>
      <a class="side-link" class:active={currentPath === '/progression'} href={sitePath('/progression')} aria-current={currentPath === '/progression' ? 'page' : undefined}>Progression personnelle</a>
      <div class="side-note"><span class="note-mark" aria-hidden="true"></span><p>Tu avances à ton rythme. Reviens à une leçon quand tu en as besoin.</p></div>
    </aside>

    <main id="contenu" class="page-content">
      {@render children()}
    </main>
  </div>

  <footer class="site-footer">
    <a class="footer-brand" href={sitePath('/')}>CodeCraft</a>
    <span>Une notion à la fois, un exemple après l’autre.</span>
    <div class="footer-contact">
      <span>Tél&nbsp;:</span>
      <a href="tel:66913322">66913322</a>
      <span class="footer-sep">/</span>
      <a href="tel:73308997">73308997</a>
    </div>
    <div class="footer-links"><a href={sitePath('/cours')}>Cours</a><a href={sitePath('/reference')}>Références</a><a href={sitePath('/a-propos')}>À propos</a></div>
  </footer>
</div>

<style>
  .platform-shell{--surface:#fff;--surface-soft:#f7f9f5;--surface-raised:#fff;--text:#25342b;--text-soft:#4d5e52;--muted:#748178;--line:#e2e8e1;--line-strong:#d2ddd2;--accent:#246b45;--accent-hover:#185536;--accent-soft:#edf5ed;--focus:#b38a38;--success:#287443;--warning:#8a6923;--danger:#a34f42;--canvas:#f4f5f0;min-height:100vh;background:var(--canvas);color:var(--text);transition:background .2s,color .2s}
  .platform-shell[data-theme="dark"]{--surface:#202923;--surface-soft:#252f28;--surface-raised:#29342c;--text:#edf2ed;--text-soft:#d0dbd1;--muted:#a2afa4;--line:#39463b;--line-strong:#4a594c;--accent:#8fc79a;--accent-hover:#acd9b5;--accent-soft:#2b3c2e;--focus:#e0bd68;--success:#a4d4ad;--warning:#e1c477;--danger:#efa89c;--canvas:#171e19;background:var(--canvas);color:var(--text)}
  .skip-link{position:fixed;z-index:20;top:8px;left:8px;transform:translateY(-150%);padding:10px 14px;border-radius:8px;background:#145e39;color:white;font-size:13px;text-decoration:none}.skip-link:focus{transform:translateY(0)}
  .topbar{position:sticky;top:0;z-index:40;min-height:68px;display:flex;align-items:center;gap:23px;padding:0 clamp(18px,4vw,56px);background:var(--surface);border-bottom:1px solid var(--line)}
  .brand{display:flex;align-items:center;gap:10px;min-width:210px;color:var(--text);text-decoration:none}.brand-mark{width:38px;height:38px;display:block;border-radius:11px}.brand-name{font:800 16px/1 Manrope,system-ui,sans-serif;letter-spacing:-.6px;white-space:nowrap}.brand-name>span{color:var(--accent)}.brand-name small{display:block;margin-top:5px;color:var(--muted);font:700 7px/1 'DM Sans',sans-serif;letter-spacing:1px}
  .top-nav{display:flex;align-items:center;gap:20px;margin-left:auto}.top-nav a,.site-footer a{color:var(--muted);font-size:12px;text-decoration:none}.top-nav a:hover,.site-footer a:hover,.top-nav a.active{color:var(--accent)}.top-nav a.active{font-weight:750}.top-controls{display:flex;gap:7px}.theme-button,.menu-button{width:40px;height:40px;display:grid;place-items:center;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--text);cursor:pointer}.theme-button svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-linecap:round;stroke-linejoin:round;stroke-width:1.7}.menu-button{display:none}.menu-glyph{position:relative;width:17px;height:14px;display:block}.menu-glyph i{position:absolute;left:0;width:17px;height:1.5px;border-radius:2px;background:currentColor;transition:transform .16s,top .16s}.menu-glyph i:first-child{top:3px}.menu-glyph i:last-child{top:10px}.menu-glyph.open i:first-child{top:6px;transform:rotate(45deg)}.menu-glyph.open i:last-child{top:6px;transform:rotate(-45deg)}.mobile-navigation{display:none}
  .workspace{max-width:1500px;min-height:calc(100vh - 144px);display:grid;grid-template-columns:224px minmax(0,1fr);margin:auto}.side-nav{position:sticky;top:68px;align-self:start;height:calc(100vh - 68px);overflow-y:auto;padding:25px 15px;background:var(--surface);border-right:1px solid var(--line)}.side-label{margin:8px 9px;color:var(--muted);font-size:9px;font-weight:800;letter-spacing:1.2px}.side-link{min-height:40px;display:flex;align-items:center;gap:9px;padding:8px 10px;border-radius:7px;color:var(--text);font-size:12px;line-height:1.45;text-decoration:none}.side-link:hover,.side-link.active{background:var(--surface-soft);color:var(--accent)}.side-link.active{font-weight:750}.side-divider{height:1px;margin:14px 8px;background:var(--line)}.course-dot{width:8px;height:8px;flex:0 0 8px;border-radius:50%}.html-dot{background:#d46c43}.css-dot{background:#3b78a8}.js-dot{background:#9b771f}.side-note{display:flex;gap:9px;margin:24px 3px 0;padding:11px;border:1px solid #e6e1cf;border-radius:9px;background:#f8f6eb;color:#6c6246}.note-mark{width:7px;height:7px;flex:0 0 7px;margin:5px 2px 0;border-radius:50%;background:#b69a55}.side-note p{margin:0;font-size:10px;line-height:1.6}.page-content{width:min(100%,1180px);min-width:0;margin:0 auto;padding:36px clamp(22px,4vw,56px) 54px}
  .site-footer{min-height:76px;display:flex;align-items:center;flex-wrap:wrap;gap:12px 20px;padding:15px clamp(18px,4vw,56px);background:var(--surface);border-top:1px solid var(--line);color:var(--muted);font-size:11px}.footer-brand{color:var(--text)!important;font:800 15px Manrope,system-ui,sans-serif!important}.footer-contact{display:flex;align-items:center;gap:6px;margin-left:auto;white-space:nowrap}.footer-contact a{color:var(--muted);font-weight:600}.footer-contact a:hover{color:var(--accent)}.footer-sep{color:var(--line-strong);margin:0 2px}.footer-links{display:flex;gap:17px}
  @media(max-width:950px){.topbar{gap:15px}.brand{min-width:145px}.top-nav{gap:12px}.workspace{grid-template-columns:190px minmax(0,1fr)}.side-nav{padding-inline:10px}}
  @media(max-width:700px){.topbar{min-height:62px;padding:0 14px;gap:10px}.brand{min-width:0;gap:7px}.brand-mark{width:34px;height:34px}.brand-name{font-size:12px;letter-spacing:-.35px}.brand-name small{display:none}.topbar :global(.global-search){min-width:0;height:36px}.topbar :global(.global-search kbd),.top-nav{display:none}.menu-button{display:grid}.mobile-navigation{position:absolute;z-index:10;top:62px;right:0;left:0;display:grid;gap:2px;padding:12px 15px;background:var(--surface);border-bottom:1px solid var(--line);box-shadow:0 12px 22px #18291a13}.mobile-navigation a{padding:12px;border-radius:7px;color:var(--text);font-size:13px;text-decoration:none}.mobile-navigation a:hover,.mobile-navigation a[aria-current="page"]{background:var(--surface-soft);color:var(--accent)}.mobile-navigation a[aria-current="page"]{font-weight:750}.workspace{display:block;min-height:calc(100vh - 136px)}.side-nav{display:none}.page-content{padding:25px 17px 36px}.site-footer{align-items:flex-start;flex-wrap:wrap;gap:9px 16px;padding:17px}.site-footer>div{width:100%;margin:2px 0 0}.site-footer>span{font-size:10px}}
</style>
