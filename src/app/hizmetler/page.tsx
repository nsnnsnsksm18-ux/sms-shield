import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";

export const metadata: Metadata = {
  title: "Hizmetler",
  description: "WhatsApp, Telegram, Instagram ve diğer platformlar için sanal numara kiralayın.",
};

export default function HizmetlerPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Catalog heading="Numara kiralayabileceğin hizmetler" />
    </div>
  );
}
