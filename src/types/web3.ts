// src/types/web3.ts

export interface WalletData {
  id: string
  name: string
  address: string
  createdAt: string
  encryptedPrivateKey: string
}

export interface Transaction {
  id: string
  from: string
  to: string
  amount: number
  type: 'send' | 'receive' | 'contract'
  status: 'pending' | 'confirmed' | 'failed'
  timestamp: string
  description?: string
}

export type UserRole = 'supplier' | 'vendor' | 'customer' | 'blockchain-expert'

export interface User {
  id: string
  walletAddress: string
  walletName: string
  role?: UserRole
  name?: string
  email?: string
  loginAt: string
  isAuthenticated: boolean
}