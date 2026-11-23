'use client';

import { useSyncExternalStore } from 'react';
import { cartLineKey, MAX_PER_LINE, type CartLine } from './shop-types';

/**
 * The cart lives in this browser only (localStorage) — no account needed.
 * Every price and stock level is checked again on the server at checkout.
 */

const KEY = 'eec-cart-v1';
const listeners = new Set<() => void>();
let cache: CartLine[] | null = null;
const EMPTY: CartLine[] = [];

function read(): CartLine[] {
  if (cache) return cache;
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    cache = Array.isArray(parsed) ? parsed : [];
  } catch {
    cache = [];
  }
  return cache;
}

function write(lines: CartLine[]) {
  cache = lines;
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    // Private mode or storage full — the cart still works for this visit.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) {
      cache = null;
      listener();
    }
  };
  window.addEventListener('storage', onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener('storage', onStorage);
  };
}

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, read, () => EMPTY);
}

export function addToCart(line: Omit<CartLine, 'key' | 'quantity'>, quantity = 1) {
  const key = cartLineKey(line.slug, line.size, line.parts);
  const lines = read();
  const existing = lines.find((l) => l.key === key);
  write(
    existing
      ? lines.map((l) => (l.key === key ? { ...l, quantity: Math.min(l.quantity + quantity, MAX_PER_LINE) } : l))
      : [...lines, { ...line, key, quantity }]
  );
}

export function setQuantity(key: string, quantity: number) {
  write(
    quantity <= 0
      ? read().filter((l) => l.key !== key)
      : read().map((l) => (l.key === key ? { ...l, quantity: Math.min(quantity, MAX_PER_LINE) } : l))
  );
}

export function clearCart() {
  write([]);
}

export const cartCount = (lines: CartLine[]) => lines.reduce((n, l) => n + l.quantity, 0);
