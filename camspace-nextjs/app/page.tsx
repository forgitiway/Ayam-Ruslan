import Link from "next/link";
import { apiFetch } from "@/lib/api";

type Equipment = {
  id: number;
  name: string;
  category: string;
  brand: string | null;
  description: string | null;
  price_per_day: number;
  stock: number;
  image_url: string | null;
  specifications: string | null;
  status: string;
  created_at: string;
};

const gambarAlat: Record<number, string> = {
  1: "/images/sony-a7iii.jpg",
  2: "/images/canon-eos-r6.jpg",
  3: "/images/tripod-manfrotto.jpg",
};

export default async function Home() {
  let dataKamera: Equipment[] = [];

  try {
    const response = await apiFetch("/equipment", {
      method: "GET",
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
    });

    dataKamera = Array.isArray(response)
      ? response
      : response.data || [];
  } catch (error) {
    console.error("Gagal mengambil data alat:", error);
  }

  return (
    <div className="min-h-screen bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">

      {/* HERO */}
      <section className="relative overflow-hidden bg-linear-to-b from-indigo-900 via-indigo-950 to-zinc-950 px-6 py-20 text-white">
        <div className="mx-auto max-w-5xl text-center space-y-6">

          <span className="inline-block rounded-full bg-indigo-500/20 px-4 py-1.5 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
            Platform Sewa Alat Konten & Fotografi
          </span>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
            Let&apos;s Create Beautiful Work
            <br className="hidden sm:block" />

            <span className="bg-linear-to-r from-indigo-400 to-indigo-200 bg-clip-text text-transparent">
              Together with CamSpace
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-300">
            Sewa kamera DSLR, Mirrorless, Digicam, Lensa, Lighting, dan
            Tripod untuk keperluan tugas, pembuatan konten, hingga dokumentasi
            acara.
          </p>

          {/* SEARCH */}
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

      {/* PRODUK POPULER */}
      <section className="mx-auto max-w-6xl px-6 py-16">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">

          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Kamera & Alat Populer
            </h2>

            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              Pilihan alat untuk kebutuhan multimedia
            </p>
          </div>

          <Link
            href="/kamera"
            className="text-sm font-medium text-indigo-600 hover:underline dark:text-indigo-400"
          >
            Lihat Semua →
          </Link>

        </div>

        {/* EMPTY STATE */}
        {dataKamera.length === 0 ? (

          <div className="rounded-2xl border border-zinc-200 bg-white p-10 text-center dark:border-zinc-800 dark:bg-zinc-900">

            <p className="text-sm text-zinc-500">
              Belum ada alat multimedia tersedia.
            </p>

            <Link
              href="/kamera"
              className="mt-4 inline-block rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Lihat Katalog
            </Link>

          </div>

        ) : (

          /* PRODUCT GRID */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">

            {dataKamera.slice(0, 3).map((item) => (

              <div
                key={item.id}
                className="rounded-2xl border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
              >

                <div>

                  {/* IMAGE */}
                  <div className="h-44 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">

                    {item.image_url || gambarAlat[item.id] ? (

                      <img
                        src={item.image_url || gambarAlat[item.id]}
                        alt={item.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                        Tidak ada gambar
                      </div>

                    )}

                  </div>

                  {/* CATEGORY + STOCK */}
                  <div className="mt-4 flex items-center justify-between">

                    <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                      {item.category}
                    </span>

                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      Stok: {item.stock}
                    </span>

                  </div>

                  {/* NAME */}
                  <h3 className="text-lg font-bold mt-1">
                    {item.name}
                  </h3>

                  {/* PRICE */}
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                    Rp
                    {Number(item.price_per_day).toLocaleString("id-ID")}
                    {" / hari"}
                  </p>

                </div>

                {/* DETAIL BUTTON */}
                <Link
                  href={`/kamera/${item.id}`}
                  className="mt-4 block text-center rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                >
                  Lihat Detail & Sewa
                </Link>

              </div>

            ))}

          </div>

        )}

      </section>

    </div>
  );
}