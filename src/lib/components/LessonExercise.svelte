<script>
  let { exercise, result = null, onCheck } = $props();
  let answer = $state('');
  let hintVisible = $state(false);

  function checkAnswer() {
    onCheck(answer);
  }
</script>

<article class="exercise-card">
  <div class="exercise-header"><span class="exercise-number">{exercise.level}</span><div><span class="exercise-meta">{exercise.type === 'multiple-choice' ? 'QCM' : exercise.type === 'code' ? 'Code' : 'Réponse courte'} · {exercise.level}</span><h3>{exercise.prompt}</h3></div></div>
  {#if exercise.type === 'multiple-choice'}
    <fieldset><legend>Choisis une réponse</legend>{#each exercise.options as option}<label class:chosen={answer === option.id}><input type="radio" name={exercise.id} value={option.id} bind:group={answer} /><span>{option.label}</span></label>{/each}</fieldset>
  {:else if exercise.type === 'short-answer'}
    <label class="answer-label" for={`${exercise.id}-answer`}>Ta réponse</label><input class="text-answer" id={`${exercise.id}-answer`} bind:value={answer} placeholder="Écris ta réponse ici" onkeydown={(event) => event.key === 'Enter' && checkAnswer()} />
  {:else}
    <label class="answer-label" for={`${exercise.id}-answer`}>Ton code</label><textarea class="code-answer" id={`${exercise.id}-answer`} bind:value={answer} placeholder="Écris ton code ici" spellcheck="false"></textarea>
  {/if}
  <div class="exercise-actions"><button class="check-button" type="button" onclick={checkAnswer}>Vérifier ma réponse</button><button class="hint-button" type="button" aria-expanded={hintVisible} onclick={() => hintVisible = !hintVisible}>{hintVisible ? 'Masquer l’indice' : 'Besoin d’un indice ?'}</button></div>
  {#if hintVisible}<p class="hint" role="note"><strong>Indice :</strong> {exercise.hint}</p>{/if}
  {#if result !== null}<p class:success={result} class="feedback" role="status">{result ? 'Bonne réponse !' : 'Ce n’est pas encore ça. Relis l’explication puis réessaie.'} {exercise.explanation}</p><details class="solution"><summary>Voir la correction détaillée</summary><p>{exercise.explanation}</p></details>{/if}
</article>

<style>
  .exercise-card{padding:19px;border:1px solid #e5ebe5;border-radius:12px;background:#fff}.exercise-header{display:flex;align-items:center;gap:10px}.exercise-number{display:grid;place-items:center;min-width:29px;height:29px;padding:0 5px;border-radius:9px;background:#edf5ee;color:#267a48;font:750 9px ui-monospace,monospace}.exercise-meta{color:#859188;font-size:9px}.exercise-header h3{margin:3px 0 0;color:#2b3a30;font:750 15px Manrope,system-ui,sans-serif}.exercise-card fieldset{display:grid;gap:7px;margin:0;padding:0;border:0}.exercise-card legend,.answer-label{margin-bottom:8px;color:#3b4c40;font-size:11px;font-weight:700}.exercise-card fieldset label{display:flex;align-items:center;gap:9px;padding:9px 10px;border:1px solid #e5ebe5;border-radius:7px;color:#546258;font-size:11px;cursor:pointer}.exercise-card fieldset label.chosen{border-color:#82b591;background:#f0f7f1}.exercise-card input[type=radio]{accent-color:#197749}.answer-label{display:block}.text-answer,.code-answer{width:100%;padding:10px;border:1px solid #dfe7df;border-radius:7px;background:#fbfcfb;color:#3b4c40;font-size:12px}.code-answer{min-height:116px;resize:vertical;font:12px/1.6 ui-monospace,SFMono-Regular,Consolas,monospace}.exercise-actions{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-top:12px}.check-button{padding:9px 12px;border:0;border-radius:7px;background:#197749;color:#fff;font-size:10px;font-weight:700;cursor:pointer}.hint-button{border:0;background:none;color:#477451;font-size:10px;font-weight:650;cursor:pointer}.hint,.feedback{padding:10px 12px;border-radius:7px;font-size:11px;line-height:1.6}.hint{background:#faf7e9;color:#776944}.feedback{background:#fff0ed;color:#8d4539}.feedback.success{background:#edf7ef;color:#286d3f}.solution{margin-top:9px;color:#536258;font-size:11px}.solution summary{cursor:pointer;font-weight:700}.solution p{line-height:1.7}:global(.platform-shell[data-theme="dark"]) .exercise-card{border-color:#35443a;background:#202a23}:global(.platform-shell[data-theme="dark"]) .exercise-header h3,:global(.platform-shell[data-theme="dark"]) .exercise-card legend,:global(.platform-shell[data-theme="dark"]) .answer-label{color:#eef4ee}:global(.platform-shell[data-theme="dark"]) .exercise-card fieldset label,:global(.platform-shell[data-theme="dark"]) .text-answer,:global(.platform-shell[data-theme="dark"]) .code-answer{border-color:#405247;background:#1a241d;color:#dce7de}
</style>
