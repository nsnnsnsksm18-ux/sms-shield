import Link from "next/link";
import { Logo } from "@/components/logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div className="max-w-xs">
          <Logo />
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            Numaralar FerPay API’sinden alınır. Bakiye ferpay.com.tr
            cüzdanındandır. hizlismsal.com için hazırlandı.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div className="flex flex-col gap-2">
            <p className="font-medium text-foreground">Ürün</p>
            <Link href="/hizmetler" className="text-muted-foreground hover:text-foreground">
              Hizmetler
            </Link>
            <Link href="/gelen-kutusu" className="text-muted-foreground hover:text-foreground">
              Gelen kutusu
            </Link>
            <Link href="/cuzdan" className="text-muted-foreground hover:text-foreground">
              Cüzdan
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-medium text-foreground">Bilgi</p>
            <Link href="/nasil-calisir" className="text-muted-foreground hover:text-foreground">
              Nasıl çalışır
            </Link>
            <Link href="/yasal" className="text-muted-foreground hover:text-foreground">
              Yasal uyarı
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
