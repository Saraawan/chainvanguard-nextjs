'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { useWallet } from '@/components/providers/wallet-provider'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ThemeToggle } from '@/components/common/theme-toggle'
import { Package, LogOut, Settings, User, Wallet } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function DashboardHeader() {
  const { user, logout } = useAuth()
  const { currentWallet, balance, disconnectWallet } = useWallet()
  const router = useRouter()

  const handleLogout = () => {
    disconnectWallet() // Disconnect wallet first
    logout() // Then logout user
    router.push('/login')
  }

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'supplier': return 'bg-blue-500'
      case 'vendor': return 'bg-green-500'
      case 'customer': return 'bg-purple-500'
      case 'blockchain-expert': return 'bg-orange-500'
      default: return 'bg-gray-500'
    }
  }

  const getRoleDisplayName = (role?: string) => {
    switch (role) {
      case 'blockchain-expert': return 'BLOCKCHAIN EXPERT'
      case 'supplier': return 'SUPPLIER'
      case 'vendor': return 'VENDOR'
      case 'customer': return 'CUSTOMER'
      default: return 'USER'
    }
  }

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  const getUserInitials = () => {
    if (user?.name) {
      return user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    if (user?.walletName) {
      return user.walletName.split(' ').map(n => n[0]).join('').toUpperCase()
    }
    return 'U'
  }

  const getDisplayName = () => {
    return user?.name || user?.walletName || 'User'
  }

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ChainVanguard</span>
          </div>
          {user?.role && (
            <Badge variant="outline" className="ml-4">
              {getRoleDisplayName(user.role)}
            </Badge>
          )}
        </div>

        <div className="flex items-center space-x-4">
          {/* Wallet Info */}
          {currentWallet && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-muted rounded-lg">
              <Wallet className="h-4 w-4 text-muted-foreground" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">{balance} CVG</span>
                <span className="text-xs text-muted-foreground font-mono">
                  {formatAddress(currentWallet.address)}
                </span>
              </div>
            </div>
          )}

          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className={getRoleColor(user?.role)}>
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {getDisplayName()}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email || 'No email provided'}
                  </p>
                  {user?.role && (
                    <p className="text-xs leading-none text-muted-foreground">
                      Role: {getRoleDisplayName(user.role)}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              
              {currentWallet && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">Wallet</p>
                      <p className="text-sm font-medium">{currentWallet.name}</p>
                      <p className="text-xs font-mono text-muted-foreground">
                        {formatAddress(currentWallet.address)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Balance: {balance} CVG
                      </p>
                    </div>
                  </DropdownMenuLabel>
                </>
              )}
              
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Wallet className="mr-2 h-4 w-4" />
                <span>Wallet Settings</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Disconnect & Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}