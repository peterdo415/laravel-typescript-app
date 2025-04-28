"use client";
import { useEffect, useState } from "react";
import Link from 'next/link'

export default function Home() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user", {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();

    // ログアウト時にuser stateをnullにリセットするカスタムイベントリスナー
    const handleLogoutEvent = () => setUser(null);
    window.addEventListener("app-logout", handleLogoutEvent);

    // ログイン時にユーザー情報を再取得するカスタムイベントリスナー
    const handleLoginEvent = () => {
      setLoading(true);
      fetchUser();
    };
    window.addEventListener("app-login", handleLoginEvent);

    return () => {
      window.removeEventListener("app-logout", handleLogoutEvent);
      window.removeEventListener("app-login", handleLoginEvent);
    };
  }, []);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* ヘッダーセクション */}
      <section className="pt-20 pb-12 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl mb-4">
          Laravel + Next.js
        </h1>
        <p className="text-lg leading-8 text-gray-600 max-w-2xl mx-auto mb-4">
          フルスタック開発学習プラットフォーム
        </p>
        <div className="mt-6 text-2xl font-semibold text-indigo-700">
          {loading ? "Loading..." : user ? `Hello ${user.name}` : "Hello Guest"}
        </div>
      </section>

      {/* 機能紹介セクション */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {/* 機能カード1 */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Laravel バックエンド
            </h3>
            <p className="text-gray-600">
              最新のLaravel 12.xを使用したAPIサーバー。
              堅牢なバックエンド開発の基礎を学べます。
            </p>
          </div>

          {/* 機能カード2 */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Next.js フロントエンド
            </h3>
            <p className="text-gray-600">
              React 19とNext.js 15による最新のフロントエンド。
              モダンなUI開発手法を実践できます。
            </p>
          </div>

          {/* 機能カード3 */}
          <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              TypeScript サポート
            </h3>
            <p className="text-gray-600">
              型安全なコーディングで、より信頼性の高い
              アプリケーション開発を実現します。
            </p>
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16 px-4 text-center">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-4">
            開発を始めましょう
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            ステップバイステップで学習を進めることができます。
          </p>
          <Link 
            href="/tutorials"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            チュートリアルを始める
          </Link>
        </div>
      </section>
    </main>
  )
}
