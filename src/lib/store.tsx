"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
} from "react";
import { toast } from "sonner";
import {
  generatePhone,
  getCountry,
  getService,
  priceFor,
  senderFor,
  smsFor,
} from "@/lib/data";
import { id, otp } from "@/lib/format";
import type { Rental, StoreState, Transaction } from "@/lib/types";

const KEY = "smsonay-demo-v1";
const RENTAL_MS = 15 * 60 * 1000;
const START_BALANCE = 150;

const emptyState: StoreState = {
  balance: START_BALANCE,
  rentals: [],
  transactions: [
    {
      id: "tx_welcome",
      type: "topup",
      amount: START_BALANCE,
      note: "Demo bakiyesi",
      createdAt: Date.UTC(2026, 0, 1),
    },
  ],
};

type Store = StoreState & {
  rent: (serviceSlug: string, countryCode: string) => Rental | null;
  cancel: (rentalId: string) => void;
  topUp: (amount: number, bonus: number, label: string) => void;
  resetDemo: () => void;
};

const StoreContext = createContext<Store | null>(null);

function tick(state: StoreState): StoreState {
  const now = Date.now();
  let changed = false;
  const rentals = state.rentals.map((rental) => {
    if (rental.status === "waiting" && now >= rental.expiresAt) {
      changed = true;
      return { ...rental, status: "expired" as const };
    }
    if (
      rental.status === "waiting" &&
      now >= rental.deliverAt &&
      rental.messages.length === 0
    ) {
      const service = getService(rental.serviceSlug);
      if (!service) return rental;
      const code = otp();
      changed = true;
      return {
        ...rental,
        status: "received" as const,
        messages: [
          {
            id: id("sms"),
            from: senderFor(service),
            body: smsFor(service, code),
            code,
            receivedAt: now,
          },
        ],
      };
    }
    return rental;
  });
  return changed ? { ...state, rentals } : state;
}

const listeners = new Set<() => void>();
let memory: StoreState = emptyState;

function emit() {
  for (const listener of listeners) listener();
}

function readDisk(): StoreState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return tick(JSON.parse(raw) as StoreState);
  } catch {
    /* ignore */
  }
  return emptyState;
}

if (typeof window !== "undefined") {
  memory = readDisk();
}

function persist(next: StoreState) {
  memory = next;
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return memory;
}

function getServerSnapshot() {
  return emptyState;
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    const timer = window.setInterval(() => {
      const next = tick(memory);
      if (next !== memory) persist(next);
    }, 400);
    return () => window.clearInterval(timer);
  }, []);

  const rent = useCallback(
    (serviceSlug: string, countryCode: string) => {
      const service = getService(serviceSlug);
      const country = getCountry(countryCode);
      if (!service || !country) {
        toast.error("Hizmet veya ülke bulunamadı.");
        return null;
      }
      const price = priceFor(service, country);
      if (memory.balance < price) {
        toast.error("Yetersiz bakiye. Cüzdana bakın.");
        return null;
      }
      const now = Date.now();
      const created: Rental = {
        id: id("hat"),
        serviceSlug,
        countryCode,
        phone: generatePhone(country),
        price,
        status: "waiting",
        createdAt: now,
        expiresAt: now + RENTAL_MS,
        deliverAt: now + 4500 + Math.floor(Math.random() * 5000),
        messages: [],
      };
      const tx: Transaction = {
        id: id("tx"),
        type: "rent",
        amount: -price,
        note: `${service.name} · ${country.name}`,
        createdAt: now,
      };
      persist({
        ...memory,
        balance: Math.round((memory.balance - price) * 100) / 100,
        rentals: [created, ...memory.rentals],
        transactions: [tx, ...memory.transactions],
      });
      toast.success(`${country.flag} ${created.phone} kiralandı`);
      return created;
    },
    [],
  );

  const cancel = useCallback((rentalId: string) => {
    const rental = memory.rentals.find((item) => item.id === rentalId);
    if (!rental || rental.status !== "waiting") {
      toast.error("Bu hat iptal edilemez.");
      return;
    }
    const refund = Math.round(rental.price * 0.7 * 100) / 100;
    persist({
      ...memory,
      balance: Math.round((memory.balance + refund) * 100) / 100,
      rentals: memory.rentals.map((item) =>
        item.id === rentalId ? { ...item, status: "cancelled" as const } : item,
      ),
      transactions: [
        {
          id: id("tx"),
          type: "refund",
          amount: refund,
          note: "İptal iadesi · %70",
          createdAt: Date.now(),
        },
        ...memory.transactions,
      ],
    });
    toast.message(`${refund.toFixed(2)} ₺ iade edildi`);
  }, []);

  const topUp = useCallback((amount: number, bonus: number, label: string) => {
    const total = amount + bonus;
    persist({
      ...memory,
      balance: Math.round((memory.balance + total) * 100) / 100,
      transactions: [
        {
          id: id("tx"),
          type: "topup",
          amount: total,
          note: bonus
            ? `${label} paket · ${amount} ₺ + ${bonus} ₺ bonus`
            : `${label} paket`,
          createdAt: Date.now(),
        },
        ...memory.transactions,
      ],
    });
    toast.success(`${total} ₺ yüklendi`);
  }, []);

  const resetDemo = useCallback(() => {
    persist({
      ...emptyState,
      transactions: [
        {
          ...emptyState.transactions[0],
          createdAt: Date.now(),
        },
      ],
    });
    toast.message("Demo sıfırlandı");
  }, []);

  const value = useMemo<Store>(
    () => ({ ...state, rent, cancel, topUp, resetDemo }),
    [state, rent, cancel, topUp, resetDemo],
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore StoreProvider içinde kullanılmalı");
  return ctx;
}
