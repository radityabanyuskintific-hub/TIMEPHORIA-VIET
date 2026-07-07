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
    finish: "It's Gloss Time",
    discount: "GET THE REWARD",
    artwork: "/promos/bts-concert-experience.webp",
    registrationUrl: "https://docs.google.com/forms/u/0/",
    registrationLabel: "Tap to register",
  },
  {
    title: "Complexion Match",
    kicker: "Shade finder promo",
    detail: "Buy cushion or powder and get a setting spray bundle offer.",
    category: "face",
    finish: "SKIN PERFECTED",
    discount: "BUNDLE DEAL",
  },
  {
    title: "Eye Stay Set",
    kicker: "Waterproof edit",
    detail: "Special price for brow and liner routines after tapping.",
    category: "eyes",
    finish: "BROW",
    discount: "SET PRICE",
  },
  {
    title: "Face Dimension",
    kicker: "Contour and cheek",
    detail: "Save on Pandora Cheek and Eclipse Spark complexion enhancers.",
    category: "face",
    finish: "BLUSH AND CONTOUR",
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
    finishes: ["It's Gloss Time", "Cloud Feel, All Day Stain", "Upgrade Your Tinted Game"],
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
    finishes: ["BROW", "LASHES"],
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
    finishes: ["SKIN PERFECTED", "BLUSH AND CONTOUR"],
    color: "#f2f2f2",
    image: "/product-pages/pandora-cheek-thumbnail.png",
    video: "/videos/header-hero_face.mp4",
  },
};

