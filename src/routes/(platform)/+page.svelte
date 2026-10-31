<script>
  import { sitePath } from '$lib/site-path.js';
  import SeoHead from '$lib/SeoHead.svelte';
  import { learningPaths } from '$lib/data/catalog.js';
  import { projects } from '$lib/data/projects.js';
  const firstProject = projects.find((project) => project.status === 'available');
</script>

<SeoHead title="Apprendre HTML, CSS et JavaScript par la pratique — CodeCraft" description="Découvre des parcours HTML, CSS et JavaScript avec des leçons, exemples interactifs, exercices et projets pratiques." path="/" />

<section class="welcome">
  <div class="welcome-copy">
    <span class="eyebrow">APPRENDRE EN FAISANT</span>
    <h1>Le Web s’apprend <em>une étape à la fois.</em></h1>
    <p>Tu n’as pas besoin de tout savoir pour commencer. Choisis un sujet, essaie un exemple et construis peu à peu tes repères.</p>
    <div class="welcome-actions"><a class="primary-button" href={sitePath('/cours')}>Explorer les cours <span aria-hidden="true">→</span></a><a class="quiet-link" href={sitePath('/apprendre')}>Reprendre les exercices interactifs</a></div>
  </div>
  <div class="welcome-illustration" aria-hidden="true"><div class="illustration-paper"><span>&lt;h1&gt;</span><b>Bonjour, le Web.</b><i>&lt;/h1&gt;</i><hr/><span>.page &#123;</span><b>  display: flex;</b><i>&#125;</i></div><div class="illustration-mark mark-a"></div><div class="illustration-mark mark-b"></div></div>
</section>

