import { useEffect, useRef, useState } from 'react';
import './CodePlayground.css';

const tabs = [
  { id: 'html', label: 'HTML' },
  { id: 'css', label: 'CSS' },
  { id: 'javascript', label: 'JavaScript' }
];

function previewDocument(files) {
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

function readDraft(exampleId, defaults) {
  const draftKey = `webschool-editor-${exampleId}`;
  try {
    const saved = localStorage.getItem(draftKey) ?? localStorage.getItem(`weblearn-editor-${exampleId}`);
    const parsed = saved ? JSON.parse(saved) : null;
    if (parsed && ['html', 'css', 'javascript'].every((key) => typeof parsed[key] === 'string')) {
      localStorage.setItem(draftKey, saved);
      return { files: parsed, status: 'Brouillon local restauré.' };
    }
  } catch (error) {
    console.error('Impossible de restaurer le brouillon de l’éditeur.', error);
    return { files: defaults, status: 'Le brouillon local est illisible; l’exemple original est chargé.' };
  }
  return { files: defaults, status: 'Modifie le code, puis exécute ton exemple.' };
}

export default function CodePlayground({ example, title = 'Exemple interactif' }) {
  const [files, setFiles] = useState(example.files);
  const [editorReady, setEditorReady] = useState(false);
  const [activeTab, setActiveTab] = useState('html');
  const [executedDocument, setExecutedDocument] = useState('');
  const [status, setStatus] = useState('Modifie le code, puis exécute ton exemple.');
  const [runtimeError, setRuntimeError] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const preview = useRef(null);
  const draftKey = `webschool-editor-${example.id}`;

  useEffect(() => {
    const draft = readDraft(example.id, example.files);
    setFiles(draft.files);
    setStatus(draft.status);
    setEditorReady(true);
    setRuntimeError('');
    setExecutedDocument(previewDocument(draft.files));
  }, [example.id, example.files]);

  useEffect(() => {
    function handlePreviewMessage(event) {
      if (event.source !== preview.current?.contentWindow || event.data?.source !== 'webschool-preview') return;
      if (event.data.type === 'error') {
        setRuntimeError(`${event.data.message}${event.data.line ? ` (ligne ${event.data.line})` : ''}`);
        setStatus('Une erreur est survenue dans ton exemple.');
      } else if (event.data.type === 'ready') {
        setStatus('Exemple exécuté.');
      }
    }
    window.addEventListener('message', handlePreviewMessage);
    return () => window.removeEventListener('message', handlePreviewMessage);
  }, []);

  function runExample(nextFiles = files) {
    setRuntimeError('');
    setStatus('Exécution…');
    try {
      localStorage.setItem(draftKey, JSON.stringify(nextFiles));
    } catch (error) {
      console.error('Impossible d’enregistrer le brouillon de l’éditeur.', error);
      setStatus('Exécution… Le navigateur ne permet pas de sauvegarder le brouillon.');
    }
    setExecutedDocument(previewDocument(nextFiles));
  }

  function resetExample() {
    const nextFiles = { ...example.files };
    setFiles(nextFiles);
    setRuntimeError('');
    setStatus('Exemple réinitialisé.');
    try {
      localStorage.removeItem(draftKey);
      localStorage.removeItem(`weblearn-editor-${example.id}`);
    } catch (error) {
      console.error('Impossible de supprimer le brouillon de l’éditeur.', error);
      setStatus('Exemple réinitialisé; le navigateur n’a pas supprimé le brouillon enregistré.');
    }
    setExecutedDocument(previewDocument(nextFiles));
  }

  function clearCurrentFile() {
    const nextFiles = { ...files, [activeTab]: '' };
    setFiles(nextFiles);
    setStatus(`${tabs.find((tab) => tab.id === activeTab).label} effacé. Exécute pour actualiser l’aperçu.`);
  }

  async function copyCurrentFile() {
    try {
      await navigator.clipboard.writeText(files[activeTab]);
      setStatus(`${tabs.find((tab) => tab.id === activeTab).label} copié.`);
    } catch (error) {
      console.error('Impossible de copier le code dans le presse-papiers.', error);
      setStatus('Copie indisponible ici. Sélectionne le code pour le copier.');
    }
  }

  return (
    <section className={`playground${isFullscreen ? ' fullscreen' : ''}`} aria-label={title}>
      <header className="playground-header">
        <div><span className="live-dot" /><div><span className="eyebrow">ATELIER DE CODE</span><h2>{title}</h2></div></div>
        <button
          className="screen-button"
          type="button"
          aria-label={isFullscreen ? 'Quitter le plein écran' : 'Passer en plein écran'}
          onClick={() => setIsFullscreen((fullscreen) => !fullscreen)}
        >{isFullscreen ? '↙' : '↗'}</button>
      </header>
      <div className="editor-panel">
        <div className="editor-toolbar">
          <div className="tabs" role="tablist" aria-label="Langage de l’exemple">
            {tabs.map((tab) => (
              <button
                id={`${example.id}-${tab.id}-tab`}
                key={tab.id}
                role="tab"
                aria-selected={activeTab === tab.id}
                aria-controls={`${example.id}-editor`}
                className={activeTab === tab.id ? 'active' : ''}
                type="button"
                onClick={() => setActiveTab(tab.id)}
              >{tab.label}</button>
            ))}
          </div>
          <div className="file-actions">
            <button type="button" onClick={copyCurrentFile}>Copier</button>
            <button type="button" onClick={clearCurrentFile}>Effacer</button>
            <button type="button" onClick={resetExample}>Réinitialiser</button>
          </div>
        </div>
        <label className="visually-hidden" htmlFor={`${example.id}-editor`}>
          Code {tabs.find((tab) => tab.id === activeTab).label}
        </label>
        <textarea
          id={`${example.id}-editor`}
          role="tabpanel"
          aria-labelledby={`${example.id}-${activeTab}-tab`}
          value={editorReady ? files[activeTab] : example.files[activeTab]}
          onChange={(event) => setFiles((current) => ({ ...current, [activeTab]: event.currentTarget.value }))}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
        />
        <div className="run-row">
          <button className="run-button" type="button" onClick={() => runExample()}>Exécuter <span aria-hidden="true">▶</span></button>
          <span className="run-status" role="status">{status}</span>
        </div>
      </div>
      <div className="preview-heading"><h3>Résultat</h3><span>Exécution isolée</span></div>
      {runtimeError && <p className="runtime-error" role="alert"><strong>Erreur JavaScript :</strong> {runtimeError}</p>}
      <iframe
        ref={preview}
        title={`Résultat de l’exemple : ${title}`}
        sandbox="allow-scripts"
        referrerPolicy="no-referrer"
        srcDoc={executedDocument}
      />
      <p className="sandbox-note">Cet exemple s’exécute dans une iframe isolée. Il ne peut pas lire les données de CodeCraft ni soumettre un formulaire.</p>
    </section>
  );
}
