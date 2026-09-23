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
          setIsAdmin(userData.role === "admin");
        }

        // Ambil data alat dari API
        const response = await apiFetch("/equipment", {
          token: process.env.NEXT_PUBLIC_DEV_TOKEN,
        });

        const equipmentData = response.data || response;

        setDataKamera(equipmentData);
      } catch (error) {
        console.error(
          "Gagal mengambil data alat:",
          error
        );

        setErrorMessage(
          error.message || "Gagal mengambil data alat."
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
          data.message || "Gagal menghapus alat."
        );
      }

      // Hapus dari tampilan tanpa reload
      setDataKamera((prev) =>
        prev.filter((item) => item.id !== id)
      );

      alert("Alat berhasil dihapus.");
    } catch (error) {
      console.error(
        "Gagal menghapus alat:",
        error
      );

      alert(
        error.message || "Gagal menghapus alat."
      );
    }
  }

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-black tracking-tight">
          Katalog Alat Multimedia
        </h1>

        <div className="mt-6 rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">
            Memuat data alat...
          </p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (errorMessage) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-black tracking-tight">
          Katalog Alat Multimedia
        </h1>

        <div className="mt-6 rounded-xl border border-zinc-300 bg-zinc-100 p-5 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
          <p className="font-semibold">
            Gagal mengambil data alat
          </p>

          <p className="mt-1 text-sm">
            {errorMessage}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">

      {/* =========================
          HEADER
      ========================= */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Katalog Alat Multimedia
          </h1>

          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Pilih alat multimedia sesuai kebutuhan produksi kamu.
          </p>
        </div>

        {/* TOMBOL TAMBAH ADMIN */}
        {isAdmin && (
          <Link
            href="/kamera/tambah"
            className="rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            + Tambah Alat
          </Link>
        )}
      </div>

      {/* =========================
          DATA KOSONG
      ========================= */}
      {dataKamera.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 p-8 text-center dark:border-zinc-800">
          <p className="text-zinc-500 dark:text-zinc-400">
            Belum ada alat multimedia tersedia.
          </p>
        </div>
      ) : (
        /* =========================
           GRID KATALOG
        ========================= */
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">

          {dataKamera.map((item) => (
            <div
              key={item.id}
              className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
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

                {/* KATEGORI & STOK */}
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    {item.category}
                  </span>

                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                    Stok: {item.stock}
                  </span>
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
                  ).toLocaleString("id-ID")}{" "}
                  / hari
                </p>
              </div>

              {/* =========================
                  TOMBOL USER
              ========================= */}
              {!isAdmin && (
                <Link
                  href={`/kamera/${item.id}`}
                  className="mt-4 block rounded-xl bg-black py-2.5 text-center text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Lihat Detail & Sewa
                </Link>
              )}

              {/* =========================
                  TOMBOL ADMIN
              ========================= */}
              {isAdmin && (
                <div className="mt-3 grid grid-cols-2 gap-2">

                  {/* EDIT */}
                  <Link
                    href={`/kamera/${item.id}/edit`}
                    className="rounded-lg border border-zinc-300 px-3 py-2 text-center text-xs font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
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
                    className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-red-700"
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
  );
}