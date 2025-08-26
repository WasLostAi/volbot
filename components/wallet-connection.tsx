"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, ExternalLink, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletConnectionProps {
  onWalletConnect?: (publicKey: string) => void
}

export default function WalletConnection({ onWalletConnect }: WalletConnectionProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [publicKey, setPublicKey] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const { toast } = useToast()

  // Simulate wallet connection (in real app, use @solana/wallet-adapter-react)
  const connectWallet = async () => {
    setIsConnecting(true)

    try {
      // Simulate connection delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate wallet connection
      const mockPublicKey = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv"
      setPublicKey(mockPublicKey)
      setIsConnected(true)
      setBalance(12.45) // Mock SOL balance

      onWalletConnect?.(mockPublicKey)

      toast({
        title: "Wallet Connected",
        description: "Successfully connected to Phantom wallet",
      })
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setIsConnected(false)
    setPublicKey(null)
    setBalance(null)
    toast({
      title: "Wallet Disconnected",
      description: "Wallet has been disconnected",
    })
  }

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const refreshBalance = async () => {
    if (!isConnected) return

    // Simulate balance refresh
    setBalance(null)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setBalance(Math.random() * 20 + 5) // Random balance between 5-25 SOL
  }

  if (!isConnected) {
    return (
      <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Wallet className="w-5 h-5" style={{ color: "#84cc16" }} />
            <span>Connect Wallet</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 mb-4">Connect your Solana wallet to start trading</p>
          <Button
            onClick={connectWallet}
            disabled={isConnecting}
            className="w-full text-white border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]"
            style={{ backgroundColor: "#84cc16" }}
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="w-4 h-4 mr-2" />
                Connect Phantom
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" style={{ color: "#84cc16" }} />
            <span>Connected Wallet</span>
          </div>
          <Badge className="bg-green-600 text-white">Connected</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-gray-400 text-sm">Address</label>
          <div className="flex items-center space-x-2 mt-1">
            <code className="text-white font-mono text-sm bg-[#333333] px-2 py-1 rounded flex-1">
              {publicKey?.slice(0, 8)}...{publicKey?.slice(-8)}
            </code>
            <Button size="sm" variant="ghost" onClick={copyAddress} className="text-gray-400 hover:text-white">
              <Copy className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="text-gray-400 text-sm">Balance</label>
            <Button size="sm" variant="ghost" onClick={refreshBalance} className="text-gray-400 hover:text-white p-1">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
          <div className="text-2xl font-bold text-white mt-1">
            {balance === null ? (
              <div className="animate-pulse bg-[#333333] h-8 w-24 rounded"></div>
            ) : (
              `${balance.toFixed(3)} SOL`
            )}
          </div>
        </div>

        <div className="flex space-x-2">
          <Button
            onClick={disconnectWallet}
            variant="outline"
            className="flex-1 bg-[#333333] border-[#404040] text-white hover:bg-[#404040]"
          >
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
