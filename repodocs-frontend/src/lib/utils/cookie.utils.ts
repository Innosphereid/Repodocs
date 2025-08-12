/**
 * Utility functions for cookie management
 */

export const CookieUtils = {
  /**
   * Set a cookie with secure defaults
   */
  setCookie(name: string, value: string, days: number = 7): void {
    if (typeof window === "undefined") return;

    const expires = new Date();
    expires.setDate(expires.getDate() + days);

    const cookieString = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`;
    document.cookie = cookieString;
  },

  /**
   * Get a cookie value by name
   */
  getCookie(name: string): string | null {
    if (typeof window === "undefined") return null;

    const cookies = document.cookie.split(";");
    const cookie = cookies.find((c) => c.trim().startsWith(`${name}=`));

    if (cookie) {
      return cookie.split("=")[1];
    }

    return null;
  },

  /**
   * Delete a cookie by name
   */
  deleteCookie(name: string): void {
    if (typeof window === "undefined") return;

    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },

  /**
   * Check if a cookie exists
   */
  hasCookie(name: string): boolean {
    return this.getCookie(name) !== null;
  },
};

/**
 * Token storage utility that uses cookies as primary storage
 * with localStorage as fallback for better compatibility
 */
export const TokenStorage = {
  /**
   * Store authentication token
   */
  setToken(token: string): void {
    // Store in cookies (primary)
    CookieUtils.setCookie("auth_token", token, 7);

    // Store in localStorage as fallback
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token);
    }
  },

  /**
   * Get authentication token
   */
  getToken(): string | null {
    // Try cookies first
    const cookieToken = CookieUtils.getCookie("auth_token");
    if (cookieToken) {
      return cookieToken;
    }

    // Fallback to localStorage
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token");
    }

    return null;
  },

  /**
   * Clear authentication token
   */
  clearToken(): void {
    // Clear from cookies
    CookieUtils.deleteCookie("auth_token");

    // Clear from localStorage
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token");
    }
  },

  /**
   * Check if user has valid token
   */
  hasToken(): boolean {
    return this.getToken() !== null;
  },
};
