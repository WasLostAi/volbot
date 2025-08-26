"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Wallet, Plus, Copy, Download, Upload, Trash2, Eye, EyeOff, RefreshCw, ExternalLink } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface GeneratedWallet {
  id: string
  publicKey: string
  privateKey: string
  balance: number
  isRevealed: boolean
  label: string
  createdAt: string
}

export default function WalletManager() {
  const [wallets, setWallets] = useState<GeneratedWallet[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [importKey, setImportKey] = useState("")
  const [walletLabel, setWalletLabel] = useState("")
  const { toast } = useToast()

  // Generate new wallet (simulated)
  const generateWallet = async () => {
    setIsGenerating(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const newWallet: GeneratedWallet = {
        id: Date.now().toString(),
        publicKey: generateMockPublicKey(),
        privateKey: generateMockPrivateKey(),
        balance: 0,
        isRevealed: false,
        label: walletLabel || `Wallet ${wallets.length + 1}`,
        createdAt: new Date().toISOString(),
      }

      setWallets((prev) => [...prev, newWallet])
      setWalletLabel("")

      toast({
        title: "Wallet Generated",
        description: `New wallet ${newWallet.label} created successfully`,
      })
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  // Import existing wallet
  const importWallet = async () => {
    if (!importKey.trim()) {
      toast({
        title: "Invalid Key",
        description: "Please enter a valid private key",
        variant: "destructive",
      })
      return
    }

    try {
      const newWallet: GeneratedWallet = {
        id: Date.now().toString(),
        publicKey: generateMockPublicKey(),
        privateKey: importKey,
        balance: Math.random() * 5, // Random existing balance
        isRevealed: false,
        label: walletLabel || `Imported Wallet ${wallets.length + 1}`,
        createdAt: new Date().toISOString(),
      }

      setWallets((prev) => [...prev, newWallet])
      setImportKey("")
      setWalletLabel("")

      toast({
        title: "Wallet Imported",
        description: `Wallet ${newWallet.label} imported successfully`,
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: "Failed to import wallet. Check your private key.",
        variant: "destructive",
      })
    }
  }

  // Generate bulk wallets for makers
  const generateBulkWallets = async (count: number) => {
    setIsGenerating(true)

    try {
      const newWallets: GeneratedWallet[] = []

      for (let i = 0; i < count; i++) {
        await new Promise((resolve) => setTimeout(resolve, 200)) // Simulate generation time

        newWallets.push({
          id: `${Date.now()}-${i}`,
          publicKey: generateMockPublicKey(),
          privateKey: generateMockPrivateKey(),
          balance: 0,
          isRevealed: false,
          label: `Maker ${wallets.length + i + 1}`,
          createdAt: new Date().toISOString(),
        })
      }

      setWallets((prev) => [...prev, ...newWallets])

      toast({
        title: "Bulk Generation Complete",
        description: `Generated ${count} maker wallets successfully`,
      })
    } catch (error) {
      toast({
        title: "Bulk Generation Failed",
        description: "Failed to generate bulk wallets",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePrivateKeyVisibility = (id: string) => {
    setWallets((prev) =>
      prev.map((wallet) => (wallet.id === id ? { ...wallet, isRevealed: !wallet.isRevealed } : wallet)),
    )
  }

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: "Copied",
      description: `${type} copied to clipboard`,
    })
  }

  const deleteWallet = (id: string) => {
    setWallets((prev) => prev.filter((wallet) => wallet.id !== id))
    toast({
      title: "Wallet Deleted",
      description: "Wallet has been removed",
    })
  }

  const refreshBalance = async (id: string) => {
    setWallets((prev) => prev.map((wallet) => (wallet.id === id ? { ...wallet, balance: Math.random() * 10 } : wallet)))
  }

  const exportWallets = () => {
    const exportData = wallets.map((wallet) => ({
      label: wallet.label,
      publicKey: wallet.publicKey,
      privateKey: wallet.privateKey,
      createdAt: wallet.createdAt,
    }))

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "vlbt-wallets.json"
    a.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Wallets Exported",
      description: "Wallet data exported to JSON file",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Wallet Manager</h2>
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-600 text-white">{wallets.length} Wallets</Badge>
          <Button
            onClick={exportWallets}
            disabled={wallets.length === 0}
            className="bg-[#2a2a2a] text-white border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 border-0 bg-[#2a2a2a] shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <TabsTrigger
            value="generate"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Generate
          </TabsTrigger>
          <TabsTrigger
            value="import"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Import
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Manage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="text-white">Generate Single Wallet</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Wallet Label (Optional)</Label>
                  <Input
                    value={walletLabel}
                    onChange={(e) => setWalletLabel(e.target.value)}
                    placeholder="e.g., Main Trading Wallet"
                    className="bg-[#333333] border-[#404040] text-white mt-1"
                  />
                </div>
                <Button
                  onClick={generateWallet}
                  disabled={isGenerating}
                  className="w-full text-white border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]"
                  style={{ backgroundColor: "#84cc16" }}
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Generate Wallet
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="text-white">Generate Maker Wallets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-400 text-sm">Generate multiple wallets for volume generation</p>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => generateBulkWallets(5)}
                    disabled={isGenerating}
                    className="bg-[#333333] text-white border-none"
                  >
                    5 Wallets
                  </Button>
                  <Button
                    onClick={() => generateBulkWallets(10)}
                    disabled={isGenerating}
                    className="bg-[#333333] text-white border-none"
                  >
                    10 Wallets
                  </Button>
                  <Button
                    onClick={() => generateBulkWallets(20)}
                    disabled={isGenerating}
                    className="bg-[#333333] text-white border-none"
                  >
                    20 Wallets
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="import">
          <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <CardHeader>
              <CardTitle className="text-white">Import Existing Wallet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Private Key</Label>
                <Input
                  type="password"
                  value={importKey}
                  onChange={(e) => setImportKey(e.target.value)}
                  placeholder="Enter private key or seed phrase"
                  className="bg-[#333333] border-[#404040] text-white mt-1"
                />
              </div>
              <div>
                <Label className="text-gray-300">Wallet Label (Optional)</Label>
                <Input
                  value={walletLabel}
                  onChange={(e) => setWalletLabel(e.target.value)}
                  placeholder="e.g., Imported Main Wallet"
                  className="bg-[#333333] border-[#404040] text-white mt-1"
                />
              </div>
              <Button
                onClick={importWallet}
                className="w-full text-white border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]"
                style={{ backgroundColor: "#84cc16" }}
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Wallet
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <CardHeader>
              <CardTitle className="text-white">Wallet List</CardTitle>
            </CardHeader>
            <CardContent>
              {wallets.length === 0 ? (
                <div className="text-center py-8">
                  <Wallet className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">No wallets generated yet</p>
                  <p className="text-gray-500 text-sm">Generate or import wallets to get started</p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {wallets.map((wallet) => (
                      <div
                        key={wallet.id}
                        className="p-4 rounded-lg bg-[#333333] shadow-[4px_4px_8px_#0a0a0a,-4px_-4px_8px_#141414]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <Wallet className="w-4 h-4 text-lime-400" />
                            <span className="text-white font-medium">{wallet.label}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => refreshBalance(wallet.id)}
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => deleteWallet(wallet.id)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center justify-between">
                              <label className="text-gray-400 text-xs">Public Key</label>
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => copyToClipboard(wallet.publicKey, "Public key")}
                                  className="text-gray-400 hover:text-white p-1"
                                >
                                  <Copy className="w-3 h-3" />
                                </Button>
                                <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                            <code className="text-white font-mono text-xs bg-[#2a2a2a] px-2 py-1 rounded block">
                              {wallet.publicKey}
                            </code>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <label className="text-gray-400 text-xs">Private Key</label>
                              <div className="flex space-x-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => togglePrivateKeyVisibility(wallet.id)}
                                  className="text-gray-400 hover:text-white p-1"
                                >
                                  {wallet.isRevealed ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                </Button>
                                {wallet.isRevealed && (
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => copyToClipboard(wallet.privateKey, "Private key")}
                                    className="text-gray-400 hover:text-white p-1"
                                  >
                                    <Copy className="w-3 h-3" />
                                  </Button>
                                )}
                              </div>
                            </div>
                            <code className="text-white font-mono text-xs bg-[#2a2a2a] px-2 py-1 rounded block">
                              {wallet.isRevealed ? wallet.privateKey : "••••••••••••••••••••••••••••••••"}
                            </code>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div>
                              <span className="text-gray-400 text-xs">Balance: </span>
                              <span className="text-white font-medium">{wallet.balance.toFixed(4)} SOL</span>
                            </div>
                            <div className="text-gray-500 text-xs">
                              {new Date(wallet.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper functions for mock data
function generateMockPublicKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789"
  let result = ""
  for (let i = 0; i < 44; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function generateMockPrivateKey(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789"
  let result = ""
  for (let i = 0; i < 88; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}
