"use client";

import { useEffect, useMemo, useState } from "react";

type CategoryKey = "lips" | "eyes" | "face";

type Product = {
  name: string;
  shortName: string;
  category: CategoryKey;
  finish: string;
  price: string;
  size: string;
  image: string;
  description: string;
  claims: string[];
  shades: string[];
  swatchSlides?: string[];
};

type Promo = {
  title: string;
  kicker: string;
  detail: string;
  category: CategoryKey;
  finish: string;
  discount: string;
  artwork?: string;
  registrationUrl?: string;
  registrationLabel?: string;
};

const promos: Promo[] = [
  {
    title: "BUY TIMEPHORIA, WIN BTS CONCERT EXPERIENCE !",
    kicker: "Grand prize promo",
    detail:
      "Makin Banyak Belanja Timephoria, Makin besar Kesempatan Memenangkan Total Hadiah Ratusan Juta Rupiah!.",
    category: "lips",
    finish: "GLOSS IT BETTER",
    discount: "GET THE REWARD",
    artwork: "/promos/bts-concert-experience.webp",
    registrationUrl: "https://ggl.link/test-link",
    registrationLabel: "Tap to register",
  },
  {
    title: "Complexion Match",
    kicker: "Shade finder promo",
    detail: "Buy cushion or powder and get a setting spray bundle offer.",
    category: "face",
    finish: "SKIN FINISH PERFECTED",
    discount: "BUNDLE DEAL",
  },
  {
    title: "Eye Stay Set",
    kicker: "Waterproof edit",
    detail: "Special price for brow and liner routines after tapping.",
    category: "eyes",
    finish: "BROWS, BUT BETTER",
    discount: "SET PRICE",
  },
  {
    title: "Face Dimension",
    kicker: "Contour and cheek",
    detail: "Save on Pandora Cheek and Eclipse Spark complexion enhancers.",
    category: "face",
    finish: "FLAWLESS FLUSHED CHEEKS",
    discount: "SAVE 15%",
  },
];

const categories: Record<
  CategoryKey,
  {
    label: string;
    eyebrow: string;
    headline: string;
    intro: string;
    finishes: string[];
    color: string;
    image: string;
    video: string;
  }
> = {
  lips: {
    label: "Lips",
    eyebrow: "Lip universe",
    headline: "Find your perfect finish",
    intro:
      "High pigment color, glossy shine, blurred velvet texture, and transfer-proof wear for every lip mood.",
    finishes: [
      "TINTED TO GO",
      "GLOSS IT BETTER",
      "NO TOUCH-UPS NEEDED / ITS MATTE TO LAST",
    ],
    color: "#ffffff",
    image: "/product-pages/lunara-frost-thumbnail.png",
    video: "/videos/header-hero_lips.mp4",
  },
  eyes: {
    label: "Eyes",
    eyebrow: "Eye orbit",
    headline: "Define, lift, and illuminate",
    intro:
      "Waterproof definition, effortless brow shaping, luminous jelly shine, and long-lasting eye color.",
    finishes: ["BROWS, BUT BETTER", "EYE GAME STRONG"],
    color: "#d8d8d8",
    image: "/product-pages/illumina-jelly-thumbnail.png",
    video: "/videos/header-hero_eyes.mp4",
  },
  face: {
    label: "Face",
    eyebrow: "Face dimension",
    headline: "Color, contour, base",
    intro:
      "Complexion, cheek color, contour, and blur products for every face step.",
    finishes: ["SKIN FINISH PERFECTED", "FLAWLESS FLUSHED CHEEKS"],
    color: "#f2f2f2",
    image: "/product-pages/pandora-cheek-thumbnail.png",
    video: "/videos/header-hero_face.mp4",
  },
};

