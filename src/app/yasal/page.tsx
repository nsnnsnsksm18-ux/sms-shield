import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yasal uyarı",
};

export default function LegalPage() {
  return (
    <div className="max-w-2xl space-y-4 rounded-xl border bg-card p-6 text-sm leading-7 text-muted-foreground">
      <h1 className="text-xl font-semibold text-foreground">Yasal uyarı</h1>
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
  );
}
