import type { Metadata } from "next";
import { Suspense } from "react";
import { Courier_Prime, JetBrains_Mono, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Nav } from "@/components/nav";

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const courierPrime = Courier_Prime({
  variable: "--font-courier-prime",
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Arcade Vault",
  description: "Play games and compete for the highest score.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${pressStart.variable} ${jetbrainsMono.variable} ${courierPrime.variable}`}
    >
      <body>
        <div className="av-bg" aria-hidden="true" />
        <div className="av-noise" aria-hidden="true" />
        <Suspense fallback={<nav className="av-nav" aria-hidden="true" />}>
          <Nav />
        </Suspense>
        <div className="av-main">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
