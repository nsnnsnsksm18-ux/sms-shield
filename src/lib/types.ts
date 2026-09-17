export type Category =
  | "mesajlasma"
  | "sosyal"
  | "google"
  | "oyun"
  | "finans"
  | "diger";

export type Country = {
  code: string;
  name: string;
  dial: string;
  flag: string;
  priceMul: number;
};

export type Service = {
  slug: string;
  name: string;
  category: Category;
  blurb: string;
  basePrice: number;
  popularity: number;
};

export type RentalStatus = "waiting" | "received" | "expired" | "cancelled";

export type SmsMessage = {
  id: string;
  from: string;
  body: string;
  code: string | null;
  receivedAt: number;
};

export type Rental = {
  id: string;
  serviceSlug: string;
  countryCode: string;
  phone: string;
  price: number;
  status: RentalStatus;
  createdAt: number;
  expiresAt: number;
  deliverAt: number;
  messages: SmsMessage[];
};

export type TxType = "topup" | "rent" | "refund";

export type Transaction = {
  id: string;
  type: TxType;
  amount: number;
  note: string;
  createdAt: number;
};

export type StoreState = {
  balance: number;
  rentals: Rental[];
  transactions: Transaction[];
};
