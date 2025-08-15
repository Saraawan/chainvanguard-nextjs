'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, UserRole } from '@/types/web3'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (walletAddress: string, password: string) => Promise<void>
  logout: () => void
  setUserRole: (role: UserRole) => void
  updateProfile: (profileData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('chainvanguard_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Error parsing saved user data:', error)
        localStorage.removeItem('chainvanguard_user')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (walletAddress: string, password: string): Promise<void> => {
    setIsLoading(true)
    
    try {
      // Get current wallet info
      const currentWallet = localStorage.getItem('chainvanguard_current_wallet')
      let walletName = 'Unknown Wallet'
      
      if (currentWallet) {
        const walletData = JSON.parse(currentWallet)
        walletName = walletData.name
      }

      // Check if user profile exists
      const savedProfile = localStorage.getItem(`profile_${walletAddress}`)
      let profileData = {}
      
      if (savedProfile) {
        profileData = JSON.parse(savedProfile)
      }

      const userData: User = {
        id: Date.now().toString(),
        walletAddress,
        walletName,
        loginAt: new Date().toISOString(),
        isAuthenticated: true,
        ...profileData
      }

      setUser(userData)
      setIsAuthenticated(true)
      localStorage.setItem('chainvanguard_user', JSON.stringify(userData))
      
    } catch (error) {
      throw new Error('Authentication failed')
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    localStorage.removeItem('chainvanguard_user')
    localStorage.removeItem('chainvanguard_current_wallet')
  }

  const setUserRole = (role: UserRole) => {
    if (!user) return
    
    const updatedUser = { ...user, role }
    setUser(updatedUser)
    localStorage.setItem('chainvanguard_user', JSON.stringify(updatedUser))
    
    // Also save to profile
    localStorage.setItem(`profile_${user.walletAddress}`, JSON.stringify(updatedUser))
  }

  const updateProfile = (profileData: Partial<User>) => {
    if (!user) return
    
    const updatedUser = { ...user, ...profileData }
    setUser(updatedUser)
    localStorage.setItem('chainvanguard_user', JSON.stringify(updatedUser))
    
    // Save to profile storage
    localStorage.setItem(`profile_${user.walletAddress}`, JSON.stringify(updatedUser))
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    setUserRole,
    updateProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}