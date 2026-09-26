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
      <div className="min-h-screen bg-zinc-200 px-6 py-12 font-sans">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 md:p-8">
            <div className="flex items-start gap-4">
              <Link
                href="/kamera"
                className="text-2xl font-medium text-zinc-700 transition hover:text-zinc-950"
              >
                ←
              </Link>

              <div>
                <h1 className="text-2xl font-bold text-zinc-900">
                  Gagal Mengambil Data
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                  {error.message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!item?.id) {
    return (
      <div className="min-h-screen bg-zinc-200 px-6 py-12 font-sans">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 md:p-8">
            <div className="flex items-start gap-4">
              <Link
                href="/kamera"
                className="text-2xl font-medium text-zinc-700 transition hover:text-zinc-950"
              >
                ←
              </Link>

              <div>
                <h1 className="text-2xl font-bold text-zinc-900">
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

  // =====================================================
  // CEK STOK
  // =====================================================

  const stokHabis = Number(item.stock) <= 0;

  return (
    <div className="min-h-screen bg-zinc-200 px-6 py-12 font-sans">
      <div className="mx-auto max-w-4xl">

        {/* CARD UTAMA DETAIL */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-zinc-200 md:p-8">

          {/* HEADER */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <Link
                href="/kamera"
                className="text-2xl font-medium text-zinc-700 transition hover:text-zinc-950"
                aria-label="Kembali"
              >
                ←
              </Link>

              <h1 className="text-3xl font-black text-zinc-900">
                Detail Alat
              </h1>
            </div>
          </div>

          {/* ISI DETAIL */}
          <div className="grid grid-cols-1 items-center gap-8 md:grid-cols-2">

            {/* GAMBAR */}
            <div className="h-64 overflow-hidden rounded-2xl bg-zinc-100">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-full w-full object-cover grayscale"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                  Tidak ada gambar
                </div>
              )}
            </div>

            {/* INFORMASI ALAT */}
            <div className="space-y-4">

              {/* KATEGORI */}
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-600">
                {item.category}
              </span>

              {/* NAMA */}
              <h2 className="text-3xl font-black text-zinc-900">
                {item.name}
              </h2>

              {/* HARGA */}
              <p className="text-2xl font-bold text-zinc-900">
                Rp{Number(item.price_per_day).toLocaleString("id-ID")}
                <span className="text-sm font-normal text-zinc-500">
                  {" "}
                  / hari
                </span>
              </p>

              {/* DESKRIPSI */}
              <p className="text-sm leading-relaxed text-zinc-600">
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