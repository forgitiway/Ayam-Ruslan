import Link from "next/link";
import { apiFetch } from "@/lib/api";

const imageMap = {
  "Sony A7III":
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80",
  "Canon EOS R6":
    "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=800&q=80",
  "Tripod Manfrotto":
    "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?w=800&q=80",
  "GoPro Hero 11 Black":
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
  "Lensa Canon 50mm f/1.8":
    "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&q=80",
  "Sony FE 16-35mm f/2.8 GM":
    "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&q=80",
  "Drone DJI Mini 3":
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
  "Mic Rode VideoMic GO":
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80",
};

const getImage = (item) =>
  item.image_url || imageMap[item.name] || "/images/no-image.png";

export default async function KatalogPage({ searchParams }) {
  const params = await searchParams;
  const kategori = params?.kategori || "SEMUA";

  let dataKamera = [];

  try {
    const response = await apiFetch("/equipment", {
      token: process.env.NEXT_PUBLIC_DEV_TOKEN,
    });

    dataKamera = Array.isArray(response.data)
      ? response.data
      : Array.isArray(response)
      ? response
      : [];
  } catch (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-black">Katalog Alat Multimedia</h1>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-semibold">Gagal mengambil data alat</p>
          <p className="mt-1 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  const filteredData =
    kategori === "SEMUA"
      ? dataKamera
      : dataKamera.filter((item) => {
          const cat = (item.category || "").toLowerCase();
          const name = (item.name || "").toLowerCase();

          switch (kategori) {
            case "KAMERA":
              return (
                cat.includes("kamera") ||
                cat.includes("camera") ||
                cat.includes("mirrorless") ||
                cat.includes("dslr") ||
                name.includes("sony") ||
                name.includes("canon") ||
                name.includes("gopro")
              );

            case "LENSA":
              return cat.includes("lensa") || cat.includes("lens");

            case "TRIPOD":
              return cat.includes("tripod") || name.includes("tripod");

            case "AKSESORIS":
              return (
                cat.includes("aksesoris") ||
                cat.includes("accessory") ||
                name.includes("drone") ||
                name.includes("mic") ||
                name.includes("rode")
              );

            default:
              return true;
          }
        });

  const kategoriList = [
    { label: "Semua", value: "SEMUA" },
    { label: "Kamera", value: "KAMERA" },
    { label: "Lensa", value: "LENSA" },
    { label: "Tripod", value: "TRIPOD" },
    { label: "Aksesoris", value: "AKSESORIS" },
  ];

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-8">
      <div>
        <h1 className="text-4xl font-black tracking-tight">
          Katalog Alat Multimedia
        </h1>
        <p className="mt-2 text-zinc-500">
          Pilih alat multimedia sesuai kebutuhan produksi kamu.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <input
          placeholder="Cari kamera, lensa, tripod..."
          className="w-full max-w-xl rounded-full border border-zinc-200 px-5 py-3 text-sm outline-none focus:border-black"
        />

        <div className="flex flex-wrap gap-2">
          {kategoriList.map((btn) => (
            <Link
              key={btn.value}
              href={
                btn.value === "SEMUA"
                  ? "/kamera"
                  : `/kamera?kategori=${btn.value}`
              }
              className={`rounded-full border px-4 py-2 text-sm transition ${
                kategori === btn.value
                  ? "bg-black text-white"
                  : "bg-white hover:bg-zinc-100"
              }`}
            >
              {btn.label}
            </Link>
          ))}
        </div>
      </div>

      {filteredData.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 p-8 text-center">
          <p className="text-zinc-500">
            Tidak ada alat pada kategori ini.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredData.map((item, index) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-52 overflow-hidden bg-zinc-100">
                <img
                  src={getImage(item)}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />

                {index === 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    🔥 Populer
                  </span>
                )}

                {index === filteredData.length - 2 && (
                  <span className="absolute left-3 top-3 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    ⭐ Terlaris
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    {item.category}
                  </span>

                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                    Stok: {item.stock}
                  </span>
                </div>

                <h3 className="text-xl font-bold">{item.name}</h3>

                <p className="text-zinc-500">
                  Rp{Number(item.price_per_day).toLocaleString("id-ID")} / hari
                </p>

                <Link
                  href={`/kamera/${item.id}`}
                  className="mt-2 rounded-xl bg-black py-3 text-center font-semibold text-white transition hover:bg-zinc-800"
                >
                  Lihat Detail & Sewa
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}