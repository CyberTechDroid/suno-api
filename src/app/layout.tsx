import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "STOF - AI Song Creator",
  description: "Create amazing AI-generated music with STOF",
  keywords: ["stof", "ai music", "song creator", "music generation", "ai", "music", "generator"],
  creator: "STOF",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "STOF Music",
  },
  openGraph: {
    type: "website",
    title: "STOF - AI Song Creator",
    description: "Create amazing AI-generated music",
    siteName: "STOF",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#7c3aed",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="STOF Music" />
      </head>
      <body className={`${inter.className} overflow-y-scroll`} >
        <main className="flex flex-col items-center m-auto w-full">
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}
