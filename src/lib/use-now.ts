"use client";

import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
}

export function useNow() {
  return useSyncExternalStore(subscribe, () => Date.now(), () => 0);
}
