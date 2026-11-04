import { base } from '$app/paths';

export function sitePath(path) {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return path;
  const match = path.match(/^([^?#]*)(.*)$/);
  const pathname = match[1];
  const suffix = match[2];
  const normalized = pathname === '/' || pathname.endsWith('/') || /\.[^/]+$/.test(pathname)
    ? pathname
    : `${pathname}/`;
  return `${base}${normalized}${suffix}`;
}
