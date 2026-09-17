import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yasal uyarı",
};

export default function LegalPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-heading text-3xl font-semibold tracking-tight">
        Yasal uyarı
      </h1>
      <div className="mt-6 space-y-4 text-sm leading-7 text-muted-foreground">
        <p>
          Numaralar üçüncü taraf FerPay altyapısından alınır (24 saat, sınırsız
          SMS). Markalar (WhatsApp, Telegram, Instagram vb.) ilgili şirketlere
          aittir.
        </p>
        <p>
          Başkasının hesabına izinsiz girmek, dolandırıcılık, spam veya bir
          platformun güvenlik önlemlerini aşmak için sanal numara kullanmak
          yasaktır.
        </p>
      </div>
    </div>
  );
}
