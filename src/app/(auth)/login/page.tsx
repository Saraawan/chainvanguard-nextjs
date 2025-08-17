/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { useWallet } from "@/components/providers/wallet-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Package,
  Wallet,
  Eye,
  EyeOff,
  Key,
  Shield,
  RefreshCw,
  AlertTriangle,
  Copy,
  CheckCircle,
  Download,
} from "lucide-react";
import { WalletData } from "@/types/web3";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [availableWallets, setAvailableWallets] = useState<WalletData[]>([]);
  const [selectedWallet, setSelectedWallet] = useState("");

  // Recovery Dialog State
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRecovering, setIsRecovering] = useState(false);

  // Password Reset State
  const [showForgotDialog, setShowForgotDialog] = useState(false);
  const [resetWalletId, setResetWalletId] = useState("");
  const [resetRecoveryPhrase, setResetRecoveryPhrase] = useState("");
  const [resetNewPassword, setResetNewPassword] = useState("");
  const [resetConfirmPassword, setResetConfirmPassword] = useState("");

  const { login } = useAuth();
  const { connectWallet, getAllWallets, recoverWallet } = useWallet();
  const router = useRouter();

  // Load available wallets on component mount
  useEffect(() => {
    const wallets = getAllWallets();
    setAvailableWallets(wallets);

    // Check if user is already logged in
    const savedUser = localStorage.getItem("chainvanguard_user");
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      if (userData.role) {
        router.push(`/${userData.role}`);
      }
    }
  }, [getAllWallets, router]);

  const handleWalletLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedWallet || !password) {
        throw new Error("Please select a wallet and enter password");
      }

      const wallet = availableWallets.find((w) => w.id === selectedWallet);
      if (!wallet) {
        throw new Error("Wallet not found");
      }

      console.log("[LOGIN] Starting login process for wallet:", wallet.address);

      // Connect wallet first
      const connected = await connectWallet(selectedWallet, password);
      if (!connected) {
        throw new Error("Invalid password");
      }

      // Set authentication cookie
      document.cookie = `chainvanguard_auth=${selectedWallet}; path=/; max-age=${7 * 24 * 60 * 60}`;

      // Login with auth provider (this should preserve role)
      await login(wallet.address, password);

      console.log("[LOGIN] Auth provider login completed");

      toast.success("Wallet connected successfully!");

      // Add a longer delay to ensure all state updates are complete
      setTimeout(async () => {
        // Double-check user data after state updates
        const savedUser = localStorage.getItem("chainvanguard_user");
        const authUser = JSON.parse(
          localStorage.getItem("chainvanguard_user") || "{}"
        );

        console.log("[LOGIN] Final check - savedUser:", savedUser);
        console.log("[LOGIN] Final check - authUser role:", authUser.role);

        if (savedUser) {
          try {
            const userData = JSON.parse(savedUser);

            if (userData.role && userData.walletAddress === wallet.address) {
              console.log(
                "[LOGIN] User has role, navigating to dashboard:",
                userData.role
              );
              // Use replace instead of push to avoid back button issues
              router.replace(`/${userData.role}`);
            } else {
              console.log("[LOGIN] User missing role, going to role selection");
              router.replace("/role-selection");
            }
          } catch (error) {
            console.error("[LOGIN] Error parsing user data:", error);
            router.replace("/role-selection");
          }
        } else {
          console.log("[LOGIN] No user data found, going to role selection");
          router.replace("/role-selection");
        }
      }, 1000); // Increased delay to 1 second
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
      setIsLoading(false); // Only set loading false on error
    }
    // Don't set setIsLoading(false) here - let the timeout handle it
  };

  const handleRecoveryRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRecovering(true);

    try {
      if (newPassword !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (!recoveryPhrase || recoveryPhrase.trim().split(" ").length !== 12) {
        throw new Error("Please enter a valid 12-word recovery phrase");
      }

      if (newPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      const recoveredWallet = await recoverWallet(
        recoveryPhrase.trim(),
        newPassword
      );

      // Update available wallets
      const updatedWallets = getAllWallets();
      setAvailableWallets(updatedWallets);
      setSelectedWallet(recoveredWallet.id);

      // Clear recovery form
      setRecoveryPhrase("");
      setNewPassword("");
      setConfirmPassword("");
      setShowRecoveryDialog(false);

      toast.success("Wallet recovered successfully! You can now login.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to recover wallet"
      );
    } finally {
      setIsRecovering(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (!resetWalletId) {
        throw new Error("Please select a wallet to reset");
      }

      if (
        !resetRecoveryPhrase ||
        resetRecoveryPhrase.trim().split(" ").length !== 12
      ) {
        throw new Error("Please enter a valid 12-word recovery phrase");
      }

      if (resetNewPassword !== resetConfirmPassword) {
        throw new Error("Passwords do not match");
      }

      if (resetNewPassword.length < 8) {
        throw new Error("Password must be at least 8 characters");
      }

      // Verify recovery phrase matches the wallet
      const storedRecoveryPhrase = localStorage.getItem(
        `wallet_${resetWalletId}_recovery`
      );
      if (storedRecoveryPhrase !== resetRecoveryPhrase.trim()) {
        throw new Error("Invalid recovery phrase for this wallet");
      }

      // Update wallet password
      const walletsData = JSON.parse(
        localStorage.getItem("chainvanguard_wallets") || "[]"
      );
      const walletIndex = walletsData.findIndex(
        (w: any) => w.id === resetWalletId
      );

      if (walletIndex === -1) {
        throw new Error("Wallet not found");
      }

      // Update password (in a real app, this would be properly encrypted)
      walletsData[walletIndex].encryptedPrivateKey = resetNewPassword; // Simplified for demo
      localStorage.setItem(
        "chainvanguard_wallets",
        JSON.stringify(walletsData)
      );

      // Clear form and close dialog
      setResetWalletId("");
      setResetRecoveryPhrase("");
      setResetNewPassword("");
      setResetConfirmPassword("");
      setShowForgotDialog(false);

      toast.success(
        "Password reset successfully! You can now login with your new password."
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to reset password"
      );
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ChainVanguard</span>
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-5 w-5" />
            Connect Your Wallet
          </CardTitle>
          <CardDescription>
            Select your Hyperledger Fabric wallet and enter your password
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleWalletLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="wallet-select">Select Wallet</Label>
              <Select value={selectedWallet} onValueChange={setSelectedWallet}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose your wallet" />
                </SelectTrigger>
                <SelectContent>
                  {availableWallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4" />
                        <div>
                          <div className="font-medium">{wallet.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatAddress(wallet.address)}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                  {availableWallets.length === 0 && (
                    <SelectItem value="no-wallet" disabled>
                      No wallets found - Create one first
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Wallet Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your wallet password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !selectedWallet}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Connect Wallet
                </>
              )}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            {/* Forgot Password Dialog */}
            {availableWallets.length > 0 && (
              <Dialog
                open={showForgotDialog}
                onOpenChange={setShowForgotDialog}
              >
                <DialogTrigger asChild>
                  <Button variant="outline" className="w-full" size="sm">
                    <Key className="mr-2 h-4 w-4" />
                    Forgot Password?
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      Reset Password
                    </DialogTitle>
                    <DialogDescription>
                      Use your recovery phrase to reset your wallet password
                    </DialogDescription>
                  </DialogHeader>

                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-wallet">Select Wallet</Label>
                      <Select
                        value={resetWalletId}
                        onValueChange={setResetWalletId}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose wallet to reset" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableWallets.map((wallet) => (
                            <SelectItem key={wallet.id} value={wallet.id}>
                              {wallet.name} - {formatAddress(wallet.address)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-recovery-phrase">
                        Recovery Phrase
                      </Label>
                      <textarea
                        id="reset-recovery-phrase"
                        className="w-full p-3 border rounded-md resize-none h-24"
                        placeholder="Enter your 12-word recovery phrase"
                        value={resetRecoveryPhrase}
                        onChange={(e) => setResetRecoveryPhrase(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-new-password">New Password</Label>
                      <Input
                        id="reset-new-password"
                        type="password"
                        placeholder="Create a new password"
                        value={resetNewPassword}
                        onChange={(e) => setResetNewPassword(e.target.value)}
                        required
                        minLength={8}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reset-confirm-password">
                        Confirm Password
                      </Label>
                      <Input
                        id="reset-confirm-password"
                        type="password"
                        placeholder="Confirm your new password"
                        value={resetConfirmPassword}
                        onChange={(e) =>
                          setResetConfirmPassword(e.target.value)
                        }
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      <Key className="mr-2 h-4 w-4" />
                      Reset Password
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            )}

            {/* Recover Wallet Dialog */}
            <Dialog
              open={showRecoveryDialog}
              onOpenChange={setShowRecoveryDialog}
            >
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full" size="sm">
                  <Shield className="mr-2 h-4 w-4" />
                  Recover Wallet with Seed Phrase
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Recover Wallet
                  </DialogTitle>
                  <DialogDescription>
                    Enter your 12-word recovery phrase to restore your wallet
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleRecoveryRestore} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="recovery-phrase">Recovery Phrase</Label>
                    <textarea
                      id="recovery-phrase"
                      className="w-full p-3 border rounded-md resize-none h-24"
                      placeholder="Enter your 12-word recovery phrase separated by spaces"
                      value={recoveryPhrase}
                      onChange={(e) => setRecoveryPhrase(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      placeholder="Create a new password (min 8 chars)"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isRecovering}
                  >
                    {isRecovering ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Recovering...
                      </>
                    ) : (
                      <>
                        <Shield className="mr-2 h-4 w-4" />
                        Recover Wallet
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Dont have a wallet?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Create New Wallet
              </Link>
            </p>
          </div>

          {/* Demo Section */}
          {availableWallets.length === 0 && (
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  No Hyperledger Fabric wallets found. Create a new wallet to
                  get started with blockchain-based supply chain management.
                </AlertDescription>
              </Alert>
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-3"
                onClick={() => router.push("/register")}
              >
                <Package className="mr-2 h-4 w-4" />
                Create Demo Wallet
              </Button>
            </div>
          )}

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
              <Shield className="h-3 w-3 inline mr-1" />
              Hyperledger Fabric Network - Secure, Private, Enterprise
              Blockchain
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
