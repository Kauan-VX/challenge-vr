function svgPlaceholder(size: number): string {
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" fill="%23eef0f5"/></svg>`;
}

export const PRODUCT_THUMBNAIL_FALLBACK = svgPlaceholder(240);
export const PRODUCT_GALLERY_FALLBACK = svgPlaceholder(480);
export const PRODUCT_ROW_FALLBACK = svgPlaceholder(64);
