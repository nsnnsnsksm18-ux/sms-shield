import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Globe,
  Shield,
  Smartphone,
  Timer,
  Wallet,
} from "lucide-react";
import { Catalog } from "@/components/catalog";
import { PhonePreview } from "@/components/phone-preview";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    icon: Wallet,
    title: "Bakiye yükle",
    text: "Demo cüzdana paket seç. Canlıda burası iyzico / PayTR olur.",
  },
  {
    icon: Globe,
    title: "Hizmet ve ülke seç",
    text: "WhatsApp, Telegram, Instagram… fiyat ülkeye göre değişir.",
  },
  {
    icon: Smartphone,
    title: "Numarayı al, kodu kopyala",
    text: "15 dakikalık hat kiralanır. Demo SMS birkaç saniyede gelir.",
  },
];

const NEED = [
  "Sanal numara API’si (Twilio, SMS Activate toptan, 5sim…)",
  "Ödeme (iyzico, PayTR) ve kullanıcı hesabı",
  "Domain, Vercel veya benzeri hosting",
  "KVKK aydınlatma, iade ve kullanım şartları",
];

export default function HomePage() {
  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-14 lg:grid-cols-[1.05fr_0.95fr] lg:py-20">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs text-primary">
            <Timer className="size-3.5" />
            Demo · gerçek SMS gitmez
          </p>
          <h1 className="font-heading max-w-xl text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
            Sanal numara ile SMS onayını saniyeler içinde al.
          </h1>
          <p className="mt-4 max-w-lg text-base leading-7 text-muted-foreground">
            Hizmeti seç, ülkeyi belirle, numarayı kirala. Kod gelen kutusuna
            düşer; kopyala, doğrulamayı bitir. Bu sürüm tarayıcıda çalışan tam
            bir demo — birlikte canlıya çıkmak için gerekenler aşağıda.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Link href="/hizmetler" className={cn(buttonVariants({ size: "lg" }))}>
              Numara kirala
              <ArrowRight />
            </Link>
            <Link
              href="/nasil-calisir"
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              Ne lazım?
            </Link>
          </div>
          <dl className="mt-10 grid max-w-md grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-muted-foreground">Hizmet</dt>
              <dd className="font-medium">16 platform</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Ülke</dt>
              <dd className="font-medium">12 hat havuzu</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Süre</dt>
              <dd className="font-medium">15 dk kiralama</dd>
            </div>
          </dl>
        </div>
        <PhonePreview />
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="grid gap-3 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div
              key={step.title}
              className="rounded-2xl border border-white/8 bg-card/50 p-5"
            >
              <div className="mb-3 flex items-center gap-2 text-primary">
                <span className="font-mono text-xs text-muted-foreground">
                  0{i + 1}
                </span>
                <step.icon className="size-4" />
              </div>
              <h2 className="font-heading font-medium">{step.title}</h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <Catalog heading="Popüler hizmetler" compact />
        <div className="mt-6">
          <Link href="/hizmetler" className="text-sm text-primary hover:underline">
            Tüm hizmetleri gör
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="overflow-hidden rounded-3xl border border-primary/20 bg-primary/8 px-6 py-8 sm:px-10">
          <div className="flex items-start gap-3">
            <Shield className="mt-0.5 size-5 text-primary" />
            <div>
              <h2 className="font-heading text-xl font-semibold">
                Canlı site için ne lazım?
              </h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Arayüz hazır. Gerçek SMS ve tahsilat için aşağıdaki parçalar
                bağlanır. Dolandırıcılık, başkasının hesabını ele geçirme veya
                platform kurallarını aşmak için kullanılmaz.
              </p>
              <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                {NEED.map((item) => (
                  <li key={item} className="flex gap-2 text-sm">
                    <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/nasil-calisir"
                className="mt-5 inline-flex text-sm font-medium text-primary hover:underline"
              >
                Ayrıntılı listeye bak
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