const products: Product[] = [
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
    shades: [
      "000 Bare",
      "001 Creme",
      "002 Birch",
      "003 Fawn",
      "003W Warm Fawn",
      "004 Beige",
      "05 Tan",
      "06 Cacao",
    ],
  },
  {
    name: "OPTIMA POWDER FOUNDATION",
    shortName: "OPTIMA POWDER FOUNDATION",
    category: "face",
    finish: "SKIN FINISH PERFECTED",
    price: "IDR 0",
    size: "8.5 g",
    image: "/product-pages/page-21.png",
    description:
      "Ultra-lightweight powder foundation for perfect cover and blur in one swipe. Flux-Matte technology gives up to 16 hours of oil control.",
    claims: ["Blur matte", "Full coverage", "16H oil control"],
    shades: ["01 Ivory", "02 Light", "03 Medium", "04 Natural", "05 Sand", "06 Tan"],
  },
  {
    name: "SUPERNOVA SETTING SPRAY",
    shortName: "SUPERNOVA SETTING SPRAY",
    category: "face",
    finish: "SKIN FINISH PERFECTED",
    price: "IDR 99.000",
    size: "60 ml",
    image: "/product-pages/page-29.png",
    description:
      "Ultra-fine setting spray that instantly mattifies, blurs pores, and keeps makeup fresh, smudge-proof, and shine-free for up to 12 hours.",
    claims: ["Get set matte", "Airbrushed finish", "12H hold"],
    shades: ["Universal"],
  },
  {
    name: "UTOPIA GLOW CUSHION",
    shortName: "UTOPIA GLOW CUSHION",
    category: "face",
    finish: "SKIN FINISH PERFECTED",
    price: "IDR 00.000",
    size: "Cushion compact",
    image: "/product-pages/page-34.png",
    description:
      "A hydrating glow cushion that creates a soft-blurring base makeup look with sun protection and a comfortable luminous finish.",
    claims: ["SPF50 PA+++", "Hydrating glow", "Soft-blur base"],
    shades: ["Light", "Natural", "Medium", "Warm", "Tan"],
  },
  {
    name: "FIXION SKIN TINT STICK",
    shortName: "FIXION SKIN TINT STICK",
    category: "face",
    finish: "SKIN FINISH PERFECTED",
    price: "IDR 00.000",
    size: "10 g",
    image: "/product-pages/page-42.png",
    description:
      "Creamy skin tint stick with medium-to-full coverage in one swipe. It blends into a satin second-skin finish for up to 8 hours.",
    claims: ["One-swipe base", "8H wear", "Satin finish"],
    shades: ["01 Creme", "02 Birch", "03 Fawn", "04 Beige", "05 Tan", "06 Cacao"],
  },
  {
    name: "VALORA CONCEALER",
    shortName: "VALORA CONCEALER",
    category: "face",
    finish: "SKIN FINISH PERFECTED",
    price: "IDR 00.000",
    size: "5 ml",
    image: "/product-pages/page-49.png",
    description:
      "High-coverage concealer that blurs dark circles and imperfections with a lightweight crease-resistant finish lasting up to 12 hours.",
    claims: ["High coverage", "12H crease resistant", "Soft matte"],
    shades: ["01 Light", "02 Neutral", "03 Medium", "04 Warm", "05 Tan"],
  },
  {
    name: "PANDORA CHEEK LIQUID BLUSH",
    shortName: "PANDORA CHEEK LIQUID BLUSH",
    category: "face",
    finish: "FLAWLESS FLUSHED CHEEKS",
    price: "IDR 199.000",
    size: "5 g",
    image: "/product-pages/page-57.png",
    description:
      "High color payoff liquid blush with an ultra-blendable lightweight feel, dewy-to-soft-matte finish, and all-day wear.",
    claims: ["Highly pigmented", "Ultra-blendable", "Long-lasting"],
    shades: ["Peony", "Rosy", "Coral", "Berry", "Mauve", "Terracotta", "Nude"],
  },
  {
    name: "ECLIPSE 2 IN 1 FACE CONTOUR",
    shortName: "ECLIPSE 2 IN 1 FACE CONTOUR",
    category: "face",
    finish: "FLAWLESS FLUSHED CHEEKS",
    price: "IDR 199.000",
    size: "7 g",
    image: "/product-pages/page-66.png",
    description:
      "Dual-ended contour stick with a built-in hygienic brush, ultra-creamy blendable formula, and silky powder-soft finish.",
    claims: ["Dual-ended", "Cream-to-powder", "Built-in brush"],
    shades: ["Warm contour", "Neutral contour", "Deep contour"],
  },
  {
    name: "ORBITA 3 IN 1 BLURRING POT",
    shortName: "ORBITA 3 IN 1 BLURRING POT",
    category: "face",
    finish: "FLAWLESS FLUSHED CHEEKS",
    price: "IDR 199.000",
    size: "4 g",
    image: "/product-pages/page-74.png",
    description:
      "Multifunction bouncy velvet mud for eyes, cheeks, and lips with a cloud-like blurring effect and intense buildable color.",
    claims: ["Blurring", "High pigment", "Built-in applicator"],
    shades: ["Nude orbit", "Rose orbit", "Coral orbit", "Berry orbit"],
  },
  {
    name: "STELLAR DUST LIP STAIN",
    shortName: "STELLAR DUST LIP STAIN",
    category: "lips",
    finish: "TINTED TO GO",
    price: "IDR 119.000",
    size: "5 g",
    image: "/product-pages/page-84.png",
    description:
      "Hybrid lip emulsion with rich one-swipe coverage, long-lasting transfer-proof color, and comfortable hydration.",
    claims: ["High shine", "12H long-lasting", "Transfer-proof"],
    shades: ["Nude comet", "Rose star", "Coral flare", "Berry nova", "Red orbit"],
  },
  {
    name: "NEBULA LIP CREAM",
    shortName: "NEBULA LIP CREAM",
    category: "lips",
    finish: "NO TOUCH-UPS NEEDED / ITS MATTE TO LAST",
    price: "IDR 119.000",
    size: "4 g",
    image: "/product-pages/page-104.png",
    description:
      "Velvet-matte lip color with a lightweight creamy texture, color-lock technology, hydration, and blurred lip lines.",
    claims: ["Blurs", "Smooth", "High pigment"],
    shades: ["Soft nude", "Warm rose", "Spiced coral", "Mocha", "Deep berry"],
  },
  {
    name: "ETERNAL LIP MATTE",
    shortName: "ETERNAL LIP MATTE",
    category: "lips",
    finish: "NO TOUCH-UPS NEEDED / ITS MATTE TO LAST",
    price: "IDR 119.000",
    size: "4 ml",
    image: "/product-pages/page-119.png",
    description:
      "Highly pigmented matte lip color with intense one-swipe coverage, feather-light texture, and comfortable non-drying wear.",
    claims: ["Long wear", "High pigment", "Transfer-proof"],
    shades: ["Bare rose", "Brick time", "Mauve eclipse", "Ruby", "Cocoa"],
  },
  {
    name: "LUNARA 3D LIP GLOSS",
    shortName: "LUNARA 3D LIP GLOSS",
    category: "lips",
    finish: "GLOSS IT BETTER",
    price: "IDR 199.000",
    size: "5 g",
    image: "/product-pages/page-131.png",
    description:
      "Cushiony gel lip gloss with hyper-shine color, mirror finish, cooling feel, and 3D plumping effect.",
    claims: ["High shine", "3D plump", "24H hydration"],
    shades: ["Clear frost", "Pink ice", "Peach beam", "Berry glass"],
  },
  {
    name: "MILKYWAY MELTING LIP BALM",
    shortName: "MILKYWAY MELTING LIP BALM",
    category: "lips",
    finish: "GLOSS IT BETTER",
    price: "IDR 00.000",
    size: "2.1 g",
    image: "/product-pages/page-180-product.png",
    description:
      "A 5D shine melting balm with a refreshing cooling sensation that glides on like butter, delivering vibrant color and a mirror-like glossy finish while nourishing lips.",
    claims: ["5D Shine", "Melts Like Butter", "Nourish"],
    shades: [
      "001 Ardent",
      "002 Moondrip",
      "003 Bella",
      "004 Noirelle",
      "005 Muse",
      "006 Galacta",
      "007 Roselle",
      "008 Caelia",
      "009 Vesper",
      "010 Ravelle",
      "011 Topazia",
      "012 Amberra",
      "013 Creamira",
      "014 Stellune",
      "015 Kyra",
      "016 Venara",
    ],
  },
  {
    name: "APHRODITE EVERLASTING GLOSSY TINT",
    shortName: "APHRODITE EVERLASTING GLOSSY TINT",
    category: "lips",
    finish: "GLOSS IT BETTER",
    price: "IDR 00.000",
    size: "4 g",
    image: "/product-pages/page-216-product.png",
    description:
      "A juicy glossy tint with vibrant color payoff, glass-like shine, and a lasting water-lock stain while keeping lips comfortable and hydrated.",
    claims: ["Juicy Tint", "Water Lock Stain", "Ultra Comfort"],
    shades: [
      "001 Freya",
      "002 Thea",
      "003 Thalassa",
      "004 Amora",
      "005 Isadora",
      "006 Juno",
      "007 Heatflare",
      "008 Clio",
      "009 Sora",
      "010 Cyprus",
    ],
  },
  {
    name: "ELIXIR VELVET-SHINE SWITCHING LIP CREAM",
    shortName: "ELIXIR VELVET-SHINE SWITCHING LIP CREAM",
    category: "lips",
    finish: "GLOSS IT BETTER",
    price: "IDR 00.000",
    size: "3.5 g",
    image: "/product-pages/page-205-product.png",
    description:
      "A dual-finish lip velvet that creates a soft velvet effect in one layer and enhanced shine when layered, with color-lock wear and cushioned comfort.",
    claims: ["Two Customizable Finish", "High Pigment", "Ultra Comfort"],
    shades: [
      "001 Fable",
      "002 Potion",
      "003 Rubium",
      "004 Terranox",
      "005 Kalion",
      "006 Cerillium",
      "007 Eclipta",
      "008 Fanox",
      "009 Vinx",
      "010 Xenon",
      "011 Auralis",
      "012 Mauvorious",
    ],
  },
  {
    name: "SPECTRA LIP VINYL",
    shortName: "SPECTRA LIP VINYL",
    category: "lips",
    finish: "NO TOUCH-UPS NEEDED / ITS MATTE TO LAST",
    price: "IDR 00.000",
    size: "Lip vinyl",
    image: "/product-pages/page-144.png",
    description:
      "Shine-lock lip vinyl built for glossy color that sets, stays bright, and resists transfer through the day.",
    claims: ["Stay-shine", "Transfer-proof", "Vinyl gloss"],
    shades: ["Nude glare", "Rose signal", "Red spectrum", "Deep shine"],
  },
  {
    name: "ORION CLOUD MATTE LIPSTICK",
    shortName: "ORION CLOUD MATTE LIPSTICK",
    category: "lips",
    finish: "NO TOUCH-UPS NEEDED / ITS MATTE TO LAST",
    price: "IDR 00.000",
    size: "2.5 g",
    image: "/product-pages/page-195-product.png",
    description:
      "A highly pigmented blurring matte lipstick that glides on smoothly, diffuses lip lines, and sets transfer-proof for up to 12 hours of soft matte wear.",
    claims: ["Soft Blur Matte", "Butter Texture", "Transferproof"],
    shades: [
      "001 Axiom",
      "002 Araminta",
      "003 Xena",
      "004 Althea",
      "005 Elladora",
      "006 Violetta",
      "007 Pegasus",
      "008 Vela",
      "009 Lunette",
      "010 Serpentis",
      "011 Enchanta",
      "012 Narcissa",
    ],
  },
  {
    name: "ALTERA LIP TINT",
    shortName: "ALTERA LIP TINT",
    category: "lips",
    finish: "TINTED TO GO",
    price: "IDR 00.000",
    size: "Lip tint",
    image: "/product-pages/page-164.png",
    description:
      "Innovative lip color that shifts from glossy to soft blurry finish with pure blur technology and weightless hydration.",
    claims: ["Gloss-to-blur", "Long stain", "Hydrating"],
    shades: ["Soft pink", "Apricot", "Warm rose", "Berry mist"],
  },
  {
    name: "AION SUPERSTAIN LIP TATTOO INK",
    shortName: "AION SUPERSTAIN LIP TATTOO INK",
    category: "lips",
    finish: "TINTED TO GO",
    price: "IDR 00.000",
    size: "4 g",
    image: "/product-pages/page-226-product.png",
    description:
      "An intense watery gel lip tattoo ink with 3x concentrated pigments, rich full-pigment coverage, and a vibrant stain that lasts up to 24 hours.",
    claims: ["High Pigment", "Non Peel", "Longlasting"],
    shades: [
      "001 Helia",
      "002 Calliope",
      "003 Eliara",
      "004 Nyssa",
      "005 Ione",
      "006 Delphina",
      "007 Theia",
      "008 Astrelle",
      "009 Chrysa",
      "010 Aera",
      "011 Calina",
      "012 Elistra",
      "013 Lunelle",
      "014 Rosia",
    ],
  },
  {
    name: "GENESIS EYEBROW PENCIL",
    shortName: "GENESIS EYEBROW PENCIL",
    category: "eyes",
    finish: "BROWS, BUT BETTER",
    price: "IDR 00.000",
    size: "0.5 g",
    image: "/product-pages/page-231.png",
    description:
      "Slanted oval-tip eyebrow pencil with powder-to-wax payoff for soft natural definition that stays through sweat and humidity.",
    claims: ["Good pigment", "Smooth", "Waterproof"],
    shades: ["Ash brown", "Natural brown", "Dark brown", "Grey brown"],
  },
  {
    name: "DUNE EYELINER",
    shortName: "DUNE EYELINER",
    category: "eyes",
    finish: "EYE GAME STRONG",
    price: "IDR 199.000",
    size: "0.5 g",
    image: "/product-pages/page-237.png",
    description:
      "Thin precise applicator with an easy-set formula for smooth intense color, waterproof wear, and clean lines all day.",
    claims: ["Thin", "Precise", "Waterproof"],
    shades: ["Black", "Brown"],
  },
  {
    name: "REVELA BROW MASCARA",
    shortName: "REVELA BROW MASCARA",
    category: "eyes",
    finish: "BROWS, BUT BETTER",
    price: "IDR 00.000",
    size: "Brow mascara",
    image: "/product-pages/page-243.png",
    description:
      "Anti-clump tinted brow gel with a 30 degree fine-tip brush for intense color, waterproof hold, and up to 12 hours of definition.",
    claims: ["Good pigment", "Hold", "Longwear"],
    shades: ["Soft brown", "Natural brown", "Dark brown"],
  },
  {
    name: "ILLUMINA EYESHADOW STICK",
    shortName: "ILLUMINA EYESHADOW STICK",
    category: "eyes",
    finish: "EYE GAME STRONG",
    price: "IDR 00.000",
    size: "Eyeshadow stick",
    image: "/product-pages/page-249.png",
    description:
      "Jelly eyeshadow stick with lightweight high-impact sparkle, hydra-metallic shine, cool cushion feel, and crease-free wear.",
    claims: ["Jelly texture", "High pigment", "Long-lasting shine"],
    shades: ["Champagne", "Rose chrome", "Copper", "Galaxy", "Moonlit"],
  },
  {
    name: "NAVI EYESHADOW PALETTE",
    shortName: "NAVI EYESHADOW PALETTE",
    category: "eyes",
    finish: "EYE GAME STRONG",
    price: "IDR 00.000",
    size: "0.9 g x 8",
    image: "/product-pages/page-274-product.png",
    description:
      "An 8-shade eyeshadow palette with matte, satin, and shimmer finishes that blend seamlessly for long-lasting day-to-night looks with minimal fallout.",
    claims: ["High Pigment", "Effortless Blend", "Longwear"],
    shades: ["Abyss Brown Palette", "Siren Pink Palette"],
  },
];

