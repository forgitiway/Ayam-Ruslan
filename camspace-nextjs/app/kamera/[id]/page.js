import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default async function DetailAlatPage({ params }) {
  const resolvedParams = await params;

  let item;

  try {
    item = await apiFetch(`/equipment/${resolvedParams.id}`, {
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
    });
  } catch (error) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Gagal Mengambil Data</h1>

        <p className="text-sm text-zinc-500">
          {error.message}
        </p>

        <Link
          href="/kamera"
          className="inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white font-medium"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  if (!item || !item.id) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">
          Peralatan Tidak Ditemukan
        </h1>

        <p className="text-sm text-zinc-500">
          Alat dengan ID "{resolvedParams.id}" tidak ada dalam katalog.
        </p>

        <Link
          href="/kamera"
          className="inline-block rounded-xl bg-indigo-600 px-4 py-2 text-sm text-white font-medium"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-8 font-sans">
      <Link
        href="/kamera"
        className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
      >
        ← Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Gambar Alat */}
        <div className="h-64 overflow-hidden rounded-2xl bg-zinc-100 dark:bg-zinc-800">
          {item.image_url ? (
            <img
              src={item.image_url}
              alt={item.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-400">
              Tidak ada gambar
            </div>
          )}
        </div>

        {/* Detail Info */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {item.category}
          </span>

          <h1 className="text-3xl font-black">
            {item.name}
          </h1>

          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Rp{Number(item.price_per_day).toLocaleString("id-ID")}
            <span className="text-sm font-normal text-zinc-500">
              {" "}
              / hari
            </span>
          </p>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {item.description || "Belum ada deskripsi alat."}
          </p>

          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Ketersediaan: {item.stock} Unit Siap Sewa
          </p>

          <Link
            href={`/peminjaman/ajukan?id=${item.id}`}
            className="block text-center w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-500/20"
          >
            Ajukan Peminjaman Alat Ini
          </Link>
        </div>
      </div>
    </div>
  );
}