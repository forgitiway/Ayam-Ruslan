"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

type Equipment = {
  id: number;
  name: string;
  category: string;
  brand: string | null;
  description: string | null;
  price_per_day: number;
  stock: number;
  image_url: string | null;
  specifications: string | null;
  status: string;
  created_at: string;
};

const gambarAlat: Record<number, string> = {
  1: "/images/sony-a7iii.jpg",
  2: "/images/canon-eos-r6.jpg",
  3: "/images/tripod-manfrotto.jpg",
};

const extraEquipment: Equipment[] = [
  {
    id: 101,
    name: "GoPro Hero 11 Black",
    category: "KAMERA",
    brand: "GoPro",
    description: null,
    price_per_day: 100000,
    stock: 4,
    image_url:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
    specifications: null,
    status: "available",
    created_at: "",
  },
  {
    id: 102,
    name: "Lensa Canon 50mm f/1.8",
    category: "LENSA",
    brand: "Canon",
    description: null,
    price_per_day: 75000,
    stock: 5,
    image_url:
      "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&q=80",
    specifications: null,
    status: "available",
    created_at: "",
  },
  {
    id: 103,
    name: "Sony FE 16-35mm f/2.8 GM",
    category: "LENSA",
    brand: "Sony",
    description: null,
    price_per_day: 120000,
    stock: 3,
    image_url:
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&q=80",
    specifications: null,
    status: "available",
    created_at: "",
  },
  {
    id: 104,
    name: "Drone DJI Mini 3",
    category: "AKSESORIS",
    brand: "DJI",
    description: null,
    price_per_day: 200000,
    stock: 2,
    image_url:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
    specifications: null,
    status: "available",
    created_at: "",
  },
  {
    id: 105,
    name: "Mic Rode VideoMic GO",
    category: "AKSESORIS",
    brand: "Rode",
    description: null,
    price_per_day: 50000,
    stock: 6,
    image_url:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80",
    specifications: null,
    status: "available",
    created_at: "",
  },
];

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  const [dataKamera, setDataKamera] = useState<Equipment[]>([]);
  const [loadingEquipment, setLoadingEquipment] = useState(false);

  useEffect(() => {
    async function loadHome() {
      try {
        const token =
          localStorage.getItem("camspace_token");

        // =========================================
        // CEK USER YANG SEDANG LOGIN
        // =========================================

        if (token) {
          try {
            // CEK ADMIN LOKAL
            const currentUser =
              localStorage.getItem(
                "camspace_current_user"
              );

            if (currentUser) {
              const userData =
                JSON.parse(currentUser);

              if (userData?.role === "admin") {
                setRole("admin");
                setCheckingRole(false);
                return;
              }
            }

            // CEK USER DARI API
            const userResponse = await apiFetch(
              "/me",
              {
                method: "GET",
                token: token,
              }
            );

            console.log(
              "DATA USER LANDING:",
              userResponse
            );

            console.log(
              "USER DATA:",
              userResponse.data
            );

            console.log(
              "ROLE USER:",
              userResponse.data?.role
            );

            const userData =
              userResponse.data;

            if (userData?.role) {
              setRole(userData.role);
            } else {
              setRole("user");
            }

            // Kalau Admin, hanya tampilkan hero
            if (userData?.role === "admin") {
              setCheckingRole(false);
              return;
            }
          } catch (error) {
            console.error(
              "Gagal mengambil data user:",
              error
            );

            localStorage.removeItem(
              "camspace_token"
            );

            setRole(null);
          }
        }

        // =========================================
        // AMBIL DATA ALAT UNTUK USER / PENGUNJUNG
        // =========================================

        setLoadingEquipment(true);

        const response = await apiFetch(
          "/equipment",
          {
            method: "GET",
            token:
              process.env.NEXT_PUBLIC_DEV_TOKEN,
          }
        );

        const apiData = Array.isArray(response)
          ? response
          : response.data || [];

        setDataKamera([
          ...apiData,
          ...extraEquipment,
        ]);
      } catch (error) {
        console.error(
          "Gagal mengambil data alat:",
          error
        );
      } finally {
        setLoadingEquipment(false);
        setCheckingRole(false);
      }
    }

    loadHome();
  }, []);

  // =========================================
  // LOADING
  // =========================================

  if (checkingRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-zinc-400">
          Memuat CamSpace...
        </p>
      </div>
    );
  }

  // =========================================
  // LANDING PAGE ADMIN
  // HERO SAJA
  // =========================================

  if (role === "admin") {
    return (
      <div className="min-h-screen bg-black font-sans text-white">

        <section className="relative flex min-h-[calc(100vh-70px)] items-center justify-center overflow-hidden px-6">

          <div className="mx-auto max-w-4xl text-center">

            <span className="inline-block rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-zinc-300">
              Admin CamSpace
            </span>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-6xl">
              Selamat Datang di
              <br />

              <span className="text-zinc-400">
                CamSpace Admin
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base text-zinc-400 sm:text-lg">
              Kelola alat dan pantau aktivitas
              peminjaman CamSpace melalui halaman
              administrasi.
            </p>

            <div className="mt-8 flex justify-center">

              <Link
                href="/admin/dashboard"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Dashboard Admin
              </Link>

            </div>

          </div>

        </section>

      </div>
    );
  }

  // =========================================
  // LANDING PAGE USER / PENGUNJUNG
  // =========================================

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">

      {/* HERO */}

      <section className="relative overflow-hidden bg-black px-6 py-20 text-white">

        <div className="mx-auto max-w-5xl space-y-6 text-center">

          <span className="inline-block rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-zinc-300">
            Platform Sewa Alat Konten & Fotografi
          </span>

          <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">

            Let&apos;s Create Beautiful Work

            <br className="hidden sm:block" />

            <span className="text-zinc-400">
              Together with CamSpace
            </span>

          </h1>

          <p className="mx-auto max-w-2xl text-base text-zinc-400 sm:text-lg">
            Sewa kamera DSLR, Mirrorless, Digicam,
            Lensa, Lighting, dan Tripod untuk
            keperluan tugas, pembuatan konten,
            hingga dokumentasi acara.
          </p>

          {/* SEARCH */}

          <div className="mx-auto max-w-xl pt-4">

            <div className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-2 sm:flex-row">

              <input
                type="text"
                placeholder="Cari kamera, lensa, atau lighting..."
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none"
              />

              <Link
                href="/kamera"
                className="rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Cari Alat
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* PRODUK POPULER */}

      <section className="mx-auto max-w-6xl px-6 py-16">

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold tracking-tight">
              Kamera & Alat Populer
            </h2>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Pilihan alat untuk kebutuhan multimedia
            </p>

          </div>

          <Link
            href="/kamera"
            className="text-sm font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
          >
            Lihat Semua →
          </Link>

        </div>

        {/* LOADING */}

        {loadingEquipment ? (

          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">

            <p className="text-sm text-zinc-500">
              Memuat alat...
            </p>

          </div>

        ) : dataKamera.length === 0 ? (

          /* EMPTY STATE */

          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">

            <p className="text-sm text-zinc-500">
              Belum ada alat multimedia tersedia.
            </p>

            <Link
              href="/kamera"
              className="mt-4 inline-block rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Lihat Katalog
            </Link>

          </div>

        ) : (

          /* PRODUCT GRID */

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">

            {dataKamera.map((item) => (

              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >

                <div>

                  {/* IMAGE */}

                  <div className="h-44 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">

                    {item.image_url ||
                    gambarAlat[item.id] ? (

                      <img
                        src={
                          item.image_url ||
                          gambarAlat[item.id]
                        }
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                        Tidak ada gambar
                      </div>

                    )}

                  </div>

                  {/* CATEGORY + STOCK */}

                  <div className="mt-4 flex items-center justify-between">

                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {item.category}
                    </span>

                    <span className="text-xs font-medium text-zinc-700 dark:text-zinc-300">
                      Stok: {item.stock}
                    </span>

                  </div>

                  {/* NAME */}

                  <h3 className="mt-1 text-lg font-bold">
                    {item.name}
                  </h3>

                  {/* PRICE */}

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Rp
                    {Number(
                      item.price_per_day
                    ).toLocaleString("id-ID")}
                    {" / hari"}
                  </p>

                </div>

                {/* DETAIL BUTTON */}

                <Link
                  href={`/kamera/${item.id}`}
                  className="mt-4 block rounded-xl bg-black py-2.5 text-center text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Lihat Detail & Sewa
                </Link>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}