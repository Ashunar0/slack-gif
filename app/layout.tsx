import type { Metadata } from "next";
import "./globals.css";
import { GOOGLE_FONTS_URL } from "@/constants/fonts";
import { Toaster } from "@/components/ui/sonner";

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
        className="font-sans antialiased bg-zinc-950 text-zinc-100 min-h-screen"
        suppressHydrationWarning={true}
      >
        {children}
        <Toaster richColors position="bottom-right" />
      </body>
    </html>
  );
}
