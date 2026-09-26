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
    function loadRentals() {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("camspace_token");

        if (!token) {
          router.replace("/login");
          return;
        }

        let userId = null;
        const currentUser = localStorage.getItem("camspace_current_user");

        if (currentUser) {
          const user = JSON.parse(currentUser);
          userId = user.user_id || user.id;
        }

        const rentalData = JSON.parse(
          localStorage.getItem("camspace_rentals") || "[]"
        );

        const userRentals = userId
          ? rentalData.filter(
              (rental) => Number(rental.user_id) === Number(userId)
            )
          : rentalData;

        setRentals(userRentals);
      } catch {
        setError("Gagal mengambil data peminjaman.");
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

  function formatRupiah(angka) {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(angka || 0);
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

  const pending = rentals.filter((r) => r.status === "pending").length;
  const approved = rentals.filter((r) => r.status === "approved").length;
  const ongoing = rentals.filter((r) => r.status === "ongoing").length;
  const completed = rentals.filter((r) => r.status === "completed").length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black align">Riwayat Rental</h1>

        </div>

        <Link
          href="/kamera"
          className="rounded-xl bg-black px-5 py-3 text-center text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          + Ajukan Peminjaman
        </Link>
      </div>

      {loading && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
          Memuat data...
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* STATUS PEMINJAMAN */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold align-center">Status</h2>

            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm text-zinc-500">Menunggu</p>
                <h3 className="mt-2 text-3xl font-black">{pending}</h3>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm text-zinc-500">Disetujui</p>
                <h3 className="mt-2 text-3xl font-black">{approved}</h3>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm text-zinc-500">Dipinjam</p>
                <h3 className="mt-2 text-3xl font-black">{ongoing}</h3>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
                <p className="text-sm text-zinc-500">Selesai</p>
                <h3 className="mt-2 text-3xl font-black">{completed}</h3>
              </div>
            </div>
          </div>

          {/* RIWAYAT PEMINJAMAN */}
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold">Riwayat</h2>

            </div>

            {rentals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
                <h3 className="font-bold">Belum ada peminjaman</h3>

                <p className="mt-2 text-sm text-zinc-500">
                  Yuk, ajukan peminjaman alat pertamamu.
                </p>

                <Link
                  href="/kamera"
                  className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
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
                    className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
                  >
                    <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold">
                            {rental.equipment_name}
                          </h3>

                          <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                            {rental.equipment_category}
                          </span>
                        </div>

                        <p className="text-sm text-zinc-500">
                          REQ-{rental.id}
                        </p>

                        {rental.purpose && (
                          <p className="text-sm text-zinc-600 dark:text-zinc-400">
                            <span className="font-medium">Keperluan:</span>{" "}
                            {rental.purpose}
                          </p>
                        )}

                        {/* Detail */}
                        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-100 pt-5 sm:grid-cols-2 md:grid-cols-4 dark:border-zinc-800">

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

                      </div>

                      {/* Status */}
                      <div className="flex flex-col items-start gap-3 md:items-end">

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${status.className}`}
                        >
                          {status.text}
                        </span>

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