import { useEffect } from 'react';
import { SITE_BASE, SITE_URL } from '../../lib/site-config.js';

function setMeta(attribute, key, content) {
  let element = document.head.querySelector(`meta[${attribute}="${key}"]`);
  if (content == null) {
    element?.remove();
    return;
  }
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, key);
    document.head.append(element);
  }
  element.content = content;
}

export default function SeoHead({ title, description, path, noindex = false }) {
  useEffect(() => {
    document.title = title;
    setMeta('name', 'description', description ?? null);
    setMeta('name', 'robots', noindex ? 'noindex, follow' : null);

    let canonical = document.head.querySelector('link[rel="canonical"]');
    const canonicalUrl = SITE_URL && path
      ? `${SITE_URL}${SITE_BASE}${path.endsWith('/') ? path : `${path}/`}`
      : null;
    if (canonicalUrl) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.append(canonical);
      }
      canonical.href = canonicalUrl;
    } else {
      canonical?.remove();
    }

    const socialMetadata = noindex ? {} : {
      'og:type': 'website',
      'og:site_name': 'CodeCraft',
      'og:title': title,
      'og:description': description,
      'og:url': canonicalUrl,
      'twitter:card': 'summary',
      'twitter:title': title,
      'twitter:description': description
    };
    for (const [property, value] of Object.entries(socialMetadata)) {
      setMeta(property.startsWith('twitter:') ? 'name' : 'property', property, value ?? null);
    }
    if (noindex) {
      for (const property of ['og:type', 'og:site_name', 'og:title', 'og:description', 'og:url', 'twitter:card', 'twitter:title', 'twitter:description']) {
        setMeta(property.startsWith('twitter:') ? 'name' : 'property', property, null);
      }
    }
  }, [description, noindex, path, title]);

  return null;
}
