import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";

import { headers } from "next/headers";
import ContextProvider from "../components/context";
import AnimatedBackground from "../components/layout/AnimatedBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AppKit Example App",
  description: "Powered by Reown",
};

export default async function MemedropLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersObj = await headers();
  const cookies = headersObj.get("cookie") ?? "";

  return (
    <div className={inter.className}>
      <div className="relative min-h-screen overflow-hidden text-white">
        <div
          className="pointer-events-none absolute inset-0 -z-20 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url(/booost.png)" }}
        />

        <div className="pointer-events-none absolute inset-0 -z-10 bg-black/60" />

        <div className="relative min-h-screen bg-white/5 backdrop-blur-xl flex flex-col">
          <AnimatedBackground />

          <ContextProvider cookies={cookies}>
            <div className="relative z-10 flex-1">{children}</div>
          </ContextProvider>
        </div>
      </div>
    </div>
  );
}
