"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditAlatPage() {
  const params = useParams();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    category: "",
    price_per_day: "",
    stock: "",
    description: "",
    image_url: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadEquipment() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/equipment/${params.id}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Gagal mengambil data alat."
          );
        }

        const item = data.data || data;

        setForm({
          name: item.name || "",
          category: item.category || "",
          price_per_day: item.price_per_day || "",
          stock: item.stock || "",
          description: item.description || "",
          image_url: item.image_url || "",
        });

        if (item.image_url) {
          setImagePreview(item.image_url);
        }
      } catch (error) {
        setError(
          error.message || "Gagal mengambil data alat."
        );
      } finally {
        setLoading(false);
      }
    }

    if (params.id) {
      loadEquipment();
    }
  }, [params.id]);

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
      return form.image_url;
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

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const imageUrl = await uploadImage();

      const response = await fetch(
        `/api/equipment/${params.id}`,
        {
          method: "PUT",
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
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Gagal mengubah data alat."
        );
      }

      setMessage("Data alat berhasil diperbarui.");

      setTimeout(() => {
        router.push("/kamera");
        router.refresh();
      }, 800);
    } catch (error) {
      setError(
        error.message || "Gagal mengubah data alat."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-12">
        <h1 className="text-3xl font-black">
          Edit Alat
        </h1>

        <p className="mt-4 text-sm text-zinc-500">
          Memuat data alat...
        </p>
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-6 py-20 text-center">
        <h1 className="text-2xl font-bold">
          Gagal Mengambil Data
        </h1>

        <p className="text-sm text-red-500">
          {error}
        </p>

        <Link
          href="/kamera"
          className="inline-block rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
        >
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <form
        onSubmit={handleSubmit}
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900"
      >
        {/* Header Card */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black">
              Edit Alat
            </h1>
          </div>

          <Link
            href="/kamera"
            className="shrink-0 rounded-xl border border-zinc-300 px-4 py-2.5 text-sm font-semibold transition hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
          >
            Kembali
          </Link>
        </div>

        {/* Pesan Error */}
        {error && (
          <div className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/30 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Pesan Berhasil */}
        {message && (
          <div className="rounded-xl bg-green-50 p-4 text-sm text-green-600 dark:bg-green-950/30 dark:text-green-400">
            {message}
          </div>
        )}

        {/* Nama Alat */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Nama Alat
          </label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        {/* Kategori */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Kategori
          </label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
          >
            <option value="">Pilih kategori</option>
            <option value="Kamera">Kamera</option>
            <option value="Audio">Audio</option>
            <option value="Tripod">Tripod</option>
          </select>
        </div>

        {/* Harga dan Stok */}
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
              required
              className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
            />
          </div>
        </div>

        {/* Gambar Alat */}
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

        {/* Preview Gambar */}
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

        {/* Deskripsi */}
        <div>
          <label className="mb-2 block text-sm font-semibold">
            Deskripsi
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={5}
            className="w-full resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 dark:border-zinc-700 dark:bg-zinc-800"
          />
        </div>

        {/* Tombol */}
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
            className="flex-1 rounded-xl bg-black px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
          >
            {uploading
              ? "Mengupload Gambar..."
              : saving
              ? "Menyimpan..."
              : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}