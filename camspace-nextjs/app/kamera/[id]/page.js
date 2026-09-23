import Link from "next/link";
import { apiFetch } from "@/lib/api";

const imageMap = {
  "Sony A7III":
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80",
  "Canon EOS R6":
    "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=1200&q=80",
  "Tripod Manfrotto":
    "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=1200&q=80",
};

export default async function DetailAlatPage({ params }) {
  const { id } = await params;

  let item;

  try {
    const response = await apiFetch(`/equipment/${id}`, {
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
    });

    item = response.data || response;
  } catch (error) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Gagal Mengambil Data</h1>

        <p className="text-sm text-zinc-500">{error.message}</p>

        <Link
          href="/kamera"
          className="inline-block rounded-xl bg-black px-5 py-3 text-white font-medium hover:bg-zinc-800"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  if (!item?.id) {
    return (
      <div className="mx-auto max-w-xl px-6 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Peralatan Tidak Ditemukan</h1>

        <p className="text-sm text-zinc-500">
          Alat dengan ID "{id}" tidak ditemukan.
        </p>

        <Link
          href="/kamera"
          className="inline-block rounded-xl bg-black px-5 py-3 text-white font-medium hover:bg-zinc-800"
        >
          Kembali ke Katalog
        </Link>
      </div>
    );
  }

  const gambar = item.image_url || imageMap[item.name];

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">

      <Link
        href="/kamera"
        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-black"
      >
        ← Kembali ke Katalog
      </Link>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">

        {/* FOTO */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-zinc-100 shadow-sm">

          {gambar ? (
            <img
              src={gambar}
              alt={item.name}
              className="h-[500px] w-full object-cover"
            />
          ) : (
            <div className="flex h-[500px] items-center justify-center text-zinc-400">
              Tidak ada gambar
            </div>
          )}
        </div>

        {/* DETAIL */}
        <div className="space-y-6">

          <div className="flex flex-wrap items-center gap-3">

            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-zinc-700">
              {item.category}
            </span>

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                item.stock > 0
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {item.stock > 0 ? "Tersedia" : "Habis"}
            </span>

          </div>

          <div>
            <h1 className="text-4xl font-black tracking-tight">
              {item.name}
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              {item.brand || "CamSpace Rental"}
            </p>
          </div>

          <div className="border-y border-zinc-200 py-5">

            <p className="text-3xl font-black">
              Rp{Number(item.price_per_day).toLocaleString("id-ID")}
            </p>

            <p className="text-sm text-zinc-500">per hari</p>

          </div>

          <div className="space-y-3">

            <h3 className="font-bold text-lg">Deskripsi</h3>

            <p className="leading-relaxed text-zinc-600">
              {item.description ||
                "Peralatan multimedia berkualitas yang siap digunakan untuk kebutuhan fotografi, videografi, maupun produksi konten."}
            </p>

          </div>

          {item.specifications && (
            <div className="space-y-3">

              <h3 className="font-bold text-lg">Spesifikasi</h3>

              <div className="rounded-2xl bg-zinc-100 p-4 text-sm whitespace-pre-wrap text-zinc-700">
                {item.specifications}
              </div>

            </div>
          )}

          <div className="rounded-2xl border border-zinc-200 p-5">

            <div className="flex items-center justify-between">

              <span className="text-zinc-500">Stok tersedia</span>

              <span className="font-bold text-lg">{item.stock} Unit</span>

            </div>

          </div>

          <Link
            href={`/peminjaman/ajukan?id=${item.id}`}
            className="block rounded-2xl bg-black py-4 text-center font-bold text-white transition hover:bg-zinc-800"
          >
            Ajukan Peminjaman
          </Link>

        </div>
      </div>
    </div>
  );
}