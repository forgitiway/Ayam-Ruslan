"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function AjukanPeminjamanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const equipmentId = searchParams.get("id");

  const [user, setUser] = useState(null);
  const [equipment, setEquipment] = useState(null);

  const [loadingEquipment, setLoadingEquipment] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);

  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [keperluan, setKeperluan] = useState("");

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("camspace_token");

    // Belum login
    if (!token) {
      router.replace("/login");
      return;
    }

    // Tidak ada ID alat
    if (!equipmentId) {
      setLoadingEquipment(false);
      return;
    }

    async function loadData() {
      try {
        setError("");

        // =========================
        // 1. AMBIL DATA USER
        // =========================

        const userResponse = await apiFetch("/me", {
          method: "GET",
          token: token,
        });

        console.log("DATA USER PEMINJAMAN:", userResponse);

        const userData = userResponse.data;

        if (!userData || !userData.user_id) {
          throw new Error(
            "Data user tidak ditemukan."
          );
        }

        setUser(userData);

        // =========================
        // 2. AMBIL DATA ALAT
        // =========================

        const equipmentResponse = await fetch(
          "/api/equipment"
        );

        const equipmentData =
          await equipmentResponse.json();

        if (!equipmentResponse.ok) {
          throw new Error(
            equipmentData.message ||
              "Gagal mengambil data alat."
          );
        }

        const equipmentList =
          equipmentData.data || equipmentData;

        const selectedEquipment =
          equipmentList.find(
            (item) =>
              String(item.id) ===
              String(equipmentId)
          );

        if (!selectedEquipment) {
          throw new Error(
            "Alat tidak ditemukan."
          );
        }

        setEquipment(selectedEquipment);
      } catch (error) {
        console.error(
          "ERROR LOAD PEMINJAMAN:",
          error
        );

        setError(
          error.message ||
            "Gagal mengambil data."
        );
      } finally {
        setLoadingUser(false);
        setLoadingEquipment(false);
      }
    }

    loadData();
  }, [equipmentId, router]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!tanggalMulai || !tanggalSelesai) {
      setError(
        "Tanggal mulai dan tanggal selesai wajib diisi."
      );
      return;
    }

    if (tanggalSelesai < tanggalMulai) {
      setError(
        "Tanggal selesai tidak boleh sebelum tanggal mulai."
      );
      return;
    }

    if (!user || !user.user_id) {
      setError(
        "Data pengguna belum tersedia."
      );
      return;
    }

    try {
      setLoadingSubmit(true);

      const token =
        localStorage.getItem(
          "camspace_token"
        );

      if (!token) {
        router.replace("/login");
        return;
      }

      // =========================
      // DATA YANG DIKIRIM
      // =========================

      const rentalData = {
        user_id: user.user_id,
        equipment_id: Number(equipmentId),
        start_date: tanggalMulai,
        end_date: tanggalSelesai,
        quantity: Number(quantity),
        keperluan: keperluan,
      };

      console.log(
        "DATA PEMINJAMAN:",
        rentalData
      );

      const response = await fetch(
        "/api/rentals",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(
            rentalData
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal membuat pengajuan."
        );
      }

      console.log(
        "HASIL PEMINJAMAN:",
        data
      );

      // =========================
      // SIMPAN PENGAJUAN
      // UNTUK APPROVAL ADMIN
      // =========================

      const pengajuan = {
        id: Date.now(),
        user_id: user.user_id,
        user_name: user.name,
        equipment_id: Number(equipmentId),
        equipment_name: equipment.name,
        start_date: tanggalMulai,
        end_date: tanggalSelesai,
        quantity: Number(quantity),
        keperluan: keperluan,
        status: "pending",
      };

      const dataLama = JSON.parse(
        localStorage.getItem(
          "camspace_rentals"
        ) || "[]"
      );

      dataLama.push(pengajuan);

      localStorage.setItem(
        "camspace_rentals",
        JSON.stringify(dataLama)
      );

      // =========================
      // BERHASIL
      // =========================

      setSuccess(
        "Pengajuan peminjaman berhasil dikirim."
      );

      setTimeout(() => {
        router.push("/status");
      }, 1500);
    } catch (error) {
      console.error(
        "ERROR PEMINJAMAN:",
        error
      );

      setError(
        error.message ||
          "Gagal membuat pengajuan."
      );
    } finally {
      setLoadingSubmit(false);
    }
  }

  // =========================
  // ID ALAT TIDAK ADA
  // =========================

  if (!equipmentId) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          ID Alat Tidak Ditemukan
        </h1>

        <p className="text-sm text-zinc-500">
          Silakan pilih alat terlebih dahulu
          dari katalog.
        </p>

        <button
          onClick={() =>
            router.push("/kamera")
          }
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  // =========================
  // LOADING
  // =========================

  if (
    loadingEquipment ||
    loadingUser
  ) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <p className="text-zinc-500">
          Memuat data...
        </p>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error && !equipment) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          Terjadi Kesalahan
        </h1>

        <p className="text-sm text-red-500">
          {error}
        </p>

        <button
          onClick={() =>
            router.push("/kamera")
          }
          className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm text-indigo-600 hover:underline"
      >
        ← Kembali
      </button>

      <div className="space-y-6">

        {/* JUDUL */}
        <div>
          <h1 className="text-3xl font-black">
            Ajukan Peminjaman
          </h1>

          <p className="mt-1 text-sm text-zinc-500">
            Isi data peminjaman alat yang
            kamu butuhkan.
          </p>
        </div>

        {/* USER */}
        {user && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Akun Peminjam
            </p>

            <h2 className="mt-1 text-lg font-bold">
              {user.name}
            </h2>

            <p className="text-sm text-zinc-500">
              {user.email}
            </p>
          </div>
        )}

        {/* ALAT */}
        {equipment && (
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-xs font-semibold uppercase tracking-wide text-indigo-600">
              Alat yang Dipilih
            </p>

            <h2 className="mt-1 text-xl font-bold">
              {equipment.name}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {equipment.category} · Rp
              {Number(
                equipment.price_per_day
              ).toLocaleString("id-ID")}{" "}
              / hari
            </p>
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
        >
          {/* TANGGAL MULAI */}
          <div>
            <label className="block text-sm font-medium">
              Tanggal Mulai
            </label>

            <input
              type="date"
              value={tanggalMulai}
              onChange={(event) =>
                setTanggalMulai(
                  event.target.value
                )
              }
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800"
            />
          </div>

          {/* TANGGAL SELESAI */}
          <div>
            <label className="block text-sm font-medium">
              Tanggal Selesai
            </label>

            <input
              type="date"
              value={tanggalSelesai}
              onChange={(event) =>
                setTanggalSelesai(
                  event.target.value
                )
              }
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800"
            />
          </div>

          {/* JUMLAH */}
          <div>
            <label className="block text-sm font-medium">
              Jumlah
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) =>
                setQuantity(
                  event.target.value
                )
              }
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800"
            />
          </div>

          {/* KEPERLUAN */}
          <div>
            <label className="block text-sm font-medium">
              Keperluan
            </label>

            <textarea
              value={keperluan}
              onChange={(event) =>
                setKeperluan(
                  event.target.value
                )
              }
              placeholder="Contoh: Untuk dokumentasi acara kampus"
              rows={4}
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800"
            />
          </div>

          {/* ERROR */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-600">
              {success}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loadingSubmit}
            className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loadingSubmit
              ? "Mengirim Pengajuan..."
              : "Ajukan Peminjaman"}
          </button>
        </form>
      </div>
    </div>
  );
}