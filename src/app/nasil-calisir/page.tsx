import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Nasıl çalışır",
};

export default function HowPage() {
  return (
    <div className="max-w-2xl rounded-xl border bg-card p-6">
      <h1 className="text-xl font-semibold">Nasıl çalışır</h1>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">
        SMS Al’den hizmet ve ülke seç, Satın Al’a bas. Numara 24 saat senindir;
        gelen her SMS Numaralarım’da birikir. Tek kullanımlık değil.
      </p>
      <ol className="mt-6 list-decimal space-y-2 pl-5 text-sm leading-6">
        <li>ferpay.com.tr’de bakiye yükle.</li>
        <li>SMS Al’den servis seç, Satın Al.</li>
        <li>Numarayı uygulamaya yaz. Hat 24 saat açık kalır.</li>
        <li>SMS’ler Numaralarım’da durur. İlk SMS gelmezse iptal et, iade olur.</li>
      </ol>
      <Link href="/" className={cn(buttonVariants(), "mt-6")}>
        SMS Al
      </Link>
    </div>
  );
}
