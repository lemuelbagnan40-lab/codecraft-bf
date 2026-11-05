import { copyFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { learningPaths } from './src/lib/data/catalog.js';
import { detailedLessons } from './src/lib/data/lessons/course-index.js';
import { projects } from './src/lib/data/projects.js';

const root = path.dirname(fileURLToPath(import.meta.url));
const basePath = process.env.BASE_PATH?.replace(/^\/+|\/+$/g, '');
const base = basePath ? `/${basePath}/` : '/';

function staticPages() {
  return {
    name: 'codecraft-static-pages',
    apply: 'build',
    async closeBundle() {
      const output = path.join(root, 'dist');
      const siteUrl = process.env.VITE_SITE_URL?.replace(/\/+$/g, '');
      const entryPoint = path.join(output, 'index.html');
      await copyFile(entryPoint, path.join(output, '404.html'));

      const appRoutes = new Set([
        '/cours',
        '/projets',
        '/reference',
        '/progression',
        '/a-propos',
        '/recherche',
        '/apprendre',
        ...learningPaths.map((course) => `/cours/${course.id}`),
        ...detailedLessons.map((lesson) => `/cours/${lesson.courseId}/lecons/${lesson.slug}`),
        ...projects.map((project) => `/projets/${project.id}`)
      ]);
      for (const route of appRoutes) {
        const page = path.join(output, route.replace(/^\/+/, ''), 'index.html');
        await mkdir(path.dirname(page), { recursive: true });
        await copyFile(entryPoint, page);
      }

      const robots = `User-agent: *\nAllow: /\n${siteUrl ? `Sitemap: ${siteUrl}${base}sitemap.xml\n` : ''}`;
      await writeFile(path.join(output, 'robots.txt'), robots);

      const pages = siteUrl
        ? [
            '/',
            '/cours',
            '/projets',
            '/reference',
            '/a-propos',
            ...learningPaths.map((course) => `/cours/${course.id}`),
            ...detailedLessons.map((lesson) => `/cours/${lesson.courseId}/lecons/${lesson.slug}`),
            ...projects.filter((project) => project.status === 'available').map((project) => `/projets/${project.id}`)
          ]
        : [];
      const escapeXml = (value) => value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&apos;');
      const urls = pages.map((page) => {
        const pathname = page === '/' ? '/' : `${page}/`;
        return `<url><loc>${escapeXml(`${siteUrl}${base}${pathname.replace(/^\/+/, '')}`)}</loc></url>`;
      }).join('');
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
      await writeFile(path.join(output, 'sitemap.xml'), sitemap);
    }
  };
}

export default defineConfig({
  base,
  plugins: [react(), staticPages()]
});
