import { env } from '$env/dynamic/public';

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

export const SITE_URL = configuredOrigin(env.PUBLIC_SITE_URL);
export const SITE_BASE = env.PUBLIC_BASE_PATH?.replace(/^\/+|\/+$/g, '')
  ? `/${env.PUBLIC_BASE_PATH.replace(/^\/+|\/+$/g, '')}`
  : '';
