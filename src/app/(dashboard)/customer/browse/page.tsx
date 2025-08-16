/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
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
  Star,
  ShoppingCart,
  Heart,
  Package,
  SlidersHorizontal,
  Grid3X3,
  List,
  Eye,
} from "lucide-react";

const mockProducts = [
  {
    id: "1",
    name: "Premium Cotton T-Shirt",
    description: "Ultra-soft premium quality cotton t-shirt with perfect fit",
    price: 29.99,
    category: "Textiles",
    vendor: "Fashion Hub",
    rating: 4.5,
    reviews: 128,
    inStock: 100,
    addedDate: "2025-08-15",
  },
  {
    id: "2",
    name: "Organic Coffee Beans",
    description: "Single-origin organic coffee beans from Ethiopian highlands",
    price: 24.99,
    category: "Food & Beverages",
    vendor: "Green Farm Co.",
    rating: 4.8,
    reviews: 89,
    inStock: 45,
    addedDate: "2025-08-14",
  },
  {
    id: "3",
    name: "Wireless Bluetooth Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 199.99,
    category: "Electronics",
    vendor: "Tech Solutions Inc.",
    rating: 4.6,
    reviews: 234,
    inStock: 25,
    image: "/api/placeholder/300/300",
    addedDate: "2025-08-13",
    tags: ["wireless", "bluetooth", "noise-cancelling"],
  },
  {
    id: "4",
    name: "Handcrafted Ceramic Mug",
    description:
      "Beautiful handcrafted ceramic mug perfect for your morning coffee",
    price: 18.99,
    category: "Home & Kitchen",
    vendor: "Artisan Crafts",
    rating: 4.3,
    reviews: 67,
    inStock: 78,
    image: "/api/placeholder/300/300",
    addedDate: "2025-08-12",
    tags: ["handcrafted", "ceramic", "kitchen"],
  },
  {
    id: "5",
    name: "Yoga Exercise Mat",
    description: "Non-slip eco-friendly yoga mat for all your fitness needs",
    price: 49.99,
    category: "Sports & Fitness",
    vendor: "FitLife Store",
    rating: 4.7,
    reviews: 156,
    inStock: 33,
    image: "/api/placeholder/300/300",
    addedDate: "2025-08-11",
    tags: ["yoga", "fitness", "eco-friendly"],
  },
  {
    id: "6",
    name: "Smart Home LED Bulb",
    description: "WiFi-enabled smart LED bulb with color changing capabilities",
    price: 34.99,
    category: "Electronics",
    vendor: "Smart Home Solutions",
    rating: 4.4,
    reviews: 98,
    inStock: 120,
    image: "/api/placeholder/300/300",
    addedDate: "2025-08-10",
    tags: ["smart", "led", "wifi"],
  },
  {
    id: "7",
    name: "Vintage Leather Wallet",
    description:
      "Genuine leather wallet with RFID protection and classic design",
    price: 79.99,
    category: "Fashion & Accessories",
    vendor: "Leather Craft Co.",
    rating: 4.9,
    reviews: 203,
    inStock: 42,
    image: "/api/placeholder/300/300",
    addedDate: "2025-08-09",
    tags: ["leather", "vintage", "rfid"],
  },
  {
    id: "8",
    name: "Plant-Based Protein Powder",
    description: "Organic plant-based protein powder with vanilla flavor",
    price: 39.99,
    category: "Food & Beverages",
    vendor: "Nutrition Plus",
    rating: 4.2,
    reviews: 87,
    inStock: 67,
    image: "/api/placeholder/300/300",
    addedDate: "2025-08-08",
    tags: ["protein", "plant-based", "vanilla"],
  },
];

const categories = [
  "All Categories",
  "Textiles",
  "Food & Beverages",
  "Electronics",
  "Home & Kitchen",
  "Sports & Fitness",
  "Fashion & Accessories",
];

const sortOptions = [
  { value: "name-asc", label: "Name: A to Z" },
  { value: "name-desc", label: "Name: Z to A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Highest Rated" },
  { value: "newest", label: "Newest First" },
];

