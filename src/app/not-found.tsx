import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-sm text-primary">404</p>
      <h1 className="font-heading mt-2 text-3xl font-semibold">Sayfa yok</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Bu adres demo sitede tanımlı değil.
      </p>
      <div className="mt-6">
        <Link href="/" className={buttonVariants()}>
          Ana sayfa
        </Link>
      </div>
    </div>
  );
}
