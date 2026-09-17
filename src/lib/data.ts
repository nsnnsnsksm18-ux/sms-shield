import type { Category, Country, Service } from "@/lib/types";

export const CATEGORIES: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "Tümü" },
  { id: "mesajlasma", label: "Mesajlaşma" },
  { id: "sosyal", label: "Sosyal" },
  { id: "google", label: "Google" },
  { id: "oyun", label: "Oyun" },
  { id: "finans", label: "Finans" },
  { id: "diger", label: "Diğer" },
];

export const COUNTRIES: Country[] = [
  { code: "TR", name: "Türkiye", dial: "+90", flag: "🇹🇷", priceMul: 1.15 },
  { code: "DE", name: "Almanya", dial: "+49", flag: "🇩🇪", priceMul: 1.35 },
  { code: "NL", name: "Hollanda", dial: "+31", flag: "🇳🇱", priceMul: 1.28 },
  { code: "US", name: "ABD", dial: "+1", flag: "🇺🇸", priceMul: 1.05 },
  { code: "GB", name: "Birleşik Krallık", dial: "+44", flag: "🇬🇧", priceMul: 1.22 },
  { code: "FR", name: "Fransa", dial: "+33", flag: "🇫🇷", priceMul: 1.3 },
  { code: "PL", name: "Polonya", dial: "+48", flag: "🇵🇱", priceMul: 0.92 },
  { code: "ID", name: "Endonezya", dial: "+62", flag: "🇮🇩", priceMul: 0.72 },
  { code: "PH", name: "Filipinler", dial: "+63", flag: "🇵🇭", priceMul: 0.68 },
  { code: "IN", name: "Hindistan", dial: "+91", flag: "🇮🇳", priceMul: 0.64 },
  { code: "UA", name: "Ukrayna", dial: "+380", flag: "🇺🇦", priceMul: 0.78 },
  { code: "KZ", name: "Kazakistan", dial: "+7", flag: "🇰🇿", priceMul: 0.86 },
];

export const SERVICES: Service[] = [
  {
    slug: "whatsapp",
    name: "WhatsApp",
    category: "mesajlasma",
    blurb: "Yeni hesap veya cihaz doğrulaması için tek kullanımlık numara.",
    basePrice: 24.9,
    popularity: 98,
  },
  {
    slug: "telegram",
    name: "Telegram",
    category: "mesajlasma",
    blurb: "Kayıt ve 2FA kodlarını sanal hat üzerinden alın.",
    basePrice: 12.5,
    popularity: 94,
  },
  {
    slug: "signal",
    name: "Signal",
    category: "mesajlasma",
    blurb: "Gizlilik odaklı kayıt için kısa süreli hat.",
    basePrice: 18,
    popularity: 61,
  },
  {
    slug: "instagram",
    name: "Instagram",
    category: "sosyal",
    blurb: "Hesap açılışı ve güvenlik kodu için numara kiralayın.",
    basePrice: 32,
    popularity: 91,
  },
  {
    slug: "tiktok",
    name: "TikTok",
    category: "sosyal",
    blurb: "Doğrulama SMS’ini 15 dakikalık hat ile alın.",
    basePrice: 28.5,
    popularity: 88,
  },
  {
    slug: "x",
    name: "X",
    category: "sosyal",
    blurb: "Twitter / X kayıt ve telefon onayı.",
    basePrice: 22,
    popularity: 76,
  },
  {
    slug: "facebook",
    name: "Facebook",
    category: "sosyal",
    blurb: "Meta hesap doğrulaması için sanal numara.",
    basePrice: 19.9,
    popularity: 70,
  },
  {
    slug: "snapchat",
    name: "Snapchat",
    category: "sosyal",
    blurb: "Yeni hesap SMS kodu için kısa kiralık hat.",
    basePrice: 26,
    popularity: 64,
  },
  {
    slug: "google",
    name: "Google",
    category: "google",
    blurb: "Gmail ve Google hesap doğrulaması.",
    basePrice: 35,
    popularity: 85,
  },
  {
    slug: "discord",
    name: "Discord",
    category: "oyun",
    blurb: "Telefon doğrulamasını sanal numara ile tamamlayın.",
    basePrice: 14.9,
    popularity: 82,
  },
  {
    slug: "steam",
    name: "Steam",
    category: "oyun",
    blurb: "Steam Guard ve hesap onay SMS’i.",
    basePrice: 21,
    popularity: 73,
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    category: "diger",
    blurb: "Outlook ve Microsoft hesap kodları.",
    basePrice: 29,
    popularity: 68,
  },
  {
    slug: "openai",
    name: "OpenAI",
    category: "diger",
    blurb: "ChatGPT / OpenAI telefon doğrulaması.",
    basePrice: 41,
    popularity: 80,
  },
  {
    slug: "binance",
    name: "Binance",
    category: "finans",
    blurb: "Borsa kayıt SMS’i için kiralık hat.",
    basePrice: 38.5,
    popularity: 71,
  },
  {
    slug: "amazon",
    name: "Amazon",
    category: "diger",
    blurb: "Amazon hesap ve OTP doğrulaması.",
    basePrice: 27,
    popularity: 66,
  },
  {
    slug: "linkedin",
    name: "LinkedIn",
    category: "sosyal",
    blurb: "Profesyonel hesap telefon onayı.",
    basePrice: 33,
    popularity: 58,
  },
];

