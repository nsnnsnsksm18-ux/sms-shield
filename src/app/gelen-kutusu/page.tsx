import type { Metadata } from "next";
import { Suspense } from "react";
import { InboxClient } from "@/components/inbox-client";

export const metadata: Metadata = {
  title: "Numaralarım",
  description: "Aldığın numaralara 24 saat boyunca gelen SMS’leri görüntüle.",
};

export default function InboxPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold">Numaralarım</h1>
      <p className="mt-1 mb-6 max-w-2xl text-sm text-muted-foreground">
        Hat 24 saat açık. Gelen her SMS burada birikir. FerPay 5 saniyede bir
        sorgulanır.
      </p>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Yükleniyor…</p>}>
        <InboxClient />
      </Suspense>
    </div>
  );
}
