import type { CategoryKey, Language, Promo } from "../catalog/types";

type UiCopy = {
  all: string;
  allRegions: string;
  appLabel: string;
  artworkAlt: string;
  availableStores: string;
  back: string;
  backHome: string;
  brandDescription: string;
  brandLabel: string;
  brandTagline: string;
  categoryIntro: string;
  chooseFinish: string;
  chooseProduct: string;
  chooseRegion: string;
  closePromo: string;
  disclaimer: string;
  faq: string;
  giveawayTitle: string;
  joinNow: string;
  loading: string;
  loadingStores: string;
  navLabel: string;
  noStores: string;
  otherPromos: string;
  productFilters: string;
  productsIntro: string;
  promoSelector: string;
  promoSlides: string;
  retry: string;
  searchStore: string;
  searchStorePlaceholder: string;
  storeError: string;
  storeIntro: string;
  storeUnit: string;
  terms: string;
  translate: string;
  translateLabel: string;
  viewFaq: string;
  viewProducts: string;
  viewPromoDetails: string;
};

export const uiCopy: Record<Language, UiCopy> = {
  id: {
    all: "Semua",
    allRegions: "Semua wilayah",
    appLabel: "Aplikasi web Timephoria",
    artworkAlt: "materi promo",
    availableStores: "TOKO TERSEDIA",
    back: "Kembali",
    backHome: "Kembali ke Beranda",
    brandDescription: "Dikembangkan dengan teknologi mutakhir dalam semesta kecantikan masa depan, berdasarkan materi edukasi produk Timephoria.",
    brandLabel: "Kisah merek Timephoria",
    brandTagline: "Kecantikan tanpa batas",
    categoryIntro: "Temukan warna, tekstur, dan hasil akhir Timephoria untuk setiap tampilan.",
    chooseFinish: "PILIH HASIL AKHIR",
    chooseProduct: "PILIH PRODUK",
    chooseRegion: "Pilih wilayah",
    closePromo: "Tutup pop-up promo",
    disclaimer: "Disclaimer",
    faq: "FAQ",
    giveawayTitle: "GIVEAWAY TIMEPHORIA SEOUL & BANGKOK",
    joinNow: "KLIK UNTUK IKUTAN",
    loading: "MEMUAT ....",
    loadingStores: "Memuat daftar toko...",
    navLabel: "Pintasan kategori",
    noStores: "Toko tidak ditemukan.",
    otherPromos: "Scroll dan lihat promo lainnya",
    productFilters: "Filter produk",
    productsIntro: "Temukan produk Timephoria untuk melengkapi setiap tampilan.",
    promoSelector: "Pilihan promo",
    promoSlides: "Slide promo",
    retry: "COBA LAGI",
    searchStore: "Cari nama toko",
    searchStorePlaceholder: "Cari nama toko...",
    storeError: "Daftar toko belum dapat dimuat.",
    storeIntro: "Cari toko tempat promo Timephoria ini berlaku.",
    storeUnit: "toko",
    terms: "Syarat & Ketentuan",
    translate: "Terjemahan",
    translateLabel: "Pilih bahasa",
    viewFaq: "LIHAT FAQ",
    viewProducts: "Lihat produk",
    viewPromoDetails: "Ketuk untuk melihat detail",
  },
  en: {
    all: "All",
    allRegions: "All regions",
    appLabel: "Timephoria web app",
    artworkAlt: "promo artwork",
    availableStores: "AVAILABLE STORES",
    back: "Back",
    backHome: "Back to Home",
    brandDescription: "Developed with advanced technology in a future-facing beauty universe, based on Timephoria product education materials.",
    brandLabel: "Timephoria brand story",
    brandTagline: "Beauty beyond limits",
    categoryIntro: "Discover Timephoria color, texture, and finishes for every look.",
    chooseFinish: "CHOOSE A FINISH",
    chooseProduct: "CHOOSE A PRODUCT",
    chooseRegion: "Choose region",
    closePromo: "Close promo popup",
    disclaimer: "Disclaimer",
    faq: "FAQ",
    giveawayTitle: "TIMEPHORIA SEOUL & BANGKOK GIVEAWAY",
    joinNow: "JOIN NOW",
    loading: "LOADING ....",
    loadingStores: "Loading stores...",
    navLabel: "Category shortcuts",
    noStores: "No stores found.",
    otherPromos: "Scroll and tap to see other promos",
    productFilters: "Product filters",
    productsIntro: "Discover Timephoria products to complete every look.",
    promoSelector: "Promo selector",
    promoSlides: "Promo slides",
    retry: "TRY AGAIN",
    searchStore: "Search store name",
    searchStorePlaceholder: "Search store name...",
    storeError: "The store directory could not be loaded.",
    storeIntro: "Find a store where this Timephoria promotion is active.",
    storeUnit: "stores",
    terms: "Terms & Conditions",
    translate: "Translate",
    translateLabel: "Choose language",
    viewFaq: "VIEW FAQ",
    viewProducts: "Tap to view products",
    viewPromoDetails: "Tap to see details",
  },
  es: {
    all: "Todos",
    allRegions: "Todas las regiones",
    appLabel: "Aplicación web de Timephoria",
    artworkAlt: "material promocional",
    availableStores: "TIENDAS DISPONIBLES",
    back: "Volver",
    backHome: "Volver al inicio",
    brandDescription: "Desarrollado con tecnología avanzada en un universo de belleza enfocado en el futuro, a partir de los materiales educativos de Timephoria.",
    brandLabel: "Historia de la marca Timephoria",
    brandTagline: "Belleza sin límites",
    categoryIntro: "Descubre los colores, las texturas y los acabados de Timephoria para cada look.",
    chooseFinish: "ELIGE UN ACABADO",
    chooseProduct: "ELIGE UN PRODUCTO",
    chooseRegion: "Elige una región",
    closePromo: "Cerrar promoción",
    disclaimer: "Aviso importante",
    faq: "PREGUNTAS FRECUENTES",
    giveawayTitle: "SORTEO TIMEPHORIA SEÚL Y BANGKOK",
    joinNow: "PARTICIPA AHORA",
    loading: "CARGANDO ....",
    loadingStores: "Cargando tiendas...",
    navLabel: "Accesos a categorías",
    noStores: "No encontramos tiendas.",
    otherPromos: "Desliza y toca para ver otras promociones",
    productFilters: "Filtros de productos",
    productsIntro: "Descubre los productos Timephoria para completar cada look.",
    promoSelector: "Selector de promociones",
    promoSlides: "Promociones",
    retry: "INTENTAR DE NUEVO",
    searchStore: "Buscar tienda",
    searchStorePlaceholder: "Buscar tienda...",
    storeError: "No se pudo cargar el directorio de tiendas.",
    storeIntro: "Encuentra una tienda donde esté vigente esta promoción de Timephoria.",
    storeUnit: "tiendas",
    terms: "Términos y condiciones",
    translate: "Traducir",
    translateLabel: "Elegir idioma",
    viewFaq: "VER PREGUNTAS",
    viewProducts: "Toca para ver productos",
    viewPromoDetails: "Toca para ver los detalles",
  },
};