const productAssetSlugs: Record<string, string> = {
  "ALTERA LIP TINT": "altera-tint",
  "DUNE EYELINER": "dune-eyeliner",
  "ECLIPSE 2 IN 1 FACE CONTOUR": "eclipse-contour",
  "ETERNAL LIP MATTE": "eternal-matte",
  "FIXION SKIN TINT STICK": "fixion-tint-stick",
  "GENESIS EYEBROW PENCIL": "genesis-brow",
  "ILLUMINA EYESHADOW STICK": "illumina-jelly",
  "LUMINA MATTE CUSHION": "lumina-cushion",
  "LUNARA 3D LIP GLOSS": "lunara-frost",
  "NEBULA LIP CREAM": "nebula-velvet",
  "OPTIMA POWDER FOUNDATION": "optima-powder",
  "ORBITA 3 IN 1 BLURRING POT": "orbita-pot",
  "PANDORA CHEEK LIQUID BLUSH": "pandora-cheek",
  "REVELA BROW MASCARA": "revela-brow",
  "SPECTRA LIP VINYL": "spectra-vinyl",
  "STELLAR DUST LIP STAIN": "stellar-dust",
  "SUPERNOVA SETTING SPRAY": "supernova-spray",
  "UTOPIA GLOW CUSHION": "utopia-glow-cushion",
  "VALORA CONCEALER": "valora-concealer",
};

