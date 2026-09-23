"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function RegisterPage() {
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!nama || !email || !password) {
      setError("Nama, email, dan password wajib diisi.");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/register", {
        method: "POST",
        body: {
          name: nama,
          email: email,
          password: password,
          phone: phone || undefined,
        },
      });

      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (error) {
      setError(
        error.message || "Gagal membuat akun."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">

        <div className="text-center">
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white">
            CamSpace
          </h1>

          <h2 className="mt-2 text-xl font-bold">
            Daftar Akun Baru
          </h2>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">

          {error && (
            <div className="mb-4 rounded-xl border border-zinc-300 bg-zinc-100 p-4 text-sm text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 rounded-xl border border-zinc-300 bg-zinc-100 p-4 text-sm font-medium text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100">
              Akun berhasil dibuat. Mengarahkan ke halaman login...
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium">
                Nama Lengkap
              </label>

              <input
                type="text"
                value={nama}
                onChange={(event) =>
                  setNama(event.target.value)
                }
                placeholder="Nama Anda"
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-800 dark:focus:border-zinc-100"
                required
              />
            </div>

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
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Nomor HP
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="08xxxxxxxxxx"
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-800 dark:focus:border-zinc-100"
              />
            </div>

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
                placeholder="Buat password"
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-zinc-900 dark:border-zinc-800 dark:focus:border-zinc-100"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-black py-3 font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              {loading
                ? "Membuat Akun..."
                : "Daftar Sekarang"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-zinc-500">
          Sudah punya akun?{" "}
          <a
            href="/login"
            className="font-medium text-zinc-900 underline dark:text-zinc-100"
          >
            Masuk
          </a>
        </p>

      </div>
    </div>
  );
}