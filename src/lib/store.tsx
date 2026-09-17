"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { toast } from "sonner";
import { extractCode, messageList } from "@/lib/ferpay-display";

const KEY = "hizlismsal-hatlar-v2";
const LEGACY_KEY = "hizlismsal-rentals-v1";
const DAY_MS = 24 * 60 * 60 * 1000;

export type LiveRental = {
  id: string;
  phone: string;
  platform: string;
  platformCode: string;
  country: string;
  countryCode: string;
  price: number;
  status: string;
  expiresAt: number;
  createdAt: number;
  messages: string[];
  code: string | null;
};

type Store = {
  balance: number | null;
  error: string | null;
  rentals: LiveRental[];
  refreshMe: () => Promise<void>;
  buy: (input: {
    platform: string;
    country: string;
    service: string;
    platformName: string;
    countryName: string;
  }) => Promise<LiveRental | null>;
  cancel: (id: string) => Promise<void>;
  refreshRental: (id: string) => Promise<void>;
};

const Ctx = createContext<Store | null>(null);

export function isRentalLive(rental: LiveRental, now?: number) {
  if (rental.status === "banned") return false;
  if (!now) return true;
  return rental.expiresAt > now;
}

function mergeMessages(prev: string[], next: string[]) {
  const out = [...prev];
  for (const item of next) {
    if (item && !out.includes(item)) out.push(item);
  }
  return out;
}

function latestCode(messages: string[]) {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    const code = extractCode(messages[i]);
    if (code) return code;
  }
  return null;
}

function coerceRental(raw: unknown): LiveRental | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || !r.id) return null;
  const messages = Array.isArray(r.messages)
    ? r.messages.flatMap((item) => messageList(item))
    : messageList(r.message);
  const createdAt = typeof r.createdAt === "number" ? r.createdAt : Date.now();
  const expiresAt =
    typeof r.expiresAt === "number" && r.expiresAt > 0
      ? r.expiresAt
      : createdAt + DAY_MS;
  return {
    id: r.id,
    phone: String(r.phone ?? "—"),
    platform: String(r.platform ?? ""),
    platformCode: String(r.platformCode ?? ""),
    country: String(r.country ?? ""),
    countryCode: String(r.countryCode ?? ""),
    price: typeof r.price === "number" ? r.price : 0,
    status: String(r.status ?? "received"),
    expiresAt,
    createdAt,
    messages,
    code: latestCode(messages),
  };
}

function readDisk(): LiveRental[] {
  try {
    const raw =
      localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    const list = Array.isArray(parsed) ? parsed : [];
    return list
      .map(coerceRental)
      .filter((item): item is LiveRental => item != null);
  } catch {
    return [];
  }
}

const listeners = new Set<() => void>();
let memory: LiveRental[] = [];

if (typeof window !== "undefined") {
  memory = readDisk();
}

function emit() {
  for (const listener of listeners) listener();
}

function persist(next: LiveRental[]) {
  memory = next.slice(0, 40);
  try {
    localStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

async function json<T>(input: RequestInfo, init?: RequestInit): Promise<T> {
  const res = await fetch(input, init);
  const data = (await res.json()) as T & { error?: string };
  if (!res.ok) throw new Error(data.error || "İstek başarısız");
  return data;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [balance, setBalance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const rentals = useSyncExternalStore(
    subscribe,
    () => memory,
    () => [] as LiveRental[],
  );

  const refreshMe = useCallback(async () => {
    try {
      const me = await json<{ balance: number }>("/api/me");
      setBalance(me.balance);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bakiye alınamadı");
    }
  }, []);

  useEffect(() => {
    let live = true;
    fetch("/api/me")
      .then(async (res) => {
        const data = (await res.json()) as { balance?: number; error?: string };
        if (!live) return;
        if (!res.ok) {
          setError(data.error || "Bakiye alınamadı");
          return;
        }
        setBalance(data.balance ?? 0);
        setError(null);
      })
      .catch(() => {
        if (live) setError("Bakiye alınamadı");
      });
    return () => {
      live = false;
    };
  }, []);

  const buy = useCallback<Store["buy"]>(async (input) => {
    try {
      const result = await json<{
        balance?: number;
        transaction?: {
          id: string;
          amount?: number;
          status?: string;
          expiresAt?: string;
          detail?: { phone?: string; platform?: string; message?: unknown };
        };
      }>("/api/buy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: input.platform,
          country: input.country,
          service: input.service,
        }),
      });
      const tx = result.transaction;
      if (!tx?.id) {
        toast.error("Numara alınamadı");
        return null;
      }
      const createdAt = Date.now();
      const messages = messageList(tx.detail?.message);
      const rental: LiveRental = {
        id: tx.id,
        phone: tx.detail?.phone || "—",
        platform: tx.detail?.platform || input.platformName,
        platformCode: input.platform,
        country: input.countryName,
        countryCode: input.country,
        price: tx.amount ?? 0,
        status: tx.status || "received",
        expiresAt: tx.expiresAt ? Date.parse(tx.expiresAt) : createdAt + DAY_MS,
        createdAt,
        messages,
        code: latestCode(messages),
      };
      persist([rental, ...memory.filter((item) => item.id !== rental.id)]);
      if (typeof result.balance === "number") setBalance(result.balance);
      toast.success(`${rental.phone} alındı · 24 saat açık`);
      return rental;
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Alım başarısız");
      return null;
    }
  }, []);

  const refreshRental = useCallback(async (id: string) => {
    try {
      const tx = await json<{
        id: string;
        status?: string;
        expiresAt?: string;
        amount?: number;
        detail?: { phone?: string; platform?: string; message?: unknown };
      }>(`/api/transactions/${encodeURIComponent(id)}`);
      persist(
        memory.map((item) => {
          if (item.id !== id) return item;
          const incoming = messageList(tx.detail?.message);
          const messages = incoming.length
            ? mergeMessages(item.messages, incoming)
            : item.messages;
          return {
            ...item,
            status: tx.status || item.status,
            phone: tx.detail?.phone || item.phone,
            platform: tx.detail?.platform || item.platform,
            expiresAt: tx.expiresAt ? Date.parse(tx.expiresAt) : item.expiresAt,
            price: tx.amount ?? item.price,
            messages,
            code: latestCode(messages),
          };
        }),
      );
    } catch {
      /* keep last snapshot */
    }
  }, []);

  const cancel = useCallback(async (id: string) => {
    try {
      const result = await json<{ balance?: number; status?: string }>(
        `/api/buy/${encodeURIComponent(id)}/cancel`,
        { method: "DELETE" },
      );
      persist(
        memory.map((item) =>
          item.id === id ? { ...item, status: result.status || "banned" } : item,
        ),
      );
      if (typeof result.balance === "number") setBalance(result.balance);
      toast.message("Sipariş iptal edildi, bakiye iade edildi");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "İptal edilemedi");
    }
  }, []);

  const value = useMemo<Store>(
    () => ({
      balance,
      error,
      rentals,
      refreshMe,
      buy,
      cancel,
      refreshRental,
    }),
    [balance, error, rentals, refreshMe, buy, cancel, refreshRental],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore StoreProvider içinde kullanılmalı");
  return ctx;
}
