export type Retailer = "watsons" | "guardian";

export type SkuVariant = {
  sku: string;
  shadeCode: string;
  shadeName: string;
  retailers: Retailer[];
};

const variant = (
  sku: string,
  shadeCode: string,
  shadeName: string,
  guardian = true,
): SkuVariant => ({
  sku,
  shadeCode,
  shadeName,
  retailers: guardian ? ["watsons", "guardian"] : ["watsons"],
});

// Active YES rows from the Watsons TP and Guardian TP sheets, dated 05 Oct 2026.
export const skuMaster: Record<string, SkuVariant[]> = {
  "PANDORA CHEEK LIQUID BLUSH": [
    variant("TSH119007", "07", "Secret Desire"),
    variant("TSH119005", "05", "Fiery Flame"),
    variant("TSH119003", "03", "Gentle Hue"),
    variant("TSH119002", "02", "Love Lust"),
  ],
  "ETERNAL LIP MATTE": [
    variant("TCC103007", "07", "Illusion"),
    variant("TCC103006", "06", "Hex"),
    variant("TCC103005", "05", "Arcane"),
    variant("TCC103004", "04", "Charm"),
    variant("TCC103003", "03", "Ritual"),
    variant("TCC103002", "02", "Hocus"),
    variant("TCC103001", "01", "Trick"),
  ],
  "SUPERNOVA SETTING SPRAY": [variant("TDW106000", "", "")],
  "LUMINA MATTE CUSHION": [
    variant("TQD116003W", "03W", "Warm Fawn"),
    variant("TQD116003", "03", "Fawn"),
    variant("TQD116002", "02", "Birch"),
    variant("TQD116001", "01", "Creme"),
  ],
  "NEBULA LIP CREAM": [
    variant("TCC104009", "09", "Helion"),
    variant("TCC104008", "08", "Equinox"),
    variant("TCC104007", "07", "Milky Way"),
    variant("TCC104003", "03", "Elara"),
    variant("TCC104002", "02", "Aurora"),
    variant("TCC104001", "01", "Cordelia"),
  ],
  "STELLAR DUST LIP STAIN": [
    variant("TCC102404", "#004", "Mauvion", false),
    variant("TCC102402", "#002", "Gemini", false),
    variant("TCC102401", "#001", "Nova", false),
    variant("TCC102011", "11", "Futura"),
    variant("TCC102009", "09", "Enigma", false),
    variant("TCC102007", "07", "Quanta"),
    variant("TCC102006", "06", "Nerose"),
    variant("TCC102003", "03", "Luxia"),
    variant("TCC102001", "01", "Calyptra"),
  ],
  "ECLIPSE 2 IN 1 FACE CONTOUR": [
    variant("TGG107003", "", "Solar"),
    variant("TGG107001", "", "Lunar"),
    variant("TGG107002", "", "Umbra"),
  ],
  "LUNARA 3D LIP GLOSS": [variant("TCC108001", "001", "Mirelle", false)],
  "OPTIMA POWDER FOUNDATION": [
    variant("TFB122001", "001", "Creme"),
    variant("TFB122002", "002", "Birch"),
    variant("TFB122003", "003", "Fawn"),
    variant("TFB122004", "004", "Beige", false),
  ],
  "ALTERA LIP TINT": [
    variant("TCC140001", "001", "Flux"),
    variant("TCC140002", "002", "Burst"),
    variant("TCC140004", "004", "Swirl"),
    variant("TCC140006", "006", "Wisp"),
    variant("TCC140009", "009", "Glimmer"),
    variant("TCC140012", "012", "Hush"),
    variant("TCC140016", "016", "Blaze"),
    variant("TCC140017", "017", "Rift"),
  ],
  "SPECTRA LIP VINYL": [
    variant("TCC153002", "002", "Celestial Dust"),
    variant("TCC153003", "003", "Venus Dune"),
    variant("TCC153004", "004", "Petal Comet"),
    variant("TCC153006", "006", "Solar Flare"),
    variant("TCC153007", "007", "Cosmic Haze"),
    variant("TCC153008", "008", "Eclipse Berry"),
    variant("TCC153009", "009", "Cosmo Crush"),
    variant("TCC153011", "011", "Crimson Mars"),
  ],
  "UTOPIA GLOW CUSHION": [
    variant("TQD113000", "00NC", "Bare", false),
    variant("TQD113001", "01NC", "Creme", false),
    variant("TQD113002", "02NC", "Birch", false),
    variant("TQD113003", "03NC", "Fawn", false),
  ],
  "ORION CLOUD MATTE LIPSTICK": [
    variant("TCG115001", "001", "Axiom", false),
    variant("TCG115002", "002", "Araminta"),
    variant("TCG115003", "003", "Xena", false),
    variant("TCG115004", "004", "Althea"),
    variant("TCG115005", "005", "Elladora"),
    variant("TCG115011", "011", "Enchanta", false),
  ],
  "FIXION SKIN TINT STICK": [
    variant("TFD11701NC", "01NC", "Creme"),
    variant("TFD11702NC", "02NC", "Birch"),
    variant("TFD11703NC", "03NC", "Fawn"),
  ],
  "VALORA CONCEALER": [
    variant("TZX10501NW", "01NW", "Serein"),
    variant("TZX10502N", "02N", "Ivora"),
    variant("TZX10503N", "03N", "Linen", false),
  ],
};

export function shadeLabel({ shadeCode, shadeName }: SkuVariant) {
  return [shadeCode, shadeName].filter(Boolean).join(" ");
}
