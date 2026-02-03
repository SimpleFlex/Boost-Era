"use client";

import React from "react";
import ContextProvider from "./components/context/index";

export default function ClientProviders({
  children,
  cookies,
}: {
  children: React.ReactNode;
  cookies: string | null;
}) {
  return <ContextProvider cookies={cookies}>{children}</ContextProvider>;
}
