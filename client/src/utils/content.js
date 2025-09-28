// Always fetch fresh JSON from public/content to reflect latest CMS edits
export async function loadContent(path) {
  const res = await fetch(`/content/${path}?v=${Date.now()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to load content: ${path}`);
  const json = await res.json();
  return json;
}
