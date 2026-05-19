import type { Metadata } from "next";
import {
  DM_Sans,
  DM_Serif_Display,
  JetBrains_Mono,
  Raleway,
  Josefin_Sans,
  Montserrat,
} from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/providers";
import { SiteModalProviders } from "@/components/providers/SiteModalProviders";
import { GTM_CONTAINER_ID } from "@/lib/analytics/gtm";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});
const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
});
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-raleway",
});
const josefinSans = Josefin_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-josefin",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  style: ["normal", "italic"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Simplify IS",
  description: "AI security assessment platform",
  metadataBase: new URL("https://simplify.is"),
  openGraph: {
    title: "Simplify IS",
    description: "AI security assessment platform",
    type: "website",
    url: "https://simplify.is",
    images: ["https://simplify.is/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Simplify IS",
    description: "AI security assessment platform",
    images: ["https://simplify.is/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body className={`${dmSans.variable} ${dmSerif.variable} ${jetbrainsMono.variable} ${raleway.variable} ${josefinSans.variable} ${montserrat.variable} antialiased`}>
        <Script id="gtm-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];`}
        </Script>
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          src={`https://www.googletagmanager.com/gtm.js?id=${GTM_CONTAINER_ID}`}
        />
        <Providers>
          <SiteModalProviders>{children}</SiteModalProviders>
        </Providers>
      </body>
    </html>
  );
}
