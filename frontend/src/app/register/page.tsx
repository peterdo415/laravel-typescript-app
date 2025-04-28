"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { registerApi } from "../../lib/api";

const schema = z.object({
  name: z.string().min(2, { message: "名前は2文字以上です" }),
  email: z.string().email({ message: "有効なメールアドレスを入力してください" }),
  password: z.string().min(6, { message: "パスワードは6文字以上です" }),
  password_confirmation: z.string().min(6, { message: "確認用パスワードも6文字以上です" }),
}).refine((data) => data.password === data.password_confirmation, {
  message: "パスワードが一致しません",
  path: ["password_confirmation"],
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
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
      const res = await registerApi(data);
      if (res.ok) {
        router.push("/");
      } else {
        const result = await res.json();
        setServerError(result.message || "登録に失敗しました");
      }
    } catch (e: any) {
      setServerError("通信エラー: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-full max-w-md space-y-6"
      >
        <h1 className="text-2xl font-bold text-center mb-4">新規登録</h1>
        <div>
          <label className="block mb-1 font-medium">名前</label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoComplete="name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>
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
            autoComplete="new-password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="block mb-1 font-medium">パスワード（確認）</label>
          <input
            type="password"
            {...register("password_confirmation")}
            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoComplete="new-password"
          />
          {errors.password_confirmation && (
            <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
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
          {loading ? "登録中..." : "新規登録"}
        </button>
      </form>
    </main>
  );
} 