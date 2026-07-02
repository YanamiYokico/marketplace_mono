export const AUTH_TOKEN_KEY = "mp_auth";

/**
 * Called when an authed request returns 401 (expired / invalid token).
 * Clears the stored session and bounces to the sign-in page so the UI never
 * gets stuck "logged in" with a dead token.
 */
export function handleUnauthorized() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_TOKEN_KEY);
  if (!window.location.pathname.startsWith("/auth")) {
    window.location.href = "/auth";
  }
}
