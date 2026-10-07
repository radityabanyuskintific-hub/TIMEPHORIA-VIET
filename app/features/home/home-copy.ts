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
  viewStores: string;
};

export const uiCopy: Record<Language, UiCopy> = {
  vi: {
    all: "Tất cả",
    allRegions: "Tất cả khu vực",
    appLabel: "Trang web Timephoria",
    artworkAlt: "hình ảnh chương trình khuyến mãi",
    availableStores: "CỬA HÀNG ÁP DỤNG",
    back: "Quay lại",
    backHome: "Về trang chủ",
    brandDescription: "Khám phá sản phẩm Timephoria trong thế giới làm đẹp lấy cảm hứng từ tương lai.",
    brandLabel: "Câu chuyện thương hiệu Timephoria",
    brandTagline: "Vẻ đẹp không giới hạn",
    categoryIntro: "Khám phá màu sắc, kết cấu và hiệu ứng trang điểm Timephoria cho từng phong cách.",
    chooseFinish: "CHỌN HIỆU ỨNG",
    chooseProduct: "CHỌN SẢN PHẨM",
    chooseRegion: "Chọn khu vực",
    closePromo: "Đóng thông tin khuyến mãi",
    disclaimer: "Lưu ý",
    faq: "Câu hỏi thường gặp",
    giveawayTitle: "CHƯƠNG TRÌNH TẶNG QUÀ TIMEPHORIA SEOUL & BANGKOK",
    joinNow: "THAM GIA NGAY",
    loading: "ĐANG TẢI...",
    loadingStores: "Đang tải danh sách cửa hàng...",
    navLabel: "Danh mục sản phẩm",
    noStores: "Không tìm thấy cửa hàng.",
    otherPromos: "Cuộn để xem các chương trình khác",
    productFilters: "Bộ lọc sản phẩm",
    productsIntro: "Khám phá sản phẩm Timephoria cho phong cách của bạn.",
    promoSelector: "Chọn chương trình khuyến mãi",
    promoSlides: "Các chương trình khuyến mãi",
    retry: "THỬ LẠI",
    searchStore: "Tìm tên cửa hàng",
    searchStorePlaceholder: "Tìm tên cửa hàng...",
    storeError: "Không thể tải danh sách cửa hàng.",
    storeIntro: "Tìm cửa hàng áp dụng chương trình Timephoria này.",
    storeUnit: "cửa hàng",
    terms: "Điều khoản và điều kiện",
    translate: "Ngôn ngữ",
    translateLabel: "Chọn ngôn ngữ",
    viewFaq: "XEM CÂU HỎI THƯỜNG GẶP",
    viewProducts: "Xem sản phẩm",
    viewPromoDetails: "Chạm để xem chi tiết",
    viewStores: "XEM CỬA HÀNG ÁP DỤNG",
  },
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
    viewStores: "LIHAT TOKO PESERTA",
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
    viewStores: "VIEW PARTICIPATING STORES",
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
    viewStores: "VER TIENDAS PARTICIPANTES",
  },
  "zh-tw": {
    all: "全部",
    allRegions: "所有地區",
    appLabel: "Timephoria 網站應用程式",
    artworkAlt: "活動宣傳圖",
    availableStores: "適用門市",
    back: "返回",
    backHome: "回到首頁",
    brandDescription: "結合先進科技與前瞻美妝概念，依據 Timephoria 產品資訊打造沉浸式美妝體驗。",
    brandLabel: "Timephoria 品牌故事",
    brandTagline: "美，無界限",
    categoryIntro: "探索 Timephoria 的色彩、質地與妝效，打造每一種理想妝容。",
    chooseFinish: "選擇妝效",
    chooseProduct: "選擇產品",
    chooseRegion: "選擇地區",
    closePromo: "關閉活動視窗",
    disclaimer: "重要提醒",
    faq: "常見問題",
    giveawayTitle: "TIMEPHORIA 首爾與曼谷抽獎活動",
    joinNow: "立即參加",
    loading: "載入中 ....",
    loadingStores: "正在載入門市...",
    navLabel: "產品分類捷徑",
    noStores: "找不到符合條件的門市。",
    otherPromos: "滑動並點選以查看其他活動",
    productFilters: "產品篩選",
    productsIntro: "探索 Timephoria 產品，完成每一種理想妝容。",
    promoSelector: "活動選單",
    promoSlides: "活動輪播",
    retry: "再試一次",
    searchStore: "搜尋門市名稱",
    searchStorePlaceholder: "搜尋門市...",
    storeError: "目前無法載入門市資訊。",
    storeIntro: "尋找適用 Timephoria 此次活動的門市。",
    storeUnit: "家門市",
    terms: "活動條款與細則",
    translate: "語言",
    translateLabel: "選擇語言",
    viewFaq: "查看常見問題",
    viewProducts: "點選查看產品",
    viewPromoDetails: "點選查看詳情",
    viewStores: "查看適用門市",
  },
};

