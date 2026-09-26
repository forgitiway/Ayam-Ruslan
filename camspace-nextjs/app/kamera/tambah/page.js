"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TambahAlatPage() {
  const router = useRouter();
    
  const [form, setForm] = useState({
    name: "",
    category: "",
    price_per_day: "",
    stock: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("File yang dipilih harus berupa gambar.");
      return;
    }

    setImageFile(file);
    setError("");

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  async function uploadImage() {
    if (!imageFile) {
      return "";
    }

    setUploading(true);

    try {
      const formData = new FormData();

      formData.append("file", imageFile);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengupload gambar."
        );
      }

      return data.image_url;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setMessage("");

    if (!form.name.trim()) {
      setError("Nama alat wajib diisi.");
      return;
    }

    if (!form.category.trim()) {
      setError("Kategori alat wajib diisi.");
      return;
    }

    if (Number(form.price_per_day) < 0) {
      setError("Harga tidak boleh kurang dari 0.");
      return;
    }

    if (Number(form.stock) < 0) {
      setError("Stok tidak boleh kurang dari 0.");
      return;
    }

    try {
      setSaving(true);

      // Upload gambar terlebih dahulu
      const imageUrl = await uploadImage();

      // Simpan data alat
      const response = await fetch("/api/equipment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price_per_day: Number(form.price_per_day),
          stock: Number(form.stock),
          description: form.description,
          image_url: imageUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal menambahkan alat."
        );
      }

      setMessage("Alat berhasil ditambahkan.");

      setTimeout(() => {
        router.push("/kamera");
        router.refresh();
      }, 800);
    } catch (error) {
      console.error("ERROR TAMBAH ALAT:", error);

      setError(
        error.message || "Gagal menambahkan alat."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-8">
        <Link
          href="/kamera"
          className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
        >
          ← Kembali ke Katalog
        </Link>

        <h1 className="mt-4 text-3xl font-black">
          Tambah Alat
        </h1>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Tambahkan alat multimedia baru ke dalam katalog.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {message && (
          <div className="rounded-xl bg-green-50 p-4 text-sm text-green-600 dark:bg-green-950/30 dark:text-green-400">
            {message}
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Nama Alat
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Contoh: Kamera Canon EOS"
            required
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Kategori
          </label>

          <input
            type="text"
            name="category"
            value={form.category}
            onChange={handleChange}
            placeholder="Contoh: Kamera"
            required
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-semibold">
              Harga per Hari
            </label>

            <input
              type="number"
              name="price_per_day"
              value={form.price_per_day}
              onChange={handleChange}
              min="0"
              placeholder="masukkan harga"
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold">
              Stok
            </label>

            <input
              type="number"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              min="0"
              placeholder="masukkan stok"
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Gambar Alat
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm dark:border-zinc-700 dark:bg-zinc-800"
          />

          <p className="mt-2 text-xs text-zinc-500">
            Pilih gambar langsung dari perangkat.
          </p>
        </div>

        {imagePreview && (
          <div>
            <p className="mb-2 text-sm font-semibold">
              Preview Gambar
            </p>

            <div className="h-56 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
              <img
                src={imagePreview}
                alt="Preview alat"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block text-sm font-semibold">
            Deskripsi
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            placeholder="Masukkan deskripsi alat..."
            className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Link
            href="/kamera"
            className="flex-1 rounded-xl border border-zinc-300 px-4 py-3 text-center text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Batal
          </Link>

          <button
            type="submit"
            disabled={saving || uploading}
            className="flex-1 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading
              ? "Mengupload Gambar..."
              : saving
              ? "Menyimpan..."
              : "Tambah Alat"}
          </button>
        </div>
      </form>
    </div>
  );
}