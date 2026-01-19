import {useEffect, useState, useRef } from "react";
import {
  useReadContract,
  useWatchContractEvent,
  useAccount,
  useChainId,
  useConfig,
} from "wagmi";
import { sepolia } from "wagmi/chains";
import {
  LOTTERY_ABI,
  LOTTERY_CONTRACT_ADDRESS,
  FUNCTION_NAMES,
} from "@/lib/contract";
import { readContract } from "@wagmi/core";
import { type Log } from "viem";

type RaffleEnteredLog = Log & {
  args: {
    player?: `0x${string}`;
  };
};

export function useUserParticipationStatus() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();

  const isSepolia = chainId === sepolia.id;

  const [hasEntered, setHasEntered] = useState(false);
  const prevCheckRef = useRef({ players: 0, address: "" });
  const config = useConfig();

  // Écoute en temps réel
  useWatchContractEvent({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: "RaffleEntered",
    chainId: sepolia.id,
    enabled: isConnected && isSepolia,
   onLogs: (logs) => {
      const userJoined = logs.some((log: any) => 
        log.args?.player?.toLowerCase() === address?.toLowerCase()
      );
      if (userJoined) setHasEntered(true);
    },
  });

    useWatchContractEvent({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: "WinnerPicked",
    onLogs: () => {
      console.log("Gagnant tiré ! Réinitialisation du statut de participation.");
      setHasEntered(false); // Débloque le bouton pour le nouveau tour
      prevCheckRef.current = { players: 0, address: address || "" };
    },
  });

  // Vérification
  const { data: numPlayers } = useReadContract({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    functionName: FUNCTION_NAMES.GET_NUMBER_OF_PLAYERS,
    chainId: sepolia.id,
    query: {
      enabled: isConnected && isSepolia && !hasEntered,
      refetchInterval: 30000,
    },
  });
  useEffect(() => {
    const checkIfUserIsLatestPlayer = async () => {
      const currentPlayers = Number(numPlayers || 0);
      if (currentPlayers === 0 && hasEntered) {
        setHasEntered(false);
        return;
      }

      const shouldCheck =
        address &&
        currentPlayers > 0 &&
        (currentPlayers !== prevCheckRef.current.players ||
          address !== prevCheckRef.current.address);

      if (shouldCheck && !hasEntered) {
        try {
          const latestPlayer = await readContract(config, {
            address: LOTTERY_CONTRACT_ADDRESS,
            abi: LOTTERY_ABI,
            functionName: "getPlayer",
            args: [BigInt(currentPlayers - 1)],
            chainId: sepolia.id,
          });

          if (
            (latestPlayer as string)?.toLowerCase() === address.toLowerCase()
          ) {
            setHasEntered(true);
          }
        } catch {
          // Ignore errors silently
        }
        prevCheckRef.current = { players: currentPlayers, address };
      }
    };

    checkIfUserIsLatestPlayer();
  }, [numPlayers, address, hasEntered, config, isConnected, isSepolia]);

  // Reset si l'utilisateur change
  useEffect(() => {
    if (address !== prevCheckRef.current.address) {
      setHasEntered(false);
      prevCheckRef.current = { players: 0, address: address || "" };
    }
  }, [address]);

  return hasEntered;
}
