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

// Gambar cadangan untuk alat yang image_url dari API masih null
const gambarAlat: Record<number, string> = {
  1: "/images/mic-rode-videomic-go.jpg",
  2: "/images/canon-eos-r6.jpg",
  4: "/images/gopro-hero-11.jpg",
  5: "/images/sony-fe-16-35mm.jpg",
  6: "/images/dji-mini-3.jpg",
  8: "/images/dji-osmo-mobile-6.jpg",
  10: "/images/led-video-light-panel.jpg",
  11: "/images/tripod-ulanzi-mt-44.jpg",
  13: "/images/ip-18-promag-xx.jpg",
};

export default function Home() {
  // =====================================================
  // USER / ROLE
  // =====================================================

  const [role, setRole] = useState<string | null>(null);
  const [checkingRole, setCheckingRole] = useState(true);

  // =====================================================
  // DATA EQUIPMENT
  // =====================================================

  const [dataKamera, setDataKamera] = useState<Equipment[]>(
    []
  );

  const [loadingEquipment, setLoadingEquipment] =
    useState(true);

  const [errorEquipment, setErrorEquipment] =
    useState("");

  // =====================================================
  // SEARCH
  // =====================================================

  const [searchKeyword, setSearchKeyword] =
    useState("");

  const [searchResults, setSearchResults] =
    useState<Equipment[]>([]);

  const [hasSearched, setHasSearched] =
    useState(false);

  // =====================================================
  // AMBIL DATA USER DAN EQUIPMENT
  // =====================================================

  useEffect(() => {
    async function loadHome() {
      try {
        setErrorEquipment("");

        const token =
          localStorage.getItem("camspace_token");

        // =================================================
        // CEK ROLE USER
        // =================================================

        if (token) {
          try {
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
                setLoadingEquipment(false);

                return;
              }
            }

            // Jika bukan admin, cek user ke API
            const userResponse =
              await apiFetch("/me", {
                method: "GET",
                token: token,
              });

            console.log(
              "DATA USER LANDING:",
              userResponse
            );

            const userData =
              userResponse.data;

            if (userData?.role) {
              setRole(userData.role);
            } else {
              setRole("user");
            }

            // Jika ternyata admin
            if (userData?.role === "admin") {
              setCheckingRole(false);
              setLoadingEquipment(false);

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

            localStorage.removeItem(
              "camspace_current_user"
            );

            setRole(null);
          }
        }

        // =================================================
        // AMBIL DATA EQUIPMENT DARI API PANITIA
        // =================================================

        const response = await apiFetch(
          "/equipment",
          {
            method: "GET",
            token:
              process.env
                .NEXT_PUBLIC_DEV_TOKEN,
          }
        );

        console.log(
          "DATA EQUIPMENT DARI API:",
          response
        );

        /*
          API panitia saat ini mengembalikan:

          [
            {
              id: 1,
              name: "Mic Rode VideoMic GO",
              category: "Audio",
              brand: "Rode",
              ...
            },
            ...
          ]
        */

        const equipmentData = Array.isArray(
          response
        )
          ? response
          : response.data || [];

        setDataKamera(equipmentData);
      } catch (error) {
        console.error(
          "Gagal mengambil data equipment:",
          error
        );

        setErrorEquipment(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data alat."
        );
      } finally {
        setLoadingEquipment(false);
        setCheckingRole(false);
      }
    }

    loadHome();
  }, []);

  // =====================================================
  // SEARCH EQUIPMENT
  // =====================================================

  function handleSearch(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const keyword =
      searchKeyword.trim().toLowerCase();

    // Jika search kosong
    if (!keyword) {
      setSearchResults([]);
      setHasSearched(false);
      return;
    }

    /*
      PENCARIAN HANYA DILAKUKAN PADA DATA
      YANG BERASAL DARI API EQUIPMENT.

      Yang dicari:
      - nama alat
      - kategori
      - merek
      - deskripsi
    */

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
    setHasSearched(true);
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (checkingRole) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm text-zinc-400">
          Memuat CamSpace...
        </p>
      </div>
    );
  }

  // =====================================================
  // LANDING PAGE ADMIN
  // =====================================================

  if (role === "admin") {
    return (
      <main className="min-h-screen bg-black text-white">

        <section className="flex min-h-[calc(100vh-70px)] items-center justify-center px-6">

          <div className="mx-auto max-w-4xl text-center">

            <span className="inline-block rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-zinc-300">
              Admin CamSpace
            </span>

            <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight sm:text-6xl">

              Selamat Datang di

              <br />

              <span className="text-zinc-400">
                CamSpace Admin
              </span>

            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
              Kelola alat dan pantau aktivitas
              peminjaman CamSpace melalui halaman
              administrasi.
            </p>

          </div>

        </section>

      </main>
    );
  }

  // =====================================================
  // LANDING PAGE USER / PENGUNJUNG
  // =====================================================

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="relative overflow-hidden bg-black px-6 py-20 text-white">

        <div className="mx-auto max-w-5xl text-center">

          {/* LABEL */}

          <span className="inline-block rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs font-semibold text-zinc-300">
            Platform Sewa Alat Konten & Fotografi
          </span>

          {/* TITLE */}

          <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight sm:text-6xl">

            Let&apos;s Create Beautiful Work

            <br />

            <span className="text-zinc-400">
              Together with CamSpace
            </span>

          </h1>

          {/* DESCRIPTION */}

          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">
            Sewa kamera DSLR, Mirrorless, Digicam,
            Lensa, Lighting, dan Tripod untuk
            keperluan tugas, pembuatan konten,
            hingga dokumentasi acara.
          </p>

          {/* =================================================
              SEARCH
          ================================================= */}

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 max-w-2xl"
          >

            <div className="flex items-center rounded-2xl border border-zinc-800 bg-zinc-900 p-2">

              <input
                type="text"
                value={searchKeyword}
                onChange={(event) =>
                  setSearchKeyword(
                    event.target.value
                  )
                }
                placeholder="Cari kamera, lensa, atau lighting..."
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
              />

              <button
                type="submit"
                className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition hover:bg-zinc-200"
              >
                Cari Alat
              </button>

            </div>

          </form>

        </div>

      </section>

      {/* =================================================
          HASIL SEARCH
      ================================================= */}

      {hasSearched && (
        <section className="mx-auto max-w-6xl px-6 py-14">

          <div className="mb-8">

            <h2 className="text-2xl font-bold">
              Hasil Pencarian
            </h2>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">

              Menampilkan hasil untuk{" "}

              <span className="font-semibold text-zinc-900 dark:text-white">
                &quot;{searchKeyword}&quot;
              </span>

            </p>

          </div>

          {/* =================================================
              TIDAK DITEMUKAN
          ================================================= */}

          {searchResults.length === 0 ? (

            <div className="rounded-2xl border border-zinc-200 bg-white px-6 py-12 text-center dark:border-zinc-800 dark:bg-zinc-900">

              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-zinc-100 text-xl dark:bg-zinc-800">
                ?
              </div>

              <h3 className="mt-4 text-lg font-bold">
                Alat tidak ditemukan
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 dark:text-zinc-400">
                Alat yang kamu cari tidak tersedia
                di katalog CamSpace.
              </p>

            </div>

          ) : (

            /* =================================================
               HASIL DITEMUKAN
            ================================================= */

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {searchResults.map((item) => (

                <div
                  key={item.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >

                  <div className="p-5">

                    {/* IMAGE */}

                    <div className="h-48 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">

                      {item.image_url ||
                      gambarAlat[item.id] ? (

                        <img
                          src={
                            item.image_url ||
                            gambarAlat[item.id]
                          }
                          alt={item.name}
                          className="h-full w-full object-cover"
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

                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        Stok: {item.stock}
                      </span>

                    </div>

                    {/* NAME */}

                    <h3 className="mt-2 text-lg font-bold">
                      {item.name}
                    </h3>

                    {/* BRAND */}

                    {item.brand && (
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {item.brand}
                      </p>
                    )}

                    {/* PRICE */}

                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                      Rp{" "}
                      {Number(
                        item.price_per_day
                      ).toLocaleString("id-ID")}
                      {" / hari"}
                    </p>

                  </div>

                  {/* DETAIL */}

                  <div className="px-5 pb-5">

                    <Link
                      href={`/kamera/${item.id}`}
                      className="block rounded-xl bg-black py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      Lihat Detail & Sewa
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>
      )}

      {/* =================================================
          ERROR EQUIPMENT
      ================================================= */}

      {!hasSearched && errorEquipment && (
        <section className="mx-auto max-w-6xl px-6 py-10">

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              {errorEquipment}
            </p>

          </div>

        </section>
      )}

      {/* =================================================
          KATALOG POPULER
          HANYA MUNCUL SEBELUM SEARCH
      ================================================= */}

      {!hasSearched && (
        <section className="mx-auto max-w-6xl px-6 py-16">

          <div className="mb-8 flex items-end justify-between gap-4">

            <div>

              <h2 className="text-2xl font-bold tracking-tight">
                Kamera & Alat Populer
              </h2>

              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Pilihan alat yang tersedia di
                katalog CamSpace
              </p>

            </div>

            <Link
              href="/kamera"
              className="shrink-0 text-sm font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
            >
              Lihat Semua →
            </Link>

          </div>

          {/* =================================================
              LOADING
          ================================================= */}

          {loadingEquipment ? (

            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">

              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Memuat katalog alat...
              </p>

            </div>

          ) : dataKamera.length === 0 ? (

            /* =================================================
               EMPTY
            ================================================= */

            <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">

              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Belum ada alat multimedia
                tersedia.
              </p>

            </div>

          ) : (

            /* =================================================
               EQUIPMENT GRID
            ================================================= */

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

              {dataKamera.map((item) => (

                <div
                  key={item.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
                >

                  <div className="p-5">

                    {/* IMAGE */}

                    <div className="h-48 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">

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

                      <span className="text-xs text-zinc-500 dark:text-zinc-400">
                        Stok: {item.stock}
                      </span>

                    </div>

                    {/* NAME */}

                    <h3 className="mt-2 text-lg font-bold">
                      {item.name}
                    </h3>

                    {/* BRAND */}

                    {item.brand && (
                      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                        {item.brand}
                      </p>
                    )}

                    {/* PRICE */}

                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                      Rp{" "}
                      {Number(
                        item.price_per_day
                      ).toLocaleString("id-ID")}
                      {" / hari"}
                    </p>

                  </div>

                  {/* DETAIL */}

                  <div className="px-5 pb-5">

                    <Link
                      href={`/kamera/${item.id}`}
                      className="block rounded-xl bg-black py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      Lihat Detail & Sewa
                    </Link>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>
      )}

    </main>
  );
}