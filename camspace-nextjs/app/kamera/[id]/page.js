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
      <div className="mx-auto max-w-4xl px-6 py-12 font-sans">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Gagal Mengambil Data
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              {error.message}
            </p>
          </div>

          <Link
            href="/kamera"
            className="shrink-0 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  if (!item?.id) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 font-sans">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Peralatan Tidak Ditemukan
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Alat dengan ID "{resolvedParams.id}" tidak ada dalam katalog.
            </p>
          </div>

          <Link
            href="/kamera"
            className="shrink-0 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 font-sans">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black">
            Detail Alat
          </h1>

          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Informasi lengkap alat multimedia.
          </p>
        </div>

        <Link
          href="/kamera"
          className="shrink-0 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Kembali
        </Link>
      </div>

      <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">
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

        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
            {item.category}
          </span>

          <h2 className="text-3xl font-black">
            {item.name}
          </h2>

          <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
            Rp{Number(item.price_per_day).toLocaleString("id-ID")}
            <span className="text-sm font-normal text-zinc-500">
              {" "}
              / hari
            </span>
          </p>

          <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
            {item.description || "Belum ada deskripsi alat."}
          </p>

          <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            Ketersediaan: {item.stock} Unit Siap Sewa
          </p>

          <Link
            href={`/peminjaman/ajukan?id=${item.id}`}
            className="block w-full rounded-xl bg-indigo-600 py-3 text-center font-semibold text-white shadow-md shadow-indigo-500/20 transition hover:bg-indigo-500"
          >
            Ajukan Peminjaman Alat Ini
          </Link>
        </div>
      </div>
    </div>
  );
}