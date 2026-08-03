import type { Metadata } from "next";
import { Hanken_Grotesk, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import HashScrollHandler from "@/components/HashScrollHandler";
import { AuthProvider } from "@/lib/AuthProvider";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin", "vietnamese"],
  variable: "--font-hanken-grotesk",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin", "vietnamese"],
  variable: "--font-source-serif-4",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Michelle Le (Hoàng Yến) | Corporate Leadership & AI Strategy",
  description:
    "Executive Strategy & AI Integration — delivering high-level strategic oversight and measurable B2B outcomes.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${hankenGrotesk.variable} ${sourceSerif.variable}`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-serif antialiased">
        <AuthProvider>
          <HashScrollHandler />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
