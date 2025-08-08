export function decodeBase64Url(str: string) {
  const pad = (s: string) => s + '='.repeat((4 - (s.length % 4)) % 4);
  const base64 = pad(str.replace(/-/g, '+').replace(/_/g, '/'));
  const json = atob(base64);
  return JSON.parse(json);
}

export function parseJwt(token: string) {
  const [h, p] = token.split('.');
  const header = decodeBase64Url(h);
  const payload = decodeBase64Url(p);
  return { header, payload };
}
