export function assetUrl(src) {
  if (!src) return '';
  if (/^(data:|blob:|https?:\/\/)/i.test(src)) return src;
  const base = import.meta.env.BASE_URL;
  return `${base}${src.replace(/^\/+/, '')}`;
}
