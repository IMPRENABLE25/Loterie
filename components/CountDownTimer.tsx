'use client'

interface CountDownTimerProps {
  countdown: {
    minutes: number
    seconds: number
  }
  isOpen: boolean
  isCalculating: boolean
  isTimeOver: boolean
  isSepolia: boolean
}

export default function CountdownTimer({
  countdown,
  isOpen,
  isCalculating,
  isTimeOver,
  isSepolia,


}: CountDownTimerProps) {
  return (
    <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 shadow-xl">
      <div className="mb-4 flex justify-between items-start">
        <div>
          <h3 className="font-bold text-white mb-1">⏱️ Prochain tirage</h3>
          <p className="text-gray-300 text-sm">
            {isCalculating ? "Calcul en cours..." : "Temps restant"}
          </p>
        </div>
        
        {/* Indicateur visuel de statut */}
        <div className="flex flex-col items-end">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${
              isCalculating ? 'bg-yellow-500 animate-pulse' : isOpen ? 'bg-green-500' : 'bg-red-500'
            }`} />
            <span className={`text-xs font-bold uppercase tracking-wider ${
              isCalculating ? 'text-yellow-500' : isOpen ? 'text-green-500' : 'text-red-500'
            }`}>
              {isCalculating ? 'Calcul' : isOpen ? 'Ouvert' : 'Fermé'}
            </span>
          </div>
        </div>
      </div>

      {/* Affichage des chiffres du minuteur */}
      <div className="flex gap-3 my-2">
        <div className="flex flex-col items-center">
          <span className="text-3xl font-mono font-black text-white">
            {String(countdown.minutes).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-gray-500 uppercase">Min</span>
        </div>
        <span className="text-3xl font-mono font-black text-gray-700">:</span>
        <div className="flex flex-col items-center">
          <span className={`text-3xl font-mono font-black ${
            isTimeOver ? 'text-red-500' : 'text-white'
          }`}>
            {String(countdown.seconds).padStart(2, '0')}
          </span>
          <span className="text-[10px] text-gray-500 uppercase">Sec</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-800">
        <div className="flex justify-between text-gray-400 text-sm">
          <span>Réseau:</span>
          <span className={isSepolia ? "text-green-400" : "text-red-400 font-bold"}>
            {isSepolia ? "Sepolia" : "Mauvais réseau"}
          </span>
        </div>
      </div>
    </div>
  )
}