const productThumbnailSlugs: Record<string, string> = {
  "AION SUPERSTAIN LIP TATTOO INK": "aion",
  "ALTERA LIP TINT": "altera",
  "APHRODITE EVERLASTING GLOSSY TINT": "aphrodite",
  "DUNE EYELINER": "dune",
  "ECLIPSE 2 IN 1 FACE CONTOUR": "eclipse",
  "ELIXIR VELVET-SHINE SWITCHING LIP CREAM": "elixir",
  "ETERNAL LIP MATTE": "eternal",
  "FIXION SKIN TINT STICK": "fixion",
  "GENESIS EYEBROW PENCIL": "genesis",
  "ILLUMINA EYESHADOW STICK": "illumina",
  "LUMINA MATTE CUSHION": "lumina",
  "LUNARA 3D LIP GLOSS": "lunara",
  "MILKYWAY MELTING LIP BALM": "milkyway",
  "NAVI EYESHADOW PALETTE": "navi",
  "NEBULA LIP CREAM": "nebula",
  "OPTIMA POWDER FOUNDATION": "optima",
  "ORBITA 3 IN 1 BLURRING POT": "orbita",
  "ORION CLOUD MATTE LIPSTICK": "orion",
  "PANDORA CHEEK LIQUID BLUSH": "pandora",
  "REVELA BROW MASCARA": "revela",
  "SPECTRA LIP VINYL": "spectra",
  "STELLAR DUST LIP STAIN": "stellar",
  "SUPERNOVA SETTING SPRAY": "supernova",
  "UTOPIA GLOW CUSHION": "utopia",
  "VALORA CONCEALER": "valora",
};

