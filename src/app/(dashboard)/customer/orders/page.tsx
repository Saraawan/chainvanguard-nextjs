/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { 
  Package, 
  Truck, 
  CheckCircle,
  Clock,
  MapPin,
  Eye,
  MessageCircle,
  RotateCcw,
  Star,
  AlertCircle,
  Plane,
  Home
} from 'lucide-react'

// Mock active orders data
const mockActiveOrders = [
  {
    id: 'ORD-2025-007',
    date: '2025-08-15',
    status: 'shipped',
    total: 156.78,
    estimatedDelivery: '2025-08-18',
    trackingId: 'TRK-2025-007',
    items: [
      { 
        id: '1',
        name: 'Wireless Gaming Mouse', 
        quantity: 1, 
        price: 89.99, 
        vendor: 'Tech Solutions Inc.',
        image: '/api/placeholder/60/60'
      },
      { 
        id: '2',
        name: 'Mouse Pad Pro', 
        quantity: 1, 
        price: 24.99, 
        vendor: 'Gaming Gear Co.',
        image: '/api/placeholder/60/60'
      }
    ],
    currentLocation: 'Distribution Center - Frankfurt, DE',
    progress: 75,
    trackingSteps: [
      { step: 'Order Confirmed', completed: true, date: '2025-08-15', time: '10:30 AM' },
      { step: 'Payment Processed', completed: true, date: '2025-08-15', time: '10:35 AM' },
      { step: 'Preparing Shipment', completed: true, date: '2025-08-15', time: '2:45 PM' },
      { step: 'Shipped', completed: true, date: '2025-08-16', time: '9:15 AM' },
      { step: 'In Transit', completed: true, date: '2025-08-16', time: '11:30 AM' },
      { step: 'Out for Delivery', completed: false, date: '2025-08-18', time: 'Expected' },
      { step: 'Delivered', completed: false, date: '2025-08-18', time: 'Expected' }
    ],
    vendor: 'Multiple Vendors',
    canCancel: false,
    canReturn: false,
    priority: 'standard'
  },
  {
    id: 'ORD-2025-008',
    date: '2025-08-16',
    status: 'processing',
    total: 245.50,
    estimatedDelivery: '2025-08-20',
    trackingId: 'TRK-2025-008',
    items: [
      { 
        id: '3',
        name: 'Premium Coffee Beans', 
        quantity: 3, 
        price: 29.99, 
        vendor: 'Green Farm Co.',
        image: '/api/placeholder/60/60'
      },
      { 
        id: '4',
        name: 'French Press Coffee Maker', 
        quantity: 1, 
        price: 155.53, 
        vendor: 'Kitchen Essentials',
        image: '/api/placeholder/60/60'
      }
    ],
    currentLocation: 'Vendor Facility - Processing',
    progress: 25,
    trackingSteps: [
      { step: 'Order Confirmed', completed: true, date: '2025-08-16', time: '3:20 PM' },
      { step: 'Payment Processed', completed: true, date: '2025-08-16', time: '3:25 PM' },
      { step: 'Preparing Shipment', completed: false, date: '2025-08-17', time: 'In Progress' },
      { step: 'Shipped', completed: false, date: '2025-08-17', time: 'Expected' },
      { step: 'In Transit', completed: false, date: '2025-08-18', time: 'Expected' },
      { step: 'Out for Delivery', completed: false, date: '2025-08-20', time: 'Expected' },
      { step: 'Delivered', completed: false, date: '2025-08-20', time: 'Expected' }
    ],
    vendor: 'Multiple Vendors',
    canCancel: true,
    canReturn: false,
    priority: 'express'
  },
  {
    id: 'ORD-2025-009',
    date: '2025-08-16',
    status: 'confirmed',
    total: 67.98,
    estimatedDelivery: '2025-08-19',
    trackingId: null,
    items: [
      { 
        id: '5',
        name: 'Eco Water Bottle', 
        quantity: 2, 
        price: 22.99, 
        vendor: 'Green Living Co.',
        image: '/api/placeholder/60/60'
      },
      { 
        id: '6',
        name: 'Bamboo Utensil Set', 
        quantity: 1, 
        price: 21.99, 
        vendor: 'Eco Accessories',
        image: '/api/placeholder/60/60'
      }
    ],
    currentLocation: 'Order Processing',
    progress: 15,
    trackingSteps: [
      { step: 'Order Confirmed', completed: true, date: '2025-08-16', time: '6:45 PM' },
      { step: 'Payment Processed', completed: false, date: '2025-08-17', time: 'Pending' },
      { step: 'Preparing Shipment', completed: false, date: '2025-08-17', time: 'Pending' },
      { step: 'Shipped', completed: false, date: '2025-08-17', time: 'Pending' },
      { step: 'In Transit', completed: false, date: '2025-08-18', time: 'Pending' },
      { step: 'Out for Delivery', completed: false, date: '2025-08-19', time: 'Pending' },
      { step: 'Delivered', completed: false, date: '2025-08-19', time: 'Pending' }
    ],
    vendor: 'Multiple Vendors',
    canCancel: true,
    canReturn: false,
    priority: 'standard'
  }
]

