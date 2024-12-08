"use client";

import type { ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base, baseSepolia } from "wagmi/chains"; // add baseSepolia for testing
import React from "react";

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={import.meta.env.VITE_PUBLIC_ONCHAINKIT_API_KEY}
      chain={baseSepolia} // add baseSepolia for testing
      config={{
        appearance: {
          mode: "light", // 'auto' | 'light' | 'dark'
          theme: "default", // 'default' | 'base' | 'cyberpunk' | 'hacker'
        },
      }}
    >
      {props.children}
    </OnchainKitProvider>
  );
}
