"use client";

import { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Package,
  Wallet,
  Eye,
  EyeOff,
  Shield,
  Copy,
  CheckCircle,
  AlertTriangle,
  Download,
  RefreshCw,
  Users,
  ShoppingCart,
  User,
  Mail,
} from "lucide-react";
import { UserRole } from "@/types/web3";

export default function RegisterPage() {
  // Form state - all in one
  const [walletName, setWalletName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Recovery dialog state
  const [isLoading, setIsLoading] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [backupConfirmed, setBackupConfirmed] = useState(false);
  const [createdWalletId, setCreatedWalletId] = useState("");

  const { login, setUserRole, updateProfile } = useAuth();
  const { createWallet, generateRecoveryPhrase, connectWallet } = useWallet();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple validation
      if (!walletName.trim()) throw new Error("Wallet name is required");
      if (!name.trim()) throw new Error("Your name is required");
      if (!selectedRole) throw new Error("Please select your role");
      if (password.length < 8)
        throw new Error("Password must be at least 8 characters");
      if (password !== confirmPassword)
        throw new Error("Passwords do not match");
      if (!acceptedTerms)
        throw new Error("Please accept the terms and conditions");
      if (email.trim() && !email.includes("@"))
        throw new Error("Please enter a valid email");

      // Create wallet
      const newWallet = await createWallet(walletName.trim(), password);

      // Generate recovery phrase
      const phrase = generateRecoveryPhrase();
      localStorage.setItem(`wallet_${newWallet.id}_recovery`, phrase);

      setRecoveryPhrase(phrase);
      setCreatedWalletId(newWallet.id);
      setShowRecoveryDialog(true);

      toast.success("Wallet created successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create wallet"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleComplete = async () => {
    if (!backupConfirmed) {
      toast.error("Please confirm you have backed up your recovery phrase");
      return;
    }

    try {
      // Get the created wallet
      const wallets = JSON.parse(
        localStorage.getItem("chainvanguard_wallets") || "[]"
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const wallet = wallets.find((w: any) => w.id === createdWalletId);

      if (!wallet) throw new Error("Wallet not found");

      // Connect wallet and login
      await connectWallet(createdWalletId, password);
      await login(wallet.address, password);

      // Set profile and role
      updateProfile({
        name: name.trim(),
        email: email.trim() || undefined,
      });
      setUserRole(selectedRole as UserRole);

      toast.success("Account setup completed!");

      // Add small delay to ensure state is updated
      setTimeout(() => {
        // Go to dashboard - FIXED ROUTING
        // Add this before the router.push in handleComplete
        console.log("Setting user role:", selectedRole);
        console.log("User after role set:", User);
        console.log("Navigating to:", `/${selectedRole}`);
        router.push(`/${selectedRole}`); // This matches your sidebar routes
      }, 100);
    } catch (error) {
      toast.error("Failed to complete setup");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast.success("Copied to clipboard!");
      })
      .catch(() => {
        toast.error("Failed to copy");
      });
  };

  const downloadRecoveryPhrase = () => {
    const content = [
      "ChainVanguard Wallet Recovery Phrase",
      "",
      `Wallet: ${walletName}`,
      `Name: ${name}`,
      `Role: ${selectedRole}`,
      `Created: ${new Date().toLocaleString()}`,
      "",
      "Recovery Phrase:",
      recoveryPhrase,
      "",
      "⚠️ SECURITY WARNING:",
      "• Keep this phrase secure and private",
      "• Never share it with anyone",
      "• This is the only way to recover your wallet",
    ].join("\n");

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `chainvanguard-${walletName.replace(/\s+/g, "-")}-recovery.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Recovery phrase downloaded!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ChainVanguard</span>
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-5 w-5" />
            Create Your Account
          </CardTitle>
          <CardDescription>
            Set up your blockchain wallet and profile for supply chain
            management
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Wallet Name */}
            <div className="space-y-2">
              <Label htmlFor="wallet-name">Wallet Name</Label>
              <Input
                id="wallet-name"
                placeholder="e.g., My Supply Chain Wallet"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            {/* Your Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email (Optional) */}
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com (optional)"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-2">
              <Label htmlFor="role">Your Role</Label>
              <Select
                value={selectedRole}
                onValueChange={(value) => setSelectedRole(value as UserRole)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your role in the supply chain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="supplier">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-600" />
                      <span>Supplier/Ministry</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="vendor">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-green-600" />
                      <span>Vendor</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="customer">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="h-4 w-4 text-purple-600" />
                      <span>Customer</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="blockchain-expert">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-orange-600" />
                      <span>Blockchain Expert</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password (min 8 chars)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  minLength={8}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) =>
                  setAcceptedTerms(checked as boolean)
                }
                disabled={isLoading}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="terms"
                  className="text-sm font-medium cursor-pointer"
                >
                  I accept the terms and conditions
                </label>
                <p className="text-xs text-muted-foreground">
                  By creating an account, you agree to our{" "}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy"
                    className="text-primary hover:underline"
                  >
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your wallet will be encrypted locally. Youll get a 12-word
                recovery phrase to backup your account.
              </AlertDescription>
            </Alert>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={
                isLoading ||
                !acceptedTerms ||
                !walletName.trim() ||
                !name.trim() ||
                !selectedRole ||
                !password ||
                !confirmPassword
              }
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recovery Phrase Dialog */}
      <Dialog open={showRecoveryDialog} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-lg"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              Backup Your Recovery Phrase
            </DialogTitle>
            <DialogDescription>
              Your account is created! Save this 12-word phrase to recover your
              wallet.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Critical:</strong> Write down these words in order.
                Anyone with this phrase can access your account.
              </AlertDescription>
            </Alert>

            <div className="bg-muted p-4 rounded-lg border-2 border-dashed border-amber-300">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {recoveryPhrase.split(" ").map((word, index) => (
                  <div
                    key={index}
                    className="bg-background p-3 rounded border text-center"
                  >
                    <span className="text-xs text-muted-foreground block">
                      {index + 1}
                    </span>
                    <div className="font-mono font-medium text-sm">{word}</div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={() => copyToClipboard(recoveryPhrase)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={downloadRecoveryPhrase}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="backup-confirmed"
                checked={backupConfirmed}
                onCheckedChange={(checked) =>
                  setBackupConfirmed(checked as boolean)
                }
              />
              <label
                htmlFor="backup-confirmed"
                className="text-sm font-medium cursor-pointer"
              >
                ✅ I have safely backed up my recovery phrase
              </label>
            </div>

            <Button
              className="w-full"
              onClick={handleComplete}
              disabled={!backupConfirmed}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Setup & Go to Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