const productSwatchSlides: Record<string, string[]> = {
  "AION SUPERSTAIN LIP TATTOO INK": [
    "/swatches/swatches-lips/swatches-aion/swatches-aion-1.jpg",
    "/swatches/swatches-lips/swatches-aion/swatches-aion-2.jpg",
  ],
  "ALTERA LIP TINT": [
    "/swatches/swatches-lips/swatches-altera/swatches-altera-1.jpg",
    "/swatches/swatches-lips/swatches-altera/swatches-altera-2.jpg",
  ],
  "APHRODITE EVERLASTING GLOSSY TINT": [
    "/swatches/swatches-lips/swatches-aphrodite/swatches-aphrodite-1.jpg",
    "/swatches/swatches-lips/swatches-aphrodite/swatches-aphrodite-2.jpg",
  ],
  "DUNE EYELINER": ["/swatches/swatches-eye/swatches-dune/swatches-dune.jpg"],
  "ELIXIR VELVET-SHINE SWITCHING LIP CREAM": [
    "/swatches/swatches-lips/swatches-elixir/swatches-elixir-1.jpg",
  ],
  "ETERNAL LIP MATTE": [
    "/swatches/swatches-lips/swatches-eternal/swatches-eternal-1.jpg",
    "/swatches/swatches-lips/swatches-eternal/swatches-eternal-2.jpg",
    "/swatches/swatches-lips/swatches-eternal/swatches-eternal-3.jpg",
  ],
  "GENESIS EYEBROW PENCIL": [
    "/swatches/swatches-eye/swatches-genesis/swatches-genesis-1.jpg",
  ],
  "ILLUMINA EYESHADOW STICK": [
    "/swatches/swatches-eye/swatches-illumina/swatches-illumina-1.jpg",
  ],
  "LUNARA 3D LIP GLOSS": [
    "/swatches/swatches-lips/swatches-lunara/swatches-lunara-1.jpg",
    "/swatches/swatches-lips/swatches-lunara/swatches-lunara-2.jpg",
  ],
  "MILKYWAY MELTING LIP BALM": [
    "/swatches/swatches-lips/swatches-milkyway/swatches-milkyway-1.jpg",
    "/swatches/swatches-lips/swatches-milkyway/swatches-milkyway-2.jpg",
  ],
  "NAVI EYESHADOW PALETTE": [
    "/swatches/swatches-eye/swatches-navi/swatches-navi-1.jpg",
    "/swatches/swatches-eye/swatches-navi/swatches-navi-2.jpg",
    "/swatches/swatches-eye/swatches-navi/swatches-navi-3.jpg",
    "/swatches/swatches-eye/swatches-navi/swatches-navi-4.jpg",
  ],
  "NEBULA LIP CREAM": [
    "/swatches/swatches-lips/swatches-nebula/swatches-nebula-1.jpg",
    "/swatches/swatches-lips/swatches-nebula/swatches-nebula-2.jpg",
    "/swatches/swatches-lips/swatches-nebula/swatches-nebula-3.jpg",
  ],
  "ORION CLOUD MATTE LIPSTICK": [
    "/swatches/swatches-lips/swatches-orion/swatches-orion.jpg",
  ],
  "REVELA BROW MASCARA": [
    "/swatches/swatches-eye/swatches-revela/swatches-revela-1.jpg",
  ],
  "SPECTRA LIP VINYL": [
    "/swatches/swatches-lips/swatches-spectra/swatches-spectra-1.jpg",
    "/swatches/swatches-lips/swatches-spectra/swatches-spectra-2.jpg",
    "/swatches/swatches-lips/swatches-spectra/swatches-spectra-3.jpg",
  ],
  "STELLAR DUST LIP STAIN": [
    "/swatches/swatches-lips/swatches-stellar/swatches-stellar-1.jpg",
    "/swatches/swatches-lips/swatches-stellar/swatches-stellar-2.jpg",
    "/swatches/swatches-lips/swatches-stellar/swatches-stellar-3.jpg",
    "/swatches/swatches-lips/swatches-stellar/swatches-stellar-4.jpg",
  ],
};

