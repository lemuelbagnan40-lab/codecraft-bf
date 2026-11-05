const basePath = (import.meta.env?.BASE_URL ?? '/').replace(/\/+$/g, '');

export function resolveRoute(pathname, search = '') {
  const path = basePath && (pathname === basePath || pathname.startsWith(`${basePath}/`))
    ? pathname.slice(basePath.length) || '/'
    : pathname;
  const normalizedPath = path.replace(/\/+$/g, '') || '/';
  let segments;
  try {
    segments = normalizedPath.split('/').filter(Boolean).map(decodeURIComponent);
  } catch {
    return { name: 'not-found', params: {}, search };
  }

  if (segments.length === 0) return { name: 'home', params: {}, search };
  if (segments[0] === 'cours' && segments.length === 1) return { name: 'courses', params: {}, search };
  if (segments[0] === 'cours' && segments.length === 2) {
    return { name: 'course', params: { id: segments[1] }, search };
  }
  if (segments[0] === 'cours' && segments.length === 4 && segments[2] === 'lecons') {
    return { name: 'lesson', params: { id: segments[1], slug: segments[3] }, search };
  }
  if (segments[0] === 'projets' && segments.length === 1) return { name: 'projects', params: {}, search };
  if (segments[0] === 'projets' && segments.length === 2) {
    return { name: 'project', params: { slug: segments[1] }, search };
  }
  if (segments[0] === 'recherche' && segments.length === 1) return { name: 'search', params: {}, search };
  if (segments[0] === 'reference' && segments.length === 1) return { name: 'reference', params: {}, search };
  if (segments[0] === 'progression' && segments.length === 1) return { name: 'progress', params: {}, search };
  if (segments[0] === 'a-propos' && segments.length === 1) return { name: 'about', params: {}, search };
  if (segments[0] === 'apprendre' && segments.length === 1) return { name: 'legacy-learning', params: {}, search };
  return { name: 'not-found', params: {}, search };
}
