import { getDistance } from '../googleMapsUtils';

const wikiCache: Record<string, string> = {};

export async function fetchWikiTitlesBySearch(keyword: string, lang: string): Promise<string[]> {
  const apiLang = lang === 'jp' ? 'ja' : lang.startsWith('zh') ? 'zh' : 'en';
  const searchUrl = `https://${apiLang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    keyword
  )}&format=json&origin=*`;

  const res = await fetch(searchUrl);
  if (!res.ok) throw new Error('Failed to fetch Wikipedia search');
  const data = (await res.json()) as any;

  if (data?.query?.search?.length > 0) {
    return data.query.search.map((item: any) => item.title);
  }
  return [];
}

export async function fetchWikiGeo(
  title: string,
  lang: string,
  placeLocation?: google.maps.LatLngLiteral
): Promise<google.maps.LatLngLiteral | null> {
  const apiLang = lang === 'jp' ? 'ja' : lang.startsWith('zh') ? 'zh' : 'en';
  const url = `https://${apiLang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(
    title
  )}&prop=coordinates&format=json&origin=*`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch Wikipedia coordinates');

  const data = (await res.json()) as any;

  if (!data?.query?.pages) return null;

  const pagesObj = data.query.pages;
  const firstPageValue = Object.values(pagesObj)[0];

  if (
    typeof firstPageValue !== 'object' ||
    firstPageValue === null ||
    !('coordinates' in firstPageValue) ||
    !Array.isArray(firstPageValue.coordinates)
  ) {
    return null;
  }

  const coords = firstPageValue.coordinates[0];
  if (!coords || typeof coords.lat !== 'number' || typeof coords.lon !== 'number') return null;

  const wikiLatLng = { lat: coords.lat, lng: coords.lon };

  if (placeLocation) {
    const dist = getDistance(placeLocation.lat, placeLocation.lng, wikiLatLng.lat, wikiLatLng.lng);
    if (dist > 5000) return null;
  }

  return wikiLatLng;
}

export async function fetchWikiExtractByTitle(title: string, lang: string): Promise<string> {
  if (wikiCache[title]) return wikiCache[title];

  const apiLang = lang === 'jp' ? 'ja' : lang.startsWith('zh') ? 'zh' : 'en';
  const url = `https://${apiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch Wikipedia extract');

  const data = (await res.json()) as any;
  const extract = typeof data.extract === 'string' ? data.extract : '';

  wikiCache[title] = extract;
  return extract;
}
