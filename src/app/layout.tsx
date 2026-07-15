import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HiFive Tours — Driver",
  description: "Create and manage sightseeing tour itineraries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Restore path after GitHub Pages 404 redirect */}
        <script dangerouslySetInnerHTML={{ __html: `
          (function() {
            var params = new URLSearchParams(window.location.search);
            var p = params.get('p');
            if (p) {
              var q = params.get('q');
              // Use location.replace with trailing slash so GitHub Pages serves
              // the correct path/index.html and Next.js mounts the right page
              var path = p.replace(/\\/?$/, '/');
              var url = '/hifive-mobility' + path + (q ? '?' + q : '') + window.location.hash;
              window.location.replace(url);
            }
          })();
        `}} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
