"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [rentals, setRentals] = useState([]);
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

        let userData = null;

        const currentUser = localStorage.getItem("camspace_current_user");

        if (currentUser) {
          const admin = JSON.parse(currentUser);
          userData = admin;
          setUser(admin);

          const savedProfile = JSON.parse(
            localStorage.getItem(
              `camspace_profile_${admin.user_id || admin.id}`
            ) || "{}"
          );

          setName(savedProfile.name || admin.name || "");
          setPhone(savedProfile.phone || admin.phone || "");
        } else {
          const response = await apiFetch("/me", {
            method: "GET",
            token,
          });

          userData =
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
        }

        // Ambil data rental user
        const rentalResponse = await fetch("/api/rentals");
        const rentalData = await rentalResponse.json();

        const rentalList = Array.isArray(rentalData)
          ? rentalData
          : rentalData.data || rentalData.rentals || [];

        const userRentals = rentalList.filter(
          (r) =>
            Number(r.user_id) ===
            Number(userData.user_id || userData.id)
        );

        setRentals(userRentals);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
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

  const peminjamanAktif = rentals.filter(
    (r) => r.status === "ongoing"
  ).length;

  const menungguApproval = rentals.filter(
    (r) => r.status === "pending"
  ).length;

  const peminjamanSelesai = rentals.filter(
    (r) => r.status === "completed"
  ).length;

  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">

      {/* Toast */}
      <div
        className={`fixed right-6 top-20 z-50 transition-all duration-300 ${
          showSuccess
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-10 opacity-0"
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

          <div>
            <label className="mb-2 block text-sm font-medium">
              Nama
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-black dark:border-zinc-700 dark:bg-zinc-800 dark:text-white"
            />
          </div>

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
            {peminjamanAktif}
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
            {menungguApproval}
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
            {peminjamanSelesai}
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Total peminjaman selesai
          </p>
        </div>

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