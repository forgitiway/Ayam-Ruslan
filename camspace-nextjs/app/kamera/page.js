"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function KatalogPage() {
  const [dataKamera, setDataKamera] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // =========================
  // FILTER KATEGORI
  // =========================
  const [selectedCategory, setSelectedCategory] =
    useState("Semua");

  // =========================
  // FILTER DATA
  // =========================
  const filteredKamera =
    selectedCategory === "Semua"
      ? dataKamera
      : dataKamera.filter((item) => {
          return (
            item.category?.trim().toLowerCase() ===
            selectedCategory.trim().toLowerCase()
          );
        });

  // =========================
  // AMBIL DATA ALAT
  // =========================
  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setErrorMessage("");

        // Cek user yang sedang login
        const currentUser = localStorage.getItem(
          "camspace_current_user"
        );

        if (currentUser) {
          const userData = JSON.parse(currentUser);

          setIsAdmin(
            userData.role === "admin"
          );
        }

        // =========================
        // AMBIL DATA DARI API
        // =========================
        const response = await apiFetch(
          "/equipment",
          {
            token:
              process.env.NEXT_PUBLIC_DEV_TOKEN,
          }
        );

        const equipmentData =
          response.data || response;

        // Pastikan data berupa array
        setDataKamera(
          Array.isArray(equipmentData)
            ? equipmentData
            : []
        );
      } catch (error) {
        console.error(
          "Gagal mengambil data alat:",
          error
        );

        setErrorMessage(
          error.message ||
            "Gagal mengambil data alat."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  // =========================
  // HAPUS ALAT
  // =========================
  async function handleDelete(id, name) {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `/api/equipment/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal menghapus alat."
        );
      }

      // Hapus dari tampilan tanpa reload
      setDataKamera((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );

      alert("Alat berhasil dihapus.");
    } catch (error) {
      console.error(
        "Gagal menghapus alat:",
        error
      );

      alert(
        error.message ||
          "Gagal menghapus alat."
      );
    }
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-100 px-6 py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl">

          <h1 className="text-3xl font-black tracking-tight">
            Katalog Alat Multimedia
          </h1>

          <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-6 shadow-md shadow-zinc-300/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30">

            <p className="text-zinc-500 dark:text-zinc-400">
              Memuat data alat...
            </p>

          </div>

        </div>
      </main>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (errorMessage) {
    return (
      <main className="min-h-screen bg-zinc-100 px-6 py-12 dark:bg-zinc-950">
        <div className="mx-auto max-w-6xl">

          <h1 className="text-3xl font-black tracking-tight">
            Katalog Alat Multimedia
          </h1>

          <div className="mt-6 rounded-2xl border border-zinc-300 bg-white p-6 text-zinc-900 shadow-md shadow-zinc-300/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:shadow-black/30">

            <p className="font-semibold">
              Gagal mengambil data alat
            </p>

            <p className="mt-1 text-sm">
              {errorMessage}
            </p>

          </div>

        </div>
      </main>
    );
  }

  // =========================
  // HALAMAN UTAMA
  // =========================
  return (
    <main className="min-h-screen bg-zinc-100 px-6 py-12 dark:bg-zinc-950">

      <div className="mx-auto max-w-6xl space-y-8">

        {/* =========================
            HEADER
        ========================= */}
        <div className="flex items-start justify-between gap-4">

          {/* JUDUL */}
          <div>

            <h1 className="text-3xl font-black tracking-tight">
              Katalog Alat Multimedia
            </h1>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Pilih alat multimedia sesuai kebutuhan produksi kamu.
            </p>

          </div>

          {/* =========================
              FILTER
          ========================= */}
          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2">

              {[
                "Semua",
                "Kamera",
                "Audio",
                "Tripod",
              ].map((category) => (

                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition ${
                    selectedCategory === category
                      ? "bg-black text-white shadow-md dark:bg-white dark:text-black"
                      : "border border-zinc-300 bg-white text-zinc-700 hover:bg-zinc-50 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
                  }`}
                >
                  {category}
                </button>

              ))}

            </div>

            {/* =========================
                TAMBAH ALAT ADMIN
            ========================= */}
            {isAdmin && (
              <Link
                href="/kamera/tambah"
                className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 hover:shadow-md dark:bg-white dark:text-black dark:hover:bg-zinc-200"
              >
                + Tambah Alat
              </Link>
            )}

          </div>

        </div>

        {/* =========================
            JUMLAH ALAT
        ========================= */}
        <div className="flex items-center justify-between">

          <h2 className="text-xl font-bold">
            Daftar Alat
          </h2>

          <span className="text-sm text-zinc-500 dark:text-zinc-400">
            {filteredKamera.length} alat
          </span>

        </div>

        {/* =========================
            DATA KOSONG
        ========================= */}
        {filteredKamera.length === 0 ? (

          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-md shadow-zinc-300/40 dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30">

            <p className="text-zinc-500 dark:text-zinc-400">

              {selectedCategory === "Semua"
                ? "Belum ada alat multimedia tersedia."
                : `Belum ada alat dengan kategori ${selectedCategory}.`}

            </p>

          </div>

        ) : (

          /* =========================
             GRID KATALOG
          ========================= */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">

            {filteredKamera.map((item) => (

              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-md shadow-zinc-300/50 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30"
              >

                {/* =========================
                    INFORMASI ALAT
                ========================= */}
                <div>

                  {/* GAMBAR */}
                  <div className="h-44 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">

                    {item.image_url ? (

                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                        Tidak ada gambar
                      </div>

                    )}

                  </div>

                  {/* =========================
                      KATEGORI & STOK
                  ========================= */}
                  <div className="mt-4 flex items-center justify-between">

                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                      {item.category}
                    </span>

                    {/* =========================
                        STOK
                    ========================= */}
                    {Number(item.stock) === 0 ? (

                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700 shadow-sm dark:bg-red-950/40 dark:text-red-400">
                        Stok: 0
                      </span>

                    ) : (

                      <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700 shadow-sm dark:bg-green-950/40 dark:text-green-400">
                        Stok: {item.stock}
                      </span>

                    )}

                  </div>

                  {/* NAMA ALAT */}
                  <h3 className="mt-1 text-lg font-bold">
                    {item.name}
                  </h3>

                  {/* HARGA */}
                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">

                    Rp
                    {Number(
                      item.price_per_day
                    ).toLocaleString(
                      "id-ID"
                    )}{" "}
                    / hari

                  </p>

                </div>

                {/* =========================
                    TOMBOL USER
                ========================= */}
                {!isAdmin && (

                  Number(item.stock) === 0 ? (

                    <button
                      type="button"
                      disabled
                      className="mt-4 block w-full cursor-not-allowed rounded-xl bg-red-100 py-2.5 text-center text-sm font-semibold text-red-600 dark:bg-red-950/30 dark:text-red-400"
                    >
                      Tidak Tersedia
                    </button>

                  ) : (

                    <Link
                      href={`/kamera/${item.id}`}
                      className="mt-4 block rounded-xl bg-black py-2.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 hover:shadow-md dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                    >
                      Lihat Detail & Sewa
                    </Link>

                  )

                )}

                {/* =========================
                    TOMBOL ADMIN
                ========================= */}
                {isAdmin && (

                  <div className="mt-3 grid grid-cols-2 gap-2">

                    {/* EDIT */}
                    <Link
                      href={`/kamera/${item.id}/edit`}
                      className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-center text-xs font-semibold shadow-sm transition hover:bg-zinc-100 hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900 dark:hover:bg-zinc-800"
                    >
                      Edit
                    </Link>

                    {/* HAPUS */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          item.id,
                          item.name
                        )
                      }
                      className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-red-700 hover:shadow-md"
                    >
                      Hapus
                    </button>

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}