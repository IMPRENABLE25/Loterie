'use client'

import { useAccount, useChainId } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { useEffect, useState } from 'react'

export default function NetworkStatus() {
  const { chain } = useAccount()
  const chainId = useChainId()
  const [isSepolia, setIsSepolia] = useState(true)

  useEffect(() => {
    setIsSepolia(chainId === sepolia.id)
  }, [chainId])

  if (!isSepolia) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-medium text-red-700 dark:text-red-300">
          Switch to Sepolia
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg">
      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      <span className="text-sm font-medium text-green-700 dark:text-green-300">
        Sepolia Network
      </span>
    </div>
  )
}