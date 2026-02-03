"use client";

import { PropsWithChildren } from "react";
import { LenisProvider } from "@/app/components/providers/LenisProvider";

export default function ClientShell({ children }: PropsWithChildren) {
  return <LenisProvider>{children}</LenisProvider>;
}
