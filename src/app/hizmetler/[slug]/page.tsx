import type { Metadata } from "next";
import Link from "next/link";
import { ServiceRent } from "@/components/service-rent";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return { title: `${decodeURIComponent(slug)} SMS onay` };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <Link
        href="/hizmetler"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-6")}
      >
        ← Tüm hizmetler
      </Link>
      <ServiceRent platformCode={decodeURIComponent(slug)} />
    </div>
  );
}
