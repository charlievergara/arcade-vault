"use client";

import { useCallback, useSyncExternalStore } from "react";

export type User = { name: string };

const KEY = "av_user";
const listeners = new Set<() => void>();

// useSyncExternalStore needs a referentially stable snapshot, so the parsed
// user is cached against the raw string it came from.
let cachedRaw: string | null = null;
let cachedUser: User | null = null;

function readRaw(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): User | null {
  const raw = readRaw();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    try {
      cachedUser = raw ? (JSON.parse(raw) as User) : null;
    } catch {
      cachedUser = null;
    }
  }
  return cachedUser;
}

function getServerSnapshot(): User | null {
  return null;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

export function useSession() {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const login = useCallback((name: string) => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ name }));
    } catch {
      // storage unavailable: the app keeps working without persistence
    }
    emit();
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(KEY);
    } catch {
      // storage unavailable: the app keeps working without persistence
    }
    emit();
  }, []);

  return { user, login, logout };
}
