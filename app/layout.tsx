
import React from "react";
import type { Metadata } from "next";
import "./globals.css";
import {Providers} from "./providers";
import Header from "../components/Header"

export const metadata: Metadata = {
  title: "Win Flex - Crypto Lottery",
  description: "A high-energy, provably fair crypto lottery powered by Chainlink VRF",
  // icons: {
  //   icon:"/lotofavicon.png",
    //  [
    //    {
    //      url: "/icon-light-32x32.png",
    //     media: "(prefers-color-scheme: light)",
    //    },
    //    {
    //      url: "/icon-dark-32x32.png",
    //      media: "(prefers-color-scheme: dark)",
    //    },
    //   {
    //      url: "/icon.svg",
    //      type: "image/svg+xml",
    //    },
    // ],
    //  apple: "/apple-icon.png",
  // },
}
export default function RootLayout(props: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Header className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950" />
        {props.children}
        </Providers>
      </body>
    </html>
  );
}