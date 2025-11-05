import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import "./globals.css";
import ModernHeader from "../components/ModernHeader";
import ModernFooter from "../components/ModernFooter";
import PageTransition from "../components/PageTransition";
import Providers from "../components/Providers";

const geistSans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
  weight: ["300","400","500","600","700","800"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AutoShop - Premium Car Marketplace",
  description: "AutoShop — покупка и продажа автомобилей быстро и безопасно. Тысячи проверенных объявлений.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body
        className={`${geistSans.className} ${geistSans.variable} ${geistMono.variable} antialiased font-sans font-semibold page-spacing`}
      >
        <Providers>
          <ModernHeader />
          <main>
            <PageTransition>{children}</PageTransition>
          </main>
          <ModernFooter />
        </Providers>
      </body>
    </html>
  );
}
