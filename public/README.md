# Public Asset Replacement Guide

This folder stores the replaceable visual assets for the Timephoria web preview.

## Brand Logo

- Current file: `brand/timephoria-logo.png`
- Used in: bottom-right footer logo
- Replace it with another PNG using the same filename to update the footer automatically.

Recommended: transparent PNG, wide horizontal logo, around 2x export size.

## Product And Category Images

- Folder: `product-pages/`
- These images are used for product cards and first-page category cards.
- The current files are exported from the product education PDF.

To replace a visual:

1. Add the new image into `product-pages/`.
2. Open `app/page.tsx`.
3. Find the product or category `image` field.
4. Change the path, for example:

```tsx
image: "/product-pages/my-new-image.png"
```

## Tone Chart / Swatch Preview

- Current file: `swatches/complexion-tone-chart.jpg`
- Used in: every product card under "Tap to see swatches"

Replace this file with a new chart using the same filename if you want all cards to use the new swatch image.

Recommended: JPG or PNG, landscape ratio, readable text at mobile width.

## Notes

- Keep all public paths starting with `/`, for example `/brand/timephoria-logo.png`.
- Avoid spaces in new asset filenames.
- After replacing assets, refresh the local preview browser.
