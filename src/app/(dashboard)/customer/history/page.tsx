/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Calendar,
  Package,
  CheckCircle,
  XCircle,
  RotateCcw,
  Download,
  Star,
  Filter,
  TrendingUp,
  ArrowUpDown,
} from "lucide-react";

// Mock order history data - past orders only
const mockOrderHistory = [
  {
    id: "ORD-2025-001",
    date: "2025-08-10",
    status: "delivered",
    total: 289.97,
    deliveryDate: "2025-08-12",
    items: [
      {
        name: "Premium Cotton T-Shirt",
        quantity: 2,
        price: 29.99,
        vendor: "Fashion Hub",
      },
      {
        name: "Wireless Bluetooth Headphones",
        quantity: 1,
        price: 199.99,
        vendor: "Tech Solutions Inc.",
      },
      {
        name: "Organic Coffee Beans",
        quantity: 1,
        price: 29.99,
        vendor: "Green Farm Co.",
      },
    ],
    trackingId: "TRK-2025-001",
    rating: 5,
    reviewed: true,
  },
  {
    id: "ORD-2025-002",
    date: "2025-08-05",
    status: "delivered",
    total: 156.78,
    deliveryDate: "2025-08-07",
    items: [
      {
        name: "Yoga Exercise Mat",
        quantity: 1,
        price: 49.99,
        vendor: "FitLife Store",
      },
      {
        name: "Plant-Based Protein Powder",
        quantity: 2,
        price: 39.99,
        vendor: "Nutrition Plus",
      },
      { name: "Water Bottle", quantity: 1, price: 26.8, vendor: "Eco Living" },
    ],
    trackingId: "TRK-2025-002",
    rating: 4,
    reviewed: true,
  },
  {
    id: "ORD-2025-003",
    date: "2025-08-01",
    status: "delivered",
    total: 324.95,
    deliveryDate: "2025-08-03",
    items: [
      {
        name: "Gaming Mouse",
        quantity: 1,
        price: 89.99,
        vendor: "Tech Solutions Inc.",
      },
      {
        name: "Mechanical Keyboard",
        quantity: 1,
        price: 159.99,
        vendor: "Tech Solutions Inc.",
      },
      {
        name: "Monitor Stand",
        quantity: 1,
        price: 74.97,
        vendor: "Office Essentials",
      },
    ],
    trackingId: "TRK-2025-003",
    rating: 5,
    reviewed: true,
  },
  {
    id: "ORD-2025-004",
    date: "2025-07-28",
    status: "delivered",
    total: 67.98,
    deliveryDate: "2025-07-30",
    items: [
      {
        name: "Eco-Friendly Plates",
        quantity: 1,
        price: 45.99,
        vendor: "Green Living Co.",
      },
      {
        name: "Bamboo Cutlery Set",
        quantity: 1,
        price: 21.99,
        vendor: "Eco Accessories",
      },
    ],
    trackingId: "TRK-2025-004",
    rating: 4,
    reviewed: false,
  },
  {
    id: "ORD-2025-005",
    date: "2025-07-25",
    status: "cancelled",
    total: 45.5,
    cancelDate: "2025-07-25",
    items: [
      {
        name: "Specialty Tea Collection",
        quantity: 1,
        price: 45.5,
        vendor: "Tea Masters",
      },
    ],
    trackingId: null,
    cancelReason: "Out of stock",
  },
  {
    id: "ORD-2025-006",
    date: "2025-07-20",
    status: "delivered",
    total: 189.99,
    deliveryDate: "2025-07-22",
    items: [
      {
        name: "Smart Watch",
        quantity: 1,
        price: 189.99,
        vendor: "Tech Gadgets Pro",
      },
    ],
    trackingId: "TRK-2025-006",
    rating: 3,
    reviewed: true,
  },
  {
    id: "ORD-2025-007",
    date: "2025-07-15",
    status: "returned",
    total: 129.99,
    returnDate: "2025-07-25",
    items: [
      {
        name: "Bluetooth Speaker",
        quantity: 1,
        price: 129.99,
        vendor: "Audio Excellence",
      },
    ],
    trackingId: "TRK-2025-007",
    returnReason: "Defective product",
    refundAmount: 129.99,
  },
];

const statusOptions = ["All Status", "delivered", "cancelled", "returned"];
const sortOptions = [
  { value: "date-desc", label: "Newest First" },
  { value: "date-asc", label: "Oldest First" },
  { value: "total-desc", label: "Highest Amount" },
  { value: "total-asc", label: "Lowest Amount" },
  { value: "status", label: "Status" },
];

