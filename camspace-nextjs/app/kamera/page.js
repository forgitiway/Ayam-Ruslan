import Link from "next/link";
import { dataKamera } from "@/data/kamera";

export default function KatalogPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Katalog Alat Multimedia</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Pilih alat multimedia sesuai kebutuhan produksi kamu.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {dataKamera.map((item) => (
          <div key={item.id} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
            <div>
              {/* BAGIAN GAMBAR YANG DISESUAIKAN */}
              <div className="h-44 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={item.gambar}
                  alt={item.nama}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{item.kategori}</span>
                <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Stok: {item.stok}</span>
              </div>
              <h3 className="text-lg font-bold mt-1">{item.nama}</h3>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">Rp{item.harga.toLocaleString("id-ID")} / hari</p>
            </div>
            
            <Link href={`/kamera/${item.id}`} className="mt-4 block text-center rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500">
              Lihat Detail & Sewa
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}