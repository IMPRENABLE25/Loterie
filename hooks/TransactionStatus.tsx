'use client'

import { useEffect, useState } from 'react'

interface TransactionStatusProps {
  hash?: `0x${string}`
  isWriting: boolean
  isConfirming: boolean
  isConfirmed: boolean
}

export default function TransactionStatus({
  hash,
  isWriting,
  isConfirming,
  isConfirmed,
}: TransactionStatusProps) {
  const [show, setShow] = useState(true)

  useEffect(() => {
    if (isConfirmed) {
      const timer = setTimeout(() => setShow(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [isConfirmed])

  if (!show) return null

  const explorerUrl = `https://sepolia.etherscan.io/tx/${hash}`

  return (
    <div className="fixed top-20 right-4 z-50 max-w-sm">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 animate-slideIn">
        <div className="flex items-start gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isWriting ? 'bg-blue-100 dark:bg-blue-900/30' :
            isConfirming ? 'bg-yellow-100 dark:bg-yellow-900/30' :
            'bg-green-100 dark:bg-green-900/30'
          }`}>
            {isWriting && <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>}
            {isConfirming && <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin"></div>}
            {isConfirmed && <span className="text-green-600">✓</span>}
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {isWriting && 'Signing Transaction...'}
              {isConfirming && 'Waiting for Confirmation...'}
              {isConfirmed && 'Transaction Successful!'}
            </h4>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {isWriting && 'Please confirm in your wallet'}
              {isConfirming && 'Transaction is being processed on-chain'}
              {isConfirmed && 'Your entry has been recorded'}
            </p>

            {hash && (
              <a
                href={explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block mt-2 text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
              >
                View on Explorer ↗
              </a>
            )}
          </div>

          <button
            onClick={() => setShow(false)}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  )
}
