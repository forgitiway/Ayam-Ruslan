"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Email dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      // =========================
      // LOGIN KE API
      // =========================
      const response = await apiFetch("/login", {
        method: "POST",
        body: {
          email: email,
          password: password,
        },
      });

      console.log("HASIL LOGIN:", response);

      // =========================
      // AMBIL TOKEN
      // =========================
      const token =
        response.token ||
        response.access_token ||
        response.data?.token ||
        response.data?.access_token;

      if (!token) {
        throw new Error(
          "Login berhasil tetapi token tidak ditemukan."
        );
      }

      // =========================
      // SIMPAN TOKEN
      // =========================
      localStorage.setItem(
        "camspace_token",
        token
      );

      // =========================
      // AMBIL DATA USER
      // =========================
      const userResponse = await apiFetch("/me", {
        method: "GET",
        token: token,
      });

      console.log("DATA USER:", userResponse);

      const userData =
        userResponse.data ||
        userResponse.user ||
        userResponse;

      console.log("USER:", userData);
      console.log("ROLE:", userData?.role);

      // =========================
      // SIMPAN DATA USER
      // =========================
      localStorage.setItem(
        "camspace_current_user",
        JSON.stringify(userData)
      );

      // Beri tahu Navbar
      window.dispatchEvent(
        new Event("camspace-login")
      );

      // =========================
      // ARAHKAN SESUAI ROLE
      // =========================
      if (userData?.role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (error) {
      console.error("ERROR LOGIN:", error);

      // Hapus data login kalau gagal
      localStorage.removeItem("camspace_token");
      localStorage.removeItem(
        "camspace_current_user"
      );

      setError(
        error.message ||
          "Email atau password tidak valid."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">

        {/* JUDUL */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
            CamSpace
          </h1>

          <h2 className="mt-2 text-xl font-bold">
            Masuk ke Akun
          </h2>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
        >

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="nama@email.com"
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-800 dark:focus:border-zinc-100"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-800 dark:focus:border-zinc-100"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="rounded-xl border border-zinc-300 bg-zinc-100 p-3 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {loading
              ? "Memproses..."
              : "Masuk"}
          </button>
        </form>

        {/* REGISTER */}
        <p className="text-center text-sm text-zinc-500">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            Daftar
          </Link>
        </p>

      </div>
    </div>
  );
}