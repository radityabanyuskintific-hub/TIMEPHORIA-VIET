"use client";

/* Product and swatch assets rely on the existing raw-image sizing behavior. */
/* eslint-disable @next/next/no-img-element */

import { useState } from "react";
import type { Language, Product } from "./types";

type ProductCardProps = {
  claims: string[];
  description: string;
  finishLabel: string;
  language: Language;
  onTryOn?: (product: Product) => void;
  product: Product;
  promoLabel?: string;
  swatchSlides: string[];
  thumbnail: string;
};

export default function ProductCard({
  claims,
  description,
  finishLabel,
  language,
  onTryOn,
  product,
  promoLabel,
  swatchSlides,
  thumbnail,
}: ProductCardProps) {
  const [isSwatchOpen, setIsSwatchOpen] = useState(false);
  const [activeSwatchSlide, setActiveSwatchSlide] = useState(0);

  function updateActiveSwatchSlide(target: HTMLDivElement) {
    const nextSlide = Math.round(target.scrollLeft / target.clientWidth);
    setActiveSwatchSlide(
      Math.min(Math.max(nextSlide, 0), swatchSlides.length - 1),
    );
  }

  return (
    <article className="product-card">
      {promoLabel ? <div className="promo-badge">{promoLabel}</div> : null}
      <div className="product-visual">
        <img src={thumbnail} alt={`${product.name} product knowledge page`} />
      </div>
      <div className="product-copy">
        <div className="product-meta">
          <span>{finishLabel}</span>
        </div>
        <h3>{product.shortName}</h3>
        <p>{description}</p>
        <div className="claim-row" aria-label={`${product.name} claims`}>
          {claims.slice(0, 3).map((claim) => (
            <span key={claim}>{claim}</span>
          ))}
        </div>
      </div>
      {onTryOn ? (
        <button
          className="tryon-card-action"
          onClick={() => onTryOn(product)}
          type="button"
        >
          <span>{language === "id" ? "COBA DI BIBIRMU" : "TRY IT ON"}</span>
          <strong>LIVE CAMERA</strong>
        </button>
      ) : null}
      <div className={`shade-panel ${isSwatchOpen ? "open" : ""}`}>
        <button
          className="shade-toggle"
          aria-expanded={isSwatchOpen}
          onClick={() => setIsSwatchOpen((open) => !open)}
          type="button"
        >
          {product.category === "lips" || product.category === "eyes" ? (
            <span>
              {language === "id"
                ? "LIHAT HASIL DAN WARNA"
                : "TAP TO SEE THE FINISH AND SHADES"}
            </span>
          ) : (
            <>
              <span>
                {language === "id" ? "Lihat swatches" : "Tap to see swatches"}
              </span>
              <strong>
                {language === "id" ? "Pilihan warna" : "Tone chart"}
              </strong>
            </>
          )}
        </button>
        <div className="shade-content">
          <div className="shade-content-inner">
            <div className="swatch-preview">
              <div
                className="swatch-carousel"
                onScroll={(event) =>
                  updateActiveSwatchSlide(event.currentTarget)}
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
