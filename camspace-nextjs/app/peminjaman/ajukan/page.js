"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function AjukanPage() {
  const searchParams = useSearchParams();
  const equipmentIdFromUrl = searchParams.get("id");

  const [dataKamera, setDataKamera] = useState([]);
  const [equipmentId, setEquipmentId] = useState(
    equipmentIdFromUrl || ""
  );
  const [tanggalMulai, setTanggalMulai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [keperluan, setKeperluan] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function ambilDataAlat() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/equipment");

        const text = await response.text();

        let result;

        try {
          result = JSON.parse(text);
        } catch {
          throw new Error(
            "Server mengembalikan response yang bukan JSON."
          );
        }

        if (!response.ok) {
          throw new Error(
            result.message || "Gagal mengambil data alat."
          );
        }

        const data = result.data || result;

        setDataKamera(data);

        if (equipmentIdFromUrl) {
          const alatAda = data.find(
            (item) =>
              String(item.id) === String(equipmentIdFromUrl)
          );

          if (alatAda) {
            setEquipmentId(String(alatAda.id));
          }
        }
      } catch (error) {
        setError(
          error.message || "Gagal mengambil data alat."
        );
      } finally {
        setLoading(false);
      }
    }

    ambilDataAlat();
  }, [equipmentIdFromUrl]);

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess(false);

    if (!equipmentId) {
      setError("Silakan pilih alat terlebih dahulu.");
      return;
    }

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

    if (Number(quantity) < 1) {
      setError("Jumlah alat minimal 1.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          equipment_id: Number(equipmentId),
          start_date: tanggalMulai,
          end_date: tanggalSelesai,
          quantity: Number(quantity),
        }),
      });

      const text = await response.text();

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          `Server mengembalikan response yang bukan JSON. Status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengirim pengajuan."
        );
      }

      setSuccess(true);

      setTanggalMulai("");
      setTanggalSelesai("");
      setQuantity(1);
      setKeperluan("");
    } catch (error) {
      setError(
        error.message || "Gagal mengirim pengajuan."
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12 space-y-6">
      <h1 className="text-3xl font-black">
        Form Pengajuan Peminjaman
      </h1>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            <p className="font-semibold">
              Pengajuan berhasil dikirim.
            </p>

            <p className="mt-1">
              Pengajuan kamu sedang menunggu proses dari admin.
            </p>

            <Link
              href="/status"
              className="mt-3 inline-block font-semibold underline"
            >
              Lihat Status Peminjaman
            </Link>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium">
              Pilih Alat
            </label>

            {loading ? (
              <div className="mt-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-500">
                Memuat daftar alat...
              </div>
            ) : dataKamera.length === 0 ? (
              <div className="mt-1 rounded-xl border border-zinc-200 px-4 py-2.5 text-sm text-zinc-500">
                Tidak ada alat yang tersedia.
              </div>
            ) : (
              <select
                value={equipmentId}
                onChange={(event) =>
                  setEquipmentId(event.target.value)
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm dark:border-zinc-800"
              >
                <option value="">
                  -- Pilih Alat --
                </option>

                {dataKamera.map((item) => (
                  <option
                    key={item.id}
                    value={item.id}
                  >
                    {item.name} - Rp
                    {Number(
                      item.price_per_day
                    ).toLocaleString("id-ID")}
                    /hari
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium">
                Tanggal Mulai
              </label>

              <input
                type="date"
                value={tanggalMulai}
                onChange={(event) =>
                  setTanggalMulai(event.target.value)
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm dark:border-zinc-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Tanggal Selesai
              </label>

              <input
                type="date"
                value={tanggalSelesai}
                onChange={(event) =>
                  setTanggalSelesai(event.target.value)
                }
                className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm dark:border-zinc-800"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">
              Jumlah
            </label>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(event) =>
                setQuantity(event.target.value)
              }
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm dark:border-zinc-800"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium">
              Keperluan Peminjaman
            </label>

            <textarea
              rows="3"
              value={keperluan}
              onChange={(event) =>
                setKeperluan(event.target.value)
              }
              placeholder="Kebutuhan tugas/konten..."
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm dark:border-zinc-800"
            />

            <p className="mt-1 text-xs text-zinc-500">
              Keperluan digunakan sebagai informasi pada form.
            </p>
          </div>

          <button
            type="submit"
            disabled={
              loading ||
              submitting ||
              dataKamera.length === 0
            }
            className="block w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting
              ? "Mengirim Pengajuan..."
              : "Kirim Pengajuan"}
          </button>
        </form>
      </div>
    </div>
  );
}