export const categoryCopy: Record<Language, Record<CategoryKey, {
  eyebrow: string;
  headline: string;
  intro: string;
  label: string;
}>> = {
  id: {
    lips: { label: "Bibir", eyebrow: "Semesta bibir", headline: "Temukan hasil akhir favoritmu", intro: uiCopy.id.categoryIntro },
    eyes: { label: "Mata", eyebrow: "Semesta mata", headline: "Bentuk, angkat, dan pancarkan", intro: uiCopy.id.categoryIntro },
    face: { label: "Wajah", eyebrow: "Dimensi wajah", headline: "Warna, kontur, dan base", intro: uiCopy.id.categoryIntro },
  },
  en: {
    lips: { label: "Lips", eyebrow: "Lip universe", headline: "Find your perfect finish", intro: "High pigment color, glossy shine, blurred velvet texture, and transfer-proof wear for every lip mood." },
    eyes: { label: "Eyes", eyebrow: "Eye orbit", headline: "Define, lift, and illuminate", intro: "Waterproof definition, effortless brow shaping, luminous jelly shine, and long-lasting eye color." },
    face: { label: "Face", eyebrow: "Face dimension", headline: "Color, contour, base", intro: "Complexion, cheek color, contour, and blur products for every face step." },
  },
  es: {
    lips: { label: "Labios", eyebrow: "Universo de labios", headline: "Encuentra tu acabado ideal", intro: "Color de alta pigmentación, brillo intenso, textura aterciopelada difuminada y larga duración para cada estilo de labios." },
    eyes: { label: "Ojos", eyebrow: "Universo de la mirada", headline: "Define, eleva e ilumina", intro: "Definición resistente al agua, cejas fáciles de moldear, brillo tipo jelly y color de larga duración." },
    face: { label: "Rostro", eyebrow: "Dimensión del rostro", headline: "Color, contorno y base", intro: "Productos para la piel, las mejillas, el contorno y el difuminado en cada paso de tu rutina." },
  },
};