export const TOPUP_PACKS = [
  { id: "50", amount: 50, bonus: 0, label: "Başlangıç" },
  { id: "100", amount: 100, bonus: 5, label: "Popüler" },
  { id: "250", amount: 250, bonus: 20, label: "Ekip" },
  { id: "500", amount: 500, bonus: 60, label: "Ajans" },
] as const;

export function getService(slug: string) {
  return SERVICES.find((s) => s.slug === slug) ?? null;
}

export function getCountry(code: string) {
  return COUNTRIES.find((c) => c.code === code) ?? null;
}

export function priceFor(service: Service, country: Country) {
  return Math.round(service.basePrice * country.priceMul * 100) / 100;
}

export function stockFor(serviceSlug: string, countryCode: string) {
  let h = 0;
  const key = `${serviceSlug}:${countryCode}`;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return 8 + (h % 140);
}

export function generatePhone(country: Country) {
  const d = (n: number) =>
    Math.floor(Math.random() * 10 ** n)
      .toString()
      .padStart(n, "0");
  switch (country.code) {
    case "TR":
      return `+90 5${d(2)} ${d(3)} ${d(2)} ${d(2)}`;
    case "US":
      return `+1 (${2 + Math.floor(Math.random() * 7)}${d(2)}) ${d(3)}-${d(4)}`;
    case "GB":
      return `+44 7${d(3)} ${d(6)}`;
    case "DE":
      return `+49 15${d(1)} ${d(8)}`;
    case "NL":
      return `+31 6 ${d(8)}`;
    case "FR":
      return `+33 6 ${d(2)} ${d(2)} ${d(2)} ${d(2)}`;
    case "PL":
      return `+48 ${d(3)} ${d(3)} ${d(3)}`;
    case "ID":
      return `+62 8${d(2)} ${d(4)} ${d(4)}`;
    case "PH":
      return `+63 9${d(2)} ${d(3)} ${d(4)}`;
    case "IN":
      return `+91 ${d(5)} ${d(5)}`;
    case "UA":
      return `+380 67 ${d(3)} ${d(4)}`;
    case "KZ":
      return `+7 7${d(2)} ${d(3)} ${d(4)}`;
    default:
      return `${country.dial} ${d(10)}`;
  }
}

export function smsFor(service: Service, code: string) {
  const templates: Record<string, string> = {
    whatsapp: `WhatsApp kodun: ${code}. Bu kodu kimseyle paylaşma.`,
    telegram: `Telegram code: ${code}`,
    signal: `${code} is your Signal verification code.`,
    instagram: `${code} is your Instagram code.`,
    tiktok: `【TikTok】Verification code: ${code}. Don't share it.`,
    x: `Your X confirmation code is ${code}.`,
    facebook: `Facebook kodunuz: ${code}`,
    snapchat: `${code} is your Snapchat confirmation code.`,
    google: `G-${code} Google doğrulama kodunuzdur.`,
    discord: `Your Discord verification code is ${code}.`,
    steam: `Steam Guard kodunuz: ${code}`,
    microsoft: `Microsoft hesabınız için kod: ${code}`,
    openai: `Your OpenAI verification code is ${code}.`,
    binance: `Binance verification code: ${code}. Do not share.`,
    amazon: `${code} is your Amazon OTP. Do not share.`,
    linkedin: `LinkedIn doğrulama kodunuz: ${code}`,
  };
  return templates[service.slug] ?? `${service.name} kodunuz: ${code}`;
}

export function senderFor(service: Service) {
  const senders: Record<string, string> = {
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    signal: "Signal",
    instagram: "Instagram",
    tiktok: "TikTok",
    x: "X",
    facebook: "Facebook",
    snapchat: "Snapchat",
    google: "Google",
    discord: "Discord",
    steam: "Steam",
    microsoft: "Microsoft",
    openai: "OpenAI",
    binance: "Binance",
    amazon: "Amazon",
    linkedin: "LinkedIn",
  };
  return senders[service.slug] ?? service.name;
}
