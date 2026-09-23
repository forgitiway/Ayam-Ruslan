"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ApprovalPage() {
  const router = useRouter();

  const [pengajuan, setPengajuan] = useState([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // AMBIL DATA PENGAJUAN
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("camspace_token");
    const currentUser = localStorage.getItem(
      "camspace_current_user"
    );

    // Belum login
    if (!token) {
      router.replace("/login");
      return;
    }

    // Ambil data user
    if (currentUser) {
      const user = JSON.parse(currentUser);

      // Bukan admin
      if (user.role !== "admin") {
        router.replace("/dashboard");
        return;
      }
    }

    // Ambil pengajuan
    const data = JSON.parse(
      localStorage.getItem("camspace_rentals") || "[]"
    );

    setPengajuan(data);
    setLoading(false);
  }, [router]);

  // =========================
  // UPDATE STATUS
  // =========================

  function updateStatus(id, status) {
    const data = JSON.parse(
      localStorage.getItem("camspace_rentals") || "[]"
    );

    const dataBaru = data.map((item) =>
      item.id === id
        ? {
            ...item,
            status: status,
          }
        : item
    );

    localStorage.setItem(
      "camspace_rentals",
      JSON.stringify(dataBaru)
    );

    setPengajuan(dataBaru);
  }

  // =========================
  // LOGOUT ADMIN
  // =========================

  function handleLogout() {
    localStorage.removeItem("camspace_token");
    localStorage.removeItem(
      "camspace_current_user"
    );

    window.dispatchEvent(
      new Event("camspace-logout")
    );

    router.push("/login");
  }

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-20 text-center">
        <p className="text-zinc-500">
          Memuat data approval...
        </p>
      </div>
    );
  }

  // =========================
  // HITUNG STATUS
  // =========================

  const pendingCount = pengajuan.filter(
    (item) => item.status === "pending"
  ).length;

  const approvedCount = pengajuan.filter(
    (item) => item.status === "approved"
  ).length;

  const rejectedCount = pengajuan.filter(
    (item) => item.status === "rejected"
  ).length;

  return (
    <main className="min-h-screen bg-zinc-50 px-6 py-10 dark:bg-zinc-950">
      <div className="mx-auto max-w-6xl">

        {/* =========================
            HEADER
        ========================= */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              ADMIN CAMSPACE
            </p>

            <h1 className="mt-1 text-3xl font-black">
              Approval Peminjaman
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Kelola pengajuan peminjaman kamera
              dari pengguna.
            </p>
          </div>
        </div>

        {/* =========================
            STATISTIK
        ========================= */}

        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          {/* PENDING */}
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 p-5 dark:border-yellow-900 dark:bg-yellow-950/30">
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
              Menunggu Persetujuan
            </p>

            <p className="mt-2 text-3xl font-black text-yellow-700 dark:text-yellow-400">
              {pendingCount}
            </p>
          </div>

          {/* APPROVED */}
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5 dark:border-green-900 dark:bg-green-950/30">
            <p className="text-sm font-medium text-green-700 dark:text-green-400">
              Disetujui
            </p>

            <p className="mt-2 text-3xl font-black text-green-700 dark:text-green-400">
              {approvedCount}
            </p>
          </div>

          {/* REJECTED */}
          <div className="rounded-2xl border border-red-200 bg-red-50 p-5 dark:border-red-900 dark:bg-red-950/30">
            <p className="text-sm font-medium text-red-700 dark:text-red-400">
              Ditolak
            </p>

            <p className="mt-2 text-3xl font-black text-red-700 dark:text-red-400">
              {rejectedCount}
            </p>
          </div>

        </div>

        {/* =========================
            DAFTAR PENGAJUAN
        ========================= */}

        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            Daftar Pengajuan
          </h2>

          <span className="text-sm text-zinc-500">
            {pengajuan.length} pengajuan
          </span>
        </div>

        {pengajuan.length === 0 ? (
          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-zinc-500">
              Belum ada pengajuan peminjaman.
            </p>
          </div>
        ) : (
          <div className="space-y-5">

            {pengajuan.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
              >

                {/* HEADER CARD */}
                <div className="flex flex-col gap-3 border-b border-zinc-100 pb-4 dark:border-zinc-800 sm:flex-row sm:items-start sm:justify-between">

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
                      Pengajuan #{item.id}
                    </p>

                    <h3 className="mt-1 text-lg font-bold">
                      {item.equipment_name ||
                        `Alat #${item.equipment_id}`}
                    </h3>
                  </div>

                  {/* STATUS */}
                  <div>
                    {item.status === "pending" && (
                      <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        PENDING
                      </span>
                    )}

                    {item.status === "approved" && (
                      <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        APPROVED
                      </span>
                    )}

                    {item.status === "rejected" && (
                      <span className="inline-flex rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        REJECTED
                      </span>
                    )}
                  </div>

                </div>

                {/* DETAIL */}
                <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

                  {/* PEMINJAM */}
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Peminjam
                    </p>

                    <p className="mt-1 font-semibold">
                      {item.user_name || "-"}
                    </p>
                  </div>

                  {/* ID ALAT */}
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      ID Alat
                    </p>

                    <p className="mt-1 font-semibold">
                      {item.equipment_id}
                    </p>
                  </div>

                  {/* JUMLAH */}
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Jumlah
                    </p>

                    <p className="mt-1 font-semibold">
                      {item.quantity}
                    </p>
                  </div>

                  {/* TANGGAL MULAI */}
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Tanggal Mulai
                    </p>

                    <p className="mt-1 font-semibold">
                      {item.start_date}
                    </p>
                  </div>

                  {/* TANGGAL SELESAI */}
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Tanggal Selesai
                    </p>

                    <p className="mt-1 font-semibold">
                      {item.end_date}
                    </p>
                  </div>

                  {/* KEPERLUAN */}
                  <div>
                    <p className="text-xs font-medium text-zinc-500">
                      Keperluan
                    </p>

                    <p className="mt-1 font-semibold">
                      {item.keperluan || "-"}
                    </p>
                  </div>

                </div>

                {/* ACTION */}
                {item.status === "pending" && (
                  <div className="mt-6 flex flex-col gap-3 border-t border-zinc-100 pt-5 dark:border-zinc-800 sm:flex-row sm:justify-end">

                    <button
                      onClick={() =>
                        updateStatus(
                          item.id,
                          "rejected"
                        )
                      }
                      className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
                    >
                      Tolak
                    </button>

                    <button
                      onClick={() =>
                        updateStatus(
                          item.id,
                          "approved"
                        )
                      }
                      className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-700"
                    >
                      Setujui
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