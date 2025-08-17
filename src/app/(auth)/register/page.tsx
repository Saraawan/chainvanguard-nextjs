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
import { RolePreservation } from "@/utils/role-preservation";
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
  Phone,
  Building,
  MapPin,
} from "lucide-react";
import { UserRole } from "@/types/web3";

export default function RegisterPage() {
  // Basic Form State
  const [walletName, setWalletName] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole | "">("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Business Details (for suppliers/vendors)
  const [companyName, setCompanyName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");

  // Recovery dialog state
  const [isLoading, setIsLoading] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [recoveryPhrase, setRecoveryPhrase] = useState("");
  const [backupConfirmed, setBackupConfirmed] = useState(false);
  const [createdWalletId, setCreatedWalletId] = useState("");

  const { login, setUserRole, updateProfile } = useAuth();
  const { createWallet, generateRecoveryPhrase, connectWallet } = useWallet();
  const router = useRouter();

  const requiresBusinessInfo =
    selectedRole === "supplier" || selectedRole === "vendor";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Basic validation
      if (!walletName.trim()) throw new Error("Wallet name is required");
      if (!name.trim()) throw new Error("Your name is required");
      if (!selectedRole) throw new Error("Please select your role");
      if (password.length < 8)
        throw new Error("Password must be at least 8 characters");
      if (password !== confirmPassword)
        throw new Error("Passwords do not match");
      if (!acceptedTerms)
        throw new Error("Please accept the terms and conditions");

      // Email validation
      if (email.trim() && !email.includes("@"))
        throw new Error("Please enter a valid email");

      // Phone validation (basic)
      if (phone.trim() && phone.length < 10)
        throw new Error("Please enter a valid phone number");

      // Business validation for suppliers/vendors
      if (requiresBusinessInfo) {
        if (!companyName.trim())
          throw new Error("Company name is required for your role");
        if (!businessAddress.trim())
          throw new Error("Business address is required");
        if (!businessType.trim())
          throw new Error("Please select business type");
      }

      // Create Hyperledger Fabric wallet
      const newWallet = await createWallet(walletName.trim(), password);

      // Generate 12-word recovery phrase
      const phrase = generateRecoveryPhrase();
      localStorage.setItem(`wallet_${newWallet.id}_recovery`, phrase);

      // Store additional wallet metadata
      const walletMetadata = {
        createdAt: new Date().toISOString(),
        networkType: "hyperledger-fabric",
        organizationMSP:
          selectedRole === "supplier"
            ? "SupplierMSP"
            : selectedRole === "vendor"
              ? "VendorMSP"
              : selectedRole === "customer"
                ? "CustomerMSP"
                : "AdminMSP",
        channelName: "supply-chain-channel",
      };
      localStorage.setItem(
        `wallet_${newWallet.id}_metadata`,
        JSON.stringify(walletMetadata)
      );

      setRecoveryPhrase(phrase);
      setCreatedWalletId(newWallet.id);
      setShowRecoveryDialog(true);

      toast.success("Hyperledger Fabric wallet created successfully!");
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

      // Create complete user data object FIRST
      const userData = {
        id: wallet.id,
        name: name.trim(),
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
        walletName: walletName.trim(),
        walletAddress: wallet.address,
        role: selectedRole as UserRole, // Role is set here
        ...(requiresBusinessInfo && {
          companyName: companyName.trim(),
          businessAddress: businessAddress.trim(),
          businessType: businessType.trim(),
          registrationNumber: registrationNumber.trim() || undefined,
        }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        networkType: "hyperledger-fabric",
        organizationMSP:
          selectedRole === "supplier"
            ? "SupplierMSP"
            : selectedRole === "vendor"
              ? "VendorMSP"
              : selectedRole === "customer"
                ? "CustomerMSP"
                : "AdminMSP",
        isAuthenticated: true,
        loginAt: new Date().toISOString(),
      };

      // Save with FULL role preservation system
      RolePreservation.saveRole(
        wallet.address,
        selectedRole as UserRole,
        userData
      );

      console.log(
        "[REGISTER] User data saved with role preservation:",
        userData.role
      );

      // Set authentication cookie
      document.cookie = `chainvanguard_auth=${createdWalletId}; path=/; max-age=${7 * 24 * 60 * 60}`;

      // Connect wallet
      await connectWallet(createdWalletId, password);

      // Update auth provider with complete data
      updateProfile(userData);
      setUserRole(selectedRole as UserRole);

      // Login with the preserved data
      await login(wallet.address, password);

      toast.success("Account setup completed successfully!");

      console.log("[REGISTER] Navigating directly to dashboard:", selectedRole);

      // Navigate directly to dashboard
      router.push(`/${selectedRole}`);
    } catch (error) {
      console.error("[REGISTER] Setup error:", error);
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
      "ChainVanguard Hyperledger Fabric Wallet Recovery",
      "================================================",
      "",
      `Wallet Name: ${walletName}`,
      `Owner: ${name}`,
      `Email: ${email}`,
      `Role: ${selectedRole}`,
      `Created: ${new Date().toLocaleString()}`,
      "",
      "Network Details:",
      `• Network: Hyperledger Fabric`,
      `• Organization: ${
        selectedRole === "supplier"
          ? "SupplierMSP"
          : selectedRole === "vendor"
            ? "VendorMSP"
            : selectedRole === "customer"
              ? "CustomerMSP"
              : "AdminMSP"
      }`,
      `• Channel: supply-chain-channel`,
      "",
      "Recovery Phrase (12 words):",
      "===========================",
      recoveryPhrase,
      "",
      "⚠️ CRITICAL SECURITY WARNINGS:",
      "• Keep this phrase secure and private",
      "• Never share it with anyone",
      "• This is the ONLY way to recover your wallet",
      "• Store multiple copies in secure locations",
      "• If someone has this phrase, they can access your wallet",
      "",
      ...(requiresBusinessInfo
        ? [
            "Business Information:",
            `• Company: ${companyName}`,
            `• Address: ${businessAddress}`,
            `• Type: ${businessType}`,
            `• Registration: ${registrationNumber || "Not provided"}`,
            "",
          ]
        : []),
      "Support: ChainVanguard Supply Chain Management",
    ].join("\n");

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `chainvanguard-${walletName.replace(/\s+/g, "-")}-recovery-${selectedRole}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast.success("Recovery file downloaded!");
  };

  const roleOptions = [
    {
      value: "supplier",
      title: "Supplier/Ministry",
      description: "Manage inventory, regulatory oversight, vendor relations",
      icon: Package,
      features: [
        "Full Access",
        "Inventory Control",
        "Vendor Management",
        "Compliance",
      ],
      color:
        "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950/20",
    },
    {
      value: "vendor",
      title: "Vendor",
      description: "Product management, customer sales, business operations",
      icon: Users,
      features: [
        "Product Management",
        "Customer Sales",
        "Analytics",
        "Transactions",
      ],
      color:
        "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20",
    },
    {
      value: "customer",
      title: "Customer",
      description: "Browse products, make purchases, track orders",
      icon: ShoppingCart,
      features: [
        "Product Browsing",
        "Order Tracking",
        "Purchase History",
        "Reviews",
      ],
      color:
        "border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950/20",
    },
    {
      value: "blockchain-expert",
      title: "Blockchain Expert",
      description: "System administration, security, network management",
      icon: Shield,
      features: [
        "Admin Access",
        "System Health",
        "Security Management",
        "Network Control",
      ],
      color:
        "border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted/20 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Package className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">ChainVanguard</span>
          </div>
          <CardTitle className="flex items-center justify-center gap-2">
            <Wallet className="h-5 w-5" />
            Create Your Hyperledger Wallet
          </CardTitle>
          <CardDescription>
            Set up your blockchain wallet and profile for supply chain
            management
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Wallet Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Wallet Information</h3>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
              </div>
            </div>

            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Personal Information</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
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

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isLoading}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Optional)</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            {/* Role Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Select Your Role</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {roleOptions.map((role) => {
                  const Icon = role.icon;
                  const isSelected = selectedRole === role.value;

                  return (
                    <Card
                      key={role.value}
                      className={`cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? `${role.color} border-2 ring-2 ring-primary/20`
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => setSelectedRole(role.value as UserRole)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center gap-3">
                          <Icon
                            className={`h-6 w-6 ${isSelected ? "text-primary" : "text-muted-foreground"}`}
                          />
                          <div>
                            <CardTitle className="text-base">
                              {role.title}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {role.description}
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-1">
                          {role.features.map((feature, idx) => (
                            <span
                              key={idx}
                              className={`text-xs px-2 py-1 rounded-full border ${
                                isSelected
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : "bg-muted text-muted-foreground border-muted"
                              }`}
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Business Information (for suppliers/vendors) */}
            {requiresBusinessInfo && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Business Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <div className="relative">
                      <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="company-name"
                        placeholder="Your company name"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="pl-10"
                        required={requiresBusinessInfo}
                        disabled={isLoading}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="business-type">Business Type</Label>
                    <Select
                      value={businessType}
                      onValueChange={setBusinessType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select business type" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedRole === "supplier" && (
                          <>
                            <SelectItem value="manufacturer">
                              Manufacturer
                            </SelectItem>
                            <SelectItem value="distributor">
                              Distributor
                            </SelectItem>
                            <SelectItem value="ministry">
                              Government Ministry
                            </SelectItem>
                            <SelectItem value="regulatory">
                              Regulatory Body
                            </SelectItem>
                            <SelectItem value="raw-materials">
                              Raw Materials
                            </SelectItem>
                          </>
                        )}
                        {selectedRole === "vendor" && (
                          <>
                            <SelectItem value="retailer">Retailer</SelectItem>
                            <SelectItem value="wholesaler">
                              Wholesaler
                            </SelectItem>
                            <SelectItem value="reseller">Reseller</SelectItem>
                            <SelectItem value="marketplace">
                              Marketplace
                            </SelectItem>
                            <SelectItem value="boutique">
                              Boutique/Specialty
                            </SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-address">Business Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <textarea
                      id="business-address"
                      className="w-full pl-10 p-3 border rounded-md resize-none h-20"
                      placeholder="Enter your business address"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      required={requiresBusinessInfo}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="registration-number">
                    Registration Number (Optional)
                  </Label>
                  <Input
                    id="registration-number"
                    placeholder="Business registration or license number"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Terms and Conditions */}
            <div className="space-y-4">
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
                    <Link
                      href="/terms"
                      className="text-primary hover:underline"
                    >
                      Terms of Service
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
                  Your wallet will be secured with Hyperledger Fabric
                  encryption. You will receive a 12-word recovery phrase - this
                  is the ONLY way to recover your wallet if you forget your
                  password.
                </AlertDescription>
              </Alert>
            </div>

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
                !confirmPassword ||
                (requiresBusinessInfo &&
                  (!companyName.trim() ||
                    !businessAddress.trim() ||
                    !businessType))
              }
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Creating Hyperledger Wallet...
                </>
              ) : (
                <>
                  <Wallet className="mr-2 h-4 w-4" />
                  Create Wallet & Account
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

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-blue-700 dark:text-blue-300 text-center">
              <Shield className="h-3 w-3 inline mr-1" />
              Enterprise-grade security with Hyperledger Fabric blockchain
              technology
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recovery Phrase Dialog */}
      <Dialog open={showRecoveryDialog} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-2xl"
          onPointerDownOutside={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-500" />
              Secure Your Wallet Recovery Phrase
            </DialogTitle>
            <DialogDescription>
              Your Hyperledger Fabric wallet is created! Save this 12-word
              recovery phrase immediately.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>CRITICAL SECURITY NOTICE:</strong> Write down these
                words in exact order. Anyone with this phrase can access your
                wallet and all associated assets.
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
                  Copy Phrase
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={downloadRecoveryPhrase}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Backup
                </Button>
              </div>
            </div>

            <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-200 dark:border-red-800">
              <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">
                Security Checklist:
              </h4>
              <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                <li>✅ Write down the 12 words on paper</li>
                <li>✅ Store the paper in a secure location</li>
                <li>✅ Never share these words with anyone</li>
                <li>✅ Never store them digitally (photos, notes, etc.)</li>
                <li>✅ Make multiple secure backups</li>
              </ul>
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
                ✅ I have securely backed up my 12-word recovery phrase and
                understand that this is the ONLY way to recover my wallet
              </label>
            </div>

            <Button
              className="w-full"
              onClick={handleComplete}
              disabled={!backupConfirmed}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Complete Setup & Access Dashboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
