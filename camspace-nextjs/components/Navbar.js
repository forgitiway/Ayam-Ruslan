"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    async function cekLogin() {
      try {
        const token = localStorage.getItem("camspace_token");

        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        // CEK ADMIN LOCAL
        const currentUser = localStorage.getItem(
          "camspace_current_user"
        );

        if (currentUser) {
          const userData = JSON.parse(currentUser);

          if (userData.role === "admin") {
            setUser(userData);
            setLoading(false);
            return;
          }
        }

        // LOGIN USER BIASA
        const response = await apiFetch("/me", {
          method: "GET",
          token: token,
        });

        console.log("DATA USER:", response);

        const userData =
          response.user ||
          response.data?.user ||
          response.data ||
          response;

        setUser(userData);
      } catch (error) {
        console.error("Gagal mengambil data user:", error);

        localStorage.removeItem("camspace_token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    // Cek login saat Navbar pertama kali dibuka
    cekLogin();

    // Cek ulang setelah user berhasil login
    window.addEventListener("camspace-login", cekLogin);

    return () => {
      window.removeEventListener("camspace-login", cekLogin);
    };
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const token = localStorage.getItem("camspace_token");

      if (token) {
        try {
          await apiFetch("/logout", {
            method: "POST",
            token: token,
          });
        } catch (error) {
          console.error("Logout API gagal:", error);
        }
      }

      // Hapus token dari browser
      localStorage.removeItem("camspace_token");
      localStorage.removeItem("camspace_current_user");

      // Hapus data user dari Navbar
      setUser(null);

      // Kembali ke halaman utama
      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  const namaUser =
    user?.name ||
    user?.nama ||
    user?.full_name ||
    "Pengguna";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* LOGO + NAVIGASI */}
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white"
          >
            CamSpace
          </Link>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">

            <Link
              href="/kamera"
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Katalog Alat
            </Link>

            {!loading && user && (
              <>
                {/* MENU USER */}
                {user?.role !== "admin" && (
                  <>
                    <Link
                      href="/peminjaman"
                      className="hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      Riwayat
                    </Link>

                    <Link
                      href="/dashboard"
                      className="hover:text-zinc-900 dark:hover:text-zinc-100"
                    >
                      Profil
                    </Link>
                  </>
                )}

                {/* MENU ADMIN */}
                {user?.role === "admin" && (
                  <Link
                    href="/admin/approval"
                    className="hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    Dashboard
                  </Link>
                )}
              </>
            )}
          </nav>
        </div>

        {/* BAGIAN KANAN */}
        <div className="flex items-center gap-3">

          {/* Saat sedang mengecek login */}
          {loading ? (
            <div className="h-9 w-24 rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse" />
          ) : user ? (

            /* SUDAH LOGIN */
            <>
              <span className="hidden sm:block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Halo, {namaUser}
              </span>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                {loggingOut ? "Keluar..." : "Logout"}
              </button>
            </>

          ) : (

            /* BELUM LOGIN */
            <>
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-900"
              >
                Masuk
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                Daftar
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}