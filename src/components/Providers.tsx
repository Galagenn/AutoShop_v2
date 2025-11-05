"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
import { Toaster } from "react-hot-toast";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider 
      refetchInterval={5 * 60}
      refetchOnWindowFocus={false}
    >
      {children}
      <Toaster position="top-right" toastOptions={{ style: { background: "#111", color: "#fff", border: "1px solid #2a2a2a" } }} />
    </SessionProvider>
  );
}


