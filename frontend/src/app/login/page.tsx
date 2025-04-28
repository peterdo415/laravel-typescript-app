"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { loginApi } from "../../lib/api";

const schema = z.object({
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }),
  password: z.string().min(6, { message: "パスワードは6文字以上です" }),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  // すでにログイン済みならトップページにリダイレクト
  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user", {
          credentials: "include",
        });
        if (res.ok) {
          router.replace("/");
        }
      } catch {}
    };
    checkLogin();
  }, [router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError(null);
    try {
      const res = await loginApi(data);
      if (res.ok) {
        window.dispatchEvent(new Event('app-login'));
        router.push("/");
      } else {
        if (res.status === 404) {
          router.push("/");
        } else {
          const result = await res.json();
          setServerError(result.message || "ログインに失敗しました");
        }
      }
    } catch (e: any) {
      setServerError("通信エラー: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="flex flex-col items-center w-full max-w-md">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white p-8 rounded shadow-md w-full space-y-6"
        >
          <h1 className="text-2xl font-bold text-center mb-4">ログイン</h1>
          <div>
            <label className="block mb-1 font-medium">メールアドレス</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoComplete="email"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>
          <div>
            <label className="block mb-1 font-medium">パスワード</label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoComplete="current-password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>
          {serverError && (
            <div className="text-red-600 text-sm text-center">{serverError}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded hover:bg-indigo-700 transition-colors disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "認証中..." : "ログイン"}
          </button>
        </form>
        <div className="mt-12 text-center w-full">
          <span className="text-gray-600 text-sm">アカウントをお持ちでない方は</span>
          <Link href="/register" className="ml-2 text-indigo-600 hover:underline font-semibold text-sm">新規登録</Link>
        </div>
      </div>
    </main>
  );
} 