# Timephoria Web

The Timephoria product universe and virtual lip try-on experience, built with
React, Next.js-compatible routing, and
[Vinext](https://github.com/cloudflare/vinext).

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm install
npm run dev
npm run check
```

## Source Structure

- `app/page.tsx` is the route entry point.
- `app/features/home/` owns homepage composition and content.
- `app/features/catalog/` owns product types, translations, and cards.
- `app/features/stores/` owns store-directory loading and filtering.
- `app/features/try-on/` owns MediaPipe setup and lip rendering.
- `app/components/VirtualLipTryOn.tsx` coordinates try-on UI and camera state.
- `public/vendor/mediapipe/` contains the pinned on-device vision runtime and
  model. These files are served locally so try-on startup does not depend on
  Google Storage or a third-party CDN.
- `.openai/hosting.json` contains the existing Sites deployment configuration.

Keep visual changes separate from structural refactors. Run `npm run check`
after changes to verify lint, TypeScript, and the production build.

## Asset Replacement Guide

The current Timephoria UI uses a portrait phone frame with several different
image windows. Some windows use `object-fit: cover`, which means the browser
will crop the image if the uploaded artwork ratio does not match that placement.
To avoid visible cropping, prepare each replacement asset at the matching ratio
below.

Important rule: one source image cannot be perfectly uncropped in every
placement if it is reused in windows with different ratios. For example,
`/product-pages/page-131.png` is used in both a wide category tile and a product
card crop. Match the most important placement, or change that placement's CSS
from `object-fit: cover` to `object-fit: contain`.

| Placement | Current file(s) | Current file size | No-crop replacement ratio | Recommended export size | Notes |
| --- | --- | --- | --- | --- | --- |
| Loading logo | `/brand/timephoria-logo.png` | `2023 x 675 px`, about `3:1` | `3:1` | `1800 x 600 px` or `1200 x 400 px` PNG | Uses `object-fit: contain`, so it will not be cropped. Use transparent padding around the wordmark if needed. |
| Footer logo | `/brand/timephoria-logo.png` | `2023 x 675 px`, about `3:1` | `3:1` | `1800 x 600 px` or `1200 x 400 px` PNG | Also uses `object-fit: contain`. Keep the logo readable at `200 px` displayed width. |
| Home category tile images | `/product-pages/page-131.png`, `/product-pages/page-249.png`, `/product-pages/page-57.png` | `1200 x 675 px`, `16:9` | about `2:1` to `2.25:1` | `1920 x 960 px` | Uses `object-fit: cover`. Keep the product and text-free safe area centered because the tile is a wide window. |
| Category hero image layer | `/product-pages/page-131.png`, `/product-pages/page-249.png`, `/product-pages/page-57.png` | `1200 x 675 px`, `16:9` | about `2.1:1` | `1920 x 900 px` | Uses `object-fit: cover` and animates at `112%` size. Keep critical content inside the center `80%` of the canvas. |
| Product card images | Product files listed below | `1200 x 675 px`, `16:9` | about `11:12` | `1100 x 1200 px` PNG or JPG | Uses `object-fit: cover` inside a narrow card column. Landscape deck pages will crop at the sides. For no crop, use a portrait or near-square product render with the product centered. |
| Swatch chart | `/swatches/complexion-tone-chart.jpg` | `1533 x 1533 px`, `1:1` | `1:1` | `1600 x 1600 px` JPG | Displayed at full width with `height: auto`, so square images show without cropping. |
| Favicon | `/favicon.svg` | SVG | `1:1` artboard | `512 x 512 px` SVG artboard | Keep the icon centered on a square artboard for browser tab rendering. |

Product card image files currently placed in the app:

```text
/product-pages/page-13.png
/product-pages/page-21.png
/product-pages/page-29.png
/product-pages/page-34.png
/product-pages/page-42.png
/product-pages/page-49.png
/product-pages/page-57.png
/product-pages/page-66.png
/product-pages/page-74.png
/product-pages/page-84.png
/product-pages/page-104.png
/product-pages/page-119.png
/product-pages/page-131.png
/product-pages/page-144.png
/product-pages/page-164.png
/product-pages/page-231.png
/product-pages/page-237.png
/product-pages/page-243.png
/product-pages/page-249.png
```

The unused files in `/public/product-pages/` may remain `1200 x 675 px` if they
are source deck pages. Before placing one into a card, prepare a `1100 x 1200 px`
card version or expect the sides to be cropped.

## Workspace Auth Headers

OpenAI workspace sites can read the current user's email from
`oai-authenticated-user-email`.

SIWC-authenticated workspace sites may also receive
`oai-authenticated-user-full-name` when the user's SIWC profile has a non-empty
`name` claim. The full-name value is percent-encoded UTF-8 and is accompanied by
`oai-authenticated-user-full-name-encoding: percent-encoded-utf-8`.

Treat the full name as optional and fall back to email when it is absent:

```tsx
import { headers } from "next/headers";

export default async function Home() {
  const requestHeaders = await headers();
  const email = requestHeaders.get("oai-authenticated-user-email");
  const encodedFullName = requestHeaders.get("oai-authenticated-user-full-name");
  const fullName =
    encodedFullName &&
    requestHeaders.get("oai-authenticated-user-full-name-encoding") ===
      "percent-encoded-utf-8"
      ? decodeURIComponent(encodedFullName)
      : null;

  const displayName = fullName ?? email;
  // ...
}
```

## Optional Dispatch-Owned ChatGPT Sign-In

Import the ready-to-use helpers from `app/chatgpt-auth.ts` when the site needs
optional or required ChatGPT sign-in:

- Use `getChatGPTUser()` for optional signed-in UI.
- Use `requireChatGPTUser(returnTo)` for server-rendered pages that should send
  anonymous visitors through Sign in with ChatGPT.
- Use `chatGPTSignInPath(returnTo)` and `chatGPTSignOutPath(returnTo)` for
  browser links or actions.
- Pass a same-origin relative `returnTo` path for the destination after sign-in
  or sign-out. The helper validates and safely encodes it.
- Mark protected pages with `export const dynamic = "force-dynamic"` because
  they depend on per-request identity headers.

Dispatch owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, `/callback`, the
OAuth cookies, and identity header injection. Do not implement app routes for
those reserved paths. Routes that do not import and call the helper remain
anonymous-compatible.

SIWC establishes identity only; it does not prove workspace membership. Use the
Sites hosting platform's access policy controls for workspace-wide restrictions,
or enforce explicit server-side membership or allowlist checks.

Use SIWC for account pages, user-specific dashboards, saved records, and write
actions tied to the current ChatGPT user. Leave public content anonymous.

## Useful Commands

- `npm run dev`: start local development
- `npm run lint`: check code quality
- `npm run typecheck`: verify TypeScript types
- `npm run build`: create the Vinext production output
- `npm run check`: run lint, type checking, and the production build
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
