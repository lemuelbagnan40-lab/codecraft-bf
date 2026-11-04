import { searchResources } from '$lib/services/search.js';

export const prerender = false;

export function load({ url }) {
  const query = url.searchParams.get('q') ?? '';
  const technology = url.searchParams.get('technologie') ?? 'all';
  const type = url.searchParams.get('type') ?? 'all';
  return { query, technology, type, results: searchResources(query, { technology, type }) };
}
