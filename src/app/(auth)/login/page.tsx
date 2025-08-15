'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { useWallet } from '@/components/providers/wallet-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { toast } from 'sonner'
import { Package, Wallet, Eye, EyeOff, Key, Shield, RefreshCw } from 'lucide-react'
import { WalletData } from '@/types/web3'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [availableWallets, setAvailableWallets] = useState<WalletData[]>([])
  const [selectedWallet, setSelectedWallet] = useState('')
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false)
  const [recoveryPhrase, setRecoveryPhrase] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const { login } = useAuth()
  const { connectWallet, getAllWallets, recoverWallet } = useWallet()
  const router = useRouter()

  // Load available wallets on component mount
  useEffect(() => {
    const wallets = getAllWallets()
    setAvailableWallets(wallets)
  }, [getAllWallets])

  const handleWalletLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!selectedWallet || !password) {
        throw new Error('Please select a wallet and enter password')
      }

      const wallet = availableWallets.find(w => w.id === selectedWallet)
      if (!wallet) {
        throw new Error('Wallet not found')
      }

      // Connect wallet first
      const connected = await connectWallet(selectedWallet, password)
      if (!connected) {
        throw new Error('Failed to connect wallet')
      }

      // Then authenticate user
      await login(wallet.address, password)
      
      toast.success('Wallet connected successfully!')
      
      // Check if user has a role set, if not go to role selection
      const savedUser = localStorage.getItem('chainvanguard_user')
      if (savedUser) {
        const userData = JSON.parse(savedUser)
        if (userData.role) {
          // User has role, go directly to dashboard
          const dashboardPath = `/${userData.role === 'blockchain-expert' ? 'blockchain-expert' : userData.role}`
          router.push(dashboardPath)
        } else {
          // User doesn't have role, go to role selection
          router.push('/role-selection')
        }
      } else {
        // Fallback to role selection
        router.push('/role-selection')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecoveryRestore = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    if (!recoveryPhrase || recoveryPhrase.split(' ').length !== 12) {
      toast.error('Please enter a valid 12-word recovery phrase')
      return
    }

    try {
      const recoveredWallet = await recoverWallet(recoveryPhrase, newPassword)
      
      // Update available wallets
      const updatedWallets = getAllWallets()
      setAvailableWallets(updatedWallets)
      setSelectedWallet(recoveredWallet.id)
      setShowRecoveryDialog(false)
      
      toast.success('Wallet recovered successfully!')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to recover wallet')
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ChainVanguard</span>
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </CardTitle>
          <CardDescription>
            Select your wallet and enter your password to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWalletLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-select">Select Wallet</Label>
              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your wallet" />
                </SelectTrigger>
                <SelectContent>
                  {availableWallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatAddress(wallet.address)}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                  {availableWallets.length === 0 && (
                    <SelectItem value="no-wallet" disabled>
                      No wallets found - Create one first
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Wallet Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your wallet password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading || !selectedWallet}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-4 flex flex-col gap-2">
            <Dialog open={showRecoveryDialog} onOpenChange={setShowRecoveryDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" size="sm">
                  <Key className="mr-2 h-4 w-4" />
                  Recover Wallet with Seed Phrase
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Recover Wallet
                  </DialogTitle>
                  <DialogDescription>
                    Enter your 12-word recovery phrase to restore your wallet
                  </DialogDescription>
                </DialogHeader>
                
                <form onSubmit={handleRecoveryRestore} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-phrase">Recovery Phrase</Label>
                    <textarea
                      id="recovery-phrase"
                      className="w-full p-3 border rounded-md resize-none h-24"
                      placeholder="Enter your 12-word recovery phrase separated by spaces"
                      value={recoveryPhrase}
                      onChange={(e) => setRecoveryPhrase(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Create a new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    <Shield className="mr-2 h-4 w-4" />
                    Recover Wallet
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Dont have a wallet?{' '}
              <Link href="/register" className="text-primary hover:underline font-medium">
                Create New Wallet
              </Link>
            </p>
          </div>

          {/* Demo Section */}
          {availableWallets.length === 0 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium mb-3 text-center">Demo Mode</p>
              <p className="text-xs text-muted-foreground mb-3 text-center">
                No wallets found. Create a new wallet to get started.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => router.push('/register')}
              >
                <Package className="mr-2 h-4 w-4" />
                Create Demo Wallet
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}