const products: Product[] = [
  {
    name: "Timeless Lumina Matte Cover Cushion",
    shortName: "Lumina Cushion",
    category: "face",
    finish: "Cushion",
    price: "IDR 199.000",
    size: "11 g",
    image: "/product-pages/page-13.png",
    description:
      "A lightweight full-coverage cushion with a natural flawless finish for up to 12 hours. Color-locking pigment helps absorb excess oil and prevent oxidation.",
    claims: ["Full coverage", "12H fresh skin", "Oil control", "8 shades"],
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
    name: "Timeless Optima Cover-Blur Skin Perfection Powder Foundation",
    shortName: "Optima Powder",
    category: "face",
    finish: "Powder",
    price: "IDR 0",
    size: "8.5 g",
    image: "/product-pages/page-21.png",
    description:
      "Ultra-lightweight powder foundation for perfect cover and blur in one swipe. Flux-Matte technology gives up to 16 hours of oil control.",
    claims: ["Blur matte", "Full coverage", "16H oil control", "Non-comedogenic"],
    shades: ["01 Ivory", "02 Light", "03 Medium", "04 Natural", "05 Sand", "06 Tan"],
  },
  {
    name: "Timeless Supernova Matte Setting Spray",
    shortName: "Supernova Spray",
    category: "face",
    finish: "Spray",
    price: "IDR 99.000",
    size: "60 ml",
    image: "/product-pages/page-29.png",
    description:
      "Ultra-fine setting spray that instantly mattifies, blurs pores, and keeps makeup fresh, smudge-proof, and shine-free for up to 12 hours.",
    claims: ["Get set matte", "Airbrushed finish", "12H hold", "Oily skin friendly"],
    shades: ["Universal"],
  },
  {
    name: "Timephoria Timeless Utopia Glow Perfection Cushion SPF50 PA+++",
    shortName: "Utopia Glow Cushion",
    category: "face",
    finish: "Cushion",
    price: "IDR 00.000",
    size: "Cushion compact",
    image: "/product-pages/page-34.png",
    description:
      "A hydrating glow cushion that creates a soft-blurring base makeup look with sun protection and a comfortable luminous finish.",
    claims: ["SPF50 PA+++", "Hydrating glow", "Soft-blur base", "BPOM registered"],
    shades: ["Light", "Natural", "Medium", "Warm", "Tan"],
  },
  {
    name: "Timeless Fixion All Day Perfection Skin Tint Stick",
    shortName: "Fixion Tint Stick",
    category: "face",
    finish: "Conceal",
    price: "IDR 00.000",
    size: "10 g",
    image: "/product-pages/page-42.png",
    description:
      "Creamy skin tint stick with medium-to-full coverage in one swipe. It blends into a satin second-skin finish for up to 8 hours.",
    claims: ["One-swipe base", "8H wear", "Satin finish", "No oxidation"],
    shades: ["01 Creme", "02 Birch", "03 Fawn", "04 Beige", "05 Tan", "06 Cacao"],
  },
  {
    name: "Timeless Valora Fit Perfection Concealer",
    shortName: "Valora Concealer",
    category: "face",
    finish: "Conceal",
    price: "IDR 00.000",
    size: "5 ml",
    image: "/product-pages/page-49.png",
    description:
      "High-coverage concealer that blurs dark circles and imperfections with a lightweight crease-resistant finish lasting up to 12 hours.",
    claims: ["High coverage", "12H crease resistant", "Soft matte", "Hydrating feel"],
    shades: ["01 Light", "02 Neutral", "03 Medium", "04 Warm", "05 Tan"],
  },
  {
    name: "Pandora Cheek Liquid Blush",
    shortName: "Pandora Cheek",
    category: "face",
    finish: "Blush",
    price: "IDR 199.000",
    size: "5 g",
    image: "/product-pages/page-57.png",
    description:
      "High color payoff liquid blush with an ultra-blendable lightweight feel, dewy-to-soft-matte finish, and all-day wear.",
    claims: ["Highly pigmented", "Ultra-blendable", "Long-lasting", "7 shades"],
    shades: ["Peony", "Rosy", "Coral", "Berry", "Mauve", "Terracotta", "Nude"],
  },
  {
    name: "Eclipse Spark 2-in-1 Face Contour",
    shortName: "Eclipse Contour",
    category: "face",
    finish: "Contour",
    price: "IDR 199.000",
    size: "7 g",
    image: "/product-pages/page-66.png",
    description:
      "Dual-ended contour stick with a built-in hygienic brush, ultra-creamy blendable formula, and silky powder-soft finish.",
    claims: ["Dual-ended", "Cream-to-powder", "Built-in brush", "8H comfort"],
    shades: ["Warm contour", "Neutral contour", "Deep contour"],
  },
  {
    name: "Orbita Lip and Cheek Blurring Pot",
    shortName: "Orbita Pot",
    category: "face",
    finish: "Blurring",
    price: "IDR 199.000",
    size: "4 g",
    image: "/product-pages/page-74.png",
    description:
      "Multifunction bouncy velvet mud for eyes, cheeks, and lips with a cloud-like blurring effect and intense buildable color.",
    claims: ["Blurring", "High pigment", "Built-in applicator", "Multi-use"],
    shades: ["Nude orbit", "Rose orbit", "Coral orbit", "Berry orbit"],
  },
  {
    name: "Stellar Dust Lip Stain",
    shortName: "Stellar Dust",
    category: "lips",
    finish: "Upgrade Your Tinted Game",
    price: "IDR 119.000",
    size: "5 g",
    image: "/product-pages/page-84.png",
    description:
      "Hybrid lip emulsion with rich one-swipe coverage, long-lasting transfer-proof color, and comfortable hydration.",
    claims: ["High shine", "12H long-lasting", "Transfer-proof", "22 shades"],
    shades: ["Nude comet", "Rose star", "Coral flare", "Berry nova", "Red orbit"],
  },
  {
    name: "Nebula Velvet Lip Cream",
    shortName: "Nebula Velvet",
    category: "lips",
    finish: "Cloud Feel, All Day Stain",
    price: "IDR 119.000",
    size: "4 g",
    image: "/product-pages/page-104.png",
    description:
      "Velvet-matte lip color with a lightweight creamy texture, color-lock technology, hydration, and blurred lip lines.",
    claims: ["Blurs", "Smooth", "High pigment", "22 shades"],
    shades: ["Soft nude", "Warm rose", "Spiced coral", "Mocha", "Deep berry"],
  },
  {
    name: "Eternal Lip Matte",
    shortName: "Eternal Matte",
    category: "lips",
    finish: "Cloud Feel, All Day Stain",
    price: "IDR 119.000",
    size: "4 ml",
    image: "/product-pages/page-119.png",
    description:
      "Highly pigmented matte lip color with intense one-swipe coverage, feather-light texture, and comfortable non-drying wear.",
    claims: ["Long wear", "High pigment", "Transfer-proof", "17 shades"],
    shades: ["Bare rose", "Brick time", "Mauve eclipse", "Ruby", "Cocoa"],
  },
  {
    name: "Lunara Frost 3D Lip Gloss",
    shortName: "Lunara Frost",
    category: "lips",
    finish: "It's Gloss Time",
    price: "IDR 199.000",
    size: "5 g",
    image: "/product-pages/page-131.png",
    description:
      "Cushiony gel lip gloss with hyper-shine color, mirror finish, cooling feel, and 3D plumping effect.",
    claims: ["High shine", "3D plump", "24H hydration", "Fresh chill"],
    shades: ["Clear frost", "Pink ice", "Peach beam", "Berry glass"],
  },
  {
    name: "Spectra Ultra Stay-Shine Transfer Proof Lip Vinyl",
    shortName: "Spectra Vinyl",
    category: "lips",
    finish: "It's Gloss Time",
    price: "IDR 00.000",
    size: "Lip vinyl",
    image: "/product-pages/page-144.png",
    description:
      "Shine-lock lip vinyl built for glossy color that sets, stays bright, and resists transfer through the day.",
    claims: ["Stay-shine", "Transfer-proof", "Vinyl gloss", "Bold color"],
    shades: ["Nude glare", "Rose signal", "Red spectrum", "Deep shine"],
  },
  {
    name: "Altera Blurring Lip Tint",
    shortName: "Altera Tint",
    category: "lips",
    finish: "Upgrade Your Tinted Game",
    price: "IDR 00.000",
    size: "Lip tint",
    image: "/product-pages/page-164.png",
    description:
      "Innovative lip color that shifts from glossy to soft blurry finish with pure blur technology and weightless hydration.",
    claims: ["Gloss-to-blur", "Long stain", "Hydrating", "Non-sticky"],
    shades: ["Soft pink", "Apricot", "Warm rose", "Berry mist"],
  },
  {
    name: "Genesis Superstay Eyebrow Pencil",
    shortName: "Genesis Brow",
    category: "eyes",
    finish: "Brow",
    price: "IDR 00.000",
    size: "0.5 g",
    image: "/product-pages/page-231.png",
    description:
      "Slanted oval-tip eyebrow pencil with powder-to-wax payoff for soft natural definition that stays through sweat and humidity.",
    claims: ["Good pigment", "Smooth", "Waterproof", "Beginner friendly"],
    shades: ["Ash brown", "Natural brown", "Dark brown", "Grey brown"],
  },
  {
    name: "Dune Hyper-Precision Superstay Eyeliner",
    shortName: "Dune Eyeliner",
    category: "eyes",
    finish: "Liner",
    price: "IDR 199.000",
    size: "0.5 g",
    image: "/product-pages/page-237.png",
    description:
      "Thin precise applicator with an easy-set formula for smooth intense color, waterproof wear, and clean lines all day.",
    claims: ["Thin", "Precise", "Waterproof", "Sweat-resistant"],
    shades: ["Black", "Brown"],
  },
  {
    name: "Revela Tinted Eyebrow Mascara",
    shortName: "Revela Brow",
    category: "eyes",
    finish: "Brow",
    price: "IDR 00.000",
    size: "Brow mascara",
    image: "/product-pages/page-243.png",
    description:
      "Anti-clump tinted brow gel with a 30 degree fine-tip brush for intense color, waterproof hold, and up to 12 hours of definition.",
    claims: ["Good pigment", "Hold", "Longwear", "Anti-clump"],
    shades: ["Soft brown", "Natural brown", "Dark brown"],
  },
  {
    name: "Illumina Jelly Eyeshadow Stick",
    shortName: "Illumina Jelly",
    category: "eyes",
    finish: "Shadow",
    price: "IDR 00.000",
    size: "Eyeshadow stick",
    image: "/product-pages/page-249.png",
    description:
      "Jelly eyeshadow stick with lightweight high-impact sparkle, hydra-metallic shine, cool cushion feel, and crease-free wear.",
    claims: ["Jelly texture", "High pigment", "Long-lasting shine", "No creasing"],
    shades: ["Champagne", "Rose chrome", "Copper", "Galaxy", "Moonlit"],
  },
];

function assetSlug(product: Product) {
  return product.shortName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function productThumbnail(product: Product) {
  return `/product-pages/${assetSlug(product)}-thumbnail.png`;
}

function productSwatchImage(product: Product) {
  return `/swatches/swatches-${assetSlug(product)}.jpg`;
}

function productGroup(product: Product) {
  if (product.category === "eyes") {
    return product.finish === "Brow" ? "BROW" : "LASHES";
  }

  if (product.category === "face") {
    return ["Cushion", "Powder", "Spray", "Conceal"].includes(product.finish)
      ? "SKIN PERFECTED"
      : "BLUSH AND CONTOUR";
  }

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
          {product.claims.slice(0, 4).map((claim) => (
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
          <span>Tap to see swatches</span>
          <strong>Tone chart</strong>
        </button>
        <div className="shade-content">
          <div className="shade-content-inner">
            <div className="swatch-preview">
              <img
                src={productSwatchImage(product)}
                alt={`${product.name} swatch chart`}
              />
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
                    <span>{categories[key].eyebrow}</span>
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
              <h2>{finish === "All" ? category.headline : `${finish} finish`}</h2>
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
