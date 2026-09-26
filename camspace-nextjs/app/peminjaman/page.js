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
  return (
    <div className="min-h-screen bg-zinc-200 px-6 py-12 font-sans">
      <div className="mx-auto max-w-5xl space-y-8">

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-black text-black">
              Peminjaman Saya
            </h1>

            <p className="mt-2 text-sm text-zinc-600">
              Lihat dan kelola pengajuan peminjaman alatmu.
            </p>
          </div>

          <Link
            href="/peminjaman/ajukan"
            className="rounded-xl bg-black px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            + Ajukan Peminjaman
          </Link>
        </div>

        {/* CARD DATA PEMINJAMAN */}
        <div className="rounded-2xl bg-white p-6 shadow-sm">

          <h2 className="mb-6 text-xl font-bold text-black">
            Data Peminjaman
          </h2>

          {/* Daftar Peminjaman */}
          <div className="space-y-4">
            {dataPeminjaman.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-zinc-200 bg-white p-6"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  {/* Informasi alat */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-black">
                        {item.alat}
                      </h3>

                      <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                        {item.kategori}
                      </span>
                    </div>

                    <p className="text-sm text-zinc-500">
                      {item.id}
                    </p>

                    <p className="text-sm text-zinc-700">
                      <span className="font-medium">Tanggal:</span>{" "}
                      {item.mulai} - {item.selesai}
                    </p>

                    <p className="text-sm text-zinc-600">
                      <span className="font-medium">Keperluan:</span>{" "}
                      {item.keperluan}
                    </p>
                  </div>

                  {/* Status */}
                  <div className="flex flex-col items-start gap-3 md:items-end">
                    <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-semibold text-zinc-700">
                      {item.status}
                    </span>

                    <Link
                      href="/status"
                      className="text-sm font-semibold text-black hover:underline"
                    >
                      Lihat Status →
                    </Link>
                  </div>

                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {dataPeminjaman.length === 0 && (
            <div className="rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center">
              <h2 className="font-bold text-black">
                Belum ada peminjaman
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Yuk, cari alat yang kamu butuhkan dan ajukan peminjaman.
              </p>

              <Link
                href="/kamera"
                className="mt-5 inline-block rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              >
                Lihat Katalog Alat
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}