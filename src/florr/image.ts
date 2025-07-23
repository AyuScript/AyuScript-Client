const imageCache = new Map<string, string>();

export function getImageUrl(petalId: number, petalRarity: number): string {
  const key = `${petalId}-${petalRarity}`;
  if (!imageCache.has(key)) {
    const url = window.florrio.utils.generatePetalImage(128, petalId, petalRarity, 1);
    imageCache.set(key, url);
  }
  return imageCache.get(key)!;
}