const promoCopySpanish: Record<string, Partial<Promo>> = {
  "CUMA BELI 1 TIMEPHORIA BISA JALAN-JALAN KE SEOUL & BANGKOK!": {
    title: "¡COMPRA 1 PRODUCTO TIMEPHORIA Y PODRÍAS VIAJAR A SEÚL O BANGKOK!",
    selectorLabel: "¡Giveaway Timephoria!",
    kicker: "Sorteo Seúl y Bangkok",
    detail: "PARTICIPA EN EL SORTEO Y GANA PREMIOS CON UN VALOR TOTAL DE CIENTOS DE MILLONES DE RUPIAS.",
    discount: "GANA EL PREMIO",
    registrationLabel: "PARTICIPA AHORA",
  },
  "Complexion Match": {
    title: "Tu tono ideal",
    kicker: "Promoción para encontrar tu tono",
    detail: "Compra un cushion o polvo y aprovecha una oferta especial con fijador de maquillaje.",
    discount: "PAQUETE ESPECIAL",
  },
  "Eye Stay Set": {
    title: "Set mirada perfecta",
    kicker: "Selección resistente al agua",
    detail: "Precio especial en tu rutina de cejas y delineado después de tocar aquí.",
    discount: "PRECIO DE SET",
  },
  "Face Dimension": {
    title: "Dimensión del rostro",
    kicker: "Contorno y mejillas",
    detail: "Ahorra en Pandora Cheek y los realzadores de rostro Eclipse Spark.",
    discount: "AHORRA 15%",
  },
};

export function localizePromo(promo: Promo, language: Language): Promo {
  if (language !== "es") return promo;
  return { ...promo, ...promoCopySpanish[promo.title] };
}

export const faqItemsSpanish = [
  ["¿Cómo participo en el Giveaway Time Phoria?", "Compra al menos un producto Time Phoria en una tienda participante, escanea el código QR del material promocional, llena todos los datos del formulario de Google, sube una foto clara y legible del recibo de compra y envía el formulario para obtener una oportunidad en el sorteo."],
  ["¿Cuándo se realiza el programa?", "El programa estará vigente de julio a octubre de 2026. Las personas ganadoras se anunciarán en noviembre de 2026 a través de la cuenta oficial de Instagram de Time Phoria."],
  ["¿Quién puede participar?", "El programa está abierto a todas las personas con ciudadanía indonesia. Para los premios de viajes internacionales, la persona ganadora deberá tener al menos 17 años."],
  ["¿Dónde es válida la promoción?", "La promoción solo es válida para compras en tiendas físicas que vendan productos Time Phoria y exhiban el material del Giveaway Time Phoria. No aplica en cadenas de Modern Trade (MT), como Guardian, Watsons, Dandan y otras tiendas MT."],
  ["¿Cuál es la compra mínima?", "La compra mínima es de un producto Time Phoria."],
  ["¿Comprar más productos aumenta mis oportunidades de ganar?", "Sí. Cada producto Time Phoria comprado equivale a una oportunidad en el sorteo. Por ejemplo: dos productos equivalen a dos oportunidades y cinco productos, a cinco oportunidades."],
  ["¿Puedo usar el mismo recibo más de una vez?", "No. Cada recibo solo puede utilizarse para un registro."],
  ["¿Qué datos debo proporcionar?", "Debes completar toda la información solicitada en el formulario de Google y subir una foto clara del recibo. Verifica tus datos antes de enviarlos, ya que no podrán modificarse después."],
  ["¿Qué pasa si la foto de mi recibo no es clara?", "Los recibos borrosos, dañados, incompletos, editados o ilegibles pueden considerarse inválidos. Conserva el recibo original hasta que termine el programa, pues podría solicitarse durante la verificación."],
  ["¿Cómo se elige a las personas ganadoras?", "Todas las personas ganadoras se elegirán al azar mediante un sorteo."],
  ["¿Cómo se anunciarán los resultados?", "Las personas ganadoras se anunciarán en la cuenta oficial de Instagram de Time Phoria y el equipo oficial se pondrá en contacto para verificar sus datos. Deberán confirmar en un máximo de cuatro días naturales. Si no responden a tiempo, perderán el premio y la organización podrá realizar un nuevo sorteo."],
  ["¿Cuáles son los premios principales?", "Los premios incluyen dos viajes a Seúl, tres viajes a Bangkok, oro, relojes inteligentes y vales de compra de Alfamart. La organización anunciará los tipos, especificaciones y valores de determinados premios."],
  ["¿Qué incluye el premio de viaje?", "Cada persona ganadora recibe un paquete de viaje individual que incluye vuelo redondo desde Yakarta al destino, hotel, alimentos según el itinerario, visa si se requiere y otros servicios incluidos en el paquete del socio de viajes."],
  ["¿Qué no incluye el premio de viaje?", "No incluye el transporte entre la ciudad de residencia y Yakarta, dinero para gastos, compras personales ni costos ajenos al paquete turístico."],
  ["¿Qué pasa si vivo fuera de Yakarta?", "Las personas que vivan fuera de Yakarta deberán cubrir sus propios gastos de traslado a Yakarta y de regreso a su ciudad."],
  ["¿Necesito pasaporte?", "Sí. Las personas ganadoras deberán tener un pasaporte vigente que cumpla los requisitos de viaje internacional. Tramitarlo o renovarlo será responsabilidad de cada persona."],
  ["¿Cuándo serán los viajes?", "Los viajes están previstos para enero o febrero de 2027. Las fechas dependerán de la disponibilidad del socio de viajes y del acuerdo con las personas ganadoras."],
  ["¿Puedo llevar acompañante?", "El premio de viaje es para una sola persona y no incluye acompañante. Cualquier costo adicional para llevar a alguien, conforme a las reglas del socio de viajes, será responsabilidad de la persona ganadora."],
  ["¿Puedo transferir el premio de viaje?", "Sí. El premio puede transferirse a otra persona si se informa a la organización antes de iniciar los preparativos de salida."],
  ["¿Qué pasa si no puedo viajar?", "La persona ganadora podrá elegir un premio en efectivo equivalente al valor del paquete definido por Time Phoria. Los impuestos correspondientes serán responsabilidad de la persona ganadora conforme a la normativa aplicable."],
  ["¿Los premios pueden cambiarse por dinero?", "Los premios no pueden cambiarse ni canjearse por efectivo, salvo el premio de viaje conforme a lo indicado en la pregunta 20."],
  ["¿Quién paga los impuestos del premio?", "Cada persona ganadora será responsable de los impuestos de su premio conforme a la normativa aplicable."],
  ["¿Qué necesito para la verificación?", "Deberás presentar una identificación oficial vigente, datos que coincidan con los del registro y el recibo original de compra si la organización lo solicita."],
];

