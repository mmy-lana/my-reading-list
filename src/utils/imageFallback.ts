export function getNoImageSvg(title: string): string {
  const safeTitle = (title || "Manga").substring(0, 20);
  const encodedTitle = encodeURIComponent(safeTitle);
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231e293b"/><stop offset="50%" stop-color="%23334155"/><stop offset="100%" stop-color="%230f172a"/></linearGradient></defs><rect width="300" height="450" fill="url(%23g)"/><circle cx="150" cy="180" r="60" fill="%23d946ef" opacity="0.2"/><path d="M120 160 Q150 120 180 160 Q150 200 120 160" fill="none" stroke="%23d946ef" stroke-width="4"/><text x="150" y="240" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23f8fafc" text-anchor="middle">${encodedTitle}</text><text x="150" y="270" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2394a3b8" text-anchor="middle">NO IMAGE AVAILABLE</text></svg>`;
}

export function getImageSources(item: {
  img?: string;
  imgFallback1?: string;
  imgFallback2?: string;
  imgFallback3?: string;
  title: string;
}): string[] {
  const sources: string[] = [];
  if (item.img && item.img.trim()) sources.push(item.img.trim());
  if (item.imgFallback1 && item.imgFallback1.trim()) sources.push(item.imgFallback1.trim());
  if (item.imgFallback2 && item.imgFallback2.trim()) sources.push(item.imgFallback2.trim());
  if (item.imgFallback3 && item.imgFallback3.trim()) sources.push(item.imgFallback3.trim());
  sources.push(getNoImageSvg(item.title));
  return sources;
}