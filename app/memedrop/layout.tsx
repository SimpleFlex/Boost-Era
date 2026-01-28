import type { ReactNode } from "react";

export default function MemeDropLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Memedrop-specific container */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-10">
        {children}
      </main>
    </div>
  );
}
