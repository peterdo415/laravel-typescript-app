"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Navbar() {
  const [authResult, setAuthResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // 初回レンダリング時に認証状態を取得
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user", {
          credentials: "include",
        });
        if (res.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();

    // ログアウト時にisLoggedInをfalseにするカスタムイベントリスナー
    const handleLogoutEvent = () => setIsLoggedIn(false);
    window.addEventListener("app-logout", handleLogoutEvent);

    // ログイン時にisLoggedInをtrueにするカスタムイベントリスナー
    const handleLoginEvent = () => setIsLoggedIn(true);
    window.addEventListener("app-login", handleLoginEvent);

    return () => {
      window.removeEventListener("app-logout", handleLogoutEvent);
      window.removeEventListener("app-login", handleLoginEvent);
    };
  }, []);

  // ログインボタン押下時の遷移
  const goToLogin = () => {
    router.push("/login");
  };

  // ログアウトボタン押下時の遷移
  const goToLogout = () => {
    router.push("/logout");
  };

  // 新規登録ボタン押下時の遷移
  const goToRegister = () => {
    router.push("/register");
  };

  // ログインAPI呼び出し
  const handleLogin = async () => {
    setLoading(true);
    setAuthResult(null);
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: "test@example.com", // デモ用
          password: "password" // デモ用
        }),
        credentials: "include",
      });
      const data = await res.json();
      if (res.ok) {
        setAuthResult("ログイン成功: " + JSON.stringify(data));
        setIsLoggedIn(true);
      } else {
        setAuthResult("エラー: " + (data.message || JSON.stringify(data)));
      }
    } catch (e: any) {
      setAuthResult("通信エラー: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="w-full flex justify-end items-center px-8 py-4 bg-white/80 shadow-sm fixed top-0 left-0 z-50 backdrop-blur">
      <div className="flex items-center gap-4">
        {isLoggedIn ? (
          <button
            onClick={goToLogout}
            className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            ログアウト
          </button>
        ) : (
          <>
            <button
              onClick={goToLogin}
              className="px-4 py-2 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "認証中..." : "ログイン"}
            </button>
            <button
              onClick={goToRegister}
              className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
              disabled={loading}
            >
              新規登録
            </button>
          </>
        )}
      </div>
      {authResult && (
        <div className="ml-6 text-sm text-gray-700 max-w-xs truncate" title={authResult}>
          {authResult}
        </div>
      )}
    </nav>
  );
} 