function assetSlug(product: Product) {
  return (productAssetSlugs[product.name] ?? product.shortName)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function productThumbnail(product: Product) {
  const thumbnailSlug = productThumbnailSlugs[product.name] ?? assetSlug(product);
  return `/product-pages/thumbnail-card/thumbnail-card-${thumbnailSlug}.jpg`;
}

function productSwatchImage(product: Product) {
  return `/swatches/swatches-${assetSlug(product)}.jpg`;
}

function productSwatches(product: Product) {
  return productSwatchSlides[product.name] ?? product.swatchSlides ?? [productSwatchImage(product)];
}

function productGroup(product: Product) {
  return product.finish;
}

function promoVisual(promo: Promo) {
  return promo.artwork ?? categories[promo.category].image;
}

function ProductCard({
  product,
  promoLabel,
}: {
  product: Product;
  promoLabel?: string;
}) {
  const [isSwatchOpen, setIsSwatchOpen] = useState(false);
  const [activeSwatchSlide, setActiveSwatchSlide] = useState(0);
  const swatchSlides = productSwatches(product);

  function updateActiveSwatchSlide(target: HTMLDivElement) {
    const nextSlide = Math.round(target.scrollLeft / target.clientWidth);
    setActiveSwatchSlide(Math.min(Math.max(nextSlide, 0), swatchSlides.length - 1));
  }

  return (
    <article className="product-card">
      {promoLabel ? <div className="promo-badge">{promoLabel}</div> : null}
      <div className="product-visual">
        <img src={productThumbnail(product)} alt={`${product.name} product knowledge page`} />
      </div>
      <div className="product-copy">
        <div className="product-meta">
          <span>{product.finish}</span>
          <span>{product.price}</span>
        </div>
        <h3>{product.shortName}</h3>
        <p>{product.description}</p>
        <div className="claim-row" aria-label={`${product.name} claims`}>
          {product.claims.slice(0, 3).map((claim) => (
            <span key={claim}>{claim}</span>
          ))}
        </div>
      </div>
      <div className={`shade-panel ${isSwatchOpen ? "open" : ""}`}>
        <button
          className="shade-toggle"
          aria-expanded={isSwatchOpen}
          onClick={() => setIsSwatchOpen((open) => !open)}
          type="button"
        >
          {product.category === "lips" || product.category === "eyes" ? (
            <span>TAP TO SEE The Finish and Shades</span>
          ) : (
            <>
              <span>Tap to see swatches</span>
              <strong>Tone chart</strong>
            </>
          )}
        </button>
        <div className="shade-content">
          <div className="shade-content-inner">
            <div className="swatch-preview">
              <div
                className="swatch-carousel"
                onScroll={(event) => updateActiveSwatchSlide(event.currentTarget)}
              >
                {swatchSlides.map((slide, index) => (
                  <img
                    key={slide}
                    src={slide}
                    alt={`${product.name} swatch ${index + 1}`}
                  />
                ))}
              </div>
              {swatchSlides.length > 1 ? (
                <div className="swatch-dots" aria-label="Swatch slides">
                  {swatchSlides.map((slide, index) => (
                    <span
                      key={slide}
                      className={index === activeSwatchSlide ? "active" : ""}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("lips");
  const [view, setView] = useState<"home" | "category" | "promo" | "products">("home");
  const [finish, setFinish] = useState("All");
  const [promoIndex, setPromoIndex] = useState(0);
  const [activePromo, setActivePromo] = useState<Promo | null>(null);
  const [loaderState, setLoaderState] = useState<"loading" | "leaving" | "done">(
    "loading",
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPromoIndex((current) => (current + 1) % promos.length);
    }, 3200);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const fillTimer = window.setTimeout(() => {
      setLoaderState("leaving");
    }, 2400);
    const doneTimer = window.setTimeout(() => {
      setLoaderState("done");
    }, 3250);

    return () => {
      window.clearTimeout(fillTimer);
      window.clearTimeout(doneTimer);
    };
  }, []);

  const category = categories[activeCategory];
  const categoryProducts = useMemo(
    () => products.filter((product) => product.category === activeCategory),
    [activeCategory],
  );
  const visibleProducts = useMemo(
    () =>
      finish === "All"
        ? categoryProducts
        : categoryProducts.filter((product) => productGroup(product) === finish),
    [categoryProducts, finish],
  );
  const currentPromo = activePromo ?? promos[promoIndex];

  function chooseCategory(key: CategoryKey, target: "category" | "products") {
    setActiveCategory(key);
    setFinish("All");
    setActivePromo(null);
    setView(target);
  }

  function applyPromo(promo: Promo) {
    setActivePromo(promo);
    setPromoIndex(promos.findIndex((item) => item.title === promo.title));
    setView("promo");
  }

  function viewPromoProducts(promo: Promo) {
    setActiveCategory(promo.category);
    setFinish(promo.finish);
    setActivePromo(promo);
    setView("products");
  }

  return (
    <main className="site-shell">
      {loaderState !== "done" ? (
        <div className={`loading-screen ${loaderState}`} aria-label="Loading">
          <div className="loading-content">
            <img
              className="loading-logo"
              src="/brand/timephoria-logo.png"
              alt="Timephoria"
            />
            <div className="loading-bar" aria-hidden="true">
              <span />
            </div>
            <p>LOADING ....</p>
          </div>
        </div>
      ) : null}

      <section className="brand-panel" aria-label="Timephoria brand story">
        <p>Product web concept</p>
        <h1>TIMEPHORIA</h1>
        <span>Beauty beyond limits</span>
        <p>
          Developed with advanced technology and a future-facing beauty universe,
          translated from the supplied framework and product education decks.
        </p>
      </section>

      <section className={`phone-frame ${view}`} aria-label="Timephoria web app">
        <div className="space-background" />

        {view === "home" ? (
          <div className="home-screen">
            <div className="promo-slider">
              <button
                className="promo-main"
                onClick={() => applyPromo(promos[promoIndex])}
                type="button"
              >
                <img
                  className="promo-main-visual"
                  src={promoVisual(promos[promoIndex])}
                  alt=""
                  aria-hidden="true"
                />
                <span>{promos[promoIndex].kicker}</span>
                <strong>{promos[promoIndex].title}</strong>
                <em>{promos[promoIndex].detail}</em>
                <small>{promos[promoIndex].discount}</small>
              </button>
              <div className="promo-bar" aria-label="Promo slides">
                {promos.map((promo, index) => (
                  <button
                    key={promo.title}
                    aria-label={`Show ${promo.title}`}
                    className={index === promoIndex ? "active" : ""}
                    onClick={() => setPromoIndex(index)}
                    type="button"
                  />
                ))}
              </div>
            </div>

            <div className="category-stack">
              {(["lips", "eyes", "face"] as CategoryKey[]).map(
                (key) => (
                  <button
                    key={key}
                    className="category-tile"
                    style={{ "--accent": categories[key].color } as React.CSSProperties}
                    onClick={() => chooseCategory(key, "category")}
                    type="button"
                  >
                    <img
                      className="category-visual"
                      src={categories[key].image}
                      alt=""
                      aria-hidden="true"
                    />
                    <strong>{categories[key].label}</strong>
                  </button>
                ),
              )}
            </div>
          </div>
        ) : null}

        {view === "promo" ? (
          <div className="promo-screen">
            <header className="promo-page-hero">
              <img
                src={promoVisual(currentPromo)}
                alt=""
                aria-hidden="true"
              />
              <span>{currentPromo.kicker}</span>
              <h2>{currentPromo.title}</h2>
              <p>{currentPromo.detail}</p>
              <small>{currentPromo.discount}</small>
            </header>

            <div className="promo-selector" aria-label="Promo selector">
              {promos.map((promo, index) => (
                <button
                  key={promo.title}
                  className={currentPromo.title === promo.title ? "selected" : ""}
                  onClick={() => {
                    setActivePromo(promo);
                    setPromoIndex(index);
                  }}
                  type="button"
                >
                  {promo.title}
                </button>
              ))}
            </div>

            {currentPromo.registrationUrl && currentPromo.artwork ? (
              <div className="promo-placeholder bts-promo-artwork">
                <div className="bts-promo-scroll">
                  <img
                    src={currentPromo.artwork}
                    alt={`${currentPromo.title} promo artwork`}
                  />
                </div>
                <a
                  className="bts-register-button"
                  href={currentPromo.registrationUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  {currentPromo.registrationLabel}
                </a>
              </div>
            ) : (
              <button
                className="promo-placeholder"
                onClick={() => viewPromoProducts(currentPromo)}
                type="button"
              >
                <img
                  src="/promos/promo-placeholder.png"
                  alt={`${currentPromo.title} promo artwork`}
                />
              </button>
            )}
          </div>
        ) : null}

        {view === "category" ? (
          <div className="category-screen">
            <header className="category-hero">
              <div className="category-video-layer" aria-hidden="true">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  poster={category.image}
                  src={category.video}
                />
              </div>
              <span>{category.eyebrow}</span>
              <h2>{category.label}</h2>
              <p>{category.intro}</p>
            </header>

            <div className="section-title">
              <i />
              <span>{category.headline}</span>
              <i />
            </div>

            <div className="finish-grid">
              {category.finishes.map((item) => (
                <button
                  key={item}
                  className="finish-card"
                  onClick={() => {
                    setFinish(item);
                    setActivePromo(null);
                    setView("products");
                  }}
                  type="button"
                >
                  <span>{item}</span>
                  <small>Tap to view products</small>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {view === "products" ? (
          <div className="products-screen">
            <header
              className="product-header"
              style={{ "--accent": category.color } as React.CSSProperties}
            >
              <span>{category.label}</span>
              <h2>{finish === "All" ? category.headline : finish}</h2>
              <p>{category.intro}</p>
              {activePromo ? (
                <div className="active-promo">
                  <strong>{activePromo.discount}</strong>
                  <span>{activePromo.detail}</span>
                </div>
              ) : null}
            </header>

            <div className="filter-bar" aria-label="Product filters">
              <button
                className={finish === "All" ? "selected" : ""}
                onClick={() => {
                  setFinish("All");
                  setActivePromo(null);
                }}
                type="button"
              >
                All
              </button>
              {category.finishes.map((item) => (
                <button
                  key={item}
                  className={finish === item ? "selected" : ""}
                  onClick={() => {
                    setFinish(item);
                    setActivePromo(null);
                  }}
                  type="button"
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="product-list">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  promoLabel={
                    activePromo &&
                    product.category === activePromo.category &&
                    productGroup(product) === activePromo.finish
                      ? activePromo.discount
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        ) : null}

        <footer className="mobile-footer">
          <button
            onClick={() => setView("home")}
            aria-label="Back to spaceship"
            type="button"
          >
            Back to Spaceship
          </button>
          <img
            className="footer-logo"
            src="/brand/timephoria-logo.png"
            alt="Timephoria"
          />
        </footer>
      </section>

      <nav className="desktop-nav" aria-label="Category shortcuts">
        {(["lips", "eyes", "face"] as CategoryKey[]).map((key) => (
          <button
            key={key}
            className={activeCategory === key ? "selected" : ""}
            onClick={() => chooseCategory(key, "products")}
            type="button"
          >
            {categories[key].label}
          </button>
        ))}
      </nav>
    </main>
  );
}
