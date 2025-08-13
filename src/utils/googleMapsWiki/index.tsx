import { getDistance } from '../googleMapsUtils';

const wikiCache: Record<string, string> = {};

export async function fetchWikiTitleBySearch(keyword: string, lang: string): Promise<string | null> {
  const apiLang = lang === 'jp' ? 'ja' : lang.startsWith('zh') ? 'zh' : 'en';
  const searchUrl = `https://${apiLang}.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(keyword)}&format=json&origin=*`;

  const res = await fetch(searchUrl);
  if (!res.ok) throw new Error('Failed to fetch Wikipedia search');
  const data = await res.json();

  if (data?.query?.search?.length > 0) {
    return data.query.search[0].title;
  }
  return null;
}

export async function fetchWikiExtractByTitle(title: string, lang: string, placeLocation?: google.maps.LatLngLiteral): Promise<string> {
  if (wikiCache[title]) return wikiCache[title];
  const apiLang = lang === 'jp' ? 'ja' : lang.startsWith('zh') ? 'zh' : 'en';
  const url = `https://${apiLang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch Wikipedia extract');
  const data = await res.json();

  if (placeLocation) {
    if (!data.coordinates) {
      return '';
    }
    const dist = getDistance(placeLocation.lat, placeLocation.lng, data.coordinates.lat, data.coordinates.lon);
    if (dist > 1000) {
      return '';
    }
  }

  return data.extract || '';
}