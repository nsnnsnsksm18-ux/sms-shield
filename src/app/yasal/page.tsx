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
          SMSOnay bu depoda bir ürün demosudur. Gerçek telefon numarası
          kiralanmaz, gerçek SMS iletilmez, ödeme alınmaz. Kodlar rastgele
          üretilir.
        </p>
        <p>
          Canlı bir SMS onay hizmeti işletmek istiyorsanız geçerli mevzuata,
          KVKK’ya ve ödeme kuruluşu kurallarına uymanız gerekir. Kullanıcıların
          başkasının hesabına izinsiz girmek, dolandırıcılık, spam veya bir
          platformun güvenlik önlemlerini aşmak için sanal numara kullanması
          yasaktır.
        </p>
        <p>
          WhatsApp, Telegram, Instagram ve diğer markalar ilgili şirketlere
          aittir. Bu demo onlarla bağlantılı değildir ve onların onayını
          ima etmez.
        </p>
        <p>
          Kişisel veri bu demoda sunucuya gitmez; bakiye ve kiralamalar yalnızca
          tarayıcınızdaki localStorage’da tutulur.
        </p>
      </div>
    </div>
  );
}
