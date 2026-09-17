import type { Metadata } from "next";
import { SmsBuyTable } from "@/components/sms-buy-table";

export const metadata: Metadata = {
  title: "SMS Al",
  description: "WhatsApp, Telegram, Instagram ve diğer platformlar için 24 saatlik sanal numara.",
};

export default function HizmetlerPage() {
  return <SmsBuyTable />;
}
