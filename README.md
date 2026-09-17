# Hızlı SMS Al (hizlismsal.com)

FerPay API’sine bağlı sanal numara / SMS onay vitrini.

## Gizli anahtar

Token’ı sohbete veya Git’e koyma. `.env.local`:

```
FERPAY_API_BASE=https://api.ferpay.com.tr/api
FERPAY_TOKEN=...
FERPAY_MARKUP=1
```

Vercel’de aynı değişkenleri Environment Variables olarak ekle.

## Çalıştırma

```bash
npm install
npm run dev
```

http://localhost:43147

Üretim:

```bash
npm run build
npm start
```

## Akış

FerPay’de kiralama yok. Numarayı alırsın; 24 saat boyunca o hattan sınırsız
SMS gelir (tek kullanımlık kod değil).

1. ferpay.com.tr bakiyesi
2. Hizmet + ülke → `POST /api/sms/v1/buy`
3. Gelen kutusu 24 saat `GET /api/sms/v1/transactions/{id}` (5 sn) — tüm SMS’ler
4. İlk SMS gelmezse iptal `DELETE /api/sms/v1/buy/{id}/cancel`

Bazı ağlarda FerPay Cloudflare 403 dönebilir; Vercel çıkışı genelde geçer.
