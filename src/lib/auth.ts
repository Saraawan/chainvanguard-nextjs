// src/lib/auth.ts
import { User, UserRole, RegisterData } from '@/types'

export class AuthService {
  private static instance: AuthService
  
  private constructor() {}
  
  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  async login(email: string, password: string): Promise<User> {
    // Mock authentication - replace with real API call
    const mockUsers = this.getMockUsers()
    const user = mockUsers.find(u => u.email === email)
    
    if (!user) {
      throw new Error('User not found')
    }
    
    // In real app, verify password hash
    if (password !== 'password') {
      throw new Error('Invalid password')
    }
    
    // Store in localStorage (in real app, use secure tokens)
    localStorage.setItem('auth_user', JSON.stringify(user))
    localStorage.setItem('auth_token', 'mock_jwt_token')
    
    return user
  }

  async register(userData: RegisterData): Promise<User> {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      role: userData.role,
      walletAddress: userData.walletAddress,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // In real app, save to database
    const existingUsers = this.getMockUsers()
    const updatedUsers = [...existingUsers, newUser]
    localStorage.setItem('mock_users', JSON.stringify(updatedUsers))
    localStorage.setItem('auth_user', JSON.stringify(newUser))
    localStorage.setItem('auth_token', 'mock_jwt_token')

    return newUser
  }

  logout(): void {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
  }

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem('auth_user')
      return userStr ? JSON.parse(userStr) : null
    } catch {
      return null
    }
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token')
  }

  hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser()
    return user?.role === role
  }

  private getMockUsers(): User[] {
    try {
      const usersStr = localStorage.getItem('mock_users')
      return usersStr ? JSON.parse(usersStr) : this.getDefaultUsers()
    } catch {
      return this.getDefaultUsers()
    }
  }

  private getDefaultUsers(): User[] {
    return [
      {
        id: '1',
        name: 'John Supplier',
        email: 'supplier@example.com',
        role: 'supplier',
        walletAddress: '0x1234567890123456789012345678901234567890',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Jane Vendor',
        email: 'vendor@example.com',
        role: 'vendor',
        walletAddress: '0x2345678901234567890123456789012345678901',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Bob Customer',
        email: 'customer@example.com',
        role: 'customer',
        walletAddress: '0x3456789012345678901234567890123456789012',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '4',
        name: 'Alice Expert',
        email: 'expert@example.com',
        role: 'expert', 
        walletAddress: '0x4567890123456789012345678901234567890123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]
  }
}