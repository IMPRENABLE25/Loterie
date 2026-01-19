"use client";

import { useState, useEffect} from "react";
import { useAccount } from "wagmi";
import CountdownTimer from "./CountDownTimer";
import TransactionStatus from "../hooks/TransactionStatus";
import { useLottery, useEnterLottery } from "../hooks/useLoterie";
import { useUserParticipationStatus } from "../hooks/checkUserStatus";



export default function LotteryCard() {
  const { isConnected } = useAccount();
  const {
    lotteryData,
    isSepolia,
    entranceFeeETH,
    isOpen, 
    isCalculating,
    countdown,
    numPlayers,
    isTimeOver,
    totalPotETH,
    refetchAll,
  } = useLottery();
  //Vérifier si on peut participer
  const { enter, hash, isPending, error } = useEnterLottery();
  const [localError, setLocalError] = useState<string>();
  const hasEntered = useUserParticipationStatus()
  const handleEnterLottery = async () => {
    if (!lotteryData) return;
    try {
      setLocalError(undefined);
      await enter(lotteryData.entranceFee);
      setTimeout(refetchAll, 5000);
    } catch (err: any) {
      setLocalError(err.message || "Échec de la participation");
    }
  };
  const displayError = error?.message || localError;
  const isDisabled =
    !isConnected ||
    !isSepolia ||
    !isOpen ||
    isPending ||
    hasEntered;

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  if (!mounted) return null

  return (
    <div className="max-w-4xl mx-auto">
      {/* Messages d'erreur/avertissement */}
      {isConnected && !isSepolia && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
          <div className="flex items-center gap-3">
            <div className="text-red-500">⚠️</div>
            <div>
              <p className="font-medium text-red-800 dark:text-red-300">
                Veuillez basculer sur Sepolia
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Status */}
      {(hash || isPending) && (
        <div className="mb-6">
          <TransactionStatus
            hash={hash}
            isWriting={isPending}
            isConfirming={false}
            isConfirmed={!!hash}
          />
        </div>
      )}

      {/* Error Display */}
      {displayError && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-100 dark:border-red-800">
          <div className="flex items-center gap-3">
            <div className="text-red-500">✗</div>
            <div>
              <p className="font-medium text-red-800 dark:text-red-300">
                Erreur: {displayError}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Dashboard principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats et participation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cartes de stats */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                title="Mise"
                value={`${entranceFeeETH} ETH`}
                loading={!lotteryData}
              />
              <StatCard
                title="Joueurs"
                value={lotteryData?.numPlayers.toString() || "0"}
              />
              <StatCard title="Cagnotte" value={`${totalPotETH} ETH`} />
              <StatCard
                title="Statut"
                value={isOpen ? "Ouverte" : "Fermée"}
                status={isOpen ? "open" : "closed"}
              />
            </div>
          </div>

          {/* Dernier gagnant */}
          {lotteryData?.recentWinner &&
            lotteryData.recentWinner !==
              "0x0000000000000000000000000000000000000000" && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <span className="text-xl">🏆</span>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                      Dernier gagnant
                    </h3>
                  </div>
                </div>
                <div className="text-sm font-mono text-gray-700 dark:text-gray-300 bg-white/50 dark:bg-gray-800/50 p-3 rounded-lg">
                  {lotteryData.recentWinner}
                </div>
              </div>
            )}

          {/* Bouton de participation: CORRECT */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Participer à la loterie
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mise d'entrée:{" "}
                <span className="font-semibold">{entranceFeeETH} ETH</span>
              </p>
            </div>
            <button
              onClick={handleEnterLottery}
              // On bloque le bouton si isDisabled est vrai OU si un calcul est en cours
              disabled={isDisabled || isCalculating}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                isDisabled || isCalculating
                  ? "bg-gray-200 dark:bg-gray-700 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white shadow-lg hover:shadow-xl"
              }`}
            >
              
              {
               isPending ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  En cours...
                </div>
              ) : !isConnected ? (
                "Connecter le wallet"
              ) : !isSepolia ? (
                "Basculer sur Sepolia"
              ) : isCalculating ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  Tirage en cours...
                </div>
              ) : hasEntered ? (
                "Déjà inscrit (1 ticket max) 🎟️"
              ) : !isOpen ? (
                "Loterie fermée"
              ) : (
                `Participer (${entranceFeeETH} ETH)`
              )}
            </button>
            {isConnected && isSepolia && isOpen && !isPending && (
              <p className="text-center mt-4 text-green-600 dark:text-green-400 text-sm">
                ✓ Prêt à participer
              </p>
            )}
          </div>
        </div>

        {/* Colonne droite - Timer et infos */}
        <div className="space-y-6">
          {/* Timer */}
          {/* Affichage du minuteur en passant les props */}
          <CountdownTimer
            countdown={countdown}
            isOpen={isOpen}
            isCalculating={isCalculating}
            isTimeOver={isTimeOver}
            isSepolia={isSepolia}
          />
          {isSepolia && numPlayers === 0 && (
    <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-center">
      <p className="text-xs text-blue-400">
        ℹ️ Le temps est écoulé. Le tirage aura lieu dès qu'un joueur participera.
      </p>
    </div>
  )}

          {/* Infos techniques */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">
              ℹ️ Informations
            </h3>
            <div className="space-y-1">
              <InfoLine label="Réseau" value="Sepolia Testnet" />
              <InfoLine label="Aléatoire" value="Chainlink VRF" />
            </div>
            <div className="mt-1 pt-1 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Utilisez du ETH de testnet pour participer
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composants auxiliaires simplifiés
function StatCard({
  title,
  value,
  loading = false,
  status,
}: {
  title: string;
  value: string;
  loading?: boolean;
  status?: "open" | "closed";
}) {
  return (
    <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">
        {title}
      </div>
      <div
        className={`text-xl font-bold ${
          status === "closed"
            ? "text-yellow-600 dark:text-yellow-400"
            : "text-gray-900 dark:text-white"
        }`}
      >
        {loading ? (
          <div className="h-7 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        ) : (
          value
        )}
      </div>
    </div>
  );
}

function InfoLine({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-medium text-gray-900 dark:text-white">{value}</span>
    </div>
  );
}
