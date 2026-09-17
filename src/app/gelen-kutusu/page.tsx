import type { Metadata } from "next";
import { Suspense } from "react";
import { InboxClient } from "@/components/inbox-client";

export const metadata: Metadata = {
  title: "Gelen kutusu",
  description: "Aldığın numaralara 24 saat boyunca gelen SMS’leri görüntüle.",
};

export default function InboxPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Gelen kutusu
      </h1>
      <p className="mt-2 mb-8 max-w-2xl text-sm text-muted-foreground">
        Aldığın hat 24 saat açık kalır. Gelen her SMS burada birikir; tek
        kodda durmaz. FerPay 5 saniyede bir sorgulanır.
      </p>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Yükleniyor…</p>}>
        <InboxClient />
      </Suspense>
    </div>
  );
}
