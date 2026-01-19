"use client";

import LotteryCard from "../components/Loterie_card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section simplifiée */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Loterie <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Décentralisée</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            Une loterie transparente et équitable sur la blockchain Ethereum
          </p>
        </div>
        {/* Contenu principal */}
        <LotteryCard />
        {/* Info boxes simplifiées */}
        <div className="mt-12 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">🎯 Transparent</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Toutes les transactions sont vérifiables sur la blockchain
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">⚡ Automatique</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Gains distribués instantanément par le smart contract
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/30 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">🔗 Décentralisé</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pas d'intermédiaire, tout est géré par le contrat
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}