'use client'
import ConnectButton from './ConnectButton'
import NetworkStatus from '../hooks/NetworkStatus'
import { useAccount } from 'wagmi'

export default function Header() {
  const { address, isConnected } = useAccount()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-pink-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">🎰</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
                WIN FLEX
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Decentralized Lottery on Ethereum Sepolia
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <NetworkStatus />
            <ConnectButton />
            
            {isConnected && address && (
              <div className="hidden sm:block px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[160px]">
                  {address.slice(0, 6)}...{address.slice(-4)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}