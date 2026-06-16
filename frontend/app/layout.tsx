import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
     variable: "--font-plus-jakarta-sans",
     subsets: ["latin"],
     weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
     variable: "--font-inter",
     subsets: ["latin"],
     weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
     title: "Simulator Harga Cabai Kota Depok",
     description:
          "Aplikasi simulator harga cabai di Kota Depok menggunakan model Random Forest, memberikan perkiraan harga yang akurat untuk membantu petani dan pedagang dalam pengambilan keputusan.",
};

export default function RootLayout({
     children,
}: Readonly<{
     children: React.ReactNode;
}>) {
     return (
          <html
               lang="en"
               className={`${plusJakartaSans.variable} ${inter.variable} h-full antialiased`}
          >
               <body className="min-h-full flex flex-col">{children}</body>
          </html>
     );
}
