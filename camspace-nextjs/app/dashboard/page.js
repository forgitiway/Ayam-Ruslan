
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const peminjamanTerbaru = [
  {
    id: "REQ-101",
    alat: "Canon EOS 600D",
    tanggal: "12 - 14 September 2026",
    status: "Menunggu Approval",
  },
  {
    id: "REQ-102",
    alat: "Sony Alpha A6000",
    tanggal: "15 - 16 September 2026",
    status: "Disetujui",
  },
];

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [saving, setSaving] = useState(false);

          useEffect(() => {
          async function getUser() {
            try {
              const token = localStorage.getItem("camspace_token");

              if (!token) {
                setLoading(false);
                return;
              }

              const currentUser = localStorage.getItem("camspace_current_user");

              if (currentUser) {
                const admin = JSON.parse(currentUser);

                setUser(admin);

                const savedProfile = JSON.parse(
                  localStorage.getItem(
                    `camspace_profile_${admin.user_id || admin.id}`
                  ) || "{}"
                );

                setName(savedProfile.name || admin.name || "");
                setPhone(savedProfile.phone || admin.phone || "");

                setLoading(false);
                return;
              }

              const response = await apiFetch("/me", {
                method: "GET",
                token,
              });

              const userData =
                response.user ||
                response.data?.user ||
                response.data ||
                response;

              setUser(userData);

              const savedProfile = JSON.parse(
                localStorage.getItem(
                  `camspace_profile_${userData.user_id || userData.id}`
                ) || "{}"
              );

              setName(
                savedProfile.name ||
                  userData.name ||
                  userData.nama ||
                  userData.full_name ||
                  ""
              );

              setPhone(
                savedProfile.phone ||
                  userData.phone ||
                  userData.nomor_hp ||
                  userData.no_hp ||
                  ""
              );
            } catch (err) {
              console.error("Gagal mengambil data user:", err);
            } finally {
              setLoading(false);
            }
          }

          getUser();
        }, []);

  async function handleSavePhone() {
  try {
    setSaving(true);

    if (!user) return;

    localStorage.setItem(
      `camspace_profile_${user.user_id || user.id}`,
      JSON.stringify({
        name,
        phone,
      })
    );

    setShowSuccess(true);

    setTimeout(() => {
      setShowSuccess(false);
    }, 2500);
  } finally {
    setSaving(false);
  }
}

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">

      {/* Toast */}
              <div
          className={`fixed right-6 top-20 z-50 transition-all duration-300 ${
            showSuccess
              ? "translate-x-0 opacity-100"
              : "translate-x-10 opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-3 rounded-xl bg-green-600 px-5 py-3 text-white shadow-xl">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white font-bold text-green-600">
              ✓
            </div>

            <div>
              <p className="text-sm font-semibold">Berhasil!</p>
              <p className="text-xs opacity-90">
                Profil berhasil diperbarui.
              </p>
            </div>
          </div>
        </div>

      {/* Header */}
      <div>
        <h1 className="text-center text-3xl font-black">
          Profil
        </h1>

        <p className="mt-2 text-center text-sm text-zinc-500">
          Selamat datang kembali di CamSpace 👋
        </p>

        <p className="text-center text-sm text-zinc-500">
          Pantau aktivitas peminjaman alatmu di sini.
        </p>
      </div>

      {/* Informasi Profil */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">

        <h2 className="text-xl font-bold">
          Informasi Profil
        </h2>


        <div className="mt-6 space-y-4">

          {/* Nama */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Nama
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Alamat Email
            </label>

            <input
              type="email"
              value={user?.email || ""}
              readOnly
              className="w-full rounded-xl border border-zinc-300 bg-zinc-100 px-4 py-3 text-sm text-zinc-500 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-400"
            />
          </div>

          {/* Nomor HP */}
          <div>
            <label className="mb-2 block text-sm font-medium">
              Nomor HP
            </label>

            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Masukkan nomor HP"
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

          <button
            onClick={handleSavePhone}
            disabled={saving || loading}
            className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>

        </div>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">
            Peminjaman Aktif
          </p>

          <h2 className="mt-2 text-3xl font-black">
            1
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Sedang dipinjam
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">
            Menunggu Approval
          </p>

          <h2 className="mt-2 text-3xl font-black">
            1
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Menunggu persetujuan admin
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500">
            Peminjaman Selesai
          </p>

          <h2 className="mt-2 text-3xl font-black">
            1
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Total peminjaman selesai
          </p>
        </div>

      </div>

      {/* Peminjaman Terbaru */}
      <div className="space-y-4">

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Peminjaman Terbaru
            </h2>

          </div>

          <Link
            href="/peminjaman"
            className="text-sm font-semibold hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>

        {peminjamanTerbaru.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-xs text-zinc-500">
                  {item.id}
                </p>

                <h3 className="mt-1 text-lg font-bold">
                  {item.alat}
                </h3>

                <p className="mt-1 text-sm text-zinc-500">
                  {item.tanggal}
                </p>
              </div>

              <div className="flex items-center gap-4">

                <span
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                    item.status === "Disetujui"
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                      : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400"
                  }`}
                >
                  {item.status}
                </span>

                <Link
                  href="/peminjaman"
                  className="text-sm font-semibold hover:underline"
                >
                  Detail
                </Link>

              </div>

            </div>
          </div>
        ))}

      </div>

      {/* Aksi */}
      <div className="rounded-2xl border border-zinc-200 bg-zinc-100 p-6 dark:border-zinc-800 dark:bg-zinc-900">

        <h2 className="text-lg font-bold">
          Butuh alat untuk kebutuhanmu?
        </h2>

        <p className="mt-1 text-sm text-zinc-500">
          Cari kamera dan peralatan content creation yang tersedia.
        </p>

        <Link
          href="/kamera"
          className="mt-4 inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          Lihat Katalog Alat
        </Link>

      </div>

    </div>
  );
}