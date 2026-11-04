<script>
  import { onMount } from 'svelte';

  let { example, title = 'Exemple interactif' } = $props();
  let files = $state({ html: '', css: '', javascript: '' });
  let editorReady = $state(false);
  let activeTab = $state('html');
  let preview;
  let executedDocument = $state('');
  let status = $state('Modifie le code, puis exécute ton exemple.');
  let runtimeError = $state('');
  let isFullscreen = $state(false);
  let currentExampleId = $state('');
  const draftKey = $derived(`webschool-editor-${example.id}`);

  const tabs = [
    { id: 'html', label: 'HTML' },
    { id: 'css', label: 'CSS' },
    { id: 'javascript', label: 'JavaScript' }
  ];

  function createPreviewDocument() {
    const script = files.javascript
      .replace(/<\/script/gi, '\\x3C/script')
      .replace(/<script/gi, '\\x3Cscript');
    const reporter = [
      '<script>',
      'window.onerror = function (message, source, line) {',
      '  parent.postMessage({ source: "webschool-preview", type: "error", message: String(message), line: Number(line) || 0 }, "*");',
      '  return true;',
      '};',
      'window.addEventListener("unhandledrejection", function (event) {',
      '  parent.postMessage({ source: "webschool-preview", type: "error", message: String(event.reason) }, "*");',
      '});',
      'window.parent.postMessage({ source: "webschool-preview", type: "ready" }, "*");',
      'try {',
      script,
      '} catch (error) {',
      '  parent.postMessage({ source: "webschool-preview", type: "error", message: String(error.message) }, "*");',
      '}',
      '</' + 'script>'
    ].join('\n');
    const policy = "default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data: blob:; font-src data:; connect-src data:; form-action 'none'; base-uri 'none'";

    return [
      '<!doctype html><html lang="fr"><head><meta charset="utf-8">',
      '<meta name="viewport" content="width=device-width,initial-scale=1">',
      `<meta http-equiv="Content-Security-Policy" content="${policy}">`,
      `<style>body{font:15px system-ui,sans-serif;color:#26372d;padding:18px;line-height:1.6}img{max-width:100%;height:auto}${files.css}</style>`,
      '</head><body>', files.html, reporter, '</body></html>'
    ].join('\n');
  }

  function runExample() {
    runtimeError = '';
    status = 'Exécution…';
    try {
      localStorage.setItem(draftKey, JSON.stringify(files));
    } catch {
      // L’éditeur fonctionne aussi si le navigateur bloque le stockage local.
    }
    executedDocument = createPreviewDocument();
  }

  function resetExample() {
    files = { ...example.files };
    runtimeError = '';
    status = 'Exemple réinitialisé.';
    try {
      localStorage.removeItem(draftKey);
      localStorage.removeItem(`weblearn-editor-${example.id}`);
    } catch {
      // La réinitialisation de l’éditeur ne dépend pas du stockage local.
    }
    executedDocument = createPreviewDocument();
  }

  function clearCurrentFile() {
    files[activeTab] = '';
    status = `${tabs.find((tab) => tab.id === activeTab).label} effacé. Exécute pour actualiser l’aperçu.`;
  }

  async function copyCurrentFile() {
    try {
      await navigator.clipboard.writeText(files[activeTab]);
      status = `${tabs.find((tab) => tab.id === activeTab).label} copié.`;
    } catch {
      status = 'Copie indisponible ici. Sélectionne le code pour le copier.';
    }
  }

  function handlePreviewMessage(event) {
    if (event.source !== preview?.contentWindow || event.data?.source !== 'webschool-preview') return;
    if (event.data.type === 'error') {
      runtimeError = `${event.data.message}${event.data.line ? ` (ligne ${event.data.line})` : ''}`;
      status = 'Une erreur est survenue dans ton exemple.';
    } else if (event.data.type === 'ready') {
      status = 'Exemple exécuté.';
    }
  }

  function restoreDraft() {
    files = { ...example.files };
    try {
      const saved = localStorage.getItem(draftKey) ?? localStorage.getItem(`weblearn-editor-${example.id}`);
      const parsed = saved ? JSON.parse(saved) : null;
      if (parsed && ['html', 'css', 'javascript'].every((key) => typeof parsed[key] === 'string')) {
        files = parsed;
        localStorage.setItem(draftKey, saved);
        status = 'Brouillon local restauré.';
      }
    } catch {
      // Un brouillon illisible ne doit pas empêcher l’ouverture de l’éditeur.
    }
    editorReady = true;
  }

  onMount(() => {
    window.addEventListener('message', handlePreviewMessage);
    return () => window.removeEventListener('message', handlePreviewMessage);
  });

  $effect(() => {
    if (currentExampleId !== example.id) {
      currentExampleId = example.id;
      restoreDraft();
      runExample();
    }
  });
</script>

