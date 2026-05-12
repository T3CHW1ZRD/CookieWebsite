export type MenuItem = {
  id: string;
  name: string;
  description: string;
  image: string;
  tag?: string;
};

export type GalleryImage = {
  id: string;
  src: string;
  caption?: string;
};

export type Review = {
  id: string;
  author: string;
  text: string;
  rating: number;
  date?: string;
};

export type Socials = {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  twitter?: string;
};

export type PricingTier = {
  id: string;
  label: string;
  size: string;
  price: string;
};

export type ShopInfo = {
  brandName: string;
  tagline: string;
  heroHeadline: string;
  heroSubcopy: string;
  aboutBody: string;
  address: string;
  hours: string;
  phone: string;
  email: string;
  orderUrl: string;
  noticeWindow: string;
  fulfillment: string;
  allergens: string;
  socials: Socials;
};

export type SiteContent = {
  shop: ShopInfo;
  pricing: PricingTier[];
  menu: MenuItem[];
  gallery: GalleryImage[];
  reviews: Review[];
};
