const localImages = import.meta.glob('../../images/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const FALLBACK_IMAGE = localImages['../../images/cafe1.jpg'];

export function isExternalUrl(value) {
  if (!value || typeof value !== 'string') return false;
  return /^https?:\/\//i.test(value.trim());
}

export function resolveProductImage(value) {
  if (!value) return FALLBACK_IMAGE;

  if (isExternalUrl(value)) {
    return value.trim();
  }

  const match = Object.entries(localImages).find(([path]) =>
    path.endsWith(`/${value}`),
  );

  return match?.[1] || FALLBACK_IMAGE;
}
