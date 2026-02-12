import { MovieItem, SeasonData } from '../types';

// List of CORS proxies to try in order of preference
const PROXIES = [
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://api.allorigins.win/raw?url=',
  'https://corsproxy.io/?url='
];

// Helper to fetch using multiple proxies if one fails
const fetchWithFallback = async (targetUrl: string): Promise<string> => {
  let lastError: any;

  for (const proxyBase of PROXIES) {
    try {
      const url = `${proxyBase}${encodeURIComponent(targetUrl)}`;
      const res = await fetch(url);
      
      if (!res.ok) throw new Error(`Status ${res.status}`);
      return await res.text();
    } catch (e) {
      console.warn(`Fetch failed with proxy ${proxyBase}:`, e);
      lastError = e;
    }
  }

  throw lastError || new Error("All proxies failed.");
};

const makePoster = (id: string): string => {
  const num = parseInt(id);
  const low = Math.floor((num - 1) / 1000) * 1000 + 1;
  const sourceUrl = `http://vd1.findmylinkes.ir/pic-list/lists/${low}-${low + 999}/${id}.jpg`;
  return `https://wsrv.nl/?url=${encodeURIComponent(sourceUrl)}&w=400&h=600&fit=cover`;
};

// Robust URL Cleaner
const cleanVideoUrl = (url: string): string => {
    if (!url) return '';
    // Force HTTPS and remove proprietary schemes
    let clean = url.replace('vlc://', '').replace('http://', 'https://');
    if (!clean.startsWith('https://')) {
        clean = 'https://' + clean;
    }
    return clean;
};

export const searchMovies = async (query: string): Promise<MovieItem[]> => {
  const targetUrl = `https://flzios.ir/list.php?q=${encodeURIComponent(query)}&send=%D8%AC%D8%B3%D8%AA%D8%AC%D9%88+%DA%A9%D9%86`;

  try {
    const html = await fetchWithFallback(targetUrl);
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    const links = doc.querySelectorAll('a[href*="detiles.php"]');
    const items = new Map<string, MovieItem>();

    links.forEach((a) => {
      const href = a.getAttribute('href');
      if (!href) return;
      
      const idMatch = href.match(/i=(\d+)/);
      if (!idMatch) return;
      
      const id = idMatch[1];
      let title = (a as HTMLElement).innerText.trim();
      
      if (!title) {
        title = a.getAttribute('title') || 
                a.querySelector('img')?.getAttribute('alt') || 
                `Film ${id}`;
      }

      if (href.includes('tfa=')) {
        try {
            const urlParams = new URLSearchParams(href.split('?')[1]);
            const tfa = urlParams.get('tfa');
            if (tfa) title = tfa;
        } catch (e) { }
      }

      let poster = makePoster(id);
      const imgTag = a.querySelector('img');
      const imgSrc = imgTag?.getAttribute('src');
      if (imgSrc) {
        let absImg = imgSrc;
        if (!imgSrc.startsWith('http')) {
             absImg = new URL(imgSrc, 'https://flzios.ir').href;
        }
        poster = `https://wsrv.nl/?url=${encodeURIComponent(absImg)}&w=400&h=600&fit=cover`;
      }

      if (!items.has(id)) {
        items.set(id, {
          id,
          title,
          link: href.startsWith('http') ? href : `https://flzios.ir/${href}`,
          poster,
        });
      }
    });

    return Array.from(items.values());
  } catch (error) {
    console.error("Search Error:", error);
    throw new Error("Failed to fetch results.");
  }
};

export const fetchDetails = async (url: string): Promise<SeasonData> => {
    let cleanUrl = url;
    try {
        const urlObj = new URL(url);
        if (urlObj.searchParams.has('i')) cleanUrl = url;
    } catch (e) {
        const parts = url.split('&');
        cleanUrl = parts.length >= 2 ? `${parts[0]}&${parts[1]}` : parts[0];
    }

    try {
        const html = await fetchWithFallback(cleanUrl);
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const sessionBoxes = doc.querySelectorAll('.SessionBox');
        const results: SeasonData = {};

        if (sessionBoxes.length > 0) {
            sessionBoxes.forEach((box) => {
                const seasonName = (box as HTMLElement).innerText.trim();
                results[seasonName] = [];
                let sibling = box.nextElementSibling;
                
                while (sibling && !sibling.classList.contains('SessionBox')) {
                    if (sibling.tagName === 'A') {
                        const href = sibling.getAttribute('href');
                        if (href && (href.startsWith('vlc://') || href.includes('.mkv') || href.includes('.mp4'))) {
                            const linkBox = sibling.querySelector('.LinkBox');
                            let epName = linkBox 
                                ? (linkBox as HTMLElement).innerText.replace('پخش آنلاین :', '').trim() 
                                : "پخش";
                            results[seasonName].push({ name: epName, url: cleanVideoUrl(href) });
                        }
                    }
                    sibling = sibling.nextElementSibling;
                }
            });
        } else {
            const links = doc.querySelectorAll('a[href^="vlc://"], a[href*=".mkv"]');
            if (links.length > 0) {
                results['فایل اصلی'] = [];
                links.forEach((a) => {
                    const box = a.querySelector('.LinkBox');
                    const name = box ? (box as HTMLElement).innerText.trim() : 'پخش فیلم';
                    const href = a.getAttribute('href');
                    if(href) {
                        results['فایل اصلی'].push({ name, url: cleanVideoUrl(href) });
                    }
                });
            }
        }
        return results;
    } catch (e) {
        console.error("Details Fetch Error", e);
        throw new Error("Could not extract episodes.");
    }
}