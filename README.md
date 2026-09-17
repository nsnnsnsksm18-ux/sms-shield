# SMSOnay

Sanal numara ile SMS doğrulama kodu alan bir pazaryeri demosu. WhatsApp, Telegram, Instagram ve benzeri hizmetler için ülke seçip 15 dakikalık hat kiralarsınız; kod gelen kutusuna düşer.

Bu sürüm **gerçek SMS göndermez**. Numaralar ve kodlar tarayıcıda simüle edilir, bakiye `localStorage` içinde tutulur. Canlı operatör, ödeme veya üyelik yoktur.

## Yerelde çalıştırma

Node 20+ gerekir.

```bash
npm install
npm run dev
```

Tarayıcıda [http://localhost:43147](http://localhost:43147) açın.

Üretim derlemesi:

```bash
npm run build
npm start
```

## Demo akışı

1. Ana sayfadan veya **Hizmetler**’den bir platform seçin.
2. Ülke ve fiyatı görün, **Numarayı kirala** deyin (başlangıç bakiyesi 150 ₺).
3. **Gelen kutusu**nda 4–9 saniye içinde sahte SMS ve 6 haneli kod gelir.
4. Bakiye yetmezse **Cüzdan**’dan demo paket yükleyin.

## Canlı site için ne lazım?

Arayüz bu repoda. Gerçek hizmet için ayrıca:

| Parça | Ne işe yarar |
| --- | --- |
| Numara API’si | Twilio, Telnyx veya toptan sanal numara sağlayıcısı. Gelen SMS webhook ile sunucuya düşer. |
| Ödeme | Türkiye’de iyzico / PayTR, cüzdan ve fatura. |
| Hesap | Üyelik, sipariş geçmişi, isteğe bağlı toptan API. |
| Yasal | KVKK, kullanım şartları, yasaklı kullanım (dolandırıcılık, başkasının 2FA’sı, spam). |
| Hosting | Bu Next.js uygulaması Vercel’de çalışır; SMS webhook için sunucu tarafı route gerekir. |

Bazı platformlar sanal numarayı reddeder. Kullanımı platform kurallarına ve yasalara aykırı amaçlar için tasarlamayın.

## Teknoloji

Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui.
