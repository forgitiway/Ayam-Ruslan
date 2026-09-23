import Link from "next/link";
import { apiFetch } from "@/lib/api";

const imageMap = {
  "Sony A7III":
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
  "Canon EOS R6":
    "https://images.unsplash.com/photo-1617005082133-548c4dd27f35",
  "Tripod Manfrotto":
    "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c",
  "Lensa Canon 50mm f/1.8":
    "https://images.unsplash.com/photo-1516724562728-afc824a36e84",
  "GoPro Hero 11 Black":
    "https://images.unsplash.com/photo-1502920917128-1aa500764cbd",
  "Sony FE 16-35mm f/2.8 GM":
    "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39",
  "Drone DJI Mini 3":
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f",
  "Mic Rode VideoMic GO":
    "https://images.unsplash.com/photo-1516280440614-37939bbacd81",
};

const extraEquipment = [
  {
    id: "demo-1",
    name: "GoPro Hero 11 Black",
    category: "KAMERA",
    stock: 4,
    price_per_day: 100000,
    image_url:
      "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80",
  },
  {
    id: "demo-2",
    name: "Lensa Canon 50mm f/1.8",
    category: "LENSA",
    stock: 5,
    price_per_day: 75000,
    image_url:
      "https://images.unsplash.com/photo-1516724562728-afc824a36e84?w=800&q=80",
  },
  {
    id: "demo-3",
    name: "Sony FE 16-35mm f/2.8 GM",
    category: "LENSA",
    stock: 3,
    price_per_day: 120000,
    image_url:
      "https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?w=800&q=80",
  },
  {
    id: "demo-4",
    name: "Drone DJI Mini 3",
    category: "AKSESORIS",
    stock: 2,
    price_per_day: 200000,
    image_url:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&q=80",
  },
  {
    id: "demo-5",
    name: "Mic Rode VideoMic GO",
    category: "AKSESORIS",
    stock: 6,
    price_per_day: 50000,
    image_url:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=800&q=80",
  },
];

const getImage = (item) => imageMap[item.name] || imageMap["Sony A7III"];

export default async function KatalogPage() {
  let dataKamera = [];

  try {
const response = await apiFetch("/equipment", {
  token: process.env.NEXT_PUBLIC_DEV_TOKEN,
});

const apiData = Array.isArray(response.data)
  ? response.data
  : Array.isArray(response)
  ? response
  : [];     

dataKamera = apiData.concat(extraEquipment);

console.log("Jumlah katalog:", dataKamera.length);

  } catch (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-black tracking-tight">
          Katalog Alat Multimedia
        </h1>

        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-red-700">
          <p className="font-semibold">Gagal mengambil data alat</p>
          <p className="mt-1 text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-6 py-12 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-4xl font-black tracking-tight">
          Katalog Alat Multimedia
        </h1>

        <p className="mt-2 text-zinc-500">
          Pilih alat multimedia sesuai kebutuhan produksi kamu.
        </p>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xl">
          <input
            placeholder="Cari kamera, lensa, tripod..."
            className="w-full rounded-full border border-zinc-200 px-5 py-3 text-sm outline-none focus:border-black"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["Semua", "Kamera", "Lensa", "Tripod", "Aksesoris"].map(
            (item, i) => (
              <button
                key={item}
                className={`rounded-full border px-4 py-2 text-sm transition ${
                  i === 0
                    ? "bg-black text-white"
                    : "bg-white hover:bg-zinc-100"
                }`}
              >
                {item}
              </button>
            )
          )}
        </div>
      </div>

      {/* Katalog */}
      {dataKamera.length === 0 ? (
        <div className="rounded-2xl border border-zinc-200 p-8 text-center">
          <p className="text-zinc-500">
            Belum ada alat multimedia tersedia.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {dataKamera.map((item, index) => (
            <div
              key={item.id}
              className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Gambar */}
              <div className="relative h-52 overflow-hidden">
                <img
                  src={item.image_url || getImage(item)}
                  alt={item.name}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />

                {index === 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-600">
                    🔥 Populer
                  </span>
                )}

                {index === dataKamera.length - 2 && (
                  <span className="absolute left-3 top-3 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                    ⭐ Terlaris
                  </span>
                )}
              </div>

              {/* Isi Card */}
              <div className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    {item.category}
                  </span>

                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                    Stok: {item.stock}
                  </span>
                </div>

                <h3 className="text-xl font-bold leading-tight">
                  {item.name}
                </h3>

                <p className="text-zinc-500">
                  Rp
                  {Number(item.price_per_day).toLocaleString("id-ID")}{" "}
                  / hari
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