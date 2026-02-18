import { LanguageProvider } from "@/components/providers/language-provider";
import { Web3Providers } from "@/components/providers/web3-providers";
import { SiteHeader } from "@/components/layout/site-header";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";

const nunitoSans = Nunito_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clippay",
  description: "Marketing that pays for itself.",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunitoSans.variable} dark`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0f0809] text-white`}
      >
        <LanguageProvider>
          <Web3Providers>
            <SiteHeader />
            <div className="pt-[64px]">
              {children}
            </div>
          </Web3Providers>
        </LanguageProvider>
      </body>
    </html>
  );
}