export default function BrowseProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("name-asc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [favorites, setFavorites] = useState<string[]>([]);

  const filteredAndSortedProducts = useMemo(() => {
    const filtered = mockProducts.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.vendor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" ||
        product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating-desc":
          return b.rating - a.rating;
        case "newest":
          return (
            new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchTerm, selectedCategory, sortBy]);

  const toggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (product: any) => {
    console.log("Adding to cart:", product);
  };

  const ProductCard = ({ product }: { product: any }) => (
    <Card className="group hover:shadow-sm transition-all duration-200 border border-border bg-background">
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <div className="w-full h-40 bg-muted flex items-center justify-center">
            <Package className="h-12 w-12 text-muted-foreground" />
          </div>

          <Badge
            className="absolute top-2 right-2 text-xs px-2 py-1"
            variant="secondary"
          >
            {product.inStock} left
          </Badge>

          <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
            <Button size="sm" variant="outline" className="h-8 w-8 p-0">
              <Eye className="h-3.5 w-3.5" />
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={`h-8 w-8 p-0 ${
                favorites.includes(product.id) ? "text-destructive" : ""
              }`}
              onClick={() => toggleFavorite(product.id)}
            >
              <Heart className={`h-3.5 w-3.5`} />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-3">
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {product.category}
          </Badge>
          <h3 className="font-medium text-sm text-foreground">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground">{product.description}</p>
          <p className="text-xs text-muted-foreground">by {product.vendor}</p>
          <div className="flex items-center gap-1">
            <Star className="h-3 w-3 text-foreground" />
            <span className="text-xs text-foreground">{product.rating}</span>
          </div>
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-medium text-foreground">
              ${product.price}
            </span>
            <Button
              size="sm"
              variant="default"
              onClick={() => addToCart(product)}
            >
              <ShoppingCart className="h-3 w-3 mr-1" /> Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem = ({ product }: { product: any }) => (
    <Card className="hover:shadow-sm transition-shadow border border-border bg-background">
      <CardContent className="p-3">
        <div className="flex gap-3">
          <div className="w-20 h-20 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-start justify-between">
              <div>
                <Badge variant="outline" className="text-xs">
                  {product.category}
                </Badge>
                <h3 className="font-medium text-sm text-foreground">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {product.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  by {product.vendor}
                </p>
              </div>
              <div className="text-right">
                <span className="text-lg font-medium text-foreground">
                  ${product.price}
                </span>
                <div className="flex items-center gap-1 justify-end mt-1">
                  <Star className="h-3 w-3 text-foreground" />
                  <span className="text-xs text-foreground">
                    {product.rating}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-xs">
                {product.inStock} left
              </Badge>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="h-7 w-7 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className={`h-7 w-7 p-0 ${favorites.includes(product.id) ? "text-destructive" : ""}`}
                  onClick={() => toggleFavorite(product.id)}
                >
                  <Heart className="h-3 w-3" />
                </Button>
                <Button
                  size="sm"
                  variant="default"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-medium text-foreground">
            Browse Products
          </h1>
          <p className="text-sm text-muted-foreground">
            Discover products from verified vendors on our blockchain platform
          </p>
        </div>
        {/* View toggle */}
        <div className="flex items-center gap-1 border border-border rounded-md p-0.5">
          <Button
            size="sm"
            variant={viewMode === "grid" ? "default" : "ghost"}
            className="h-7 w-7 p-0"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="sm"
            variant={viewMode === "list" ? "default" : "ghost"}
            className="h-7 w-7 p-0"
            onClick={() => setViewMode("list")}
          >
            <List className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="border border-border bg-background">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-foreground">
            <SlidersHorizontal className="h-4 w-4" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products, vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm border-border focus:border-primary"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-9 text-sm border-border">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem
                    key={category}
                    value={category}
                    className="text-sm"
                  >
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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

          {/* Active filters */}
          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filteredAndSortedProducts.length} of {mockProducts.length}{" "}
              products
            </p>
            <div className="flex gap-2">
              {searchTerm && (
                <Badge variant="secondary" className="text-xs">
                  {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
              {selectedCategory !== "All Categories" && (
                <Badge variant="secondary" className="text-xs">
                  {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("All Categories")}
                    className="ml-1 text-xs text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Products */}
      {filteredAndSortedProducts.length > 0 ? (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredAndSortedProducts.map((product) =>
            viewMode === "grid" ? (
              <ProductCard key={product.id} product={product} />
            ) : (
              <ProductListItem key={product.id} product={product} />
            )
          )}
        </div>
      ) : (
        <Card className="text-center py-8 border border-border bg-background">
          <CardContent>
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-medium text-foreground mb-2">
              No products found
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Categories");
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
