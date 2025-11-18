const STORAGE_KEY = "cashorcrash_admin_token";

type AdminTokenListener = (token: string | null) => void;

let currentToken: string | null = null;
let initialized = false;
let originalFetch: typeof fetch | null = null;
const listeners = new Set<AdminTokenListener>();

function notify(token: string | null) {
  listeners.forEach((listener) => listener(token));
}

function ensureOriginalFetch() {
  if (typeof window === "undefined") {
    return;
  }

  if (!originalFetch) {
    originalFetch = window.fetch.bind(window);
  }
}

function applyTokenToFetch(token: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  ensureOriginalFetch();

  if (!originalFetch) {
    return;
  }

  if (!token) {
    window.fetch = originalFetch;
    return;
  }

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    const headers = new Headers(init?.headers || {});
    headers.set("x-admin-token", token);
    const updatedInit: RequestInit = { ...init, headers };

    if (input instanceof Request) {
      return originalFetch!(new Request(input, updatedInit));
    }

    return originalFetch!(input, updatedInit);
  };
}

export function ensureAdminTokenSupport(): string | null {
  if (!initialized) {
    initialized = true;
    if (typeof window !== "undefined") {
      currentToken = window.localStorage.getItem(STORAGE_KEY);
    }
  }

  applyTokenToFetch(currentToken);
  return currentToken;
}

export function getAdminToken(): string | null {
  if (!initialized) {
    ensureAdminTokenSupport();
  }
  return currentToken;
}

export function setAdminToken(token: string | null) {
  initialized = true;
  currentToken = token?.trim() ? token.trim() : null;

  if (typeof window !== "undefined") {
    if (currentToken) {
      window.localStorage.setItem(STORAGE_KEY, currentToken);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  applyTokenToFetch(currentToken);
  notify(currentToken);
}

export function subscribeToAdminToken(listener: AdminTokenListener) {
  listeners.add(listener);
  listener(currentToken);
  return () => listeners.delete(listener);
}


