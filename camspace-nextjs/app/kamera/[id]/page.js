import Link from "next/link";
import { dataKamera } from "@/data/kamera";

export default async function DetailAlatPage({ params }) {
  // Await params agar nilainya terbaca dengan benar di Next.js
  const resolvedParams = await params;
  
  // Cari barang berdasarkan ID yang diklik
  const item = dataKamera.find((k) => String(k.id) === String(resolvedParams.id));

  // Jika ID tidak ditemukan di data/kamera.js
  if (!item) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Peralatan Tidak Ditemukan</h1>
        <p className="text-sm text-zinc-500">
          Alat dengan ID "{resolvedParams.id}" tidak ada dalam katalog.
        </p>
        <Link href="/kamera" className="inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white font-medium">
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-8 font-sans">
      <Link href="/kamera" className="text-sm text-indigo-600 hover:underline dark:text-indigo-400">
        ← Kembali ke Katalog
      </Link>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Gambar Alat */}
        <div className="h-64 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          <img
            src={item.gambar}
            alt={item.nama}
            className="h-full w-full object-cover"
          />
        </div>

        {/* Detail Info */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {item.kategori}
          </span>
          <h1 className="text-3xl font-black">{item.nama}</h1>
          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Rp{item.harga.toLocaleString("id-ID")} <span className="text-sm font-normal text-zinc-500">/ hari</span>
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {item.deskripsi}
          </p>
          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Ketersediaan: {item.stok} Unit Siap Sewa
          </p>

          <Link
            href="/peminjaman/ajukan"
            className="block text-center w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
          >
            Ajukan Peminjaman Alat Ini
          </Link>
        </div>
      </div>
    </div>
  );
}