import type { Metadata } from "next";
import { Inter, Merriweather, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const merriweather = Merriweather({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-merriweather",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | UNIBEN Journal of Humanities",
    default: "UNIBEN Journal of Humanities",
  },
  description:
    "The UNIBEN Journal of Humanities publishes peer-reviewed scholarship with African and global perspectives in law & society, history, languages, culture, philosophy, arts, and environmental humanities.",
  keywords: [
    "UNIBEN",
    "Humanities",
    "Academic Journal",
    "Open Access",
    "Peer Review",
    "African Scholarship",
    "Law & Society",
    "History",
    "Languages",
    "Culture",
    "Philosophy",
    "Arts",
    "Environmental Humanities",
  ],
  openGraph: {
    title: "UNIBEN Journal of Humanities",
    description:
      "Peer-reviewed scholarship with African and global perspectives in humanities",
    url: "https://journals.uniben.edu/humanities",
    siteName: "UNIBEN Journal of Humanities",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${merriweather.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
        <Footer/>
      </body>
    </html>
  );
}