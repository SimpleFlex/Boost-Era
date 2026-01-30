import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import background from "./public/boost.png";

import { headers } from "next/headers";
import ContextProvider from "../components/context";
import AnimatedBackground from "../components/layout/AnimatedBackground";
import Footer from "../components/layout/Footer";

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
        <div className="relative min-h-screen overflow-hidden text-white">
          <div
            className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${background.src})` }}
          />

          <div className="pointer-events-none absolute inset-0 -z-10 bg-black/60" />

          <div className="relative min-h-screen bg-white/5 backdrop-blur-xl flex flex-col">
            <AnimatedBackground />

            <ContextProvider cookies={cookies}>
              {/* ✅ NO max-w wrapper here */}
              <div className="flex-1">{children}</div>

              <Footer />
            </ContextProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
