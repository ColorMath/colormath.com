import type { Metadata } from "next";
import { PT_Serif, Fira_Sans_Condensed } from "next/font/google";
import "./globals.css";

const ptSerif = PT_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-pt-serif",
});

const fira = Fira_Sans_Condensed({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-fira",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://colormath.com"),
  title: "Color/Math",
  description:
    "A design studio that helps teams design and build products that add real value in the age of AI.",
  // Link previews (Slack, iMessage, LinkedIn, X…): a frame of the Blocks film.
  openGraph: { images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Color/Math" }] },
  twitter: { card: "summary_large_image", images: ["/og.jpg"] },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${ptSerif.variable} ${fira.variable}`}>
      <body className="bg-paper font-body text-ink antialiased">
        {children}
      </body>
    </html>
  );
}
