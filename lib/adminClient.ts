"use client";

const KEY = "kucingapps_admin_secret";

export function getAdminSecret(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setAdminSecret(secret: string) {
  window.localStorage.setItem(KEY, secret);
}

export function clearAdminSecret() {
  window.localStorage.removeItem(KEY);
}

export function isAdmin(): boolean {
  return !!getAdminSecret();
}

/** fetch() yang auto-sertakan header x-admin-secret. */
export function adminFetch(url: string, options: RequestInit = {}) {
  const secret = getAdminSecret();
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(secret ? { "x-admin-secret": secret } : {}),
    },
  });
}
