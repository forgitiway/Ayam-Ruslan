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
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">Peminjaman Saya</h1>

          <p className="mt-2 text-sm text-zinc-500">
            Pantau status dan riwayat peminjaman alatmu.
          </p>
        </div>

        <Link
          href="/kamera"
          className="rounded-xl bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
        >
          + Ajukan Peminjaman
        </Link>
      </div>

      {/* STATUS PEMINJAMAN */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Status Peminjaman</h2>

          <p className="text-sm text-zinc-500">
            Ringkasan status pengajuan dan peminjamanmu.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Menunggu</p>

            <h3 className="mt-2 text-3xl font-black">{menunggu}</h3>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Disetujui</p>

            <h3 className="mt-2 text-3xl font-black">{disetujui}</h3>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Dipinjam</p>

            <h3 className="mt-2 text-3xl font-black">{dipinjam}</h3>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <p className="text-sm text-zinc-500">Selesai</p>

            <h3 className="mt-2 text-3xl font-black">{selesai}</h3>
          </div>
        </div>
      </div>

      {/* RIWAYAT PEMINJAMAN */}
      <div className="space-y-4">
        <div>
          <h2 className="text-xl font-bold">Riwayat Peminjaman</h2>

          <p className="text-sm text-zinc-500">
            Daftar seluruh pengajuan peminjamanmu.
          </p>
        </div>

        {dataPeminjaman.length === 0 ? (
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
        ) : (
          dataPeminjaman.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                {/* Informasi Alat */}
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-bold">{item.alat}</h2>

                    <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
                      {item.kategori}
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-zinc-500">{item.id}</p>

                  <div className="mt-5 grid grid-cols-2 gap-4 border-t border-zinc-100 pt-5 sm:grid-cols-2 md:grid-cols-4 dark:border-zinc-800">

                    <div>
                      <p className="text-xs text-zinc-500">Tanggal Mulai</p>

                      <p className="mt-1 text-sm font-semibold">
                        {item.mulai}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-zinc-500">Tanggal Selesai</p>

                      <p className="mt-1 text-sm font-semibold">
                        {item.selesai}
                      </p>
                    </div>

                    <div className="md:col-span-2">
                      <p className="text-xs text-zinc-500">Keperluan</p>

                      <p className="mt-1 text-sm font-semibold">
                        {item.keperluan}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Status */}
                <div className="flex flex-col items-start gap-3 md:items-end">
                  <span
                    className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                      item.status === "Disetujui"
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                        : item.status === "Menunggu Approval"
                        ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                        : item.status === "Selesai"
                        ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
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
          ))
        )}
      </div>

    </div>
  );
}