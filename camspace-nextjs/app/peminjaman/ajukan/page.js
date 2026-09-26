"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch } from "@/lib/api";

function getTanggalHariIni() {
  const sekarang = new Date();

  const tahun = sekarang.getFullYear();

  const bulan = String(
    sekarang.getMonth() + 1
  ).padStart(2, "0");

  const tanggal = String(
    sekarang.getDate()
  ).padStart(2, "0");

  return `${tahun}-${bulan}-${tanggal}`;
}

export default function AjukanPeminjamanPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const equipmentId = searchParams.get("id");

  const hariIni = getTanggalHariIni();

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

  // =============================
  // AMBIL DATA USER DAN ALAT
  // =============================

  useEffect(() => {
    const token = localStorage.getItem("camspace_token");

    if (!token) {
      router.replace("/login");
      return;
    }

    if (!equipmentId) {
      setLoadingEquipment(false);
      setLoadingUser(false);
      return;
    }

    async function loadData() {
      try {
        setError("");

        // =============================
        // AMBIL DATA USER
        // =============================

        const userResponse = await apiFetch("/me", {
          method: "GET",
          token,
        });

        setUser(userResponse.data);

        // =============================
        // AMBIL DATA ALAT
        // =============================

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

        const list =
          equipmentData.data || equipmentData;

        const selected = list.find(
          (item) =>
            String(item.id) ===
            String(equipmentId)
        );

        if (!selected) {
          throw new Error(
            "Alat tidak ditemukan."
          );
        }

        setEquipment(selected);

        // ==================================================
        // JIKA STOK 0, TIDAK BOLEH MELAKUKAN PEMINJAMAN
        // ==================================================

        if (Number(selected.stock) <= 0) {
          setError(
            "Alat ini sedang tidak tersedia karena stok habis."
          );
        }
      } catch (err) {
        console.error(
          "ERROR LOAD DATA:",
          err
        );

        setError(
          err.message ||
            "Gagal mengambil data."
        );
      } finally {
        setLoadingEquipment(false);
        setLoadingUser(false);
      }
    }

    loadData();
  }, [equipmentId, router]);

  // =============================
  // HITUNG JUMLAH HARI
  // =============================

  const jumlahHari =
    tanggalMulai && tanggalSelesai
      ? Math.max(
          1,
          Math.ceil(
            (new Date(tanggalSelesai) -
              new Date(tanggalMulai)) /
              (1000 * 60 * 60 * 24)
          ) + 1
        )
      : 0;

  // =============================
  // HITUNG TOTAL HARGA
  // =============================

  const totalHarga =
    equipment && jumlahHari
      ? Number(
          equipment.price_per_day
        ) *
        Number(quantity) *
        jumlahHari
      : 0;

  // =============================
  // SUBMIT PEMINJAMAN
  // =============================

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    // =============================
    // VALIDASI TANGGAL
    // =============================

    if (
      !tanggalMulai ||
      !tanggalSelesai
    ) {
      setError(
        "Tanggal mulai dan selesai wajib diisi."
      );
      return;
    }

    if (tanggalMulai < hariIni) {
      setError(
        "Tanggal mulai tidak boleh sebelum hari ini."
      );
      return;
    }

    if (tanggalSelesai < hariIni) {
      setError(
        "Tanggal selesai tidak boleh sebelum hari ini."
      );
      return;
    }

    if (
      tanggalSelesai < tanggalMulai
    ) {
      setError(
        "Tanggal selesai tidak boleh sebelum tanggal mulai."
      );
      return;
    }

    // =============================
    // VALIDASI JUMLAH
    // =============================

    if (Number(quantity) < 1) {
      setError(
        "Jumlah peminjaman minimal 1 unit."
      );
      return;
    }

    // ==================================================
    // VALIDASI JUMLAH TIDAK BOLEH MELEBIHI STOK
    // ==================================================

    if (
      equipment &&
      Number(quantity) > Number(equipment.stock)
    ) {
      setError(
        `Jumlah peminjaman tidak boleh melebihi stok yang tersedia (${equipment.stock} unit).`
      );
      return;
    }

    // ==================================================
    // VALIDASI STOK HABIS
    // ==================================================

    if (
      equipment &&
      Number(equipment.stock) <= 0
    ) {
      setError(
        "Alat ini sedang tidak tersedia karena stok habis."
      );
      return;
    }

    // =============================
    // VALIDASI USER
    // =============================

    if (!user) {
      setError(
        "Data pengguna tidak ditemukan."
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

      // =============================
      // DATA PEMINJAMAN
      // =============================

      const rentalData = {
        user_id: user.user_id,
        equipment_id: Number(equipmentId),
        start_date: tanggalMulai,
        end_date: tanggalSelesai,
        quantity: Number(quantity),
        keperluan: keperluan,
      };

      console.log(
        "DATA YANG DIKIRIM:",
        rentalData
      );

      // =============================
      // KIRIM KE API RENTALS
      // =============================

      const response = await fetch(
        "/api/rentals",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
            Authorization:
              `Bearer ${token}`,
          },
          body: JSON.stringify(
            rentalData
          ),
        }
      );

      const data =
        await response.json();

      console.log(
        "HASIL POST RENTAL:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Gagal membuat pengajuan."
        );
      }

      // =============================
      // BERHASIL
      // =============================

      setSuccess(
        "Pengajuan berhasil dikirim dan menunggu persetujuan admin."
      );

      // =============================
      // PINDAH KE STATUS
      // =============================

      setTimeout(() => {
        router.push("/status");
      }, 1200);

    } catch (err) {
      console.error(
        "ERROR PENGAJUAN:",
        err
      );

      setError(
        err.message ||
          "Gagal membuat pengajuan."
      );
    } finally {
      setLoadingSubmit(false);
    }
  }

  // =============================
  // ID ALAT TIDAK ADA
  // =============================

  if (!equipmentId) {
    return (
      <div className="p-10 text-center">
        ID alat tidak ditemukan.
      </div>
    );
  }

  // =============================
  // LOADING
  // =============================

  if (
    loadingEquipment ||
    loadingUser
  ) {
    return (
      <div className="p-10 text-center">
        Memuat...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">

      {/* KEMBALI */}
      <button
        onClick={() => router.back()}
        className="mb-6 text-sm font-medium hover:underline"
      >
        Kembali
      </button>

      <div className="space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-3xl font-black">
            Ajukan Peminjaman
          </h1>

          <p className="text-zinc-500">
            Isi data peminjaman alat.
          </p>
        </div>

        {/* USER */}
        {user && (
          <div className="rounded-2xl border p-5">
            <p className="text-xs uppercase text-zinc-500">
              Peminjam
            </p>

            <h2 className="font-bold">
              {user.name}
            </h2>

            <p className="text-sm text-zinc-500">
              {user.email}
            </p>
          </div>
        )}

        {/* ALAT */}
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
              ).toLocaleString(
                "id-ID"
              )}{" "}
              / hari
            </p>
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-2xl border p-6"
        >

          {/* TANGGAL MULAI */}
          <div>
            <label className="block text-sm font-medium">
              Tanggal Mulai
            </label>

            <input
              type="date"
              min={hariIni}
              value={tanggalMulai}
              onChange={(e) => {
                const tanggal =
                  e.target.value;

                setTanggalMulai(
                  tanggal
                );

                if (
                  tanggalSelesai &&
                  tanggalSelesai < tanggal
                ) {
                  setTanggalSelesai("");
                }
              }}
              className="mt-1 w-full rounded-xl border px-4 py-2"
            />
          </div>

          {/* TANGGAL SELESAI */}
          <div>
            <label className="block text-sm font-medium">
              Tanggal Selesai
            </label>

            <input
              type="date"
              min={
                tanggalMulai ||
                hariIni
              }
              value={tanggalSelesai}
              onChange={(e) =>
                setTanggalSelesai(
                  e.target.value
                )
              }
              className="mt-1 w-full rounded-xl border px-4 py-2"
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
    max={
      equipment
        ? Number(equipment.stock)
        : undefined
    }
    value={quantity}
    onChange={(e) => {
      const nilai = Number(e.target.value);

      if (
        equipment &&
        nilai > Number(equipment.stock)
      ) {
        setQuantity(Number(equipment.stock));
        return;
      }

      setQuantity(e.target.value);
    }}
    className="mt-1 w-full rounded-xl border px-4 py-2"
  />
</div>

          {/* RINGKASAN HARGA */}
          {equipment &&
            jumlahHari > 0 && (
              <div className="rounded-xl bg-zinc-100 p-4">

                <div className="flex justify-between text-sm">
                  <span>
                    Harga / Hari
                  </span>

                  <span>
                    Rp
                    {Number(
                      equipment.price_per_day
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span>
                    Lama Peminjaman
                  </span>

                  <span>
                    {jumlahHari} Hari
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span>
                    Jumlah
                  </span>

                  <span>
                    {quantity} Unit
                  </span>
                </div>

                <div className="mt-3 flex justify-between border-t pt-3 text-lg font-bold">
                  <span>
                    Total Harga
                  </span>

                  <span>
                    Rp
                    {totalHarga.toLocaleString(
                      "id-ID"
                    )}
                  </span>
                </div>

              </div>
            )}

          {/* ERROR */}
          {error && (
            <div className="rounded-xl bg-red-100 p-3 text-red-700">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {success && (
            <div className="rounded-xl bg-green-100 p-3 text-green-700">
              {success}
            </div>
          )}

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={
              loadingSubmit ||
              !equipment ||
              Number(equipment.stock) <= 0
            }
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