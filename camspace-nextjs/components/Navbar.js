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

        // =========================
        // BELUM LOGIN
        // =========================
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }

        // =========================
        // CEK DATA USER LOCAL
        // =========================
        const currentUser = localStorage.getItem(
          "camspace_current_user"
        );

        if (currentUser) {
          try {
            const userData = JSON.parse(currentUser);

            console.log("=== CEK USER LOCAL ===");
            console.log("USER DATA:", userData);
            console.log("USER ROLE:", userData?.role);
            console.log("=====================");

            // Kalau data local sudah lengkap
            if (userData?.role) {
              setUser(userData);
              setLoading(false);
              return;
            }
          } catch (error) {
            console.error(
              "Data user local tidak valid:",
              error
            );

            localStorage.removeItem(
              "camspace_current_user"
            );
          }
        }

        // =========================
        // AMBIL DATA USER DARI API
        // =========================
        const response = await apiFetch("/me", {
          method: "GET",
          token: token,
        });

        console.log("=== RESPONSE /ME ===");
        console.log("DATA USER:", response);
        console.log("====================");

        const userData =
          response.user ||
          response.data?.user ||
          response.data ||
          response;

        console.log("=== CEK USER API ===");
        console.log("USER DATA:", userData);
        console.log("USER ROLE:", userData?.role);
        console.log("===================");

        setUser(userData);

        // Simpan data user terbaru
        localStorage.setItem(
          "camspace_current_user",
          JSON.stringify(userData)
        );
      } catch (error) {
        console.error(
          "Gagal mengambil data user:",
          error
        );

        localStorage.removeItem("camspace_token");
        localStorage.removeItem(
          "camspace_current_user"
        );

        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    // Jalankan saat Navbar pertama kali dibuka
    cekLogin();

    // Jalankan ulang setelah proses login
    window.addEventListener(
      "camspace-login",
      cekLogin
    );

    return () => {
      window.removeEventListener(
        "camspace-login",
        cekLogin
      );
    };
  }, []);

  // =========================
  // LOGOUT
  // =========================
  async function handleLogout() {
    try {
      setLoggingOut(true);

      const token =
        localStorage.getItem(
          "camspace_token"
        );

      if (token) {
        try {
          await apiFetch("/logout", {
            method: "POST",
            token: token,
          });
        } catch (error) {
          console.error(
            "Logout API gagal:",
            error
          );
        }
      }

      // Hapus semua data login
      localStorage.removeItem(
        "camspace_token"
      );

      localStorage.removeItem(
        "camspace_current_user"
      );

      setUser(null);

      router.push("/");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  // =========================
  // DATA USER
  // =========================
  const namaUser =
    user?.name ||
    user?.nama ||
    user?.full_name ||
    "Pengguna";

  const isAdmin =
    user?.role === "admin";

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">

        {/* =========================
            LOGO + NAVIGASI
        ========================= */}
        <div className="flex items-center gap-8">

          <Link
            href="/"
            className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white"
          >
            CamSpace
          </Link>

          <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">

            {/* KATALOG */}
            <Link
              href="/kamera"
              className="hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Katalog Alat
            </Link>

            {/* =========================
                MENU USER
            ========================= */}
            {!loading &&
              user &&
              !isAdmin && (
                <>
                  <Link
<<<<<<< HEAD
                    href="/peminjaman"
                    className="hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    Riwayat
=======
                    href="/admin/approval"
                    className="hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    Dashboard
>>>>>>> d22cdb59a9b7874df70d99ed7f9e6808d1d2c0bc
                  </Link>

                  <Link
                    href="/status"
                    className="hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    Status
                  </Link>

                  <Link
                    href="/dashboard"
                    className="hover:text-zinc-900 dark:hover:text-zinc-100"
                  >
                    Profil
                  </Link>
                </>
              )}

            {/* =========================
                MENU ADMIN
            ========================= */}
            {!loading &&
              user &&
              isAdmin && (
                <Link
                  href="/admin/dashboard"
                  className="font-bold text-indigo-600 hover:text-indigo-500"
                >
                  Dashboard Admin
                </Link>
              )}
          </nav>
        </div>

        {/* =========================
            BAGIAN KANAN
        ========================= */}
        <div className="flex items-center gap-3">

          {/* LOADING */}
          {loading ? (
            <div className="h-9 w-24 rounded-xl bg-zinc-100 animate-pulse dark:bg-zinc-800" />
          ) : user ? (

            /* =========================
               SUDAH LOGIN
            ========================= */
            <>
              <span className="hidden sm:block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                Halo, {namaUser}
              </span>

              <button
                onClick={handleLogout}
                disabled={loggingOut}
                className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
              >
                {loggingOut
                  ? "Keluar..."
                  : "Logout"}
              </button>
            </>

          ) : (

            /* =========================
               BELUM LOGIN
            ========================= */
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