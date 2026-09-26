"use client";

import Link from "next/link";

const dataPeminjaman = [
  {
    id: "REQ-101",
    alat: "Canon EOS 600D",
    kategori: "DSLR",
    mulai: "12 September 2026",
    selesai: "14 September 2026",
    keperluan: "Dokumentasi kegiatan kampus",
    status: "Menunggu Approval",
  },
  {
    id: "REQ-102",
    alat: "Sony Alpha A6000",
    kategori: "Mirrorless",
    mulai: "20 September 2026",
    selesai: "21 September 2026",
    keperluan: "Pembuatan konten",
    status: "Disetujui",
  },
];

export default function PeminjamanPage() {
  const menunggu = dataPeminjaman.filter(
    (item) => item.status === "Menunggu Approval"
  ).length;

  const disetujui = dataPeminjaman.filter(
    (item) => item.status === "Disetujui"
  ).length;

  const dipinjam = dataPeminjaman.filter(
    (item) => item.status === "Sedang Dipinjam"
  ).length;

  const selesai = dataPeminjaman.filter(
    (item) => item.status === "Selesai"
  ).length;

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Peminjaman Saya</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Lihat dan kelola pengajuan peminjaman alatmu.
          </p>
        </div>

        <Link
          href="/peminjaman/ajukan"
          className="rounded-xl bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          + Ajukan Peminjaman
        </Link>
      </div>

      {/* Daftar Peminjaman */}
      <div className="space-y-4">
        {dataPeminjaman.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              
              {/* Informasi alat */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h2 className="text-lg font-bold">{item.alat}</h2>

                  <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                    {item.kategori}
                  </span>
                </div>

                <p className="text-sm text-zinc-500">
                  {item.id}
                </p>

                <p className="text-sm">
                  <span className="font-medium">Tanggal:</span>{" "}
                  {item.mulai} - {item.selesai}
                </p>

                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  <span className="font-medium">Keperluan:</span>{" "}
                  {item.keperluan}
                </p>
              </div>

              {/* Status dan tombol */}
              <div className="flex flex-col items-start gap-3 md:items-end">
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
                  href="/status"
                  className="text-sm font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
                >
                  Lihat Status →
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Empty state jika nanti data kosong */}
      {dataPeminjaman.length === 0 && (
        <div className="rounded-2xl border border-dashed border-zinc-300 p-12 text-center dark:border-zinc-700">
          <h2 className="font-bold">Belum ada peminjaman</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Yuk, cari alat yang kamu butuhkan dan ajukan peminjaman.
          </p>

          <Link
            href="/kamera"
            className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            Lihat Katalog Alat
          </Link>
        </div>
      )}

    </div>
  );
}