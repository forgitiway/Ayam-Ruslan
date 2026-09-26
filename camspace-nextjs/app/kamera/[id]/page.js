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
            <div className="flex items-start justify-between gap-4">
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
                    Alat dengan ID "{resolvedParams.id}" tidak ada dalam
                    katalog.
                  </p>
                </div>
              </div>

              <Link
                href="/kamera"
                className="shrink-0 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-100"
              >
                Kembali
              </Link>
            </div>
          </div>
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

              {/* STOK */}
              <p
                className={
                  stokHabis
                    ? "text-sm font-semibold text-zinc-500"
                    : "text-sm font-semibold text-zinc-800"
                }
              >
                {stokHabis
                  ? "Ketersediaan: Stok Habis"
                  : `Ketersediaan: ${item.stock} Unit Siap Sewa`}
              </p>

              {/* TOMBOL */}
              {stokHabis ? (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-xl bg-zinc-300 py-3 font-semibold text-zinc-500"
                >
                  Stok Habis
                </button>
              ) : (
                <Link
                  href={`/peminjaman/ajukan?id=${item.id}`}
                  className="block w-full rounded-xl bg-zinc-900 py-3 text-center font-semibold text-white shadow-md transition hover:bg-zinc-700"
                >
                  Ajukan Peminjaman Alat Ini
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}