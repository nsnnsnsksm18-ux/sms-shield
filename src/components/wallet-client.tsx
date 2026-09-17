"use client";

import { Wallet } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatClock, formatTL } from "@/lib/format";
import { useStore } from "@/lib/store";

export function WalletClient() {
  const { balance, error, rentals } = useStore();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="size-4 text-primary" />
            FerPay bakiyesi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-heading text-4xl font-semibold tracking-tight">
            {balance == null ? "…" : formatTL(balance)}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Bakiye ferpay.com.tr cüzdanındandır. Yükleme oradan yapılır; bu
            sitede kart çekilmez.
          </p>
          {error && <p className="mt-3 text-sm text-amber-300">{error}</p>}
          <a
            href="https://ferpay.com.tr/"
            target="_blank"
            rel="noreferrer"
            className="mt-5 inline-flex text-sm text-primary hover:underline"
          >
            ferpay.com.tr’de bakiye yükle
          </a>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Bu tarayıcıdaki kiralamalar</CardTitle>
        </CardHeader>
        <CardContent>
          {rentals.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz kiralama yok.</p>
          ) : (
            <ul className="divide-y divide-white/8">
              {rentals.slice(0, 12).map((tx) => (
                <li
                  key={tx.id}
                  className="flex items-center justify-between py-3 text-sm"
                >
                  <div>
                    <p>
                      {tx.platform} · {tx.phone}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatClock(tx.createdAt)}
                    </p>
                  </div>
                  <p className="font-medium">{formatTL(tx.price)}</p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
