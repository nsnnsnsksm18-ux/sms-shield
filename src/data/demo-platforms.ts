import type { PlatformSummary } from "@/lib/platform-types";

function tr(stock: number, priceA: number, priceB: number): PlatformSummary["countries"] {
  return [
    {
      name: "Türkiye",
      code: "tr",
      alpha2: "tr",
      stock,
      best: { code: "dvirt2", price: priceA, count: stock },
      services: [
        { code: "dvirt2", price: priceA, count: stock },
        { code: "dvirt17", price: priceB, count: Math.max(1, Math.floor(stock / 2)) },
      ],
    },
  ];
}

export const DEMO_PLATFORMS: PlatformSummary[] = [
  { code: "whatsapp", name: "WhatsApp", stock: 48, minPrice: 12, countries: tr(48, 12, 18) },
  { code: "telegram", name: "Telegram", stock: 39, minPrice: 10, countries: tr(39, 10, 15) },
  { code: "instagram", name: "Instagram", stock: 27, minPrice: 14, countries: tr(27, 14, 20) },
  { code: "google", name: "Google", stock: 22, minPrice: 16, countries: tr(22, 16, 22) },
  { code: "facebook", name: "Facebook", stock: 18, minPrice: 11, countries: tr(18, 11, 16) },
  { code: "tiktok", name: "TikTok", stock: 31, minPrice: 13, countries: tr(31, 13, 19) },
  { code: "x", name: "X", stock: 14, minPrice: 15, countries: tr(14, 15, 21) },
  { code: "discord", name: "Discord", stock: 25, minPrice: 9, countries: tr(25, 9, 14) },
  { code: "snapchat", name: "Snapchat", stock: 12, minPrice: 17, countries: tr(12, 17, 24) },
  { code: "amazon", name: "Amazon", stock: 8, minPrice: 20, countries: tr(8, 20, 28) },
];
