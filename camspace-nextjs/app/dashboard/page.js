import Link from "next/link";

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
  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black">
          Profil
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Selamat datang kembali di CamSpace 👋
        </p>

        <p className="text-sm text-zinc-500">
          Pantau aktivitas peminjaman alatmu di sini.
        </p>
      </div>

      {/* Ringkasan */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Peminjaman Aktif
          </p>

          <h2 className="mt-2 text-3xl font-black text-zinc-900 dark:text-zinc-100">
            1
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Sedang dipinjam
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Menunggu Approval
          </p>

          <h2 className="mt-2 text-3xl font-black text-zinc-900 dark:text-zinc-100">
            1
          </h2>

          <p className="mt-1 text-xs text-zinc-500">
            Menunggu persetujuan admin
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Peminjaman Selesai
          </p>

          <h2 className="mt-2 text-3xl font-black text-zinc-900 dark:text-zinc-100">
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

            <p className="text-sm text-zinc-500">
              Aktivitas peminjaman terakhir kamu.
            </p>
          </div>

          <Link
            href="/status"
            className="text-sm font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
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

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
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
                  href="/status"
                  className="text-sm font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
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

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
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