"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  Package,
  CreditCard,
  Truck,
  Shield,
  Tag,
  Heart,
} from "lucide-react";

// Mock cart data - in real app this would come from your cart state/blockchain
const mockCartItems = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    description: "Ultra-soft premium quality cotton t-shirt",
    price: 29.99,
    quantity: 2,
    vendor: "Fashion Hub",
    category: "Textiles",
    inStock: 100,
    image: "/api/placeholder/80/80",
  },
  {
    id: "2",
    name: "Organic Coffee Beans",
    description: "Single-origin organic coffee from Ethiopian highlands",
    price: 24.99,
    quantity: 1,
    vendor: "Green Farm Co.",
    category: "Food & Beverages",
    inStock: 45,
    image: "/api/placeholder/80/80",
  },
  {
    id: "3",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    quantity: 1,
    vendor: "Tech Solutions Inc.",
    category: "Electronics",
    inStock: 25,
    image: "/api/placeholder/80/80",
  },
];

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState(mockCartItems);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 100 ? 0 : 9.99;
  const discount = appliedPromo === "SAVE10" ? subtotal * 0.1 : 0;
  const total = subtotal + shipping - discount;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setAppliedPromo("SAVE10");
      setPromoCode("");
    } else {
      // In real app, show error toast
      console.log("Invalid promo code");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const CartItem = ({ item }: { item: any }) => (
    <Card className="border border-gray-100 bg-white">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-20 h-20 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="h-8 w-8 text-gray-300" />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <Badge
                  variant="outline"
                  className="text-xs text-gray-500 border-gray-200 mb-1"
                >
                  {item.category}
                </Badge>
                <h3 className="font-medium text-sm text-gray-800">
                  {item.name}
                </h3>
                <p className="text-xs text-gray-500">{item.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  by <span className="text-gray-600">{item.vendor}</span>
                </p>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-lg font-medium text-gray-800">
                  ${item.price}
                </p>
                <p className="text-xs text-gray-500">
                  ${(item.price * item.quantity).toFixed(2)} total
                </p>
              </div>
            </div>

            {/* Quantity Controls & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Quantity Controls */}
                <div className="flex items-center border border-gray-200 rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-50"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-12 text-center text-sm text-gray-700">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-50"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.inStock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Stock Info */}
                <Badge
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-600"
                >
                  {item.inStock} available
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-red-600"
                  onClick={() => removeItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Button>
        </div>

        <Card className="text-center py-12 border border-gray-100 bg-white">
          <CardContent>
            <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-medium text-gray-700 mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Add some products to your cart to get started
            </p>
            <Button className="bg-gray-800 hover:bg-gray-700 text-white">
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-gray-600">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Button>
          <div>
            <h1 className="text-xl font-medium text-gray-700">Shopping Cart</h1>
            <p className="text-sm text-gray-500">
              {cartItems.length} items in your cart
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        {/* Order Summary */}
        <div className="space-y-4">
          {/* Summary Card */}
          <Card className="border border-gray-100 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Subtotal */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">
                  Subtotal (
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items)
                </span>
                <span className="text-gray-800">${subtotal.toFixed(2)}</span>
              </div>

              {/* Shipping */}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="text-gray-800">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {/* Free shipping notice */}
              {shipping > 0 && (
                <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                  <Truck className="h-3 w-3 inline mr-1" />
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}

              {/* Discount */}
              {appliedPromo && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">
                    Discount ({appliedPromo})
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 text-gray-400 hover:text-red-600"
                      onClick={removePromoCode}
                    >
                      ×
                    </Button>
                  </span>
                  <span className="text-green-600">
                    -${discount.toFixed(2)}
                  </span>
                </div>
              )}

              <Separator />

              {/* Total */}
              <div className="flex justify-between">
                <span className="font-medium text-gray-800">Total</span>
                <span className="font-medium text-lg text-gray-800">
                  ${total.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <Button className="w-full bg-gray-800 hover:bg-gray-700 text-white">
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>

              {/* Security Notice */}
              <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                <Shield className="h-3 w-3" />
                Secure blockchain transaction
              </div>
            </CardContent>
          </Card>

          {/* Promo Code */}
          <Card className="border border-gray-100 bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Promo Code
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!appliedPromo ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-9 text-sm border-gray-200"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200 text-gray-600 hover:text-gray-800"
                    onClick={applyPromoCode}
                    disabled={!promoCode.trim()}
                  >
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                  <span className="text-sm text-green-700">
                    Code &quot;{appliedPromo}&quot; applied!
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-green-600 hover:text-red-600"
                    onClick={removePromoCode}
                  >
                    ×
                  </Button>
                </div>
              )}

              {/* Sample codes hint */}
              <p className="text-xs text-gray-400 mt-2">
                Try: SAVE10 for 10% off
              </p>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card className="border border-gray-100 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Fast Delivery
                  </p>
                  <p className="text-xs text-gray-500">2-3 business days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
