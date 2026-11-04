import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const dev = process.env.NODE_ENV === 'development';

export default {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({ fallback: '404.html' }),
    paths: { base: dev ? '' : (process.env.BASE_PATH ?? '') },
    prerender: { entries: ['*', '/robots.txt', '/sitemap.xml'] }
  }
};
