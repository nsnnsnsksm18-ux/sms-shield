export type ServiceOption = {
  code: string;
  price: number;
  count: number;
};

export type CountrySummary = {
  name: string;
  code: string;
  alpha2: string;
  stock: number;
  best: ServiceOption | null;
  services: ServiceOption[];
};

export type PlatformSummary = {
  code: string;
  name: string;
  stock: number;
  minPrice: number | null;
  countries: CountrySummary[];
};
