import type { Metadata } from "next";
import { Suspense } from "react";
import { InboxClient } from "@/components/inbox-client";

export const metadata: Metadata = {
  title: "Gelen kutusu",
  description: "Kiraladığın numaralara gelen SMS kodlarını görüntüle.",
};

export default function InboxPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Gelen kutusu
      </h1>
      <p className="mt-2 mb-8 max-w-2xl text-sm text-muted-foreground">
        Aktif hatlar, geri sayım ve gelen kodlar burada. SMS bu demoda
        simüle edilir.
      </p>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Yükleniyor…</p>}>
        <InboxClient />
      </Suspense>
    </div>
  );
}
