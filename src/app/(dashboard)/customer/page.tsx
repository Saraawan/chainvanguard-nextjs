'use client'

import { useAuth } from '@/components/providers/auth-provider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ShoppingCart, 
  Package, 
  Truck, 
  DollarSign, 
  Clock,
  CheckCircle,
  MapPin,
  Star,
  Eye,
  Trash2
} from 'lucide-react'
import { useState, useEffect } from 'react'

// Mock data - in real app this would come from your blockchain/API
const mockCartItems = [
  {
    id: '1',
    name: 'Organic Coffee Beans',
    vendor: 'Green Farm Co.',
    price: 29.99,
    quantity: 2,
    image: '/api/placeholder/80/80',
    inStock: true
  },
  {
    id: '2',
    name: 'Premium Tea Set',
    vendor: 'Mountain Tea Ltd.',
    price: 89.99,
    quantity: 1,
    image: '/api/placeholder/80/80',
    inStock: true
  }
]

const mockOrders = [
  {
    id: 'ORD-001',
    date: '2025-08-12',
    total: 156.78,
    status: 'delivered',
    items: 3,
    vendor: 'Green Farm Co.',
    trackingId: 'TRK001'
  },
  {
    id: 'ORD-002',
    date: '2025-08-10',
    total: 89.99,
    status: 'shipped',
    items: 1,
    vendor: 'Mountain Tea Ltd.',
    trackingId: 'TRK002'
  },
  {
    id: 'ORD-003',
    date: '2025-08-08',
    total: 245.50,
    status: 'processing',
    items: 5,
    vendor: 'Tech Solutions Inc.',
    trackingId: 'TRK003'
  }
]

const mockLastOrder = {
  id: 'ORD-002',
  status: 'shipped',
  estimatedDelivery: '2025-08-16',
  currentLocation: 'Distribution Center - Frankfurt',
  progress: 75,
  trackingSteps: [
    { step: 'Order Confirmed', completed: true, date: '2025-08-10' },
    { step: 'Processing', completed: true, date: '2025-08-10' },
    { step: 'Shipped', completed: true, date: '2025-08-12' },
    { step: 'In Transit', completed: true, date: '2025-08-13' },
    { step: 'Out for Delivery', completed: false, date: '2025-08-16' },
    { step: 'Delivered', completed: false, date: '2025-08-16' }
  ]
}

export default function CustomerDashboard() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState(mockCartItems)
  const [recentOrders, setRecentOrders] = useState(mockOrders)

  // Calculate stats
  const cartTotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalSpent = recentOrders.reduce((sum, order) => sum + order.total, 0)
  const ordersInTransit = recentOrders.filter(order => 
    order.status === 'shipped' || order.status === 'processing'
  ).length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'shipped': return 'bg-blue-100 text-blue-800'
      case 'processing': return 'bg-yellow-100 text-yellow-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'shipped': return <Truck className="h-4 w-4" />
      case 'processing': return <Clock className="h-4 w-4" />
      default: return <Package className="h-4 w-4" />
    }
  }

  const removeFromCart = (itemId: string) => {
    setCartItems(cartItems.filter(item => item.id !== itemId))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Customer Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}</p>
        </div>
        <Button className="flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          View All Products
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{cartItemCount}</div>
            <p className="text-xs text-muted-foreground">
              ${cartTotal.toFixed(2)} total value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentOrders.length}</div>
            <p className="text-xs text-muted-foreground">Total orders placed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Transit</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ordersInTransit}</div>
            <p className="text-xs text-muted-foreground">Orders being shipped</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All time purchases</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Recent Orders
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentOrders.slice(0, 3).map((order) => (
              <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(order.status)}
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.vendor}</p>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)} variant="secondary">
                    {order.status}
                  </Badge>
                  <p className="text-sm text-muted-foreground mt-1">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full">
              View All Orders
            </Button>
          </CardContent>
        </Card>

        {/* Shopping Cart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Shopping Cart ({cartItemCount} items)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.length > 0 ? (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg">
                    <div className="w-12 h-12 bg-muted rounded-md"></div>
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.vendor}</p>
                      <p className="text-sm">Qty: {item.quantity} × ${item.price}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold text-lg">${cartTotal.toFixed(2)}</span>
                  </div>
                  <Button className="w-full">
                    Proceed to Checkout
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Your cart is empty</p>
                <Button variant="outline" className="mt-2">
                  Start Shopping
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Tracking Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Last Order Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order {mockLastOrder.id}</p>
                <p className="text-sm text-muted-foreground">
                  Current Status: {mockLastOrder.currentLocation}
                </p>
              </div>
              <Badge className={getStatusColor(mockLastOrder.status)} variant="secondary">
                {mockLastOrder.status}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Delivery Progress</span>
                <span>{mockLastOrder.progress}%</span>
              </div>
              <Progress value={mockLastOrder.progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Estimated delivery: {mockLastOrder.estimatedDelivery}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-6">
              {mockLastOrder.trackingSteps.map((step, index) => (
                <div key={index} className="flex flex-col items-center text-center">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center mb-2 ${
                    step.completed 
                      ? 'bg-green-100 border-green-500 text-green-700' 
                      : 'bg-gray-100 border-gray-300 text-gray-500'
                  }`}>
                    {step.completed ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <Clock className="h-4 w-4" />
                    )}
                  </div>
                  <p className="text-xs font-medium">{step.step}</p>
                  <p className="text-xs text-muted-foreground">{step.date}</p>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4">
              View Full Tracking Details
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}