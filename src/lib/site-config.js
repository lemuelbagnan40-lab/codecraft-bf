function configuredOrigin(value) {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) return null;
    return url.origin;
  } catch {
    return null;
  }
}

const env = import.meta.env ?? {};
const baseUrl = env.BASE_URL ?? '/';

export const SITE_URL = configuredOrigin(env.VITE_SITE_URL);
export const SITE_BASE = baseUrl === '/' ? '' : baseUrl.replace(/\/+$/g, '');
