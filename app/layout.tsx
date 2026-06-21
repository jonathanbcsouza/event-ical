import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { PitchBackground } from "@/components/PitchBackground";
import { SiteHeader } from "@/components/SiteHeader";
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
  title: "World Cup 2026 - Calendar",
  description:
    "Pick your teams and matches, then download or subscribe to a FIFA World Cup 2026 calendar.",
};

const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t!=="light"&&(t==="dark"||!t);if(d)document.documentElement.classList.add("dark");else document.documentElement.classList.remove("dark");}catch(e){document.documentElement.classList.add("dark");}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full flex flex-col text-zinc-900 dark:text-zinc-50">
        <PitchBackground />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
