import type { Metadata } from "next";
import { Outfit, Geist_Mono } from "next/font/google";
import { PanelShell } from "@/components/panel-shell";
import { Providers } from "@/components/providers";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Hızlı SMS Al — hizlismsal.com",
    template: "%s · Hızlı SMS Al",
  },
  description:
    "Sanal numara al, 24 saat sınırsız SMS oku. Stok FerPay üzerinden gelir.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="tr"
      className={`${outfit.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <Providers>
          <PanelShell>{children}</PanelShell>
        </Providers>
      </body>
    </html>
  );
}
