import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GOOGLE_FONTS_URL } from "@/constants/fonts";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Slack Stamp Studio",
  description: "カスタムSlackスタンプを簡単作成",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={GOOGLE_FONTS_URL} rel="stylesheet" />
      </head>
      <body
        className={`${outfit.variable} ${jetbrainsMono.variable} font-sans antialiased bg-zinc-950 text-zinc-100 min-h-screen`}
        suppressHydrationWarning={true}
      >
        {children}
      </body>
    </html>
  );
}
