
import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import {Providers} from "./providers";
import Header from "../components/Header"

export const metadata: Metadata = {
  title: "Win Flex - Crypto Lottery",
  description: "A high-energy, provably fair crypto lottery powered by Chainlink VRF",
  
}
export default function RootLayout(props: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-950">
        <Providers>
          <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
            <Header />
            <main>
        {props.children}
              </main>
            </div>
        </Providers>
      </body>
    </html>
  );
}
