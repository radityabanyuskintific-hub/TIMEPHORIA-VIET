# Public Asset And Product Update Guide

This folder stores the public images and media used by the Timephoria web preview.

Important: product text such as name, price, size, description, claims, and shades is not edited in `public/`.
Those values are stored in `app/page.tsx` inside the `const products: Product[] = [...]` list.

## Where To Edit Product Info

Open `app/page.tsx` and find the product entry you want to update.

Example:

```tsx
{
  name: "LUMINA MATTE CUSHION",
  shortName: "LUMINA MATTE CUSHION",
  category: "face",
  finish: "SKIN FINISH PERFECTED",
  price: "IDR 199.000",
  size: "11 g",
  image: "/product-pages/page-13.png",
  description:
    "A lightweight full-coverage cushion with a natural flawless finish for up to 12 hours. Color-locking pigment helps absorb excess oil and prevent oxidation.",
  claims: ["Full coverage", "12H fresh skin", "Oil control"],
  shades: ["000 Bare", "001 Creme", "002 Birch"],
}
```

## How To Change Product Name

Update these fields in `app/page.tsx`:

- `name`: full product name shown in the product detail
- `shortName`: shorter display name used in smaller UI areas

Example:

```tsx
name: "NEW PRODUCT NAME",
shortName: "NEW PRODUCT NAME",
```

## How To Change Product Price

Update the `price` field in `app/page.tsx`.

Example:

```tsx
price: "IDR 149.000",
```

## How To Change Product Image

1. Put the new image file inside `public/product-pages/`.
2. Update the `image` field in `app/page.tsx`.

Example:

```tsx
image: "/product-pages/my-new-product-image.png",
```

## How To Change Other Product Details

You can also update these fields in the same product object:

- `size`: product weight or volume
- `description`: product description paragraph
- `claims`: short selling points shown as labels
- `shades`: list of available shades

Example:

```tsx
size: "15 g",
description: "Your updated product description here.",
claims: ["Long wear", "Hydrating", "Buildable"],
shades: ["Light", "Medium", "Tan"],
```

## Brand Logo

- Current file: `brand/timephoria-logo.png`
- Used in: bottom-right footer logo
- Replace it with another PNG using the same filename to update the footer automatically

Recommended: transparent PNG, wide horizontal logo, around 2x export size.

## Swatch Images

- Folder: `swatches/`
- These files are used for product swatch previews
- Replace an existing file with the same filename, or add a new file and point to it from the related product configuration if needed

## Notes

- Keep all public asset paths starting with `/`, for example `/product-pages/page-13.png`
- Avoid spaces in asset filenames
- Store images in the matching folder, such as `product-pages/`, `swatches/`, `brand/`, or `promos/`
- After editing `app/page.tsx` or replacing files in `public/`, refresh the preview browser
