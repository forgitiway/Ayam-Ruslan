import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-6">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-black text-indigo-600 dark:text-indigo-400">CamSpace</h1>
          <h2 className="mt-2 text-xl font-bold">Masuk ke Akun</h2>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900 space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input type="email" placeholder="nama@email.com" className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800" />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input type="password" placeholder="••••••••" className="mt-1 w-full rounded-xl border border-zinc-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-indigo-500 dark:border-zinc-800" />
          </div>
          <Link href="/dashboard" className="block text-center w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500">
            Masuk
          </Link>
        </div>
        <p className="text-center text-sm text-zinc-500">
          Belum punya akun? <Link href="/register" className="text-indigo-600 hover:underline">Daftar</Link>
        </p>
      </div>
    </div>
  );
}