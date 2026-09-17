import type { Metadata } from "next";
import { WalletClient } from "@/components/wallet-client";

export const metadata: Metadata = {
  title: "Cüzdan",
  description: "Demo bakiye yükle, kiralama hareketlerini gör.",
};

export default function WalletPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">Cüzdan</h1>
      <p className="mt-2 mb-8 max-w-2xl text-sm text-muted-foreground">
        150 ₺ demo bakiyeyle başlarsınız. Paketler gerçek ödeme almaz.
      </p>
      <WalletClient />
    </div>
  );
}
