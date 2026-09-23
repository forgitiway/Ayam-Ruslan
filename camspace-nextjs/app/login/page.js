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

      // LOGIN ADMIN
      if (
        email === "admin@camspace.com" &&
        password === "admin123"
      ) {
        const adminUser = {
          user_id: 999,
          name: "Admin CamSpace",
          email: "admin@camspace.com",
          role: "admin",
        };

        localStorage.setItem(
          "camspace_current_user",
          JSON.stringify(adminUser)
        );

        localStorage.setItem(
          "camspace_token",
          "admin-token"
        );

        // Beri tahu Navbar bahwa admin sudah login
        window.dispatchEvent(new Event("camspace-login"));

        // Masuk ke halaman approval
        router.push("/admin/approval");

        return;
      }

      // LOGIN USER BIASA
      const response = await apiFetch("/login", {
        method: "POST",
        body: {
          email: email,
          password: password,
        },
      });

      console.log("HASIL LOGIN:", response);

      // Ambil token dari berbagai kemungkinan struktur response API
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

      // Simpan token
      localStorage.setItem("camspace_token", token);

      // Beri tahu Navbar bahwa login berhasil
      window.dispatchEvent(new Event("camspace-login"));

      // Masuk ke dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("ERROR LOGIN:", error);

      setError(
        error.message || "Email atau password tidak valid."
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
          <h1 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
            CamSpace
          </h1>

          <h2 className="mt-2 text-xl font-bold">
            Masuk ke Akun
          </h2>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-4"
        >

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="nama@email.com"
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800"
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
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="rounded-xl bg-red-50 border border-red-200 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>
        </form>

        {/* REGISTER */}
        <p className="text-center text-sm text-zinc-500">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="text-indigo-600 hover:underline"
          >
            Daftar
          </Link>
        </p>

      </div>
    </div>
  );
}