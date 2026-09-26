import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "CamSpace - Sewa Alat Konten & Fotografi",
  description: "Sistem peminjaman kamera, lighting, tripod, dan aksoris multimedia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body className="flex min-h-screen flex-col bg-zinc-50 font-sans text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}