export const termsItemsSpanish = [
  "El programa estará vigente de julio a octubre de 2026.",
  "Solo aplica para compras físicas de productos Time Phoria en tiendas participantes que exhiban el material promocional del Giveaway Time Phoria.",
  "Cada producto Time Phoria comprado equivale a una oportunidad en el sorteo.",
  "Cada recibo de compra solo puede utilizarse para un registro.",
  "Las personas participantes deberán proporcionar información correcta y completa en el formulario de Google.",
  "La organización podrá verificar los datos de participación, los comprobantes de compra y la identidad de las personas ganadoras.",
  "Se descalificará a quien use un recibo falso o editado; proporcione información incorrecta; use una cuenta de Instagram falsa o inválida; envíe spam o interfiera con el programa; no pueda ser contactado o no confirme en cuatro días naturales; o no presente los documentos requeridos durante la verificación.",
  "Las decisiones de la organización durante todo el programa, incluidas la verificación, el sorteo y la selección de ganadores, serán definitivas e inapelables.",
  "Los impuestos de cada premio serán responsabilidad de la persona ganadora conforme a la normativa aplicable.",
  "Quienes ganen un viaje deberán tener pasaporte vigente y cumplir los requisitos de viaje internacional.",
  "El premio de viaje no incluye transporte a Yakarta, dinero para gastos, compras personales ni costos ajenos al paquete turístico.",
  "Si una persona ganadora decide no viajar, la organización podrá entregar efectivo equivalente al valor del paquete. Los impuestos de ese pago serán responsabilidad de la persona ganadora.",
  "El premio de viaje podrá transferirse a otra persona si se informa a la organización antes de la salida.",
  "La organización podrá modificar el calendario, la mecánica o el tipo de premio por otro de valor equivalente cuando existan circunstancias fuera de su control, incluidas modificaciones regulatorias, cancelaciones de viaje, disposiciones gubernamentales u otros casos de fuerza mayor.",
  "Al participar, se entiende que cada persona ha leído, comprendido y aceptado todos los términos y condiciones aplicables.",
];

export const giveawayDisclaimerSpanish = "Ten cuidado con los fraudes que suplanten a Time Phoria. Toda la información oficial del Giveaway Time Phoria se comunica únicamente mediante la cuenta oficial de Instagram y los canales oficiales de Time Phoria. Time Phoria nunca cobra a participantes ni a personas ganadoras por entrar al programa o recibir un premio.";
