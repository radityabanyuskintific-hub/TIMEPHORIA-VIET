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

const cardCopy: Record<Language, {
  claims: string;
  finishAndShades: string;
  liveCamera: string;
  productImage: string;
  swatch: string;
  swatchSlides: string;
  swatches: string;
  toneChart: string;
  tryOn: Record<Product["category"], string>;
}> = {
  id: {
    claims: "klaim",
    finishAndShades: "LIHAT HASIL DAN WARNA",
    liveCamera: "KAMERA LANGSUNG",
    productImage: "gambar produk",
    swatch: "Lihat swatches",
    swatchSlides: "Slide swatch",
    swatches: "swatch",
    toneChart: "Pilihan warna",
    tryOn: { eyes: "COBA DI MATAMU", face: "COBA DI WAJAHMU", lips: "COBA DI BIBIRMU" },
  },
  en: {
    claims: "claims",
    finishAndShades: "TAP TO SEE THE FINISH AND SHADES",
    liveCamera: "LIVE CAMERA",
    productImage: "product image",
    swatch: "Tap to see swatches",
    swatchSlides: "Swatch slides",
    swatches: "swatch",
    toneChart: "Tone chart",
    tryOn: { eyes: "TRY IT ON", face: "TRY IT ON", lips: "TRY IT ON" },
  },
  es: {
    claims: "beneficios",
    finishAndShades: "TOCA PARA VER EL ACABADO Y LOS TONOS",
    liveCamera: "CÁMARA EN VIVO",
    productImage: "imagen del producto",
    swatch: "Toca para ver las muestras",
    swatchSlides: "Muestras de color",
    swatches: "muestra",
    toneChart: "Guía de tonos",
    tryOn: { eyes: "PRUÉBALO EN TUS OJOS", face: "PRUÉBALO EN TU ROSTRO", lips: "PRUÉBALO EN TUS LABIOS" },
  },
  "zh-tw": {
    claims: "產品特色",
    finishAndShades: "點選查看妝效與色號",
    liveCamera: "即時鏡頭",
    productImage: "產品圖片",
    swatch: "點選查看色票",
    swatchSlides: "色票輪播",
    swatches: "色票",
    toneChart: "色號表",
    tryOn: { eyes: "眼妝立即試色", face: "臉部立即試妝", lips: "唇彩立即試色" },
  },
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
  const copy = cardCopy[language];

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
        <img src={thumbnail} alt={`${product.name}, ${copy.productImage}`} />
      </div>
      <div className="product-copy">
        <div className="product-meta">
          <span>{finishLabel}</span>
        </div>
        <h3>{product.shortName}</h3>
        <p>{description}</p>
        <div className="claim-row" aria-label={`${product.name}, ${copy.claims}`}>
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
          <span>{copy.tryOn[product.category]}</span>
          <strong>{copy.liveCamera}</strong>
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
              {copy.finishAndShades}
            </span>
          ) : (
            <>
              <span>
                {copy.swatch}
              </span>
              <strong>
                {copy.toneChart}
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
                    alt={`${product.name}, ${copy.swatches} ${index + 1}`}
                  />
                ))}
              </div>
              {swatchSlides.length > 1 ? (
                <div className="swatch-dots" aria-label={copy.swatchSlides}>
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
