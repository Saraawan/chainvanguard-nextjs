"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
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

// Mock cart data
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

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const applyPromoCode = () => {
    if (promoCode.toUpperCase() === "SAVE10") {
      setAppliedPromo("SAVE10");
      setPromoCode("");
    } else {
      console.log("Invalid promo code");
    }
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
  };

  // Cart item component
  const CartItem = ({ item }: { item: (typeof mockCartItems)[0] }) => (
    <Card className="border border-border bg-background">
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Product Image */}
          <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="h-8 w-8 text-muted-foreground" />
          </div>

          {/* Product Info */}
          <div className="flex-1 space-y-2">
            <div className="flex justify-between items-start">
              <div>
                <Badge variant="outline" className="text-xs mb-1">
                  {item.category}
                </Badge>
                <h3 className="font-medium text-sm text-foreground">
                  {item.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {item.description}
                </p>
                <p className="text-xs mt-1 text-muted-foreground">
                  by <span className="text-foreground">{item.vendor}</span>
                </p>
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="text-lg font-medium text-foreground">
                  ${item.price}
                </p>
                <p className="text-xs text-muted-foreground">
                  ${(item.price * item.quantity).toFixed(2)} total
                </p>
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-border rounded-md">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-accent"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-12 text-center text-sm text-foreground">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-accent"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    disabled={item.quantity >= item.inStock}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                <Badge variant="secondary" className="text-xs">
                  {item.inStock} available
                </Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive/80"
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
        <div className="flex items-center gap-4">
          <Link href="/browse">
            <Button variant="ghost" size="sm" className="text-foreground">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Continue Shopping
            </Button>
          </Link>
        </div>

        <Card className="text-center py-12 border border-border bg-background">
          <CardContent>
            <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-lg font-medium text-foreground mb-2">
              Your cart is empty
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              Add some products to your cart to get started
            </p>
            <Link href="/browse">
              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                Browse Products
              </Button>
            </Link>
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
          <Button variant="ghost" size="sm" className="text-foreground">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Continue Shopping
          </Button>
          <div>
            <h1 className="text-xl font-medium text-foreground">
              Shopping Cart
            </h1>
            <p className="text-sm text-muted-foreground">
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
          <Card className="border border-border bg-background">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  Subtotal (
                  {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                  items)
                </span>
                <span className="text-foreground">${subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>

              {shipping > 0 && (
                <div className="text-xs text-muted-foreground bg-muted p-2 rounded flex items-center gap-1">
                  <Truck className="h-3 w-3" />
                  Add ${(100 - subtotal).toFixed(2)} more for free shipping
                </div>
              )}

              {appliedPromo && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">
                    Discount ({appliedPromo})
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 text-destructive hover:text-destructive/80"
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

              <div className="flex justify-between">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-medium text-lg text-foreground">
                  ${total.toFixed(2)}
                </span>
              </div>

              <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Checkout
              </Button>

              <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="h-3 w-3" />
                Secure blockchain transaction
              </div>
            </CardContent>
          </Card>

          {/* Promo Code */}
          <Card className="border border-border bg-background">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
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
                    className="h-9 text-sm border-border"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border text-foreground hover:text-foreground/90"
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

              <p className="text-xs text-muted-foreground mt-2">
                Try: SAVE10 for 10% off
              </p>
            </CardContent>
          </Card>

          {/* Delivery Info */}
          <Card className="border border-border bg-background">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                  <Truck className="h-4 w-4 text-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    Fast Delivery
                  </p>
                  <p className="text-xs text-muted-foreground">
                    2-3 business days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
