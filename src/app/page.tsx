// src/app/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Shield, Zap, Globe, Users, Package, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-muted/40">
      
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex h-14 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold text-lg">ChainVanguard</span>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost" className="hover:text-primary transition-colors">Login</Button>
            </Link>
            <Link href="/register">
              <Button className="shadow-md hover:shadow-lg transition-shadow">Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 text-center">
        <div className="container mx-auto px-4">
          <Badge variant="secondary" className="mb-4">
            Powered by Hyperledger Fabric & IPFS
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Blockchain Supply Chain <span className="text-primary">Management</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Transparent, secure, and efficient supply chain management powered by cutting-edge blockchain technology. 
            Track products from origin to consumer with complete transparency.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link href="/register">
              <Button size="lg" className="h-12 px-8 shadow-md hover:shadow-lg transition-shadow">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="h-12 px-8 hover:bg-muted/50 transition-colors">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Powerful Features</h2>
            <p className="text-muted-foreground mt-2">Everything you need for modern supply chain management</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Secure & Transparent', desc: 'Immutable blockchain records ensure complete transparency and security' },
              { icon: Zap, title: 'Real-time Tracking', desc: 'Track products in real-time from manufacturer to end consumer' },
              { icon: Globe, title: 'Decentralized Storage', desc: 'IPFS integration for distributed and secure file storage' },
              { icon: Users, title: 'Multi-Role System', desc: 'Support for suppliers, vendors, customers, and blockchain experts' },
              { icon: Package, title: 'Smart Contracts', desc: 'Automated processes with Hyperledger Fabric smart contracts' },
              { icon: TrendingUp, title: 'Analytics Dashboard', desc: 'Comprehensive analytics and reporting for all stakeholders' },
            ].map((feature, idx) => (
              <Card 
                key={idx} 
                className="hover:shadow-xl transition-all duration-300 border border-muted/30 rounded-xl"
              >
                <CardHeader>
                  <feature.icon className="h-10 w-10 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Roles Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">Choose Your Role</h2>
            <p className="text-muted-foreground mt-2">Different interfaces for different stakeholders</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Supplier/Ministry', desc: 'Manage inventory, buy from vendors, sell to vendors, view full product history', badge: 'Read & Write' },
              { title: 'Vendor', desc: 'Add products, sell to customers, view transaction history and analytics', badge: 'Write Access' },
              { title: 'Customer', desc: 'Browse products, add to cart, purchase items, track orders', badge: 'Read Only' },
              { title: 'Blockchain Expert', desc: 'View all transactions, manage consensus, security settings, fault tolerance', badge: 'Admin Access' },
            ].map((role, idx) => (
              <Card 
                key={idx} 
                className="text-center hover:shadow-xl transition-all duration-300 border border-muted/30 rounded-xl"
              >
                <CardHeader>
                  <CardTitle>{role.title}</CardTitle>
                  <CardDescription>{role.desc}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Badge variant="outline">{role.badge}</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-muted/40">
        <div className="container mx-auto px-4 text-center space-y-3">
          <div className="flex items-center justify-center space-x-2">
            <Package className="h-6 w-6 text-primary" />
            <span className="font-bold">ChainVanguard</span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} ChainVanguard. Built with Next.js, TypeScript, and Hyperledger Fabric.
          </p>
        </div>
      </footer>
    </div>
  )
}
