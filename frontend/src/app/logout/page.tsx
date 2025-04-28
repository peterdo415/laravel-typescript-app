"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { logoutApi } from "../../lib/api";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      try {
        await logoutApi();
      } catch {}
      // クライアント側の認証情報を全て削除
      Cookies.remove("XSRF-TOKEN");
      localStorage.clear();
      sessionStorage.clear();
      window.dispatchEvent(new Event('app-logout'));
      router.push("/");
    };
    logout();
  }, [router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-lg text-gray-700">ログアウト中...</div>
    </main>
  );
} 