export default function OrderHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("date-desc");
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  // Filter and sort orders
  const filteredAndSortedOrders = React.useMemo(() => {
    const filtered = mockOrderHistory.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.items.some(
          (item) =>
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.vendor.toLowerCase().includes(searchTerm.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "All Status" || order.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    // Sort orders
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "total-desc":
          return b.total - a.total;
        case "total-asc":
          return a.total - b.total;
        case "status":
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, statusFilter, sortBy]);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "delivered":
        return {
          color: "bg-green-100 text-green-700",
          icon: CheckCircle,
          label: "Delivered",
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-700",
          icon: XCircle,
          label: "Cancelled",
        };
      case "returned":
        return {
          color: "bg-orange-100 text-orange-700",
          icon: RotateCcw,
          label: "Returned",
        };
      default:
        return {
          color: "bg-muted text-gray-700",
          icon: Package,
          label: "Unknown",
        };
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const renderStarRating = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
          />
        ))}
        <span className="text-xs text-muted-foreground ml-1">({rating}/5)</span>
      </div>
    );
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const OrderHistoryCard = ({ order }: { order: any }) => {
    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;
    const isExpanded = expandedOrder === order.id;

    return (
      <Card className="border border-border bg-background">
        <CardContent className="p-4">
          {/* Order Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                <StatusIcon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-medium text-sm text-foreground">
                  {order.id}
                </h3>
                <p className="text-xs text-muted-foreground">
                  Ordered {formatDate(order.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge
                className={`text-xs px-2 py-1 ${statusConfig.color}`}
                variant="secondary"
              >
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusConfig.label}
              </Badge>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-2 mb-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-muted-foreground">
                {order.items.length} item{order.items.length > 1 ? "s" : ""}
              </span>
              <span className="font-medium text-foreground">
                ${order.total.toFixed(2)}
              </span>
            </div>

            {/* Status specific info */}
            {order.status === "delivered" && order.deliveryDate && (
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>Delivered {formatDate(order.deliveryDate)}</span>
                {order.rating && <div>{renderStarRating(order.rating)}</div>}
              </div>
            )}

            {order.status === "cancelled" && (
              <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                Cancelled: {order.cancelReason}
              </div>
            )}

            {order.status === "returned" && (
              <div className="text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 p-2 rounded">
                Returned: {order.returnReason} • Refund: ${order.refundAmount}
              </div>
            )}
          </div>

          {/* Items Preview/Details */}
          {!isExpanded ? (
            <div className="mb-3">
              <p className="text-xs text-muted-foreground line-clamp-1">
                {order.items
                  .map((item: any) => `${item.quantity}x ${item.name}`)
                  .join(", ")}
              </p>
            </div>
          ) : (
            <div className="space-y-2 mb-3 border-t border-border pt-3">
              {order.items.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                      <Package className="h-3 w-3 text-muted-foreground" />
                    </div>
                    <div>
                      <span className="text-foreground">
                        {item.quantity}x {item.name}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        by {item.vendor}
                      </p>
                    </div>
                  </div>
                  <span className="text-muted-foreground">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground h-7"
              onClick={() => toggleOrderExpansion(order.id)}
            >
              {isExpanded ? "Show Less" : "View Details"}
            </Button>

            <div className="flex gap-1">
              {order.status === "delivered" && !order.reviewed && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs px-2 text-primary hover:text-primary/80"
                >
                  <Star className="h-3 w-3 mr-1" />
                  Review
                </Button>
              )}

              {order.status === "delivered" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-muted-foreground hover:text-gray-700"
                >
                  <RotateCcw className="h-3 w-3" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0 text-muted-foreground hover:text-gray-700"
              >
                <Download className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Calculate stats
  const totalOrders = mockOrderHistory.length;
  const totalSpent = mockOrderHistory
    .filter((o) => o.status !== "cancelled")
    .reduce((sum, o) => sum + o.total, 0);
  const deliveredOrders = mockOrderHistory.filter(
    (o) => o.status === "delivered"
  ).length;
  const avgRating = mockOrderHistory
    .filter((o) => o.rating)
    .reduce((sum, o, _, arr) => sum + (o.rating || 0) / arr.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-medium text-foreground">Order History</h1>

        <p className="text-sm text-muted-foreground">
          View and manage all your completed orders
        </p>
      </div>

      {/* Order Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Orders", value: totalOrders, icon: Package },
          {
            label: "Total Spent",
            value: `$${totalSpent.toFixed(2)}`,
            icon: TrendingUp,
          },
          { label: "Delivered", value: deliveredOrders, icon: CheckCircle },
          {
            label: "Avg Rating",
            value: avgRating > 0 ? avgRating.toFixed(1) : "N/A",
            icon: Star,
          },
        ].map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border border-border bg-background">
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-muted rounded-lg flex items-center justify-center">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground">
                      {stat.value}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card className="border border-border bg-background">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
            <Filter className="h-4 w-4 text-muted-foreground" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders, products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm border-border focus:border-gray-300"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-9 text-sm border-border">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status} className="text-sm">
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-9 text-sm border-border">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                {sortOptions.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                    className="text-sm"
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Results Summary */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedOrders.length} of {mockOrderHistory.length}{" "}
              orders
            </p>

            {/* Active Filters */}
            <div className="flex gap-2">
              {searchTerm && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-muted text-muted-foreground gap-1"
                >
                  {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="text-xs text-muted-foreground hover:text-muted-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {statusFilter !== "All Status" && (
                <Badge
                  variant="secondary"
                  className="text-xs bg-muted text-muted-foreground gap-1"
                >
                  {statusFilter}
                  <button
                    onClick={() => setStatusFilter("All Status")}
                    className="text-xs text-muted-foreground hover:text-muted-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      {filteredAndSortedOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredAndSortedOrders.map((order) => (
            <OrderHistoryCard key={order.id} order={order} />
          ))}
        </div>
      ) : (
        <Card className="text-center py-8 border border-border bg-background">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-medium text-gray-700 mb-2">
              No orders found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button
              variant="outline"
              size="sm"
              className="border-border text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSearchTerm("");
                setStatusFilter("All Status");
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
