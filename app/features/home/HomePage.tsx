"use client";

/* Existing art-directed assets intentionally use CSS-driven raw image crops. */
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useMemo, useState } from "react";
import VirtualLipTryOn from "../../components/VirtualLipTryOn";
import ProductCard from "../catalog/ProductCard";
import {
  finishTranslations,
  productTranslations,
} from "../catalog/product-copy";
import type {
  CategoryKey,
  Language,
  Product,
  Promo,
  SiteView,
} from "../catalog/types";
import { useStoreDirectory } from "../stores/useStoreDirectory";
import { lipTryOnShades } from "../../lip-try-on-shades";

const promos: Promo[] = [
  {
    title: "CUMA BELI 1 TIMEPHORIA BISA JALAN-JALAN KE SEOUL & BANGKOK!",
    selectorLabel: "TIMEPHORIA Giveaway!",
    kicker: "Seoul & Bangkok giveaway",
    detail:
      "IKUTI UNDIANNYA, DAN MENANGKAN HADIAH TOTAL RATUSAN JUTA RUPIAH.",
    category: "lips",
    finish: "GLOSS IT BETTER",
    discount: "GET THE REWARD",
    artwork: "/promos/seoul-bangkok-giveaway.webp",
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
  title: "CUMA BELI 1 TIMEPHORIA BISA JALAN-JALAN KE SEOUL & BANGKOK!",
  detail: "IKUTI UNDIANNYA, DAN MENANGKAN HADIAH TOTAL RATUSAN JUTA RUPIAH.",
};

const faqItems = [
  ["Bagaimana cara mengikuti Giveaway Time Phoria?", "Beli minimal 1 produk Time Phoria di toko yang berpartisipasi, scan QR Code pada materi promosi Giveaway Time Phoria, isi seluruh data pada Google Form, upload foto struk pembelian yang jelas dan masih dapat dibaca, lalu submit formulir untuk mendapatkan kesempatan mengikuti undian."],
  ["Kapan periode program berlangsung?", "Program berlangsung mulai Juli 2026 hingga Oktober 2026. Pengumuman pemenang akan dilakukan pada November 2026 melalui Instagram resmi Time Phoria."],
  ["Siapa saja yang dapat mengikuti program ini?", "Program terbuka bagi seluruh Warga Negara Indonesia (WNI). Khusus hadiah perjalanan ke luar negeri, pemenang harus berusia minimal 17 tahun."],
  ["Di mana program ini berlaku?", "Program hanya berlaku untuk pembelian offline di toko yang menjual produk Time Phoria dan memasang materi promosi Giveaway Time Phoria. Program tidak berlaku untuk pembelian di Modern Trade (MT), seperti Guardian, Watsons, Dandan, dan toko MT lainnya."],
  ["Berapa minimal pembelian?", "Minimal pembelian adalah 1 produk Time Phoria."],
  ["Apakah semakin banyak membeli produk akan menambah kesempatan menang?", "Ya. Setiap pembelian 1 produk Time Phoria mendapatkan 1 kesempatan undian. Contoh: beli 2 produk = 2 kesempatan; beli 5 produk = 5 kesempatan."],
  ["Apakah satu struk dapat digunakan lebih dari satu kali?", "Tidak. Setiap struk hanya dapat digunakan untuk satu kali registrasi."],
  ["Data apa saja yang harus diisi?", "Peserta wajib mengisi seluruh data yang diminta pada Google Form dan mengunggah foto struk pembelian yang jelas. Pastikan seluruh data yang diisi sudah benar karena data yang telah dikirim tidak dapat diubah."],
  ["Bagaimana jika foto struk tidak jelas?", "Struk yang buram, rusak, tidak lengkap, hasil edit, atau tidak dapat dibaca dapat dinyatakan tidak valid. Peserta juga disarankan menyimpan struk asli hingga program berakhir karena penyelenggara dapat meminta struk asli untuk proses verifikasi."],
  ["Bagaimana pemenang dipilih?", "Seluruh pemenang akan dipilih secara acak melalui proses pengundian."],
  ["Bagaimana pengumuman pemenang dilakukan?", "Pemenang akan diumumkan melalui Instagram resmi Time Phoria dan dihubungi oleh tim resmi Time Phoria untuk proses verifikasi. Pemenang wajib memberikan konfirmasi maksimal 4 (empat) hari kalender sejak dihubungi. Apabila tidak memberikan konfirmasi dalam batas waktu tersebut, hadiah dianggap hangus dan penyelenggara berhak melakukan pengundian ulang."],
  ["Apa saja hadiah utama yang tersedia?", "Hadiah utama terdiri dari 2 pemenang Trip Seoul, 3 pemenang Trip Bangkok, emas, smartwatch, dan voucher belanja Alfamart. Jenis, spesifikasi, dan nominal hadiah tertentu akan diumumkan oleh penyelenggara."],
  ["Apa saja yang termasuk dalam hadiah perjalanan?", "Setiap pemenang trip memperoleh 1 paket perjalanan untuk 1 orang (single traveler), mencakup tiket pesawat pulang-pergi Jakarta–tujuan, hotel, makan sesuai itinerary, visa (apabila diperlukan), dan fasilitas lain yang termasuk dalam paket tour dari travel partner."],
  ["Apa saja yang tidak termasuk dalam hadiah perjalanan?", "Hadiah perjalanan tidak mencakup transportasi dari kota domisili menuju Jakarta dan sebaliknya, uang saku, pengeluaran pribadi, belanja pribadi, dan biaya di luar paket tour."],
  ["Bagaimana jika saya tinggal di luar Jakarta?", "Pemenang yang berdomisili di luar Jakarta wajib menanggung sendiri biaya perjalanan menuju Jakarta dan kepulangan ke kota domisili."],
  ["Apakah saya harus memiliki paspor?", "Ya. Pemenang wajib memiliki paspor yang masih berlaku sesuai persyaratan perjalanan internasional. Pembuatan maupun perpanjangan paspor menjadi tanggung jawab pemenang."],
  ["Kapan keberangkatan trip?", "Perjalanan direncanakan berlangsung pada Januari–Februari 2027. Jadwal keberangkatan akan disesuaikan dengan ketersediaan dari travel partner serta kesepakatan dengan pemenang."],
  ["Apakah saya boleh membawa pendamping?", "Hadiah perjalanan hanya berlaku untuk 1 (satu) orang pemenang dan tidak termasuk pendamping. Apabila pemenang ingin membawa pendamping, seluruh biaya tambahan sesuai ketentuan travel partner menjadi tanggung jawab pemenang."],
  ["Apakah hadiah perjalanan dapat dipindahtangankan?", "Ya. Hadiah perjalanan dapat dialihkan kepada pihak lain dengan pemberitahuan kepada penyelenggara sebelum proses keberangkatan."],
  ["Bagaimana jika saya tidak dapat mengikuti perjalanan?", "Pemenang dapat memilih penggantian hadiah berupa uang tunai sebesar nilai paket perjalanan. Pajak atas hadiah uang tunai menjadi tanggung jawab pemenang sesuai ketentuan perpajakan yang berlaku."],
  ["Apakah hadiah dapat diuangkan atau ditukar?", "Seluruh hadiah tidak dapat ditukar maupun diuangkan, kecuali hadiah perjalanan sesuai ketentuan pada FAQ nomor 20."],
  ["Siapa yang menanggung pajak hadiah?", "Seluruh pajak hadiah menjadi tanggung jawab masing-masing pemenang sesuai ketentuan perpajakan yang berlaku."],
  ["Apa yang diperlukan saat proses verifikasi?", "Pemenang wajib menunjukkan KTP atau kartu identitas resmi yang masih berlaku, data yang sesuai dengan informasi saat registrasi, dan struk pembelian asli apabila diminta oleh penyelenggara."],
];

const faqItemsEnglish = [
  ["How do I join the Time Phoria Giveaway?", "Buy at least one Time Phoria product at a participating store, scan the QR code on the promotional material, complete the Google Form, upload a clear and readable receipt photo, and submit the form to receive an entry in the draw."],
  ["When does the program run?", "The program runs from July through October 2026. Winners will be announced in November 2026 through Time Phoria's official Instagram account."],
  ["Who can participate?", "The program is open to all Indonesian citizens. Winners of international travel prizes must be at least 17 years old."],
  ["Where is the program valid?", "The program is valid only for offline purchases at stores that sell Time Phoria products and display the Time Phoria Giveaway promotional material. It does not apply to Modern Trade retailers such as Guardian, Watsons, Dandan, or other MT stores."],
  ["What is the minimum purchase?", "The minimum purchase is one Time Phoria product."],
  ["Does buying more products increase my chances?", "Yes. Each Time Phoria product purchased earns one draw entry. For example, two products earn two entries and five products earn five entries."],
  ["Can one receipt be used more than once?", "No. Each receipt can only be used for one registration."],
  ["What information must I provide?", "Participants must complete all requested information in the Google Form and upload a clear receipt photo. Check all information carefully because submitted data cannot be changed."],
  ["What if my receipt photo is unclear?", "Blurred, damaged, incomplete, edited, or unreadable receipts may be declared invalid. Keep the original receipt until the program ends because it may be requested for verification."],
  ["How are winners selected?", "All winners will be selected at random through a prize draw."],
  ["How will winners be announced?", "Winners will be announced through Time Phoria's official Instagram account and contacted by the official Time Phoria team for verification. Winners must confirm within four calendar days of being contacted. Otherwise, the prize will be forfeited and the organizer may redraw it."],
  ["What main prizes are available?", "The prizes include two Seoul trips, three Bangkok trips, gold, smartwatches, and Alfamart shopping vouchers. Certain prize types, specifications, and values will be announced by the organizer."],
  ["What is included in the travel prize?", "Each trip winner receives one travel package for one person, including round-trip airfare from Jakarta to the destination, hotel, meals according to the itinerary, a visa if required, and other facilities included in the travel partner's tour package."],
  ["What is not included in the travel prize?", "The travel prize does not include transportation between the winner's city and Jakarta, spending money, personal expenses, personal shopping, or costs outside the tour package."],
  ["What if I live outside Jakarta?", "Winners living outside Jakarta are responsible for their own travel costs to Jakarta and back to their city of residence."],
  ["Do I need a passport?", "Yes. Winners must hold a passport that remains valid under international travel requirements. Obtaining or renewing the passport is the winner's responsibility."],
  ["When will the trips depart?", "Travel is planned for January–February 2027. Departure dates will depend on the travel partner's availability and agreement with the winners."],
  ["May I bring a companion?", "The travel prize is for one winner and does not include a companion. Any additional costs for a companion under the travel partner's rules are the winner's responsibility."],
  ["Can the travel prize be transferred?", "Yes. The travel prize may be transferred to another person by notifying the organizer before departure arrangements are processed."],
  ["What if I cannot take the trip?", "The winner may choose a cash replacement equal to the travel package value. Taxes on the cash prize are the winner's responsibility under applicable tax regulations."],
  ["Can prizes be exchanged or redeemed for cash?", "Prizes cannot be exchanged or redeemed for cash, except for travel prizes under FAQ number 20."],
  ["Who pays prize taxes?", "All prize taxes are the responsibility of each winner under applicable tax regulations."],
  ["What is required during verification?", "Winners must present a valid national ID or other official identification, information matching their registration, and the original purchase receipt if requested by the organizer."],
];

const termsItems = [
  "Program berlangsung pada periode Juli 2026–Oktober 2026.",
  "Program hanya berlaku untuk pembelian produk Time Phoria secara offline di toko yang berpartisipasi dan memasang materi promosi Giveaway Time Phoria.",
  "Setiap pembelian 1 produk Time Phoria memperoleh 1 kesempatan undian.",
  "Setiap struk pembelian hanya dapat digunakan untuk 1 kali registrasi.",
  "Peserta wajib mengisi data dengan benar dan lengkap pada Google Form.",
  "Penyelenggara berhak melakukan verifikasi terhadap seluruh data peserta, bukti pembelian, maupun identitas pemenang.",
  "Peserta akan didiskualifikasi apabila menggunakan struk palsu; mengubah atau mengedit struk; memberikan data yang tidak benar; menggunakan akun Instagram palsu atau tidak valid; melakukan spam atau tindakan yang mengganggu program; tidak dapat dihubungi atau tidak memberikan konfirmasi dalam 4 hari kalender; atau tidak dapat menunjukkan dokumen pendukung saat verifikasi.",
  "Keputusan penyelenggara dalam seluruh proses program, termasuk verifikasi, pengundian, dan penetapan pemenang, bersifat final dan tidak dapat diganggu gugat.",
  "Seluruh pajak hadiah menjadi tanggung jawab pemenang sesuai ketentuan perpajakan yang berlaku.",
  "Pemenang hadiah perjalanan wajib memiliki paspor yang masih berlaku dan memenuhi persyaratan perjalanan internasional.",
  "Hadiah perjalanan tidak mencakup biaya transportasi menuju Jakarta, uang saku, pengeluaran pribadi, maupun biaya lain di luar paket tour.",
  "Apabila pemenang memilih untuk tidak mengikuti perjalanan, penyelenggara dapat memberikan penggantian berupa uang tunai sebesar nilai paket perjalanan. Pajak atas hadiah uang tunai menjadi tanggung jawab pemenang.",
  "Hadiah perjalanan dapat dialihkan kepada pihak lain dengan pemberitahuan kepada penyelenggara sebelum keberangkatan.",
  "Penyelenggara berhak mengubah jadwal, mekanisme program, atau jenis hadiah dengan nilai yang setara apabila terjadi keadaan di luar kendali penyelenggara (force majeure), termasuk perubahan regulasi, pembatalan perjalanan, kebijakan pemerintah, atau keadaan kahar lainnya.",
  "Dengan mengikuti program ini, peserta dianggap telah membaca, memahami, dan menyetujui seluruh syarat dan ketentuan yang berlaku.",
];

const termsItemsEnglish = [
  "The program runs from July through October 2026.",
  "The program is valid only for offline purchases of Time Phoria products at participating stores displaying the Time Phoria Giveaway promotional material.",
  "Each Time Phoria product purchased earns one draw entry.",
  "Each purchase receipt may only be used for one registration.",
  "Participants must provide correct and complete information in the Google Form.",
  "The organizer may verify participant data, proof of purchase, and winner identities.",
  "Participants will be disqualified for using a fake or edited receipt; providing false information; using a fake or invalid Instagram account; spamming or disrupting the program; being unreachable or failing to confirm within four calendar days; or failing to present required verification documents.",
  "The organizer's decisions throughout the program, including verification, drawing, and winner selection, are final and cannot be contested.",
  "All prize taxes are the winner's responsibility under applicable tax regulations.",
  "Travel-prize winners must hold a valid passport and meet international travel requirements.",
  "The travel prize excludes transportation to Jakarta, spending money, personal expenses, and costs outside the tour package.",
  "If a winner chooses not to travel, the organizer may provide cash equal to the travel package value. Taxes on the cash prize are the winner's responsibility.",
  "The travel prize may be transferred to another person by notifying the organizer before departure.",
  "The organizer may change the schedule, program mechanism, or prize type for another of equal value due to circumstances beyond its control (force majeure), including regulatory changes, travel cancellation, government policy, or other force majeure events.",
  "By participating, participants are deemed to have read, understood, and accepted all applicable terms and conditions.",
];

const giveawayDisclaimer = "Hati-hati terhadap penipuan yang mengatasnamakan Time Phoria. Seluruh informasi resmi mengenai program Giveaway Time Phoria hanya disampaikan melalui akun Instagram resmi Time Phoria dan kanal komunikasi resmi Time Phoria. Time Phoria tidak pernah memungut biaya apa pun kepada peserta maupun pemenang untuk mengikuti program atau menerima hadiah.";

const giveawayDisclaimerEnglish = "Beware of fraud claiming to represent Time Phoria. Official information about the Time Phoria Giveaway is communicated only through Time Phoria's official Instagram account and official communication channels. Time Phoria never charges participants or winners to join the program or receive a prize.";

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

export default function Home() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>("lips");
  const [view, setView] = useState<SiteView>("home");
  const [language, setLanguage] = useState<Language>("en");
  const [finish, setFinish] = useState("All");
  const [promoIndex, setPromoIndex] = useState(0);
  const [activePromo, setActivePromo] = useState<Promo | null>(null);
  const [activeTryOnProduct, setActiveTryOnProduct] = useState<Product | null>(null);
  const [showMegaPromo, setShowMegaPromo] = useState(true);
  const [loaderState, setLoaderState] = useState<"loading" | "leaving" | "done">(
    "loading",
  );
  const closeTryOn = useCallback(() => setActiveTryOnProduct(null), []);
  const {
    query: storeQuery,
    region: storeRegion,
    regions: storeRegions,
    setQuery: setStoreQuery,
    setRegion: setStoreRegion,
    setStatus: setStoreStatus,
    status: storeStatus,
    visibleStores,
  } = useStoreDirectory(view);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPromoIndex((current) => (current + 1) % promos.length);
    }, 2000);

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
  const megaPromo = promos[0];
  const isIndonesian = language === "id";
  const translatedPromo = currentPromo === promos[0] && isIndonesian
    ? { ...currentPromo, ...promoTranslation }
    : currentPromo;
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
              <strong>{megaPromo.title}</strong>
              <em>{megaPromo.detail}</em>
              <div className="mega-promo-actions">
                <a
                  href={megaPromo.registrationUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  KLIK UNTUK IKUTAN
                </a>
                <button
                  onClick={() => {
                    setShowMegaPromo(false);
                    setView("faq");
                  }}
                  type="button"
                >
                  VIEW FAQ
                </button>
              </div>
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
            onClose={closeTryOn}
            productFinish={activeTryOnProduct.finish}
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
                <strong>{promos[promoIndex].title}</strong>
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
                  {promo.selectorLabel ?? promo.title}
                </button>
              ))}
            </div>

            {currentPromo.registrationUrl && currentPromo.artwork ? (
              <div className="promo-placeholder featured-promo-artwork">
                <div className="promo-artwork-scroll">
                  <img
                    src={currentPromo.artwork}
                    alt={`${currentPromo.title} promo artwork`}
                  />
                </div>
                <button className="faq-link" onClick={() => setView("faq")} type="button">
                  VIEW FAQ
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
              <span>TIMEPHORIA SEOUL &amp; BANGKOK GIVEAWAY</span>
              <h2>FAQ</h2>
            </header>
            <div className="faq-list">
              {(isIndonesian ? faqItems : faqItemsEnglish).map(([question, answer], index) => (
                <details key={question} open={index === 0}>
                  <summary>{question}</summary>
                  <p>{answer}</p>
                </details>
              ))}
            </div>
            <section className="terms-section">
              <h3>{isIndonesian ? "Syarat & Ketentuan" : "Terms & Conditions"}</h3>
              <ol>
                {(isIndonesian ? termsItems : termsItemsEnglish).map((term) => (
                  <li key={term}>{term}</li>
                ))}
              </ol>
              <aside className="giveaway-disclaimer">
                <strong>{isIndonesian ? "Disclaimer" : "Disclaimer"}</strong>
                <p>{isIndonesian ? giveawayDisclaimer : giveawayDisclaimerEnglish}</p>
              </aside>
            </section>
          </div>
        ) : null}

        {view === "stores" ? (
          <div className="stores-screen">
            <header className="stores-header">
              <button onClick={() => setView("faq")} type="button">Back</button>
              <span>TIMEPHORIA SEOUL &amp; BANGKOK GIVEAWAY</span>
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
                  claims={
                    isIndonesian
                      ? productTranslations[product.name]?.claims ??
                        product.claims
                      : product.claims
                  }
                  description={
                    isIndonesian
                      ? productTranslations[product.name]?.description ??
                        product.description
                      : product.description
                  }
                  finishLabel={
                    isIndonesian
                      ? finishTranslations[product.finish]
                      : product.finish
                  }
                  key={product.name}
                  language={language}
                  onTryOn={
                    product.category === "lips" &&
                    lipTryOnShades[product.name]?.length
                      ? setActiveTryOnProduct
                      : undefined
                  }
                  product={product}
                  promoLabel={
                    activePromo &&
                    product.category === activePromo.category &&
                    productGroup(product) === activePromo.finish
                      ? activePromo.discount
                      : undefined
                  }
                  swatchSlides={productSwatches(product)}
                  thumbnail={productThumbnail(product)}
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
