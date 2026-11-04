<script>
  import { sitePath } from '$lib/site-path.js';
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  onMount(() => {
    const path = location.pathname;
    if (path && !path.endsWith('/') && !/\.[^/]+$/.test(path)) {
      location.replace(path + '/' + location.search + location.hash);
    }
  });
</script>

<svelte:head><title>Page introuvable — CodeCraft</title><meta name="robots" content="noindex, follow" /></svelte:head>
<main class="error-page"><span aria-hidden="true">{page.status}</span><h1>Cette page n’a pas été trouvée.</h1><p>Vérifie l’adresse ou retourne à l’accueil pour choisir un parcours.</p><a href={sitePath('/')}>Retour à l’accueil</a></main>
<style>.error-page{max-width:650px;margin:12vh auto;padding:30px;text-align:center}.error-page>span{color:#287a4b;font:800 36px Manrope,system-ui,sans-serif}.error-page h1{color:#29372e;font:800 27px Manrope,system-ui,sans-serif}.error-page p{color:#718076;font-size:14px;line-height:1.7}.error-page a{display:inline-block;margin-top:12px;padding:11px 15px;border-radius:8px;background:#197749;color:#fff;font-size:12px;font-weight:700;text-decoration:none}</style>
