"use client";

import { useEffect, useMemo, useState } from "react";
import VirtualLipTryOn from "./components/VirtualLipTryOn";
import { lipTryOnShades } from "./lip-try-on-shades";

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

type Language = "en" | "id";

type ProductTranslation = {
  description: string;
  claims: string[];
};

type Store = {
  name: string;
  region: string;
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
    title: "BUY 1 TIMEPHORIA PRODUCT, GET READY TO SEE BTS LIVE!",
    kicker: "Grand prize promo",
    detail:
      "Scan the QR code, complete the registration form, and upload your receipt for a chance to win spectacular prizes worth hundreds of millions of rupiah.",
    category: "lips",
    finish: "GLOSS IT BETTER",
    discount: "GET THE REWARD",
    artwork: "/promos/bts-concert-experience.webp",
    registrationUrl: "https://forms.gle/ChMJtWT7mReLJERs6",
    registrationLabel: "KLIK UNTUK IKUTAN",
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

const promoTranslation = {
  title: "BELI 1 PRODUK TIMEPHORIA, SIAP-SIAP NONTON KONSER BTS!",
  detail:
    "Cukup scan QR Code, lengkapi formulir pendaftaran, unggah foto struk pembelianmu untuk resmi mengikuti undian dan kesempatan memenangkan hadiah spektakuler lainnya seharga RATUSAN JUTA!",
};

const finishTranslations: Record<string, string> = {
  "SKIN FINISH PERFECTED": "KULIT AUTO FLAWLESS",
  "FLAWLESS FLUSHED CHEEKS": "PIPI MERONA SEKETIKA",
  "BROWS, BUT BETTER": "ALIS ANTI BADAI",
  "EYE GAME STRONG": "EKSPLORASI EYE LOOK",
  "TINTED TO GO": "STAIN SESUAI MOODMU",
  "GLOSS IT BETTER": "GLOSSY TANPA BATAS",
  "IT'S MATTE TO LAST": "BOLD SEHARIAN TANPA TOUCH UP",
};

const productTranslations: Record<string, ProductTranslation> = {
  "ALTERA LIP TINT": { description: "Lip color inovatif yang berubah dari tampilan glossy menjadi soft blurry hanya dengan satu swipe.", claims: ["Blur Garis Bibir", "Stain Tahan Lama", "Warna Intens"] },
  "ELIXIR VELVET-SHINE SWITCHING LIP CREAM": { description: "Lip velvet ringan dan melembapkan dengan dua hasil akhir dalam satu produk.", claims: ["2 Hasil Bibir", "Warna Intens", "Super Nyaman"] },
  "ETERNAL LIP MATTE": { description: "Lip matte dengan warna super pigmented dengan hasil transferproof dan waterproof hingga 24 jam.", claims: ["Hasil Bold Matte", "Warna Intens", "Feel Ringan"] },
  "NEBULA LIP CREAM": { description: "Lip bertekstur velvet-matte yang lembut, tidak membuat bibir terasa kering, dan menyamarkan garis bibir.", claims: ["Hasil Velvet Matte", "Anti Transfer", "Feel Ringan"] },
  "STELLAR DUST LIP STAIN": { description: "Full coverage dalam sekali swipe dengan tekstur ringan yang mengunci pigmen agar tahan lama dan tidak mudah transfer.", claims: ["Stain Super Intens", "Kilau Maksimal", "Tahan Lama"] },
  "SPECTRA LIP VINYL": { description: "Lip vinyl transfer-proof dengan warna ultra-intens dan full coverage hanya dalam satu swipe.", claims: ["Warna Intens", "Tahan 24 Jam", "Super Nyaman"] },
  "ORION CLOUD MATTE LIPSTICK": { description: "Lipstik matte blurring berpigmentasi tinggi dengan full coverage dan hasil transferproof hingga 12 jam.", claims: ["Matte Blur Halus", "Tekstur Lembut", "Anti Transfer"] },
  "ORBITA 3 IN 1 BLURRING POT": { description: "Bouncy velvet mud multifungsi untuk mata, pipi, dan bibir dengan aplikator silikon yang presisi.", claims: ["Hasil Velvet Blur", "Buildable", "Aplikator Praktis"] },
  "MILKYWAY MELTING LIP BALM": { description: "5D Shine Melting Balm bertekstur buttery dengan sensasi dingin, warna vibrant, dan hasil glossy seperti cermin.", claims: ["Kilau 5D", "Selembut Butter", "Menutrisi"] },
  "LUNARA 3D LIP GLOSS": { description: "Lip gloss bertekstur gel lembut dengan hasil high-shine seperti kaca.", claims: ["Efek Bibir 3D", "Anti Lengket", "Sensasi Dingin"] },
  "APHRODITE EVERLASTING GLOSSY TINT": { description: "Tint bibir berkilau dengan warna cerah dan stain tahan lama yang menjaga bibir nyaman dan terhidrasi.", claims: ["Tekstur Juicy", "Stain Water Lock", "Super Nyaman"] },
  "AION SUPERSTAIN LIP TATTOO INK": { description: "Tint gel cair dengan pigmen 3x lebih pekat yang memberikan warna intens hingga 24 jam.", claims: ["Warna Intens", "Tanpa Dikelupas", "Tahan Lama"] },
  "UTOPIA GLOW CUSHION": { description: "Glow cushion ringan dan ultra-hydrating dengan hasil glow-radiant instan, medium-full coverage, dan ketahanan hingga 10 jam.", claims: ["Hasil Glowing", "Halus Seketika", "Melembapkan"] },
  "LUMINA MATTE CUSHION": { description: "Cushion full coverage yang tetap ringan untuk tampilan natural dan flawless sepanjang hari.", claims: ["Hasil Natural", "Feel Ringan", "Anti Oksidasi"] },
  "OPTIMA POWDER FOUNDATION": { description: "Powder foundation ekstra-ringan yang memberikan full coverage hanya dengan satu usapan.", claims: ["Hasil Blur Matte", "Kontrol Minyak", "Non-Komedogenik"] },
  "PANDORA CHEEK LIQUID BLUSH": { description: "Blush berpigmentasi tinggi yang memberikan warna intens hanya dengan satu titik.", claims: ["Warna Intens", "Mudah di-Blend", "Tahan Lama"] },
  "FIXION SKIN TINT STICK": { description: "Skin tint stick creamy dan ringan dengan medium hingga full coverage serta hasil second-skin hingga 8 jam.", claims: ["Hasil Satin", "Tekstur Creamy", "Ringan di Kulit"] },
  "ECLIPSE 2 IN 1 FACE CONTOUR": { description: "Stik kontur wajah 2-in-1 dengan formula ultra-creamy dan warna intens yang mulus dalam satu swipe.", claims: ["Super Creamy", "Krim ke Powder", "Brush Lepas-Pasang"] },
  "VALORA CONCEALER": { description: "Concealer coverage tinggi yang menyamarkan dark circle dan imperfection dengan hasil ringan dan tahan crease hingga 12 jam.", claims: ["Hasil Soft Matte", "Pigmen Intens", "Melembapkan"] },
  "SUPERNOVA SETTING SPRAY": { description: "Setting spray dengan partikel powder halus dan merata untuk makeup yang instant matte dan shine-free.", claims: ["Hasil Matte", "Anti Luntur", "Kontrol Minyak"] },
  "REVELA BROW MASCARA": { description: "Mascara alis dengan pigmen intens dan holding power yang kuat.", claims: ["Warna Intens", "Tahan 12 Jam", "Anti Gumpal"] },
  "ILLUMINA EYESHADOW STICK": { description: "Eyeshadow stick bertekstur jelly yang ringan dan mudah diaplikasikan dengan warna intens dan high shine dalam sekali swipe.", claims: ["Tekstur Jelly", "Kilau Seketika", "Anti Fallout"] },
  "DUNE EYELINER": { description: "Eyeliner dengan aplikator tipis dan presisi untuk membuat garis yang akurat dan rapi.", claims: ["Pigmen Bold", "Ujung Presisi", "Tahan Air"] },
  "GENESIS EYEBROW PENCIL": { description: "Pensil alis berujung oval presisi untuk membingkai, mengisi, dan mendefinisikan alis natural maupun bold.", claims: ["Hasil Natural", "Ujung Oval", "Anti Luntur"] },
  "NAVI EYESHADOW PALETTE": { description: "Palet eyeshadow 8 warna matte, satin, dan shimmer yang mudah dibaurkan untuk tampilan tahan lama.", claims: ["Warna Intens", "Mudah di-Blend", "Tahan Lama"] },
};

const faqItems = [
  ["Bagaimana cara mengikuti program ini?", "Beli minimal 1 produk Timephoria di toko yang berpartisipasi, scan QR Code pada poster di toko, isi formulir, unggah foto struk, lalu submit."],
  ["Apakah ada minimum pembelian?", "Setiap pembelian minimal 1 produk Timephoria berhak mengikuti program."],
  ["Apakah satu struk bisa didaftarkan lebih dari satu kali?", "Tidak. Setiap struk pembelian hanya dapat digunakan untuk 1 kali pendaftaran."],
  ["Jika membeli lebih dari satu produk, apakah peluang menang bertambah?", "Setiap struk yang berbeda dapat didaftarkan sebagai satu kesempatan mengikuti undian."],
  ["Toko mana saja yang mengikuti program ini?", "Program tersedia di 314 toko pilihan Timephoria."],
  ["Apakah pembelian online bisa ikut?", "Tidak. Program hanya berlaku untuk pembelian di toko yang berpartisipasi."],
  ["Bagaimana jika foto struk tidak jelas?", "Pendaftaran dapat dianggap tidak valid apabila foto struk tidak terbaca atau tidak lengkap."],
  ["Bagaimana saya tahu kalau pendaftaran berhasil?", "Setelah formulir berhasil dikirim, akan muncul halaman konfirmasi bahwa data telah diterima."],
  ["Kapan pengumuman pemenang?", "Pengumuman dilakukan pada bulan November melalui Instagram resmi Timephoria dan website resmi program."],
  ["Bagaimana pemenang dihubungi?", "Pemenang diumumkan melalui Instagram Story resmi Timephoria dan dihubungi melalui DM untuk proses verifikasi."],
  ["Berapa lama batas konfirmasi?", "Maksimal 3 x 24 jam."],
  ["Apakah hadiah dapat diuangkan?", "Tidak. Hadiah tidak dapat diuangkan maupun dipindahtangankan."],
  ["Apakah saya dipungut biaya jika menang?", "Tidak. Seluruh proses program dan penyerahan hadiah tidak dipungut biaya."],
  ["Bagaimana jika saya salah mengisi data?", "Pastikan seluruh data benar. Data yang telah dikirim tidak dapat diubah."],
  ["Apakah tiket konser sudah termasuk transportasi dan akomodasi?", "Tidak. Hadiah hanya berupa tiket konser BTS. Biaya lain menjadi tanggung jawab pemenang."],
  ["Bagaimana proses pengambilan tiket konser BTS?", "Waktu dan lokasi akan diberitahukan kepada pemenang. Pengambilan dilakukan di area sekitar GBK, Jakarta, dengan kartu identitas yang sesuai data pendaftaran."],
  ["Apakah hadiah dapat diwakilkan pengambilannya?", "Tidak. Hadiah hanya dapat diterima oleh pemenang yang telah diverifikasi identitasnya."],
];

const faqItemsEnglish = [
  ["How do I join?", "Buy at least one Timephoria product at a participating store, scan the QR code, complete the form, upload your receipt, and submit."],
  ["Is there a minimum purchase?", "Every purchase of at least one Timephoria product is eligible."],
  ["Can one receipt be registered more than once?", "No. Each receipt can only be used for one registration."],
  ["Does buying more products increase my chance?", "Each different receipt can be registered as one entry in the draw."],
  ["Which stores are participating?", "The program is available at 314 selected Timephoria stores."],
  ["Are online purchases eligible?", "No. Only purchases from participating physical stores are eligible."],
  ["What if my receipt photo is unclear?", "The registration may be invalid if the receipt is unreadable or incomplete."],
  ["How do I know my registration succeeded?", "A confirmation page will appear after the form is submitted."],
  ["When will winners be announced?", "Winners will be announced in November on Timephoria's official Instagram and program website."],
  ["How will winners be contacted?", "Winners will be announced on Timephoria's official Instagram Story and contacted by DM for verification."],
  ["How long is the confirmation period?", "A maximum of 3 x 24 hours."],
  ["Can the prize be exchanged for cash?", "No. Prizes cannot be exchanged for cash or transferred."],
  ["Will I be charged if I win?", "No. The program and prize handover process are free of charge."],
  ["What if I entered incorrect data?", "Check all details before submitting. Submitted data cannot be changed."],
  ["Does the concert ticket include transport and accommodation?", "No. The prize only includes the BTS concert ticket. Other expenses are the winner's responsibility."],
  ["How do I collect the concert ticket?", "Collection details will be provided to the winner. Collection will be near GBK, Jakarta, with matching valid identification."],
  ["Can someone collect the prize for me?", "No. The verified winner must receive the prize."],
];

function parseStoreCsv(csv: string): Store[] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (character === '"') {
      if (quoted && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field.trim());
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && csv[index + 1] === "\n") index += 1;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (field || row.length) {
    row.push(field.trim());
    rows.push(row);
  }

  return rows.slice(1).flatMap(([name, region]) =>
    name && region ? [{ name, region }] : [],
  );
}

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
      "IT'S MATTE TO LAST",
    ],
    color: "#ffffff",
    image: "/homepage-category/category-lips.jpg",
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
    image: "/homepage-category/category-eyes.jpg",
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
    image: "/homepage-category/category-face.jpg",
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
    finish: "IT'S MATTE TO LAST",
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
    finish: "IT'S MATTE TO LAST",
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
    finish: "IT'S MATTE TO LAST",
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
    finish: "IT'S MATTE TO LAST",
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
  "ECLIPSE 2 IN 1 FACE CONTOUR": [
    "/swatches/swatches-face/swatches-eclipse/swatches-eclipse-1.jpg",
  ],
  "ELIXIR VELVET-SHINE SWITCHING LIP CREAM": [
    "/swatches/swatches-lips/swatches-elixir/swatches-elixir-1.jpg",
  ],
  "ETERNAL LIP MATTE": [
    "/swatches/swatches-lips/swatches-eternal/swatches-eternal-1.jpg",
    "/swatches/swatches-lips/swatches-eternal/swatches-eternal-2.jpg",
    "/swatches/swatches-lips/swatches-eternal/swatches-eternal-3.jpg",
  ],
  "FIXION SKIN TINT STICK": [
    "/swatches/swatches-face/swatches-fixion/swatches-fixion-1.jpg",
  ],
  "GENESIS EYEBROW PENCIL": [
    "/swatches/swatches-eye/swatches-genesis/swatches-genesis-1.jpg",
  ],
  "ILLUMINA EYESHADOW STICK": [
    "/swatches/swatches-eye/swatches-illumina/swatches-illumina-1.jpg",
  ],
  "LUMINA MATTE CUSHION": [
    "/swatches/swatches-face/swatches-lumina/swatches-lumina-1.jpg",
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
  "OPTIMA POWDER FOUNDATION": [
    "/swatches/swatches-face/swatches-optima/swatches-optima-1.jpg",
  ],
  "ORBITA 3 IN 1 BLURRING POT": [
    "/swatches/swatches-face/swatches-orbita/swatches-orbita-1.jpg",
  ],
  "ORION CLOUD MATTE LIPSTICK": [
    "/swatches/swatches-lips/swatches-orion/swatches-orion.jpg",
  ],
  "PANDORA CHEEK LIQUID BLUSH": [
    "/swatches/swatches-face/swatches-pandora/swatches-pandora-1.jpg",
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
  "SUPERNOVA SETTING SPRAY": [
    "/swatches/swatches-face/swatches-supernova/swatches-supernova-1.jpg",
  ],
  "UTOPIA GLOW CUSHION": [
    "/swatches/swatches-face/swatches-utopia/swatches-utopia-1.jpg",
  ],
  "VALORA CONCEALER": [
    "/swatches/swatches-face/swatches-valora/swatches-valora-1.jpg",
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
  language,
  onTryOn,
}: {
  product: Product;
  promoLabel?: string;
  language: Language;
  onTryOn?: (product: Product) => void;
}) {
  const [isSwatchOpen, setIsSwatchOpen] = useState(false);
  const [activeSwatchSlide, setActiveSwatchSlide] = useState(0);
  const swatchSlides = productSwatches(product);
  const translation = language === "id" ? productTranslations[product.name] : undefined;
  const description = translation?.description ?? product.description;
  const claims = translation?.claims ?? product.claims;

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
          <span>{language === "id" ? finishTranslations[product.finish] : product.finish}</span>
        </div>
        <h3>{product.shortName}</h3>
        <p>{description}</p>
        <div className="claim-row" aria-label={`${product.name} claims`}>
          {claims.slice(0, 3).map((claim) => (
            <span key={claim}>{claim}</span>
          ))}
        </div>
      </div>
      {onTryOn && lipTryOnShades[product.name]?.length ? (
        <button className="tryon-card-action" onClick={() => onTryOn(product)} type="button">
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
              <span>{language === "id" ? "LIHAT HASIL DAN WARNA" : "TAP TO SEE THE FINISH AND SHADES"}</span>
          ) : (
            <>
              <span>{language === "id" ? "Lihat swatches" : "Tap to see swatches"}</span>
              <strong>{language === "id" ? "Pilihan warna" : "Tone chart"}</strong>
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
  const [view, setView] = useState<"home" | "category" | "promo" | "faq" | "stores" | "products">("home");
  const [language, setLanguage] = useState<Language>("en");
  const [stores, setStores] = useState<Store[]>([]);
  const [storeQuery, setStoreQuery] = useState("");
  const [storeRegion, setStoreRegion] = useState("All");
  const [storeStatus, setStoreStatus] = useState<"idle" | "loading" | "error">("idle");
  const [finish, setFinish] = useState("All");
  const [promoIndex, setPromoIndex] = useState(0);
  const [activePromo, setActivePromo] = useState<Promo | null>(null);
  const [activeTryOnProduct, setActiveTryOnProduct] = useState<Product | null>(null);
  const [showMegaPromo, setShowMegaPromo] = useState(true);
  const [loaderState, setLoaderState] = useState<"loading" | "leaving" | "done">(
    "loading",
  );

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPromoIndex((current) => (current + 1) % promos.length);
    }, 2000);

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (view !== "stores" || stores.length || storeStatus !== "loading") return;

    fetch("/api/stores")
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load stores");
        return response.text();
      })
      .then((csv) => {
        setStores(parseStoreCsv(csv));
        setStoreStatus("idle");
      })
      .catch(() => setStoreStatus("error"));
  }, [storeStatus, stores.length, view]);

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
  const megaPromo = promos[0];
  const isIndonesian = language === "id";
  const translatedPromo = currentPromo === promos[0] && isIndonesian
    ? { ...currentPromo, ...promoTranslation }
    : currentPromo;
  const storeRegions = useMemo(
    () => ["All", ...Array.from(new Set(stores.map((store) => store.region))).sort()],
    [stores],
  );
  const visibleStores = useMemo(() => {
    const query = storeQuery.trim().toLocaleLowerCase("id");

    return stores.filter((store) =>
      (storeRegion === "All" || store.region === storeRegion) &&
      (!query || `${store.name} ${store.region}`.toLocaleLowerCase("id").includes(query)),
    );
  }, [storeQuery, storeRegion, stores]);

  function toggleLanguage() {
    setLanguage((current) => (current === "en" ? "id" : "en"));
  }

  function chooseCategory(key: CategoryKey, target: "category" | "products") {
    setActiveCategory(key);
    setFinish("All");
    setActivePromo(null);
    setView(target);
  }

  function applyPromo(promo: Promo) {
    setActivePromo(promo);
    setPromoIndex(promos.findIndex((item) => item.title === promo.title));
    setShowMegaPromo(false);
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

      {loaderState === "done" && showMegaPromo ? (
        <div className="mega-promo-modal" role="dialog" aria-label={megaPromo.title}>
          <div className="mega-promo-card">
            <div className="mega-promo-copy">
              <strong>BELI 1 PRODUK TIMEPHORIA, SIAP-SIAP NONTON KONSER BTS!</strong>
              <em>{promoTranslation.detail}</em>
              <a
                href={megaPromo.registrationUrl}
                rel="noreferrer"
                target="_blank"
              >
                KLIK UNTUK IKUTAN
              </a>
            </div>
            <img src={promoVisual(megaPromo)} alt="" aria-hidden="true" />
          </div>
          <button
            className="mega-promo-close"
            aria-label="Close promo popup"
            onClick={() => setShowMegaPromo(false)}
            type="button"
          >
            X
          </button>
        </div>
      ) : null}

      <section className="brand-panel" aria-label="Timephoria brand story">
        <h1>TIMEPHORIA</h1>
        <span>Beauty beyond limits</span>
        <p>
          Developed with advanced technology and a future-facing beauty universe,
          translated from the supplied framework and product education decks.
        </p>
      </section>

      <section className={`phone-frame ${view}`} aria-label="Timephoria web app">
        <div className="space-background" />

        {activeTryOnProduct ? (
          <VirtualLipTryOn
            language={language}
            onClose={() => setActiveTryOnProduct(null)}
            productImage={productThumbnail(activeTryOnProduct)}
            productName={activeTryOnProduct.name}
            shades={lipTryOnShades[activeTryOnProduct.name]}
          />
        ) : null}

        {view === "home" ? (
          <div className="home-screen">
            <div className="promo-slider">
              <button
                key={promos[promoIndex].title}
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
                <b className="promo-tap-hint">Tap To See Details</b>
                <span>{promos[promoIndex].kicker}</span>
                <strong>{promoIndex === 0 ? "BUY 1 TIMEPHORIA PRODUCT, GET READY TO SEE BTS LIVE!" : promos[promoIndex].title}</strong>
                <em>{promos[promoIndex].detail}</em>
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
              <span>{translatedPromo.kicker}</span>
              <h2>{translatedPromo.title}</h2>
              <p>{translatedPromo.detail}</p>
              {currentPromo.registrationUrl ? (
                <a className="promo-hero-cta" href={currentPromo.registrationUrl} rel="noreferrer" target="_blank">
                  {isIndonesian ? "KLIK UNTUK IKUTAN" : "JOIN NOW"}
                </a>
              ) : null}
              <div className="promo-scroll-hint">
                <span>{isIndonesian ? "Scroll dan lihat promo lainnya" : "Scroll & Tap to See Other Promo!"}</span>
                <i aria-hidden="true" />
              </div>
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
                <div className="promo-artwork-scroll">
                  <img
                    src={currentPromo.artwork}
                    alt={`${currentPromo.title} promo artwork`}
                  />
                </div>
                <button className="faq-link" onClick={() => setView("faq")} type="button">
                  {isIndonesian ? "LIHAT FAQ" : "VIEW FAQ"}
                </button>
              </div>
            ) : (
              <button
                className="promo-placeholder promo-artwork-card"
                onClick={() => viewPromoProducts(currentPromo)}
                type="button"
              >
                <div className="promo-artwork-scroll">
                  <img
                    src="/promos/promo-placeholder.png"
                    alt={`${currentPromo.title} promo artwork`}
                  />
                </div>
              </button>
            )}
          </div>
        ) : null}

        {view === "faq" ? (
          <div className="faq-screen">
            <header className="faq-header">
              <button onClick={() => setView("promo")} type="button">Back</button>
              <span>TIMEPHORIA BTS GIVEAWAY</span>
              <h2>FAQ</h2>
            </header>
            <div className="faq-list">
              {(isIndonesian ? faqItems : faqItemsEnglish).map(([question, answer], index) => (
                <details key={question} open={index === 0}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                  {index === 4 ? (
                    <button
                      className="store-directory-link"
                      onClick={() => {
                        setStoreStatus("loading");
                        setView("stores");
                      }}
                      type="button"
                    >
                      {isIndonesian ? "LIHAT 314 TOKO" : "VIEW 314 STORES"}
                    </button>
                  ) : null}
                </details>
              ))}
            </div>
          </div>
        ) : null}

        {view === "stores" ? (
          <div className="stores-screen">
            <header className="stores-header">
              <button onClick={() => setView("faq")} type="button">Back</button>
              <span>TIMEPHORIA BTS GIVEAWAY</span>
              <h2>{isIndonesian ? "TOKO TERSEDIA" : "AVAILABLE STORES"}</h2>
              <p>
                {isIndonesian
                  ? "Cari toko tempat promo Timephoria ini berlaku."
                  : "Find a store where this Timephoria promotion is active."}
              </p>
            </header>

            <div className="store-tools">
              <input
                aria-label={isIndonesian ? "Cari nama toko" : "Search store name"}
                onChange={(event) => setStoreQuery(event.target.value)}
                placeholder={isIndonesian ? "Cari nama toko..." : "Search store name..."}
                type="search"
                value={storeQuery}
              />
              <select
                aria-label={isIndonesian ? "Pilih wilayah" : "Choose region"}
                onChange={(event) => setStoreRegion(event.target.value)}
                value={storeRegion}
              >
                {storeRegions.map((region) => (
                  <option key={region} value={region}>
                    {region === "All" && isIndonesian ? "Semua wilayah" : region}
                  </option>
                ))}
              </select>
            </div>

            <div className="store-result-count" aria-live="polite">
              {storeStatus === "loading"
                ? (isIndonesian ? "Memuat daftar toko..." : "Loading stores...")
                : `${visibleStores.length} ${isIndonesian ? "toko" : "stores"}`}
            </div>

            {storeStatus === "error" ? (
              <div className="store-empty">
                {isIndonesian ? "Daftar toko belum dapat dimuat." : "The store directory could not be loaded."}
                <button onClick={() => setStoreStatus("loading")} type="button">
                  {isIndonesian ? "COBA LAGI" : "TRY AGAIN"}
                </button>
              </div>
            ) : (
              <div className="store-list">
                {visibleStores.map((store, index) => (
                  <article key={`${store.name}-${store.region}-${index}`}>
                    <strong>{store.name}</strong>
                    <span>{store.region}</span>
                  </article>
                ))}
                {storeStatus !== "loading" && visibleStores.length === 0 ? (
                  <div className="store-empty">
                    {isIndonesian ? "Toko tidak ditemukan." : "No stores found."}
                  </div>
                ) : null}
              </div>
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
              <p>{isIndonesian ? "Temukan warna, tekstur, dan hasil akhir Timephoria untuk setiap tampilan." : category.intro}</p>
            </header>

            <div className="section-title">
              <i />
              <span>{isIndonesian ? "PILIH HASIL AKHIR" : category.headline}</span>
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
                  <span>{isIndonesian ? finishTranslations[item] : item}</span>
                  <small>{isIndonesian ? "Lihat produk" : "Tap to view products"}</small>
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
              <h2>{finish === "All" ? (isIndonesian ? "PILIH PRODUK" : category.headline) : (isIndonesian ? finishTranslations[finish] : finish)}</h2>
              <p>{isIndonesian ? "Temukan produk Timephoria untuk melengkapi setiap tampilan." : category.intro}</p>
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
                {isIndonesian ? "Semua" : "All"}
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
                  {isIndonesian ? finishTranslations[item] : item}
                </button>
              ))}
            </div>

            <div className="product-list">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product.name}
                  product={product}
                  language={language}
                  onTryOn={product.category === "lips" ? setActiveTryOnProduct : undefined}
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
            onClick={() => {
              setActiveTryOnProduct(null);
              setView("home");
              setShowMegaPromo(true);
            }}
            aria-label="Back to home"
            type="button"
          >
            Back to Home
          </button>
          {view !== "home" ? (
            <button
              aria-label="Switch language"
              className="language-toggle footer-language-toggle"
              onClick={toggleLanguage}
              type="button"
            >
              <span className={language === "en" ? "active" : ""}>EN</span>
              <span className={language === "id" ? "active" : ""}>ID</span>
            </button>
          ) : <span className="footer-control-spacer" aria-hidden="true" />}
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
