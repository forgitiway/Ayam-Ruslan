"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminApprovalPage() {
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRentals();
  }, []);

  function loadRentals() {
    try {
      const data = JSON.parse(
        localStorage.getItem("camspace_rentals") || "[]"
      );

      setRentals(data);
    } catch (error) {
      console.error("Gagal mengambil data peminjaman:", error);
      setRentals([]);
    } finally {
      setLoading(false);
    }
  }

  function updateStatus(id, status) {
    const dataLama = JSON.parse(
      localStorage.getItem("camspace_rentals") || "[]"
    );

    const dataBaru = dataLama.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          status: status,
        };
      }

      return item;
    });

    localStorage.setItem(
      "camspace_rentals",
      JSON.stringify(dataBaru)
    );

    setRentals(dataBaru);
  }

  const pendingCount = rentals.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = rentals.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = rentals.filter(
    (item) => item.status === "rejected"
  ).length;

  function getStatusLabel(status) {
    if (status === "pending") {
      return "Menunggu Persetujuan";
    }

    if (status === "approved") {
      return "Disetujui";
    }

    if (status === "rejected") {
      return "Ditolak";
    }

    if (status === "ongoing") {
      return "Sedang Dipinjam";
    }

    if (status === "completed") {
      return "Selesai";
    }

    return status;
  }

  function getStatusClass(status) {
    if (status === "pending") {
      return "bg-yellow-100 text-yellow-700";
    }

    if (status === "approved") {
      return "bg-green-100 text-green-700";
    }

    if (status === "rejected") {
      return "bg-red-100 text-red-700";
    }

    if (status === "ongoing") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "completed") {
      return "bg-zinc-100 text-zinc-700";
    }

    return "bg-zinc-100 text-zinc-700";
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-black">
          Dashboard Admin
        </h1>

        <p className="mt-4 text-sm text-zinc-500 dark:text-zinc-400">
          Memuat data...
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">
            Dashboard Admin
          </h1>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Kelola peminjaman dan persetujuan alat CamSpace.
          </p>
        </div>

        <Link
          href="/kamera"
          className="shrink-0 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          ← Kembali
        </Link>
      </div>

      {/* Statistik Dashboard */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {/* Pending */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Menunggu Persetujuan
          </p>

          <p className="mt-2 text-3xl font-black">
            {pendingCount}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Pengajuan menunggu approval
          </p>
        </div>

        {/* Approved */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Disetujui
          </p>

          <p className="mt-2 text-3xl font-black">
            {approvedCount}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Pengajuan telah disetujui
          </p>
        </div>

        {/* Rejected */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            Ditolak
          </p>

          <p className="mt-2 text-3xl font-black">
            {rejectedCount}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            Pengajuan telah ditolak
          </p>
        </div>
      </div>

      {/* Approval */}
      <div className="mt-10">
        <div className="mb-5">
          <h2 className="text-2xl font-black">
            Approval Peminjaman
          </h2>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Kelola pengajuan peminjaman alat dari pengguna.
          </p>
        </div>

        {rentals.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Belum ada pengajuan peminjaman.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {rentals.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
              >
                {/* Header Pengajuan */}
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div>
                    <h3 className="text-lg font-bold">
                      {item.equipment_name}
                    </h3>

                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      Pengaju: {item.user_name}
                    </p>
                  </div>

                  <span
                    className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {getStatusLabel(item.status)}
                  </span>
                </div>

                {/* Detail */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                  <div>
                    <p className="text-xs text-zinc-500">
                      Tanggal Mulai
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {item.start_date || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Tanggal Selesai
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {item.end_date || "-"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Jumlah
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {item.quantity || 0} Unit
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-zinc-500">
                      Keperluan
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {item.keperluan || "-"}
                    </p>
                  </div>
                </div>

                {/* Tombol Approval */}
                {item.status === "pending" && (
                  <div className="mt-5 flex gap-3 border-t border-zinc-200 pt-5 dark:border-zinc-800">
                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(item.id, "approved")
                      }
                      className="flex-1 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700"
                    >
                      Setujui
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        updateStatus(item.id, "rejected")
                      }
                      className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
                    >
                      Tolak
                    </button>
                  </div>
                )}

                {/* Status jika sudah diproses */}
                {item.status !== "pending" && (
                  <div className="mt-5 border-t border-zinc-200 pt-4 dark:border-zinc-800">
                    <p className="text-xs text-zinc-500">
                      Status pengajuan sudah diproses oleh admin.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}