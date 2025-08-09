export function normalizeImageUrl(url: string | undefined | null): string | undefined {
  if (!url) return url ?? undefined;
  const value = String(url);
  if (/^https?:\/\//i.test(value)) return value;
  const base = (import.meta as any)?.env?.VITE_API_BASE_URL || 'https://api.live-study.com';
  if (value.startsWith('/')) return `${base}${value}`;
  return `${base}/${value}`;
}

export function pickImageUrlFromResponse(data: unknown): string | undefined {
  // 서버가 문자열 혹은 객체로 반환할 수 있어 유연하게 파싱
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object') {
    const anyData = data as Record<string, unknown>;
    // 우선순위: profileImage → imageUrl → url
    const candidate = (anyData.profileImage || anyData.imageUrl || anyData.url) as string | undefined;
    if (candidate) return candidate;
  }
  return undefined;
}

