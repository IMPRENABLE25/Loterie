'use client';
import { LOTTERY_ABI } from './contract'

// Auto-detect RaffleState enum from ABI

export enum RaffleState {
  OPEN = 0,
  CALCULATING = 1
}

export interface LotteryData {
  entranceFee: bigint
  lotteryState: RaffleState
  numPlayers: bigint
  recentWinner: `0x${string}`
  lastTimestamp: bigint
  isOpen: boolean
  players: `0x${string}`[]
  vrfCoordinator: `0x${string}`
}

export interface CountdownData {
  minutes: number
  seconds: number
  isComplete: boolean
}

export interface CheckUpkeepResult {
  upkeepNeeded: boolean
  performData: string
}

// Type-safe contract function calls
export type ContractFunction = typeof LOTTERY_ABI[number]
export type ReadFunction = Extract<ContractFunction, { stateMutability: 'view' }>
export type WriteFunction = Extract<ContractFunction, { stateMutability: 'nonpayable' | 'payable' }>
export type Event = Extract<ContractFunction, { type: 'event' }>
export type Error = Extract<ContractFunction, { type: 'error' }>

// Transaction status
export interface TransactionStatus {
  hash?: `0x${string}`
  status: 'idle' | 'pending' | 'confirming' | 'success' | 'error'
  error?: string
  blockNumber?: number
  timestamp?: number
}