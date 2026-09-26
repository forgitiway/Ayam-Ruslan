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

export default function Home() {
  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  const [dataKamera, setDataKamera] = useState<Equipment[]>([]);
  const [loadingEquipment, setLoadingEquipment] =
    useState(false);

  // =========================================
  // SEARCH
  // =========================================

  const [searchKeyword, setSearchKeyword] = useState("");
  const [searchResults, setSearchResults] =
    useState<Equipment[] | null>(null);

  useEffect(() => {
    async function loadHome() {
      try {
        const token =
          localStorage.getItem("camspace_token");

        // =========================================
        // 1. CEK USER YANG SEDANG LOGIN
        // =========================================

        if (token) {
          try {
            // Cek user yang tersimpan di localStorage
            const currentUser =
              localStorage.getItem(
                "camspace_current_user"
              );

            if (currentUser) {
              const userData =
                JSON.parse(currentUser);

              // Kalau Admin
              if (userData?.role === "admin") {
                setRole("admin");
                setCheckingRole(false);
                return;
              }
            }

            // Kalau bukan admin, cek ke API
            const userResponse =
              await apiFetch("/me", {
                method: "GET",
                token: token,
              });

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

            // Kalau Admin dari API,
            // langsung tampilkan hero admin
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
        // 2. AMBIL DATA ALAT DARI API PANITIA
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

        // HANYA DATA DARI API
        // Tidak ada extraEquipment lagi
        setDataKamera(apiData);
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
  // 3. FUNGSI SEARCH
  // =========================================

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const keyword =
      searchKeyword.trim().toLowerCase();

    // Kalau search kosong,
    // tampilkan kembali semua produk
    if (!keyword) {
      setSearchResults(null);
      return;
    }

    const hasil = dataKamera.filter((item) => {
      const nama =
        item.name?.toLowerCase() || "";

      const kategori =
        item.category?.toLowerCase() || "";

      const merek =
        item.brand?.toLowerCase() || "";

      const deskripsi =
        item.description?.toLowerCase() || "";

      return (
        nama.includes(keyword) ||
        kategori.includes(keyword) ||
        merek.includes(keyword) ||
        deskripsi.includes(keyword)
      );
    });

    setSearchResults(hasil);
  }

  // =========================================
  // 4. DATA YANG DITAMPILKAN
  // =========================================

  const alatYangDitampilkan =
    searchResults !== null
      ? searchResults
      : dataKamera;

  // =========================================
  // 5. LOADING CEK ROLE
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
  // 6. LANDING PAGE ADMIN
  // HERO SAJA
  // =========================================

  if (role === "admin") {
    return (
      <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">

        {/* HERO ADMIN */}

        <section className="relative overflow-hidden bg-black px-6 py-20 text-white">

          <div className="mx-auto max-w-5xl space-y-6 text-center">

            <span className="inline-block rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-zinc-300">
              Admin CamSpace
            </span>

            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-6xl">

              Kelola CamSpace

              <br className="hidden sm:block" />

              <span className="text-zinc-400">
                dengan Lebih Mudah
              </span>

            </h1>

            <p className="mx-auto max-w-2xl text-base text-zinc-400 sm:text-lg">
              Kelola alat, pantau peminjaman, dan
              proses persetujuan melalui sistem
              administrasi CamSpace ^w^.
            </p>

          </div>

        </section>

      </div>
    );
  }

  // =========================================
  // 7. LANDING PAGE USER / PENGUNJUNG
  // =========================================

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-black dark:text-zinc-100">

      {/* =========================================
          HERO USER
      ========================================= */}

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

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-2 rounded-2xl border border-zinc-800 bg-zinc-900 p-2 sm:flex-row"
            >

              <input
                type="text"
                value={searchKeyword}
                onChange={(event) =>
                  setSearchKeyword(
                    event.target.value
                  )
                }
                placeholder="Cari kamera, lensa, atau lighting..."
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-500 outline-none"
              />

              <button
                type="submit"
                className="rounded-xl bg-white px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Cari Alat
              </button>

            </form>

          </div>

        </div>

      </section>

      {/* =========================================
          PRODUK POPULER
      ========================================= */}

      <section className="mx-auto max-w-6xl px-6 py-16">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">

          <div>

            <h2 className="text-2xl font-bold tracking-tight">
              {searchResults !== null
                ? "Hasil Pencarian"
                : "Kamera & Alat Populer"}
            </h2>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {searchResults !== null
                ? `Hasil pencarian untuk "${searchKeyword}"`
                : "Pilihan alat untuk kebutuhan multimedia"}
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

        ) : searchResults !== null &&
          searchResults.length === 0 ? (

          /* =========================================
             SEARCH TIDAK DITEMUKAN
          ========================================= */

          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">

            <p className="text-sm text-zinc-500">
              Alat yang kamu cari tidak ditemukan
              di katalog CamSpace.
            </p>

          </div>

        ) : alatYangDitampilkan.length === 0 ? (

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

          /* =========================================
             PRODUCT GRID
          ========================================= */

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">

            {alatYangDitampilkan.map((item) => (

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