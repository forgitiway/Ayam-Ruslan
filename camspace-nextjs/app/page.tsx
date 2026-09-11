import Link from "next/link";
import { dataKamera } from "@/data/kamera";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      {/* Dynamic Hero Banner Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <span className="inline-block rounded-full bg-indigo-500/20 px-4 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
            Platform Sewa Alat Konten & Fotografi
          </span>
          
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Let's Create Beautiful Work <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
              Together with CamSpace
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-300">
            Sewa kamera DSLR, Mirrorless, Digicam, Lensa, Lighting, dan Tripod untuk keperluan tugas, pembuatan konten, hingga dokumentasi acara.
          </p>

          <div className="mx-auto max-w-xl pt-4">
            <div className="flex flex-col sm:flex-row gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur-md border border-white/15">
              <input
                type="text"
                placeholder="Cari kamera, lensa, atau lighting..."
                className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-zinc-400 outline-none"
              />
              <Link
                href="/kamera"
                className="rounded-xl bg-indigo-600 px-6 py-3 text-center text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                Cari Alat
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Catalog Preview Section */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Kamera & Alat Populer</h2>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Pilihan favorit untuk kebutuhan multimedia
            </p>
          </div>
          <Link
            href="/kamera"
            className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Lihat Semua →
          </Link>
        </div>

        {/* Dynamic Card Grid Menggunakan Gambar dari Public */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dataKamera.slice(0, 3).map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
            >
              <div>
                {/* TAMPILAN GAMBAR FISIK DARI PUBLIC/IMAGES */}
                <div className="h-44 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  <img
                    src={item.gambar}
                    alt={item.nama}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {item.kategori}
                  </span>
                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Stok: {item.stok}
                  </span>
                </div>
                <h3 className="text-lg font-bold mt-1">{item.nama}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Rp{item.harga.toLocaleString("id-ID")} / hari
                </p>
              </div>

              <Link
                href={`/kamera/${item.id}`}
                className="mt-4 block text-center rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
              >
                Lihat Detail & Sewa
              </Link>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}