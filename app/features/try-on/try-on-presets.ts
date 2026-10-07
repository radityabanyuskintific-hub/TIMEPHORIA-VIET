import { lipTryOnShades, type LipTryOnShade } from "../../lip-try-on-shades.ts";
import { skuMaster } from "../../sku-master.ts";

export type TryOnRegion =
  | "brows"
  | "concealer"
  | "contour"
  | "eyeliner"
  | "eyelashes"
  | "eyeshadow"
  | "foundation"
  | "lips"
  | "blush";

export type TryOnPreset = {
  coverage?: number;
  finish?: "glow" | "matte" | "natural" | "satin";
  region: TryOnRegion;
  shades: LipTryOnShade[];
  shimmer?: boolean;
};

const shade = (code: string, name: string, hex: string): LipTryOnShade => ({
  code,
  name,
  hex,
});

const faceBase = [
  shade("000", "Bare", "#EFC3A7"),
  shade("001", "Creme", "#E7B795"),
  shade("002", "Birch", "#DDA985"),
  shade("003", "Fawn", "#CB936F"),
  shade("003W", "Warm Fawn", "#C88A62"),
  shade("004", "Beige", "#B97855"),
  shade("05", "Tan", "#966044"),
  shade("06", "Cacao", "#70432F"),
];

const presets: Record<string, TryOnPreset> = {
  "LUMINA MATTE CUSHION": { coverage: 0.68, finish: "matte", region: "foundation", shades: faceBase },
  "OPTIMA POWDER FOUNDATION": {
    coverage: 0.58,
    finish: "matte",
    region: "foundation",
    shades: faceBase.slice(1, 7).map((item, index) => ({
      ...item,
      code: String(index + 1).padStart(2, "0"),
    })),
  },
  "UTOPIA GLOW CUSHION": {
    coverage: 0.56,
    finish: "glow",
    region: "foundation",
    shades: [faceBase[1], faceBase[2], faceBase[3], faceBase[4], faceBase[6]],
  },
  "FIXION SKIN TINT STICK": {
    coverage: 0.36,
    finish: "satin",
    region: "foundation",
    shades: faceBase.slice(1, 7),
  },
  "VALORA CONCEALER": {
    coverage: 0.62,
    finish: "matte",
    region: "concealer",
    shades: [faceBase[1], faceBase[2], faceBase[3], faceBase[4], faceBase[6]],
  },
  "PANDORA CHEEK LIQUID BLUSH": {
    region: "blush",
    shades: [
      shade("01", "Peony", "#D75F83"),
      shade("02", "Rosy", "#C6576A"),
      shade("03", "Coral", "#E46F61"),
      shade("04", "Berry", "#A93A64"),
      shade("05", "Mauve", "#A55472"),
      shade("06", "Terracotta", "#B85C43"),
      shade("07", "Nude", "#B76D60"),
    ],
  },
  "ECLIPSE 2 IN 1 FACE CONTOUR": {
    region: "contour",
    shades: [
      shade("01", "Warm contour", "#A86C50"),
      shade("02", "Neutral contour", "#805A4E"),
      shade("03", "Deep contour", "#684333"),
    ],
  },
  "ORBITA 3 IN 1 BLURRING POT": {
    region: "blush",
    shades: [
      shade("01", "Nude orbit", "#A9685D"),
      shade("02", "Rose orbit", "#B74F68"),
      shade("03", "Coral orbit", "#D96859"),
      shade("04", "Berry orbit", "#8E365C"),
    ],
  },
  "GENESIS EYEBROW PENCIL": {
    region: "brows",
    shades: [
      shade("01", "Ash brown", "#66564F"),
      shade("02", "Natural brown", "#76503C"),
      shade("03", "Dark brown", "#3F2B25"),
      shade("04", "Grey brown", "#504A48"),
    ],
  },
  "DUNE EYELINER": {
    region: "eyeliner",
    shades: [shade("01", "Black", "#111014"), shade("02", "Brown", "#412B27")],
  },
  "REVELA BROW MASCARA": {
    region: "brows",
    shades: [
      shade("01", "Soft brown", "#8A6654"),
      shade("02", "Natural brown", "#694936"),
      shade("03", "Dark brown", "#3D2A25"),
    ],
  },
  "ILLUMINA EYESHADOW STICK": {
    region: "eyeshadow",
    shimmer: true,
    shades: [
      shade("01", "Champagne", "#DABF9D"),
      shade("02", "Rose chrome", "#C17D89"),
      shade("03", "Copper", "#B66B45"),
      shade("04", "Galaxy", "#79536F"),
      shade("05", "Moonlit", "#A9A2B7"),
    ],
  },
  "NAVI EYESHADOW PALETTE": {
    region: "eyeshadow",
    shades: [
      shade("01", "Abyss Brown", "#6F493C"),
      shade("02", "Siren Pink", "#A65676"),
    ],
  },
};

for (const [productName, shades] of Object.entries(lipTryOnShades)) {
  presets[productName] = { region: "lips", shades };
}

// The SKU workbook has no color values. These are display-only approximations.
const skuHexOverrides: Record<string, string> = {
  TSH119007: "#E6628D",
  TSH119005: "#8F3042",
  TSH119003: "#DB8580",
  TSH119002: "#A96355",
  TCC102404: "#B25466",
  TCC102402: "#D65D64",
  TCC102401: "#B9415A",
  TGG107003: "#85543A",
  TGG107001: "#C49172",
  TGG107002: "#9B6A56",
  TCC140017: "#813B45",
  TQD113000: "#EFC3A7",
  TZX10501NW: "#E7B795",
  TZX10502N: "#DDA985",
  TZX10503N: "#CB936F",
};

export const tryOnPresets: Record<string, TryOnPreset> = {};

for (const [productName, variants] of Object.entries(skuMaster)) {
  const preset = presets[productName];
  if (!preset) continue;

  tryOnPresets[productName] = {
    ...preset,
    shades: variants.filter((variant) => variant.shadeName).map((variant) => {
      const previous = preset.shades.find(
        (item) => item.name.toLowerCase() === variant.shadeName.toLowerCase(),
      );
      const hex = skuHexOverrides[variant.sku] ?? previous?.hex;
      if (!hex) throw new Error(`Missing try-on color for SKU ${variant.sku}`);

      return {
        ...previous,
        code: variant.shadeCode,
        name: variant.shadeName,
        hex,
        sku: variant.sku,
      };
    }),
  };
}
