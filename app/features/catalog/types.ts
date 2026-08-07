export type CategoryKey = "lips" | "eyes" | "face";

export type Language = "en" | "es" | "id";

export type SiteView =
  | "home"
  | "category"
  | "promo"
  | "faq"
  | "stores"
  | "products";

export type Product = {
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

export type ProductTranslation = {
  description: string;
  claims: string[];
};

export type Promo = {
  title: string;
  selectorLabel?: string;
  kicker: string;
  detail: string;
  category: CategoryKey;
  finish: string;
  discount: string;
  artwork?: string;
  registrationUrl?: string;
  registrationLabel?: string;
};

export type Store = {
  name: string;
  region: string;
};