<section class:fullscreen={isFullscreen} class="playground" aria-label={title}>
  <header class="playground-header"><div><span class="live-dot"></span><div><span class="eyebrow">ATELIER DE CODE</span><h2>{title}</h2></div></div><button class="screen-button" type="button" aria-label={isFullscreen ? 'Quitter le plein écran' : 'Passer en plein écran'} onclick={() => isFullscreen = !isFullscreen}>{isFullscreen ? '↙' : '↗'}</button></header>
  <div class="editor-panel">
    <div class="editor-toolbar"><div class="tabs" role="tablist" aria-label="Langage de l’exemple">{#each tabs as tab}<button id={`${example.id}-${tab.id}-tab`} role="tab" aria-selected={activeTab === tab.id} aria-controls={`${example.id}-editor`} class:active={activeTab === tab.id} type="button" onclick={() => activeTab = tab.id}>{tab.label}</button>{/each}</div><div class="file-actions"><button type="button" onclick={copyCurrentFile}>Copier</button><button type="button" onclick={clearCurrentFile}>Effacer</button><button type="button" onclick={resetExample}>Réinitialiser</button></div></div>
  <label class="visually-hidden" for={`${example.id}-editor`}>Code {tabs.find((tab) => tab.id === activeTab).label}</label><textarea id={`${example.id}-editor`} role="tabpanel" aria-labelledby={`${example.id}-${activeTab}-tab`} value={editorReady ? files[activeTab] : example.files[activeTab]} oninput={(event) => files[activeTab] = event.currentTarget.value} spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>
    <div class="run-row"><button class="run-button" type="button" onclick={runExample}>Exécuter <span aria-hidden="true">▶</span></button><span class="run-status" role="status">{status}</span></div>
  </div>
  <div class="preview-heading"><h3>Résultat</h3><span>Exécution isolée</span></div>
  {#if runtimeError}<p class="runtime-error" role="alert"><strong>Erreur JavaScript :</strong> {runtimeError}</p>{/if}
  <iframe bind:this={preview} title={`Résultat de l’exemple : ${title}`} sandbox="allow-scripts" referrerpolicy="no-referrer" srcdoc={executedDocument}></iframe>
  <p class="sandbox-note">Cet exemple s’exécute dans une iframe isolée. Il ne peut pas lire les données de CodeCraft ni soumettre un formulaire.</p>
</section>

<style>
  .playground{border:1px solid #e2e9e2;border-radius:13px;background:#fff;overflow:hidden;box-shadow:0 5px 18px #223a2b08}.playground.fullscreen{position:fixed;z-index:30;inset:14px;display:flex;flex-direction:column;background:#f7f9f7;box-shadow:0 0 0 100vmax #15231bbc}.playground-header{display:flex;align-items:center;justify-content:space-between;padding:15px 17px;border-bottom:1px solid #e9eee9}.playground-header>div{display:flex;align-items:center;gap:10px}.live-dot{width:8px;height:8px;border-radius:50%;background:#45a768;box-shadow:0 0 0 4px #eaf5ed}.eyebrow{color:#849289;font-size:8px;font-weight:800;letter-spacing:1.2px}.playground-header h2{margin:4px 0 0;color:#2d3b31;font:750 14px Manrope,system-ui,sans-serif}.screen-button{width:30px;height:30px;border:1px solid #e3eae3;border-radius:7px;background:#fff;color:#617167;font-size:15px;cursor:pointer}.editor-panel{margin:13px;border:1px solid #e3e9e3;border-radius:9px;overflow:hidden}.editor-toolbar{display:flex;align-items:center;justify-content:space-between;gap:9px;padding:7px;background:#f7f9f7;border-bottom:1px solid #e3e9e3}.tabs,.file-actions{display:flex;flex-wrap:wrap;gap:4px}.tabs button,.file-actions button{padding:7px 9px;border:0;border-radius:6px;background:transparent;color:#758179;font-size:10px;cursor:pointer}.tabs button.active{background:#fff;color:#27794b;font-weight:750;box-shadow:0 1px 3px #23352810}.file-actions button:hover{background:#eaf1ea;color:#426c4d}.editor-panel textarea{display:block;width:100%;height:210px;resize:vertical;padding:13px;border:0;outline:0;background:#fff;color:#314f3b;font:12px/1.65 ui-monospace,SFMono-Regular,Consolas,monospace;tab-size:2;white-space:pre;overflow:auto}.run-row{display:flex;align-items:center;gap:11px;padding:9px 11px;border-top:1px solid #e9eee9}.run-button{padding:8px 11px;border:0;border-radius:6px;background:#197749;color:#fff;font-size:10px;font-weight:750;cursor:pointer}.run-button span{margin-left:5px;font-size:8px}.run-status{color:#7d897f;font-size:9px}.preview-heading{display:flex;align-items:center;justify-content:space-between;padding:0 16px 8px}.preview-heading h3{margin:4px 0;color:#344239;font-size:11px}.preview-heading span{color:#859188;font-size:9px}.playground iframe{display:block;width:calc(100% - 26px);height:220px;margin:0 13px;border:1px solid #e3e9e3;border-radius:8px;background:#fff}.sandbox-note{margin:9px 15px 13px;color:#879188;font-size:9px;line-height:1.55}.runtime-error{margin:0 13px 9px;padding:9px 11px;border:1px solid #f0d4ce;border-radius:7px;background:#fff3f0;color:#8a4236;font-size:10px;line-height:1.6}.visually-hidden{position:absolute;width:1px;height:1px;clip:rect(0,0,0,0);white-space:nowrap;clip-path:inset(50%);overflow:hidden}
  :global(.platform-shell[data-theme="dark"]) .playground,:global(.platform-shell[data-theme="dark"]) .playground.fullscreen{border-color:#35443a;background:#202a23}:global(.platform-shell[data-theme="dark"]) .playground-header h2,:global(.platform-shell[data-theme="dark"]) .preview-heading h3{color:#eef4ee}:global(.platform-shell[data-theme="dark"]) .editor-panel,:global(.platform-shell[data-theme="dark"]) .editor-panel textarea,:global(.platform-shell[data-theme="dark"]) .screen-button{border-color:#405247;background:#1a241d;color:#e3ece4}:global(.platform-shell[data-theme="dark"]) .editor-toolbar{border-color:#405247;background:#202a23}:global(.platform-shell[data-theme="dark"]) .tabs button.active{background:#35443a;color:#b0dfbb}
  @media(max-width:650px){.editor-toolbar{align-items:flex-start;flex-direction:column}.file-actions{width:100%}.editor-panel textarea{height:190px}.playground iframe{height:180px}.playground.fullscreen{inset:5px}}
</style>
