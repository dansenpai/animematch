import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AnimeMatch",
  description: "Descubra seu próximo anime favorito",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <div className="min-h-screen flex flex-col">
          <header className="w-full border-b border-white/10 bg-black/80 backdrop-blur-xl fixed top-0 z-50 supports-[backdrop-filter]:bg-black/60">
            <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link
                href="/"
                className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 text-transparent bg-clip-text"
              >
                AnimeMatch
              </Link>
              <div className="flex gap-6">
                <Link
                  href="/"
                  className="text-gray-200 hover:text-white transition-colors"
                >
                  Buscar
                </Link>
                <Link
                  href="/minha-lista"
                  className="text-gray-200 hover:text-white transition-colors flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 4v16m8-8H4" />
                  </svg>
                  Minha Lista
                </Link>
              </div>
            </nav>
          </header>

          <main className="flex-grow pt-20">{children}</main>
        </div>
      </body>
    </html>
  );
}
