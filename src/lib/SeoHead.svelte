<script>
  import { SITE_BASE, SITE_URL } from '$lib/site-config.js';
  let { title, description, path, noindex = false } = $props();
  const siteName = 'CodeCraft';
  const canonical = $derived(SITE_URL && path ? `${SITE_URL}${SITE_BASE}${path.endsWith('/') ? path : `${path}/`}` : null);
</script>

<svelte:head>
  <title>{title}</title>
  {#if description}<meta name="description" content={description} />{/if}
  {#if noindex}<meta name="robots" content="noindex, follow" />{/if}
  {#if canonical}<link rel="canonical" href={canonical} />{/if}
  {#if !noindex}
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:title" content={title} />
    {#if description}<meta property="og:description" content={description} />{/if}
    {#if canonical}<meta property="og:url" content={canonical} />{/if}
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content={title} />
    {#if description}<meta name="twitter:description" content={description} />{/if}
  {/if}
</svelte:head>
