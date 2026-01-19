"use client";
import { http} from "wagmi";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import {sepolia} from "wagmi/chains";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || '';

const config =  getDefaultConfig({
  appName: 'loterie',
  projectId: projectId,
  chains: [ sepolia],
  transports: {
    [sepolia.id]: http("/api/rpc"),
  },
  ssr: false,
});

export default config;
