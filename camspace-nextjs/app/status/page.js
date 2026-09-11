import Link from "next/link";

export default function StatusPage() {
  const statusList = [
    { id: "REQ-101", alat: "Canon EOS 600D", tanggal: "12 - 14 Sept 2026", status: "Menunggu Approval", warna: "bg-amber-100 text-amber-800" },
    { id: "REQ-102", alat: "Sony Alpha A6000", tanggal: "15 - 16 Sept 2026", status: "Disetujui", warna: "bg-emerald-100 text-emerald-800" },
    { id: "REQ-103", alat: "Lighting Softbox Kit", tanggal: "01 - 02 Sept 2026", status: "Selesai", warna: "bg-zinc-200 text-zinc-800" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-black">Status Peminjaman</h1>
        <Link href="/peminjaman/ajukan" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">+ Pinjam Lagi</Link>
      </div>
      <div className="space-y-4">
        {statusList.map((item) => (
          <div key={item.id} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-zinc-400">{item.id}</span>
              <h3 className="text-lg font-bold">{item.alat}</h3>
              <p className="text-xs text-zinc-500">{item.tanggal}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.warna}`}>{item.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}