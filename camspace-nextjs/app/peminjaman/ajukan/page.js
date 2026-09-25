
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

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!equipmentId) return;

    async function loadData() {
      try {
        setError("");

        const userResponse = await apiFetch("/me", {
          method: "GET",
          token,
        });

        setUser(userResponse.data);

        const equipmentResponse = await fetch("/api/equipment");
        const equipmentData = await equipmentResponse.json();

        const list = equipmentData.data || equipmentData;

        const selected = list.find(
          (item) => String(item.id) === String(equipmentId)
        );

        if (!selected) throw new Error("Alat tidak ditemukan.");

        setEquipment(selected);
      } catch (err) {
        setError(err.message || "Gagal mengambil data.");
      } finally {
        setLoadingEquipment(false);
        setLoadingUser(false);
      }
    }

    loadData();
  }, [equipmentId, router]);

  // =============================
  // HITUNG TOTAL HARGA OTOMATIS
  // =============================

  const jumlahHari =
    tanggalMulai && tanggalSelesai
      ? Math.max(
          1,
          Math.ceil(
            (new Date(tanggalSelesai) - new Date(tanggalMulai)) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  const totalHarga =
    equipment && jumlahHari
      ? Number(equipment.price_per_day) *
        Number(quantity) *
        jumlahHari
      : 0;

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!tanggalMulai || !tanggalSelesai) {
      setError("Tanggal mulai dan selesai wajib diisi.");
      return;
    }

    if (tanggalSelesai < tanggalMulai) {
      setError("Tanggal selesai tidak boleh sebelum tanggal mulai.");
      return;
    }

    try {
      setLoadingSubmit(true);

      const token = localStorage.getItem("camspace_token");

      const rentalData = {
        user_id: user.user_id,
        equipment_id: Number(equipmentId),
        start_date: tanggalMulai,
        end_date: tanggalSelesai,
        quantity: Number(quantity),
        keperluan,
      };

      const response = await fetch("/api/rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rentalData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal membuat pengajuan.");
      }

      // Simpan data untuk halaman status

      const pengajuan = {
        id: Date.now(),
        user_id: user.user_id,
        user_name: user.name,
        equipment_id: Number(equipmentId),
        equipment_name: equipment.name,
        start_date: tanggalMulai,
        end_date: tanggalSelesai,
        quantity: Number(quantity),
        keperluan,
        status: "pending",

        price_per_day: Number(equipment.price_per_day),
        jumlah_hari: jumlahHari,
        total_price: totalHarga,
      };

      const lama = JSON.parse(
        localStorage.getItem("camspace_rentals") || "[]"
      );

      lama.push(pengajuan);

      localStorage.setItem(
        "camspace_rentals",
        JSON.stringify(lama)
      );

      setSuccess("Pengajuan berhasil dikirim.");

      setTimeout(() => {
        router.push("/status");
      }, 1200);
    } catch (err) {
      setError(err.message || "Gagal membuat pengajuan.");
    } finally {
      setLoadingSubmit(false);
    }
  }

  if (!equipmentId)
    return (
      <div className="p-10 text-center">
        ID alat tidak ditemukan.
      </div>
    );

  if (loadingEquipment || loadingUser)
    return (
      <div className="p-10 text-center">
        Memuat...
      </div>
    );

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm font-medium hover:underline"
      >
        ← Kembali
      </button>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black">
            Ajukan Peminjaman
          </h1>
          <p className="text-zinc-500">
            Isi data peminjaman alat.
          </p>
        </div>

        {user && (
          <div className="rounded-2xl border p-5">
            <p className="text-xs uppercase text-zinc-500">
              Peminjam
            </p>
            <h2 className="font-bold">{user.name}</h2>
            <p className="text-sm text-zinc-500">
              {user.email}
            </p>
          </div>
        )}

        {equipment && (
          <div className="rounded-2xl border p-5">
            <p className="text-xs uppercase text-zinc-500">
              Alat
            </p>
            <h2 className="text-xl font-bold">
              {equipment.name}
            </h2>
            <p className="text-sm text-zinc-500">
              {equipment.category} • Rp
              {Number(
                equipment.price_per_day
              ).toLocaleString("id-ID")}{" "}
              / hari
            </p>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border p-6"
        >
          <div>
            <label className="block text-sm font-medium">
              Tanggal Mulai
            </label>
            <input
              type="date"
              value={tanggalMulai}
              onChange={(e) =>
                setTanggalMulai(e.target.value)
              }
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Tanggal Selesai
            </label>
            <input
              type="date"
              value={tanggalSelesai}
              onChange={(e) =>
                setTanggalSelesai(e.target.value)
              }
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Jumlah
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) =>
                setQuantity(e.target.value)
              }
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Keperluan
            </label>
            <textarea
              rows={4}
              value={keperluan}
              onChange={(e) =>
                setKeperluan(e.target.value)
              }
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          {/* Ringkasan Harga */}

          {equipment && jumlahHari > 0 && (
            <div className="rounded-xl bg-zinc-100 p-4">
              <div className="flex justify-between text-sm">
                <span>Harga / Hari</span>
                <span>
                  Rp
                  {Number(
                    equipment.price_per_day
                  ).toLocaleString("id-ID")}
                </span>
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span>Lama Peminjaman</span>
                <span>{jumlahHari} Hari</span>
              </div>

              <div className="mt-2 flex justify-between text-sm">
                <span>Jumlah</span>
                <span>{quantity} Unit</span>
              </div>

              <div className="mt-3 flex justify-between border-t pt-3 font-bold text-lg">
                <span>Total Harga</span>
                <span>
                  Rp{totalHarga.toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              {success}
            </div>
          )}

          <button
            type="submit"
            disabled={loadingSubmit}
            className="w-full rounded-xl bg-black py-3 font-semibold text-white hover:bg-zinc-800 disabled:opacity-50"
          >
            {loadingSubmit
              ? "Mengirim..."
              : "Ajukan Peminjaman"}
          </button>
        </form>
      </div>
    </div>
  );
}