<section class="section-block">
  <div class="section-heading"><div><span class="eyebrow">TON PARCOURS</span><h2>Choisis ton point de départ</h2></div><a href={sitePath('/cours')}>Voir tous les cours <span aria-hidden="true">→</span></a></div>
  <div class="path-grid">
    {#each learningPaths as path}
      <article class="path-card" style={`--path-color:${path.color}`}>
        <div class="path-card-top"><span class="path-symbol">{path.symbol}</span><span class="path-duration">{path.lessonCount} leçons</span></div>
        <p class="path-subtitle">{path.subtitle}</p><h3>{path.title}</h3><p class="path-description">{path.description}</p>
        <a href={sitePath(`/cours/${path.id}`)}>Découvrir le parcours <span aria-hidden="true">→</span></a>
      </article>
    {/each}
  </div>
</section>

{#if firstProject}<section class="project-invitation"><div><span class="eyebrow">APPRENDRE EN PRATIQUANT</span><h2>La prochaine étape peut être un projet.</h2><p>{firstProject.description} Tu peux avancer en construisant, puis revenir aux leçons quand tu en as besoin.</p><div class="project-invitation-meta"><span>{firstProject.level}</span><span>{firstProject.technologies.join(' · ')}</span><span>{firstProject.duration}</span></div></div><div class="project-invitation-actions"><a class="primary-button" href={sitePath(`/projets/${firstProject.id}`)}>Essayer le projet <span aria-hidden="true">→</span></a><a href={sitePath('/projets')}>Voir tous les projets</a></div></section>{/if}

<section class="human-note"><span class="note-dot" aria-hidden="true"></span><div><h2>Une petite étape suffit pour aujourd’hui.</h2><p>Tu peux revenir autant de fois que tu veux. Ta progression est enregistrée sur cet appareil quand tu suis les leçons interactives.</p></div><a href={sitePath('/progression')}>Voir ma progression</a></section>

<style>
  .welcome{min-height:290px;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(250px,.8fr);align-items:center;gap:35px;padding:35px 42px;border:1px solid #e4ebe3;border-radius:20px;background:linear-gradient(110deg,#edf6ed,#f5f3e8 85%);overflow:hidden}.welcome-copy{max-width:610px}.eyebrow{color:#688774;font-size:10px;font-weight:800;letter-spacing:1.4px}.welcome h1{max-width:600px;margin:13px 0 12px;font:800 clamp(32px,4vw,47px)/1.12 Manrope,system-ui,sans-serif;letter-spacing:-2px;color:#27372d}.welcome h1 em{font-style:normal;color:#1a7948}.welcome-copy>p{max-width:560px;margin:0;color:#6d7a70;font-size:15px;line-height:1.75}.welcome-actions{display:flex;align-items:center;flex-wrap:wrap;gap:17px;margin-top:22px}.primary-button{display:inline-flex;align-items:center;gap:14px;padding:12px 16px;border-radius:9px;background:#197749;color:#fff;font-size:13px;font-weight:700;text-decoration:none;box-shadow:0 5px 12px #19774925}.primary-button:hover{background:#125f39}.quiet-link{color:#456c51;font-size:12px;font-weight:650;text-decoration:none}.quiet-link:hover{text-decoration:underline}.welcome-illustration{position:relative;display:grid;place-items:center;min-height:200px}.illustration-paper{width:230px;padding:21px;border:1px solid #e1e7df;border-radius:13px;background:#fff;box-shadow:0 15px 32px #273d2b12;transform:rotate(2deg);font:11px/1.85 ui-monospace,monospace}.illustration-paper span{color:#b86642}.illustration-paper b{display:block;color:#336d49;font-weight:600}.illustration-paper i{display:block;color:#77857a;font-style:normal}.illustration-paper hr{border:0;border-top:1px solid #edf0e9;margin:10px 0}.section-block{margin-top:42px}.section-heading{display:flex;justify-content:space-between;align-items:end;gap:15px;margin-bottom:17px}.section-heading h2{margin:6px 0 0;color:#26372c;font:750 23px Manrope,system-ui,sans-serif;letter-spacing:-.6px}.section-heading>a{color:#28784b;font-size:12px;font-weight:700;text-decoration:none}.path-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}.path-card{--path-color:#197749;min-height:245px;display:flex;flex-direction:column;padding:19px;border:1px solid #e6ebe5;border-radius:14px;background:#fff;transition:transform .16s,border-color .16s}.path-card:hover{transform:translateY(-3px);border-color:color-mix(in srgb,var(--path-color),white 58%)}.path-card-top{display:flex;align-items:center;justify-content:space-between}.path-symbol{width:36px;height:36px;display:grid;place-items:center;border-radius:11px;background:color-mix(in srgb,var(--path-color),white 87%);color:var(--path-color);font:800 14px ui-monospace,monospace}.path-duration{color:#859188;font-size:10px}.path-subtitle{margin:15px 0 4px;color:#7c897f;font-size:11px}.path-card h3{margin:0;color:#2b392f;font:800 23px Manrope,system-ui,sans-serif}.path-description{margin:9px 0 18px;color:#78847b;font-size:12px;line-height:1.65}.path-card>a{display:flex;align-items:center;justify-content:space-between;margin-top:auto;color:var(--path-color);font-size:11px;font-weight:750;text-decoration:none}.human-note{display:flex;align-items:center;gap:14px;margin-top:25px;padding:19px 21px;border:1px solid #eee7d4;border-radius:13px;background:#fbf8ee}.human-note>span{font-size:24px}.human-note>div{flex:1}.human-note h2{margin:0;color:#554c38;font-size:14px}.human-note p{margin:5px 0 0;color:#837a66;font-size:11px;line-height:1.6}.human-note>a{color:#786638;font-size:11px;font-weight:700;text-decoration:none;white-space:nowrap}
  :global(.platform-shell[data-theme="dark"]) .welcome{border-color:#35443a;background:linear-gradient(110deg,#20362a,#2d3025)}:global(.platform-shell[data-theme="dark"]) .welcome h1,:global(.platform-shell[data-theme="dark"]) .section-heading h2,:global(.platform-shell[data-theme="dark"]) .path-card h3{color:#eef4ee}:global(.platform-shell[data-theme="dark"]) .path-card{border-color:#35443a;background:#202a23}:global(.platform-shell[data-theme="dark"]) .illustration-paper{background:#253329;border-color:#3c4b40}:global(.platform-shell[data-theme="dark"]) .human-note{background:#302d22;border-color:#4b4430}
  @media(max-width:800px){.welcome{grid-template-columns:1fr;padding:28px}.welcome-illustration{display:none}.path-grid{grid-template-columns:1fr}.path-card{min-height:0}.human-note{align-items:flex-start;flex-wrap:wrap}.human-note>a{margin-left:38px}}
  @media(max-width:500px){.welcome{padding:23px 19px;border-radius:15px}.welcome h1{font-size:33px;letter-spacing:-1.4px}.welcome-copy>p{font-size:14px}.welcome-actions{align-items:flex-start;flex-direction:column;gap:13px}.section-heading{align-items:flex-start;flex-direction:column}.section-heading h2{font-size:21px}.human-note{padding:15px}.human-note>div{flex-basis:calc(100% - 45px)}}
</style>
