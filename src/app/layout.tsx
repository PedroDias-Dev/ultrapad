import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "@/styles/globals.css";
import { Toaster } from "@/components/ui/toaster"

const mulish = Mulish({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ultrapad",
  description: "made by siad, for siad usage only",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mulish.className} bg-neutral-900 overflow-hidden`}>
        {children}

        <Toaster />
      </body>
    </html>
  );
}
