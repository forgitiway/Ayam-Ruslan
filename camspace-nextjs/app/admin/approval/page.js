export default function AdminApprovalPage() {
  const pengajuan = [
    { id: "REQ-101", pemohon: "lala", alat: "Canon EOS 600D", jadwal: "12 - 14 Sept 2026", alasan: "Dokumentasi Acara Kampus" },
    { id: "REQ-104", pemohon: "isty", alat: "Microphone Wireless Boya", jadwal: "18 - 19 Sept 2026", alasan: "Tugas Podcasting" },
  ];

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-6">
      <h1 className="text-3xl font-black">Admin Approval Panel</h1>
      <div className="space-y-4">
        {pengajuan.map((p) => (
          <div key={p.id} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900 flex justify-between items-center">
            <div>
              <span className="text-xs font-bold text-indigo-600">{p.id} • Pemohon: {p.pemohon}</span>
              <h3 className="text-lg font-bold">{p.alat}</h3>
              <p className="text-xs text-zinc-500">{p.jadwal}</p>
              <p className="text-xs italic text-zinc-600 mt-1">"{p.alasan}"</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-xl bg-rose-100 px-4 py-2 text-xs font-bold text-rose-700 hover:bg-rose-200">Tolak</button>
              <button className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500">Setujui</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}