export default function MyOrdersPage() {
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null)
  const [selectedTab, setSelectedTab] = useState<'active' | 'tracking'>('active')

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'confirmed':
        return { 
          color: 'bg-blue-100 text-blue-700', 
          icon: Clock,
          label: 'Confirmed'
        }
      case 'processing':
        return { 
          color: 'bg-yellow-100 text-yellow-700', 
          icon: Package,
          label: 'Processing'
        }
      case 'shipped':
        return { 
          color: 'bg-green-100 text-green-700', 
          icon: Truck,
          label: 'Shipped'
        }
      case 'delivered':
        return { 
          color: 'bg-gray-100 text-gray-700', 
          icon: CheckCircle,
          label: 'Delivered'
        }
      default:
        return { 
          color: 'bg-gray-100 text-gray-700', 
          icon: Package,
          label: 'Unknown'
        }
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'express': return 'bg-orange-100 text-orange-700'
      case 'priority': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-600'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId)
  }

  const ActiveOrderCard = ({ order }: { order: any }) => {
    const statusConfig = getStatusConfig(order.status)
    const StatusIcon = statusConfig.icon
    const isExpanded = expandedOrder === order.id

    return (
      <Card className="border border-gray-100 bg-white">
        <CardContent className="p-4">
          {/* Order Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <StatusIcon className="h-5 w-5 text-gray-400" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-gray-800">{order.id}</h3>
                <p className="text-xs text-gray-500">{formatDate(order.date)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {order.priority === 'express' && (
                <Badge className={`text-xs px-2 py-1 ${getPriorityColor(order.priority)}`} variant="secondary">
                  <Plane className="h-3 w-3 mr-1" />
                  Express
                </Badge>
              )}
              <Badge className={`text-xs px-2 py-1 ${statusConfig.color}`} variant="secondary">
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex justify-between items-center text-xs mb-2">
              <span className="text-gray-600">Order Progress</span>
              <span className="text-gray-800 font-medium">{order.progress}%</span>
            </div>
            <Progress value={order.progress} className="h-2" />
            <div className="flex justify-between items-center text-xs mt-1">
              <span className="text-gray-500">{order.currentLocation}</span>
              <span className="text-gray-500">Est. {formatDate(order.estimatedDelivery)}</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
              <span className="font-medium text-gray-800">${order.total.toFixed(2)}</span>
            </div>
            
            {order.trackingId && (
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>Tracking: {order.trackingId}</span>
                <span>Delivery: {formatDate(order.estimatedDelivery)}</span>
              </div>
            )}
          </div>

          {/* Items Preview/Details */}
          {!isExpanded ? (
            <div className="mb-3">
              <p className="text-xs text-gray-500 line-clamp-1">
                {order.items.map((item: any) => `${item.quantity}x ${item.name}`).join(', ')}
              </p>
            </div>
          ) : (
            <div className="space-y-3 mb-3 border-t border-gray-100 pt-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-50 rounded-lg flex items-center justify-center">
                    <Package className="h-4 w-4 text-gray-300" />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-800">{item.name}</h4>
                    <p className="text-xs text-gray-500">by {item.vendor}</p>
                    <p className="text-xs text-gray-600">Qty: {item.quantity} × ${item.price}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-gray-600 hover:text-gray-800 h-7"
              onClick={() => toggleOrderExpansion(order.id)}
            >
              {isExpanded ? 'Show Less' : 'View Details'}
            </Button>
            
            <div className="flex gap-1">
              {order.trackingId && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedTab('tracking')}
                >
                  <Eye className="h-3 w-3" />
                </Button>
              )}
              
              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-500 hover:text-gray-700">
                <MessageCircle className="h-3 w-3" />
              </Button>
              
              {order.canCancel && (
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-gray-500 hover:text-red-600">
                  <AlertCircle className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const TrackingView = ({ order }: { order: any }) => (
    <Card className="border border-gray-100 bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <MapPin className="h-4 w-4" />
          Order Tracking - {order.id}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Current Status */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm text-gray-800">Current Location</p>
                <p className="text-xs text-gray-600">{order.currentLocation}</p>
              </div>
              <Badge className={`text-xs px-2 py-1 ${getStatusConfig(order.status).color}`} variant="secondary">
                {getStatusConfig(order.status).label}
              </Badge>
            </div>
          </div>

          {/* Tracking Timeline */}
          <div className="space-y-3">
            {order.trackingSteps.map((step: any, index: number) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
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
                <div className="flex-1">
                  <p className={`text-sm font-medium ${step.completed ? 'text-gray-800' : 'text-gray-500'}`}>
                    {step.step}
                  </p>
                  <p className="text-xs text-gray-500">{step.date} • {step.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Estimated Delivery */}
          <div className="border-t border-gray-100 pt-3">
            <div className="flex items-center gap-2 text-sm">
              <Home className="h-4 w-4 text-gray-500" />
              <span className="text-gray-600">Estimated delivery:</span>
              <span className="font-medium text-gray-800">{formatDate(order.estimatedDelivery)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-medium text-gray-700">My Orders</h1>
          <p className="text-sm text-gray-500">
            Track your current orders and delivery status
          </p>
        </div>
        
        {/* Tab Toggle */}
        <div className="flex items-center gap-1 border border-gray-200 rounded-md p-0.5">
          <Button
            variant={selectedTab === 'active' ? 'default' : 'ghost'}
            size="sm"
            className={`h-7 text-xs ${selectedTab === 'active' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setSelectedTab('active')}
          >
            <Package className="h-3 w-3 mr-1" />
            Active Orders
          </Button>
          <Button
            variant={selectedTab === 'tracking' ? 'default' : 'ghost'}
            size="sm"
            className={`h-7 text-xs ${selectedTab === 'tracking' ? 'bg-gray-800 text-white' : 'text-gray-600 hover:text-gray-800'}`}
            onClick={() => setSelectedTab('tracking')}
          >
            <MapPin className="h-3 w-3 mr-1" />
            Track Orders
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Orders', value: mockActiveOrders.length, icon: Package },
          { label: 'In Transit', value: mockActiveOrders.filter(o => o.status === 'shipped').length, icon: Truck },
          { label: 'Processing', value: mockActiveOrders.filter(o => o.status === 'processing').length, icon: Clock },
          { label: 'Total Value', value: `$${mockActiveOrders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`, icon: Star }
        ].map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={index} className="border border-gray-100 bg-white">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-800">{stat.value}</p>
                    <p className="text-xs text-gray-500">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Content */}
      {selectedTab === 'active' ? (
        <div className="space-y-4">
          {mockActiveOrders.length > 0 ? (
            mockActiveOrders.map(order => (
              <ActiveOrderCard key={order.id} order={order} />
            ))
          ) : (
            <Card className="text-center py-8 border border-gray-100 bg-white">
              <CardContent>
                <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-700 mb-2">No active orders</h3>
                <p className="text-sm text-gray-500 mb-4">
                  You dont have any orders in progress
                </p>
                <Button className="bg-gray-800 hover:bg-gray-700 text-white">
                  Start Shopping
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {mockActiveOrders
            .filter(order => order.trackingId)
            .map(order => (
              <TrackingView key={order.id} order={order} />
            ))}
          
          {mockActiveOrders.filter(order => order.trackingId).length === 0 && (
            <Card className="text-center py-8 border border-gray-100 bg-white">
              <CardContent>
                <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-base font-medium text-gray-700 mb-2">No trackable orders</h3>
                <p className="text-sm text-gray-500">
                  Orders with tracking information will appear here
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}