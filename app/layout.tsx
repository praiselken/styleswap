import type { Metadata } from "next";
import "./globals.css";
import { Yeseva_One, Roboto } from "next/font/google";
import BackgroundVideo from "@/components/BackgroundVideo";

const yeseva = Yeseva_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-yeseva-src",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto-src",
});

export const metadata: Metadata = {
  title: {
    default: "Thr-Fit — Thr-fited. Reimagined.",
    template: "%s | Thr-Fit",
  },
  description:
    "Discover unique fashion finds, list your own pieces, and give clothing a second life on Thr-Fit.",
  keywords: ["thrift", "resale", "vintage", "streetwear", "sustainable fashion", "marketplace"],
  openGraph: {
    title: "Thr-Fit — Thr-fited. Reimagined.",
    description:
      "Discover unique fashion finds, list your own pieces, and give clothing a second life.",
    type: "website",
    siteName: "Thr-Fit",
  },
  twitter: {
    card: "summary_large_image",
    title: "Thr-Fit — Thr-fited. Reimagined.",
    description:
      "Discover unique fashion finds, list your own pieces, and give clothing a second life.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${yeseva.variable} ${roboto.variable}`}>
      <body className="relative min-h-screen antialiased overflow-x-hidden text-white bg-black font-roboto">
        {/* 🎬 Video behind everything */}
        <BackgroundVideo />

        {/* 🌑 Overlay for readability */}
        <div className="fixed inset-0 z-[-1] bg-black/10" />

        {/* 📦 Content above all */}
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
