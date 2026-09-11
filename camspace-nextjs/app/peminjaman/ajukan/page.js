import Link from "next/link";

export default function AjukanPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12 space-y-6">
      <h1 className="text-3xl font-black">Form Pengajuan Peminjaman</h1>
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
        <div>
          <label className="block text-sm font-medium">Pilih Alat</label>
          <select className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm dark:border-zinc-800">
            <option value="1">Canon EOS 600D (DSLR)</option>
            <option value="2">Sony Alpha A6000 (Mirrorless)</option>
            <option value="3">Digicam Sony Cyber-shot (Digicam)</option>
            <option value="4">Tripod Takara Hydro (Tripod)</option>
            <option value="5">Lighting Softbox Kit (Lighting)</option>
            <option value="6">Microphone Wireless Boya (Microphone)</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Tanggal Mulai</label>
            <input type="date" className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm dark:border-zinc-800" />
          </div>
          <div>
            <label className="block text-sm font-medium">Tanggal Selesai</label>
            <input type="date" className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm dark:border-zinc-800" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium">Keperluan Peminjaman</label>
          <textarea rows="3" placeholder="Kebutuhan tugas/konten..." className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm dark:border-zinc-800"></textarea>
        </div>
        <Link href="/status" className="block text-center w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500">
          Kirim Pengajuan
        </Link>
      </div>
    </div>
  );
}