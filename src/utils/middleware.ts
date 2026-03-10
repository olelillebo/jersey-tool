import { redirect, type LoaderFunctionArgs } from "react-router";

const STORAGE_VERSION = "v1"; // bump to invalidate old unlocks
const STORAGE_KEY = `route_pw_unlocked_${STORAGE_VERSION}`;
const COOKIE_NAME = `app_pw_${STORAGE_VERSION}`;
const ROUTE_PASSWORD = import.meta.env.VITE_APP_SECRET_PASSWORD as
  | string
  | undefined;
const ROUTE_PASSWORD_ENABLED =
  import.meta.env.VITE_ROUTE_PASSWORD_ENABLED === "true";

export function isRoutePasswordEnabled() {
  return ROUTE_PASSWORD_ENABLED && !!ROUTE_PASSWORD?.trim();
}

export function isUnlocked(): boolean {
  try {
    if (localStorage.getItem(STORAGE_KEY) === "1") return true;
  } catch {
    // Ignore errors
  }
  return document.cookie
    .split("; ")
    .some((c) => c.startsWith(`${COOKIE_NAME}=1`));
}

export function markUnlocked() {
  try {
    localStorage.setItem(STORAGE_KEY, "1"); // persists until user clears storage
  } catch {
    // Ignore errors
  }
  // ~10 years
  document.cookie = `${COOKIE_NAME}=1; Max-Age=${
    60 * 60 * 24 * 365 * 10
  }; Path=/; SameSite=Lax`;
}
export async function appMiddleware({ request }: LoaderFunctionArgs) {
  if (!isRoutePasswordEnabled()) return;

  const url = new URL(request.url);

  const pw = url.searchParams.get("pw");
  if (pw) {
    if (pw === ROUTE_PASSWORD) {
      markUnlocked();
      url.searchParams.delete("pw");
      throw redirect(url.pathname + url.search + url.hash); // clean URL
    }
    const redirectTo = url.pathname + url.search;
    throw redirect(
      `/enter-password?redirectTo=${encodeURIComponent(redirectTo)}&err=badpw`,
    );
  }
  if (!isUnlocked()) {
    const redirectTo = url.pathname + url.search;
    throw redirect(
      `/enter-password?redirectTo=${encodeURIComponent(redirectTo)}`,
    );
  }
}
