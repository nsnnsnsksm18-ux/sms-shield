"use client";

import { Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TOPUP_PACKS } from "@/lib/data";
import { formatClock, formatTL } from "@/lib/format";
import { useStore } from "@/lib/store";

export function WalletClient() {
  const { balance, transactions, hydrated, topUp, resetDemo } = useStore();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="size-4 text-primary" />
            Bakiye
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="font-heading text-4xl font-semibold tracking-tight">
            {hydrated ? formatTL(balance) : "…"}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Demo cüzdan. Ödeme alınmaz; paketler bakiyeyi yerelde artırır.
          </p>
          <div className="mt-6 grid gap-2 sm:grid-cols-2">
            {TOPUP_PACKS.map((pack) => (
              <button
                key={pack.id}
                type="button"
                onClick={() => topUp(pack.amount, pack.bonus, pack.label)}
                className="rounded-xl border border-white/10 bg-white/3 p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary/8"
              >
                <p className="text-xs text-muted-foreground">{pack.label}</p>
                <p className="font-medium">{formatTL(pack.amount)}</p>
                {pack.bonus > 0 && (
                  <p className="text-xs text-primary">+{pack.bonus} ₺ bonus</p>
                )}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="sm" className="mt-4" onClick={resetDemo}>
            Demoyu sıfırla
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Hareketler</CardTitle>
        </CardHeader>
        <CardContent>
          {!hydrated ? (
            <p className="text-sm text-muted-foreground">Yükleniyor…</p>
          ) : transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground">Henüz hareket yok.</p>
          ) : (
            <ul className="divide-y divide-white/8">
              {transactions.slice(0, 12).map((tx) => (
                <li key={tx.id} className="flex items-center justify-between py-3 text-sm">
                  <div>
                    <p>{tx.note}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatClock(tx.createdAt)}
                    </p>
                  </div>
                  <p
                    className={
                      tx.amount >= 0 ? "font-medium text-teal-300" : "font-medium"
                    }
                  >
                    {tx.amount >= 0 ? "+" : ""}
                    {formatTL(tx.amount)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
