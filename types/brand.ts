export interface BrandState {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  logo: string | null;
}

export const defaultBrand: BrandState = {
  name: "BrandSync",
  tagline: "Your brand, unified",
  email: "contact@brandsync.com",
  phone: "+1 (555) 123-4567",
  logo: null,
};
