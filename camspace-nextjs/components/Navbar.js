import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-black tracking-tight text-indigo-600 dark:text-indigo-400">
            CamSpace
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">Beranda</Link>
            <Link href="/kamera" className="hover:text-zinc-900 dark:hover:text-zinc-100">Katalog Alat</Link>
            <Link href="/peminjaman" className="hover:text-zinc-900 dark:hover:text-zinc-100">Riwayat</Link>
            <Link href="/status" className="hover:text-zinc-900 dark:hover:text-zinc-100">Status</Link>
            <Link href="/dashboard" className="hover:text-zinc-900 dark:hover:text-zinc-100">Dashboard</Link>
            <Link href="/admin/approval" className="text-amber-600 hover:text-amber-700 dark:text-amber-400">Admin Approval</Link>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-xl px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900">
            Masuk
          </Link>
          <Link href="/register" className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 shadow-md shadow-indigo-500/20">
            Daftar
          </Link>
        </div>
      </div>
    </header>
  );
}