const BASE = process.env.FERPAY_API_BASE ?? "https://api.ferpay.com.tr/api";

export type FerPayPricing = {
  price: number;
  count: number;
};

export type FerPayCountry = {
  name: string;
  code: string;
  alpha2?: string;
  pricing?: Record<string, FerPayPricing>;
};

export type FerPayPlatform = {
  name: string;
  code: string;
  countries: FerPayCountry[];
};

export type FerPayTransaction = {
  id: string;
  amount?: number;
  status?: string;
  expiresAt?: string;
  detail?: {
    phone?: string;
    platform?: string;
    message?: unknown;
  };
};

export class FerPayError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly code?: string,
  ) {
    super(message);
    this.name = "FerPayError";
  }
}

function token() {
  const value = process.env.FERPAY_TOKEN?.trim();
  if (!value) {
    throw new FerPayError("FerPay anahtarı tanımlı değil (FERPAY_TOKEN).", 500);
  }
  return value;
}

async function ferpay<T>(
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token(),
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
      Origin: "https://ferpay.com.tr",
      Referer: "https://ferpay.com.tr/",
      "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
      "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24"',
      "sec-ch-ua-mobile": "?0",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      ...init.headers,
    },
  });

  const text = await res.text();
  if (text.includes("Just a moment") || res.status === 403) {
    throw new FerPayError(
      "FerPay şu an Vercel sunucusundan liste vermiyor (Cloudflare). FERPAY_TOKEN’ın Value kutusunda olduğundan emin ol; sonra Vercel’de Redeploy et.",
      403,
      "cloudflare",
    );
  }

  let data: unknown = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    throw new FerPayError("FerPay beklenmeyen yanıt döndü.", res.status || 502);
  }

  const payload = data as { message?: string };
  if (!res.ok) {
    throw new FerPayError(
      mapMessage(payload?.message) || `FerPay hata ${res.status}`,
      res.status,
      payload?.message,
    );
  }
  if (payload?.message === "auth.expired") {
    throw new FerPayError(
      "FerPay oturumu doldu. Panelden yeni token al.",
      401,
      payload.message,
    );
  }
  return data as T;
}

export function mapMessage(code?: string) {
  const table: Record<string, string> = {
    "login.invalid": "FerPay e-posta veya şifre hatalı.",
    "auth.expired": "FerPay oturumu doldu. Yeni token gerekli.",
    "sms.success": "Numara alındı.",
    "sms.error.insufficientFunds":
      "Yetersiz bakiye. ferpay.com.tr üzerinden yükle.",
    "sms.error.operatorNotAvailable":
      "Bu ülke/serviste stok yok. Başka kombinasyon dene.",
    "sms.error.countryNotFound": "Bu ülke şu an kapalı.",
    "transaction.recreated": "Yeni numara oluşturuldu.",
  };
  return code ? table[code] ?? code : "";
}

export function getMarkup() {
  const raw = Number(process.env.FERPAY_MARKUP ?? "1");
  return Number.isFinite(raw) && raw > 0 ? raw : 1;
}

export function sellPrice(ferpayPrice: number) {
  return Math.round(ferpayPrice * getMarkup() * 100) / 100;
}

type Cache<T> = { at: number; value: T };
let platformCache: Cache<FerPayPlatform[]> | null = null;
const PLATFORM_TTL = 5 * 60 * 1000;

export async function getMe() {
  return ferpay<{
    id: number | string;
    name?: string;
    wallet?: { balance?: number };
  }>("/user/v1/me");
}

export async function getPlatforms() {
  const now = Date.now();
  if (platformCache && now - platformCache.at < PLATFORM_TTL) {
    return platformCache.value;
  }
  const value = await ferpay<FerPayPlatform[]>("/sms/v1/platforms");
  const list = Array.isArray(value) ? value : [];
  platformCache = { at: now, value: list };
  return list;
}

export async function buyNumber(input: {
  platform: string;
  country: string;
  service: string;
  quantity?: number;
}) {
  return ferpay<{
    message?: string;
    balance?: number;
    transaction?: FerPayTransaction;
  }>("/sms/v1/buy", {
    method: "POST",
    body: JSON.stringify({
      platform: input.platform,
      country: input.country,
      service: input.service,
      quantity: input.quantity ?? 1,
    }),
  });
}

export async function getTransaction(id: string) {
  return ferpay<FerPayTransaction>(
    `/sms/v1/transactions/${encodeURIComponent(id)}`,
  );
}

export async function cancelBuy(id: string) {
  return ferpay<{ message?: string; status?: string; balance?: number }>(
    `/sms/v1/buy/${encodeURIComponent(id)}/cancel`,
    { method: "DELETE" },
  );
}

export function cheapestService(country: FerPayCountry) {
  const entries = Object.entries(country.pricing ?? {}).filter(
    ([, info]) => (info?.count ?? 0) > 0,
  );
  if (entries.length === 0) {
    const all = Object.entries(country.pricing ?? {});
    if (all.length === 0) return null;
    all.sort((a, b) => a[1].price - b[1].price);
    return { code: all[0][0], ...all[0][1] };
  }
  entries.sort((a, b) => a[1].price - b[1].price);
  return { code: entries[0][0], ...entries[0][1] };
}

export function countryStock(country: FerPayCountry) {
  return Object.values(country.pricing ?? {}).reduce(
    (sum, item) => sum + (item.count ?? 0),
    0,
  );
}

export function platformSummary(platform: FerPayPlatform) {
  let stock = 0;
  let minPrice = Number.POSITIVE_INFINITY;
  for (const country of platform.countries ?? []) {
    stock += countryStock(country);
    for (const info of Object.values(country.pricing ?? {})) {
      if ((info.count ?? 0) > 0 && info.price < minPrice) minPrice = info.price;
    }
  }
  return {
    code: platform.code,
    name: platform.name,
    stock,
    minPrice: Number.isFinite(minPrice) ? sellPrice(minPrice) : null,
    countries: (platform.countries ?? []).map((country) => {
      const best = cheapestService(country);
      return {
        name: country.name,
        code: country.code,
        alpha2: country.alpha2 ?? "",
        stock: countryStock(country),
        best: best ? { ...best, price: sellPrice(best.price) } : null,
        services: Object.entries(country.pricing ?? {})
          .map(([code, info]) => ({
            code,
            price: sellPrice(info.price),
            count: info.count ?? 0,
          }))
          .sort((a, b) => a.price - b.price),
      };
    }),
  };
}

