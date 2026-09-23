"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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

    dataKamera = response.data || response;
  } catch (error) {
    return (
      <div className="mx-auto max-w-7xl px-6 py-12">
        <h1 className="text-4xl font-black tracking-tight">
          Katalog Alat Multimedia
        </h1>

        <div className="mt-6 rounded-xl border border-zinc-300 bg-zinc-100 p-5 text-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
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
        <div className="rounded-2xl border border-zinc-200 p-8 text-center">
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
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    {item.category}
                  </span>

                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                    Stok: {item.stock}
                  </span>
                </div>

                <h3 className="text-lg font-bold mt-1">
                  {item.name}
                </h3>

                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                  Rp{Number(item.price_per_day).toLocaleString("id-ID")} / hari
                </p>

              <Link
                href={`/kamera/${item.id}`}
                className="mt-4 block text-center rounded-xl bg-black py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
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