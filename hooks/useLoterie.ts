"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  useReadContract,
  useWriteContract,
  useWatchContractEvent,
  useAccount,
  useChainId,
  UseReadContractParameters
} from "wagmi";

import { formatEther } from "viem";
import {
  LOTTERY_ABI,
  LOTTERY_CONTRACT_ADDRESS,
  FUNCTION_NAMES,
} from "@/lib/contract";
import { sepolia } from "wagmi/chains";
import type {
  LotteryData,
  RaffleState,
  CountdownData,
  TransactionStatus,
} from "@/lib/types";

// Hook principal pour la loterie
export function useLottery() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const [latestEvents, setLatestEvents] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(Date.now());
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatus>(
    { status: "idle" },
  );

  // Check if we're on Sepolia
  const isSepolia = chainId === sepolia.id;
  const isReady = isConnected && isSepolia;

  //Read all contract data
  const contractConfig : UseReadContractParameters = {
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    chainId: sepolia.id,
    query: { enabled: true }
  };

  const { data: entranceFee, refetch: refetchFee } =  useReadContract({
    ...contractConfig,
    functionName: FUNCTION_NAMES.GET_ENTRANCE_FEE,
  });
  const { data: lotteryState, refetch: refetchState } = useReadContract({
    ...contractConfig,
    functionName: FUNCTION_NAMES.GET_RAFFLE_STATE,
  });
  const { data: recentWinner, refetch: refetchWinner } = useReadContract({
    ...contractConfig,
    functionName: FUNCTION_NAMES.GET_RECENT_WINNER,
  });
  const { data: lastTimestamp, refetch: refetchTimestamp } = useReadContract({
    ...contractConfig,
    functionName: FUNCTION_NAMES.GET_LAST_TIMESTAMP,
  });
  const { data: numPlayers, refetch: refetchPlayers } = useReadContract({
    ...contractConfig,
    functionName: FUNCTION_NAMES.GET_NUMBER_OF_PLAYERS,
  });

  // Watch for events
  useWatchContractEvent({
    address: LOTTERY_CONTRACT_ADDRESS,
    abi: LOTTERY_ABI,
    eventName: "RaffleEntered",
    onLogs(logs) {
      setLatestEvents((prev) => [...logs, ...prev.slice(0, 9)]); 
      refetchAll();
    },
  });
    //Total de la cagnotte
  const totalPotETH = useMemo(() => {
    if (!entranceFee || !numPlayers) return "0";
    const fee = Number(formatEther(entranceFee as bigint));
    const players = Number(numPlayers);
    return (fee * players).toFixed(4); // 4 décimales
  }, [entranceFee, numPlayers]);

  // Calculate countdown 
  const [now, setNow] = useState(Math.floor(Date.now() / 1000));
  const [startTime, setStartTime] = useState<number | null>(null);
  // Update du temps réel
  useEffect(() => {
    const timer = setInterval(
      () => setNow(Math.floor(Date.now() / 1000)),
      1000,
    );
    return () => clearInterval(timer);
  }, []);
  // Déclencheur du chrono dès le 1er joueur
  useEffect(() => {
    const pCount = Number(numPlayers || 0);
    if (pCount > 0 && startTime === null) {
      setStartTime(Math.floor(Date.now() / 1000));
    } else if (pCount === 0) {
      setStartTime(null);
    }
  }, [numPlayers, startTime]);
  const getCountdown = useCallback((): CountdownData => {
    const pCount = Number(numPlayers || 0);
    if (!startTime || pCount === 0)
      return { minutes: 0, seconds: 0, isComplete: true };
    const interval = 30;
    const targetTime = startTime + interval;
    const remaining = targetTime - now;
    if (remaining <= 0) return { minutes: 0, seconds: 0, isComplete: true };
    return {
      minutes: Math.floor(remaining / 60),
      seconds: Math.floor(remaining % 60),
      isComplete: false,
    };
  }, [startTime, now, numPlayers]);

  const countdownData = getCountdown();
  const isCalculating = lotteryState === 1;
  const isTimeOver = countdownData.isComplete && Number(numPlayers || 0) > 0;
  const realIsOpen = lotteryState === 0;

  // Combine all data
  const lotteryData: LotteryData | null =
    entranceFee !== undefined
      ? {
          entranceFee: entranceFee as bigint,
          lotteryState: lotteryState as RaffleState,
          numPlayers: numPlayers as bigint,
          recentWinner: recentWinner as `0x${string}`,
          lastTimestamp: lastTimestamp as bigint,
          isOpen: lotteryState === 0,
          players: [],
          vrfCoordinator: "0x" as `0x${string}`,
        }
      : null;

  // Refresh all data
  const refetchAll = useCallback(() => {
    refetchFee();
    refetchState();
    refetchPlayers();
    refetchWinner();
    refetchTimestamp();
    setLastUpdate(Date.now());
  }, [
    refetchFee,
    refetchState,
    refetchPlayers,
    refetchWinner,
    refetchTimestamp,
  ]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(refetchAll, 30000);
    return () => clearInterval(interval);
  }, [refetchAll]);

  return {
    // Data
    lotteryData,
    latestEvents,
    lastUpdate,
    recentWinner,
    numPlayers: Number(numPlayers || 0),
    totalPotETH,
    // Status
    isSepolia,
    isConnected,
    isReady,
    transactionStatus,
    refetchAll,
    // Helper values
    entranceFeeETH: entranceFee ? formatEther(entranceFee as bigint) : "0",
    countdown: countdownData,
    isOpen: realIsOpen,
    isCalculating,
    isTimeOver,
  };
}

// Participer à la loterie
export function useEnterLottery() {
  const { writeContract, isPending, error } = useWriteContract();
  const [hash, setHash] = useState<`0x${string}`>();
  const enter = useCallback(
    (entranceFee: bigint): Promise<`0x${string}`> => {
      return new Promise((resolve, reject) => {
        writeContract(
          {
            address: LOTTERY_CONTRACT_ADDRESS,
            abi: LOTTERY_ABI,
            functionName: FUNCTION_NAMES.ENTER_RAFFLE,
            value: entranceFee,
          },
          {
            onSuccess: (hash) => {
              setHash(hash);
              resolve(hash);
            },
            onError: (error) => {
              console.error("Error entering lottery:", error);
              reject(error);
            },
          },
        );
      });
    },
    [writeContract],
  );

  return {
    enter,
    hash,
    isPending,
    error,
  };
}
