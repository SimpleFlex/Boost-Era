import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import background from "./public/boost.png";

import { headers } from "next/headers";
import ContextProvider from "./components/context";
import Navbar from "./components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AppKit Example App",
  description: "Powered by Reown",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie");

  return (
    <html lang="en">
      <body className={inter.className}>
        {/* Global background image */}
        <div className="relative min-h-screen overflow-hidden text-white">
          <div
            className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${background.src})` }}
          />

          {/* Dark overlay for readability */}
          <div className="pointer-events-none absolute inset-0 -z-10 bg-black/60" />

          {/* Glass layer across the whole app */}
          <div className="relative min-h-screen bg-white/5 backdrop-blur-xl">
            <Navbar />

            <ContextProvider cookies={cookies}>
              <main className="mx-auto max-w-6xl px-4 py-10">{children}</main>
            </ContextProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
