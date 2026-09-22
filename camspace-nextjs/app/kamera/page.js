import Link from "next/link";
import { apiFetch } from "@/lib/api";

export default async function KatalogPage() {
  let dataKamera = [];

  try {
    const response = await apiFetch("/equipment", {
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
    });

    dataKamera = response.data || response;
  } catch (error) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-black tracking-tight">
          Katalog Alat Multimedia
        </h1>

        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-semibold">Gagal mengambil data alat</p>
          <p className="mt-1 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight">
          Katalog Alat Multimedia
        </h1>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Pilih alat multimedia sesuai kebutuhan produksi kamu.
        </p>
      </div>

      {dataKamera.length === 0 ? (
        <div className="rounded-xl border border-zinc-200 p-6 text-center">
          <p className="text-zinc-500">
            Belum ada alat multimedia tersedia.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {dataKamera.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between"
            >
              <div>
                <div className="h-44 w-full overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                  {item.image_url ? (
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-zinc-400">
                      Tidak ada gambar
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    {item.category}
                  </span>

                  <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    Stok: {item.stock}
                  </span>
                </div>

                <h3 className="text-lg font-bold mt-1">
                  {item.name}
                </h3>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Rp{Number(item.price_per_day).toLocaleString("id-ID")} / hari
                </p>
              </div>

              <Link
                href={`/kamera/${item.id}`}
                className="mt-4 block text-center rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Lihat Detail & Sewa
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}