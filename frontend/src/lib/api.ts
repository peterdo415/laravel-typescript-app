// APIラッパー関数（SPA用）
import Cookies from "js-cookie";

const API_BASE = "http://localhost:8000";

// CSRFトークン取得
export async function fetchCsrfCookie() {
  await fetch(`${API_BASE}/sanctum/csrf-cookie`, {
    credentials: "include",
  });
  // Cookie反映を保証
  await new Promise((resolve) => setTimeout(resolve, 0));
}

// 共通fetch
async function apiFetch(path: string, options: RequestInit = {}) {
  const xsrfToken = Cookies.get("XSRF-TOKEN");
  return fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
      ...(xsrfToken ? { "X-XSRF-TOKEN": decodeURIComponent(xsrfToken) } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });
}

// ログイン
export async function loginApi(data: { email: string; password: string }) {
  await fetchCsrfCookie();
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// 登録
export async function registerApi(data: { name: string; email: string; password: string; password_confirmation: string }) {
  await fetchCsrfCookie();
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

// ログアウト
export async function logoutApi() {
  await fetchCsrfCookie();
  return apiFetch("/api/auth/logout", {
    method: "POST",
  });
} 