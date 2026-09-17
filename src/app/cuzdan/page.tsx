import type { Metadata } from "next";
import { WalletClient } from "@/components/wallet-client";

export const metadata: Metadata = {
  title: "Bakiye",
  description: "FerPay bakiyesini gör, aldığın numaraları listele.",
};

export default function WalletPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">Bakiye</h1>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-muted-foreground">
        Bakiye FerPay hesabındandır. Yükleme ferpay.com.tr üzerinden yapılır.
      </p>
      <WalletClient />
    </div>
  );
}
