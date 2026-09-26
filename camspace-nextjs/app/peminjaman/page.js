"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PeminjamanPage() {
  const router = useRouter();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRentals() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("camspace_token");

        if (!token) {
          router.replace("/login");
          return;
        }

        const currentUser = localStorage.getItem("camspace_current_user");

        if (!currentUser) {
          router.replace("/login");
          return;
        }

        const user = JSON.parse(currentUser);
        const userId = user.user_id || user.id;

        const response = await fetch("/api/rentals");
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Gagal mengambil data peminjaman.");
        }

        const rentalList = Array.isArray(data)
          ? data
          : data.data || data.rentals || [];

        const userRentals = rentalList.filter(
          (rental) => Number(rental.user_id) === Number(userId)
        );

        setRentals(userRentals);
      } catch (err) {
        setError(err.message || "Gagal mengambil data peminjaman.");
      } finally {
        setLoading(false);
      }
    }

    loadRentals();
  }, [router]);

  function formatTanggal(tanggal) {
    if (!tanggal) return "-";

    return new Date(tanggal).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  function formatRupiah(nominal) {
    return `Rp${Number(nominal || 0).toLocaleString("id-ID")}`;
  }

  function getStatus(status) {
    switch (status) {
      case "pending":
        return {
          text: "Menunggu Approval",
          className:
            "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
        };

      case "approved":
        return {
          text: "Disetujui",
          className:
            "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
        };

      case "ongoing":
        return {
          text: "Sedang Dipinjam",
          className:
            "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
        };

      case "completed":
        return {
          text: "Selesai",
          className:
            "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        };

      case "rejected":
        return {
          text: "Ditolak",
          className:
            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
        };

      default:
        return {
          text: status || "Tidak diketahui",
          className:
            "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        };
    }
  }

  const menunggu = rentals.filter((r) => r.status === "pending").length;
  const disetujui = rentals.filter((r) => r.status === "approved").length;
  const dipinjam = rentals.filter((r) => r.status === "ongoing").length;
  const selesai = rentals.filter((r) => r.status === "completed").length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">

      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Riwayat Rental</h1>
        </div>

        <Link
          href="/kamera"
          className="rounded-xl bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          + Ajukan Peminjaman
        </Link>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">
            Memuat data peminjaman...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="rounded-2xl border border-zinc-300 bg-zinc-100 p-5 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
          <p className="font-semibold">
            Gagal mengambil data peminjaman
          </p>

          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* STATUS */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Status</h2>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm text-zinc-500">Menunggu</p>
                <h3 className="mt-2 text-3xl font-black">{menunggu}</h3>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm text-zinc-500">Disetujui</p>
                <h3 className="mt-2 text-3xl font-black">{disetujui}</h3>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm text-zinc-500">Dipinjam</p>
                <h3 className="mt-2 text-3xl font-black">{dipinjam}</h3>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm text-zinc-500">Selesai</p>
                <h3 className="mt-2 text-3xl font-black">{selesai}</h3>
              </div>
            </div>
          </div>

          {/* RIWAYAT */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Riwayat</h2>

            {rentals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
                <h2 className="font-bold">Belum ada peminjaman</h2>

                <p className="mt-2 text-sm text-zinc-500">
                  Yuk, cari alat yang kamu butuhkan dan ajukan peminjaman.
                </p>

                <Link
                  href="/kamera"
                  className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
                >
                  Lihat Katalog Alat
                </Link>
              </div>
            ) : (
              rentals.map((rental) => {
                const status = getStatus(rental.status);

                return (
                  <div
                    key={rental.id}
                    className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md shadow-zinc-300/50 transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                      {/* Informasi */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h2 className="text-lg font-bold">
                            {rental.equipment_name}
                          </h2>

                          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                            {rental.equipment_category}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-zinc-500">
                          REQ-{rental.id}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-100 pt-5 md:grid-cols-4 dark:border-zinc-800">

                          <div>
                            <p className="text-xs text-zinc-500">
                              Tanggal Mulai
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              {formatTanggal(rental.start_date)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-zinc-500">
                              Tanggal Selesai
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              {formatTanggal(rental.end_date)}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-zinc-500">
                              Jumlah
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              {rental.quantity} Unit
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-zinc-500">
                              Total Harga
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                              {formatRupiah(rental.total_price)}
                            </p>
                          </div>

                        </div>

                        {rental.purpose && (
                          <div className="mt-5 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
                            <p className="text-xs font-semibold text-zinc-500">
                              Keperluan
                            </p>

                            <p className="mt-1 text-sm">
                              {rental.purpose}
                            </p>
                          </div>
                        )}

                        {rental.admin_note && (
                          <div className="mt-4 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
                            <p className="text-xs font-semibold text-zinc-500">
                              Catatan Admin
                            </p>

                            <p className="mt-1 text-sm">
                              {rental.admin_note}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Status */}
                      <div className="flex flex-col items-start gap-3 md:items-end">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          {status.text}
                        </span>

                        <Link
                          href={`https://wa.me/6285337182019?text=${encodeURIComponent(
                            `Halo Admin CamSpace, saya ingin menanyakan status peminjaman saya.\n\nID Peminjaman: REQ-${rental.id}\nAlat: ${rental.equipment_name}`
                          )}`}
                          target="_blank"
                          className="rounded-lg border border-green-600 px-4 py-2 text-sm font-semibold text-green-600 transition hover:bg-green-600 hover:text-white"
                        >
                          Hubungi Admin
                        </Link>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>
        </>
      )}
    </div>
  );
}