export const categoryCopy: Record<Language, Record<CategoryKey, {
  eyebrow: string;
  headline: string;
  intro: string;
  label: string;
}>> = {
  vi: {
    lips: { label: "Môi", eyebrow: "Thế giới son môi", headline: "Chọn hiệu ứng môi yêu thích", intro: "Từ sắc son đậm đến độ bóng trong trẻo và chất son lì mềm mịn." },
    eyes: { label: "Mắt", eyebrow: "Trang điểm mắt", headline: "Tạo điểm nhấn cho đôi mắt", intro: "Kẻ mắt, định hình chân mày và khám phá những sắc mắt nổi bật." },
    face: { label: "Mặt", eyebrow: "Trang điểm khuôn mặt", headline: "Nền, má hồng và tạo khối", intro: "Hoàn thiện lớp nền, thêm sắc má và tạo đường nét cho khuôn mặt." },
  },
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
  "zh-tw": {
    lips: { label: "唇妝", eyebrow: "唇彩宇宙", headline: "找到你的理想唇妝", intro: "從高顯色、水亮光澤到柔焦絲絨與長效不沾染，滿足每一種唇妝風格。" },
    eyes: { label: "眼妝", eyebrow: "迷人眼界", headline: "勾勒、提亮、聚焦目光", intro: "防水線條、俐落眉型、果凍光澤與長效眼彩，打造有神雙眸。" },
    face: { label: "臉部", eyebrow: "立體輪廓", headline: "底妝、頰彩與修容", intro: "從底妝、頰彩到修容與柔焦，完整每一道臉部彩妝步驟。" },
  },
};

const promoCopyVietnamese: Record<string, Partial<Promo>> = {
  "CUMA BELI 1 TIMEPHORIA BISA JALAN-JALAN KE SEOUL & BANGKOK!": {
    title: "MUA 1 SẢN PHẨM TIMEPHORIA, CÓ CƠ HỘI ĐẾN SEOUL HOẶC BANGKOK!",
    selectorLabel: "Quà tặng Timephoria",
    kicker: "Cơ hội du lịch Seoul & Bangkok",
    detail: "THAM GIA RÚT THĂM VỚI TỔNG GIÁ TRỊ GIẢI THƯỞNG HÀNG TRĂM TRIỆU RUPIAH.",
    discount: "THAM GIA RÚT THĂM",
    registrationLabel: "THAM GIA NGAY",
  },
  "Complexion Match": {
    title: "Chọn màu nền phù hợp",
    kicker: "Ưu đãi sản phẩm nền",
    detail: "Mua phấn nước hoặc phấn nền và nhận ưu đãi khi mua cùng xịt khóa nền.",
    discount: "ƯU ĐÃI COMBO",
  },
  "Eye Stay Set": {
    title: "Bộ trang điểm mắt",
    kicker: "Lựa chọn chống nước",
    detail: "Khám phá giá ưu đãi cho sản phẩm chân mày và kẻ mắt.",
    discount: "GIÁ COMBO",
  },
  "Face Dimension": {
    title: "Tạo nét khuôn mặt",
    kicker: "Tạo khối và má hồng",
    detail: "Ưu đãi dành cho Pandora Cheek và các sản phẩm trang điểm mặt Eclipse Spark.",
    discount: "GIẢM 15%",
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

const promoCopyTraditionalChinese: Record<string, Partial<Promo>> = {
  "CUMA BELI 1 TIMEPHORIA BISA JALAN-JALAN KE SEOUL & BANGKOK!": {
    title: "購買 1 件 TIMEPHORIA，就有機會暢遊首爾或曼谷！",
    selectorLabel: "Timephoria 抽獎活動",
    kicker: "首爾與曼谷旅遊抽獎",
    detail: "立即參加抽獎，總獎項價值高達數億印尼盾。",
    discount: "贏取大獎",
    registrationLabel: "立即參加",
  },
  "Complexion Match": {
    title: "找到你的完美色號",
    kicker: "選色優惠活動",
    detail: "購買氣墊粉餅或粉餅，即享定妝噴霧組合優惠。",
    discount: "組合優惠",
  },
  "Eye Stay Set": {
    title: "持久眼妝組",
    kicker: "防水眼妝精選",
    detail: "點選查看眉妝與眼線組合的活動價格。",
    discount: "套組優惠價",
  },
  "Face Dimension": {
    title: "立體輪廓",
    kicker: "修容與頰彩",
    detail: "Pandora Cheek 與 Eclipse Spark 臉部彩妝享專屬優惠。",
    discount: "現省 15%",
  },
};

export function localizePromo(promo: Promo, language: Language): Promo {
  if (language === "vi") return { ...promo, ...promoCopyVietnamese[promo.title] };
  if (language === "es") return { ...promo, ...promoCopySpanish[promo.title] };
  if (language === "zh-tw") return { ...promo, ...promoCopyTraditionalChinese[promo.title] };
  return promo;
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
