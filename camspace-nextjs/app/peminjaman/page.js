"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function formatTanggal(tanggal) {
  if (!tanggal) return "-";

  const date = new Date(tanggal);

  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function getStatusLabel(status) {
  switch (status) {
    case "pending":
      return "Menunggu Approval";
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    case "ongoing":
      return "Sedang Dipinjam";
    case "completed":
      return "Selesai";
    default:
      return status || "-";
  }
}

function getStatusClass(status) {
  switch (status) {
    case "approved":
      return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

    case "rejected":
      return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

    case "ongoing":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";

    case "completed":
      return "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

    case "pending":
    default:
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  }
}

export default function PeminjamanPage() {
  const router = useRouter();

  const [dataPeminjaman, setDataPeminjaman] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPeminjaman() {
      try {
        const token = localStorage.getItem("camspace_token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const userData = localStorage.getItem("camspace_current_user");

        if (!userData) {
          setError("Data pengguna tidak ditemukan.");
          return;
        }

        const user = JSON.parse(userData);

        const response = await fetch("/api/rentals", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Gagal mengambil data peminjaman."
          );
        }

        const rentals = Array.isArray(data)
          ? data
          : data.data || [];

        // Hanya tampilkan peminjaman milik user yang sedang login
        const peminjamanSaya = rentals.filter(
          (item) =>
            Number(item.user_id) === Number(user.user_id)
        );

        setDataPeminjaman(peminjamanSaya);
      } catch (err) {
        console.error("ERROR LOAD PEMINJAMAN:", err);
        setError(
          err.message || "Gagal mengambil data peminjaman."
        );
      } finally {
        setLoading(false);
      }
    }

    loadPeminjaman();
  }, [router]);

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">
            Peminjaman Saya
          </h1>

          <p className="mt-2 text-sm text-zinc-500">
            Lihat dan kelola pengajuan peminjaman alatmu.
          </p>
        </div>

        <Link
          href="/peminjaman/ajukan"
          className="rounded-xl bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          + Ajukan Peminjaman
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-12 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">
            Memuat data peminjaman...
          </p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Daftar Peminjaman */}
      {!loading && !error && dataPeminjaman.length > 0 && (
        <div className="space-y-4">
          {dataPeminjaman.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                {/* Informasi alat */}
                <div className="space-y-2">

                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-lg font-bold">
                      {item.equipment_name || "Nama alat tidak tersedia"}
                    </h2>

                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {item.equipment_category || "-"}
                    </span>
                  </div>

                  <p className="text-sm text-zinc-500">
                    ID Peminjaman: #{item.id}
                  </p>

                  <p className="text-sm">
                    <span className="font-medium">
                      Tanggal:
                    </span>{" "}
                    {formatTanggal(item.start_date)} -{" "}
                    {formatTanggal(item.end_date)}
                  </p>

                  <p className="text-sm">
                    <span className="font-medium">
                      Jumlah:
                    </span>{" "}
                    {item.quantity || 0} unit
                  </p>

                  <p className="text-sm">
                    <span className="font-medium">
                      Total Harga:
                    </span>{" "}
                    Rp
                    {Number(
                      item.total_price || 0
                    ).toLocaleString("id-ID")}
                  </p>

                  {item.admin_note && (
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      <span className="font-medium">
                        Catatan Admin:
                      </span>{" "}
                      {item.admin_note}
                    </p>
                  )}
                </div>

                {/* Status dan tombol */}
                <div className="flex flex-col items-start gap-3 md:items-end">

                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>

                  <Link
                    href="/status"
                    className="text-sm font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
                  >
                    Lihat Status →
                  </Link>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        dataPeminjaman.length === 0 && (
          <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
            <h2 className="font-bold">
              Belum ada peminjaman
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Yuk, cari alat yang kamu butuhkan dan ajukan
              peminjaman.
            </p>

            <Link
              href="/kamera"
              className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Lihat Katalog Alat
            </Link>
          </div>
        )}
    </div>
  );
}