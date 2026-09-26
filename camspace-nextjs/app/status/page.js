"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function StatusPage() {
  const router = useRouter();

  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadRentals() {
      try {
        setLoading(true);
        setError("");

        // ==============================
        // CEK LOGIN
        // ==============================

        const token = localStorage.getItem("camspace_token");

        if (!token) {
          router.replace("/login");
          return;
        }

        // ==============================
        // AMBIL USER LOGIN
        // ==============================

        const currentUser = localStorage.getItem(
          "camspace_current_user"
        );

        if (!currentUser) {
          router.replace("/login");
          return;
        }

        const user = JSON.parse(currentUser);

        const userId = user.user_id;

        if (!userId) {
          throw new Error(
            "Data pengguna tidak ditemukan."
          );
        }

        console.log("USER LOGIN:", user);

        // ==============================
        // AMBIL DATA RENTAL DARI API
        // ==============================

        const response = await fetch("/api/rentals", {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json();

        console.log("DATA RENTALS API:", data);

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Gagal mengambil data peminjaman."
          );
        }

        if (!Array.isArray(data)) {
          throw new Error(
            "Format data peminjaman tidak sesuai."
          );
        }

        // ==============================
        // FILTER BERDASARKAN USER LOGIN
        // ==============================

        const userRentals = data.filter(
          (rental) =>
            Number(rental.user_id) === Number(userId)
        );

        console.log(
          "PEMINJAMAN USER:",
          userRentals
        );

        setRentals(userRentals);
      } catch (error) {
        console.error(
          "ERROR STATUS:",
          error
        );

        setError(
          error.message ||
            "Gagal mengambil data peminjaman."
        );
      } finally {
        setLoading(false);
      }
    }

    loadRentals();
  }, [router]);

  // ==============================
  // FORMAT TANGGAL
  // ==============================

  function formatTanggal(tanggal) {
    if (!tanggal) return "-";

    return new Date(
      tanggal
    ).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  // ==============================
  // FORMAT RUPIAH
  // ==============================

  function formatRupiah(nominal) {
    return `Rp${Number(
      nominal || 0
    ).toLocaleString("id-ID")}`;
  }

  // ==============================
  // STATUS
  // ==============================

  function getStatus(status) {
    switch (status) {
      case "pending":
        return {
          text: "Menunggu Persetujuan",
          className:
            "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        };

      case "approved":
        return {
          text: "Disetujui",
          className:
            "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900",
        };

      case "rejected":
        return {
          text: "Ditolak",
          className:
            "bg-zinc-200 text-zinc-600 line-through dark:bg-zinc-800 dark:text-zinc-400",
        };

      case "ongoing":
        return {
          text: "Sedang Dipinjam",
          className:
            "bg-zinc-800 text-zinc-100 dark:bg-zinc-200 dark:text-zinc-900",
        };

      case "completed":
        return {
          text: "Selesai",
          className:
            "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        };

      default:
        return {
          text: status || "Tidak diketahui",
          className:
            "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
        };
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black">
          Status Peminjaman
        </h1>

        <p className="mt-1 text-sm text-zinc-500">
          Pantau status pengajuan peminjaman
          alat kamu.
        </p>
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

      {/* BELUM ADA PEMINJAMAN */}
      {!loading &&
        !error &&
        rentals.length === 0 && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">

            <h2 className="text-lg font-bold">
              Belum Ada Peminjaman
            </h2>

            <p className="mt-2 text-sm text-zinc-500">
              Kamu belum memiliki pengajuan
              peminjaman alat.
            </p>

            <button
              onClick={() =>
                router.push("/kamera")
              }
              className="mt-5 rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Lihat Katalog Alat
            </button>

          </div>
        )}

      {/* DATA PEMINJAMAN */}
      {!loading &&
        !error &&
        rentals.length > 0 && (
          <div className="space-y-5">

            {rentals.map((rental) => {
              const status = getStatus(
                rental.status
              );

              return (
                <div
                  key={rental.id}
                  className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-md shadow-zinc-300/50 transition hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900 dark:shadow-black/30"
                >

                  {/* INFORMASI UTAMA */}
                  <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
                        Peminjaman #{rental.id}
                      </p>

                      <h2 className="mt-1 text-xl font-bold">
                        {rental.equipment_name}
                      </h2>

                      <p className="mt-1 text-sm text-zinc-500">
                        {rental.equipment_category}
                      </p>
                    </div>

                    <span
                      className={`w-fit rounded-full px-4 py-2 text-xs font-semibold ${status.className}`}
                    >
                      {status.text}
                    </span>

                  </div>

                  {/* DETAIL */}
                  <div className="mt-6 grid grid-cols-1 gap-4 border-t border-zinc-100 pt-5 sm:grid-cols-2 md:grid-cols-4 dark:border-zinc-800">

                    <div>
                      <p className="text-xs text-zinc-500">
                        Tanggal Mulai
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {formatTanggal(
                          rental.start_date
                        )}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500">
                        Tanggal Selesai
                      </p>

                      <p className="mt-1 text-sm font-semibold">
                        {formatTanggal(
                          rental.end_date
                        )}
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
                        {formatRupiah(
                          rental.total_price
                        )}
                      </p>
                    </div>

                  </div>

                  {/* CATATAN ADMIN */}
                  {rental.admin_note && (
                    <div className="mt-5 rounded-xl bg-zinc-50 p-4 dark:bg-zinc-800">
                      <p className="text-xs font-semibold text-zinc-500">
                        Catatan Admin
                      </p>

                      <p className="mt-1 text-sm">
                        {rental.admin_note}
                      </p>
                    </div>
                  )}

                </div>
              );
            })}

          </div>
        )}

    </div>
  );
}