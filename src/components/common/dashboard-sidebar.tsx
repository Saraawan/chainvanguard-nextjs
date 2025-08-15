// src/components/common-sidebar.tsx
"use client";

import { useAuth } from "@/components/providers/auth-provider";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Home,
  Package,
  Warehouse,
  ShoppingCart,
  Users,
  BarChart,
  Plus,
  History,
  FileText,
  ClipboardList,
  TrendingUp,
  List,
  Shield,
  Activity,
  Monitor,
  GitBranch,
} from "lucide-react";

export function DashboardSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();

  const getNavigationItems = () => {
    switch (user?.role) {
      // 1. Supplier
      case "supplier":
        return [
          { href: "/supplier", label: "Dashboard", icon: Home },
          { href: "/supplier/products", label: "Products", icon: Package },
          { href: "/supplier/inventory", label: "Inventory", icon: Warehouse },
          {
            href: "/supplier/transactions",
            label: "Transactions",
            icon: History,
          },
          { href: "/supplier/vendors", label: "Vendors", icon: Users },
          { href: "/supplier/analytics", label: "Analytics", icon: BarChart },
        ];

      // 2. Vendor
      case "vendor":
        return [
          { href: "/vendor", label: "Dashboard", icon: Home },
          { href: "/vendor/add-product", label: "Add Product", icon: Plus },
          { href: "/vendor/my-products", label: "My Products", icon: Package },
          { href: "/vendor/orders", label: "Orders", icon: ShoppingCart },
          { href: "/vendor/customers", label: "Customers", icon: Users },
          { href: "/vendor/analytics", label: "Analytics", icon: TrendingUp },
          {
            href: "/vendor/sales-history",
            label: "Sales History",
            icon: History,
          },
        ];

      // 3. Customer
      case "customer":
        return [
          { href: "/customer", label: "Dashboard", icon: Home },
          { href: "/customer/browse", label: "Browse Products", icon: Package }, 
          { href: "/customer/cart", label: "My Cart", icon: ShoppingCart }, 
          { href: "/customer/orders", label: "My Orders", icon: ClipboardList }, 
          { href: "/customer/history", label: "Order History", icon: History }, 
        ];

      // 4. Blockchain Expert
      case "blockchain-expert":
        return [
          { href: "/blockchain-expert", label: "Dashboard", icon: Home },
          {
            href: "/blockchain-expert/all-transactions",
            label: "All Transactions",
            icon: List,
          },
          {
            href: "/blockchain-expert/blockchain-logs",
            label: "Blockchain Logs",
            icon: FileText,
          },
          {
            href: "/blockchain-expert/consensus",
            label: "Consensus",
            icon: GitBranch,
          },
          {
            href: "/blockchain-expert/security",
            label: "Security",
            icon: Shield,
          },
          {
            href: "/blockchain-expert/fault-tolerance",
            label: "Fault Tolerance",
            icon: Activity,
          },
          {
            href: "/blockchain-expert/system-health",
            label: "System Health",
            icon: Monitor,
          },
        ];

      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background">
      <div className="h-full py-6 overflow-y-auto">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            {user?.role === "vendor" ? "Vendor Portal" : "Navigation"}
          </h2>
          <div className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    pathname === item.href && "bg-secondary"
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
