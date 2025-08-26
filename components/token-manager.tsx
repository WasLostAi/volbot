"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Plus, ExternalLink, Copy, Trash2, RefreshCw, AlertCircle, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TokenInfo {
  address: string
  name: string
  symbol: string
  decimals: number
  supply: string
  price: number
  marketCap: string
  liquidity: string
  holders: number
  isVerified: boolean
  addedAt: string
}

export default function TokenManager() {
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [tokenAddress, setTokenAddress] = useState("")
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState<boolean | null>(null)
  const { toast } = useToast()

  // Validate Solana token address
  const validateTokenAddress = async (address: string) => {
    if (!address || address.length !== 44) {
      setIsValid(false)
      return false
    }

    setIsValidating(true)

    try {
      // Simulate API call to validate token
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Basic validation (in real app, use @solana/web3.js)
      const isValidFormat = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
      setIsValid(isValidFormat)
      return isValidFormat
    } catch (error) {
      setIsValid(false)
      return false
    } finally {
      setIsValidating(false)
    }
  }

  // Add token to list
  const addToken = async () => {
    if (!tokenAddress.trim()) {
      toast({
        title: "Invalid Address",
        description: "Please enter a valid token contract address",
        variant: "destructive",
      })
      return
    }

    const isValidAddress = await validateTokenAddress(tokenAddress)
    if (!isValidAddress) {
      toast({
        title: "Invalid Token",
        description: "Token address is not valid or token doesn't exist",
        variant: "destructive",
      })
      return
    }

    try {
      // Simulate fetching token info
      const mockTokenInfo: TokenInfo = {
        address: tokenAddress,
        name: generateMockTokenName(),
        symbol: generateMockSymbol(),
        decimals: 9,
        supply: (Math.random() * 1000000000).toFixed(0),
        price: Math.random() * 10,
        marketCap: `$${(Math.random() * 10000000).toFixed(0)}`,
        liquidity: `$${(Math.random() * 1000000).toFixed(0)}`,
        holders: Math.floor(Math.random() * 10000),
        isVerified: Math.random() > 0.7,
        addedAt: new Date().toISOString(),
      }

      setTokens((prev) => [...prev, mockTokenInfo])
      setTokenAddress("")
      setIsValid(null)

      toast({
        title: "Token Added",
        description: `${mockTokenInfo.name} (${mockTokenInfo.symbol}) added successfully`,
      })
    } catch (error) {
      toast({
        title: "Failed to Add Token",
        description: "Could not fetch token information",
        variant: "destructive",
      })
    }
  }

  // Remove token from list
  const removeToken = (address: string) => {
    setTokens((prev) => prev.filter((token) => token.address !== address))
    toast({
      title: "Token Removed",
      description: "Token has been removed from your list",
    })
  }

  // Copy address to clipboard
  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    toast({
      title: "Address Copied",
      description: "Token address copied to clipboard",
    })
  }

  // Refresh token data
  const refreshTokenData = async (address: string) => {
    setTokens((prev) =>
      prev.map((token) =>
        token.address === address
          ? {
              ...token,
              price: Math.random() * 10,
              marketCap: `$${(Math.random() * 10000000).toFixed(0)}`,
              liquidity: `$${(Math.random() * 1000000).toFixed(0)}`,
              holders: Math.floor(Math.random() * 10000),
            }
          : token,
      ),
    )
  }

  // Popular tokens for quick add
  const popularTokens = [
    { symbol: "BONK", address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263" },
    { symbol: "WIF", address: "EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm" },
    { symbol: "POPCAT", address: "7GCihgDB8fe6KNjn2MYtkzZcRjQy3t9GHdC8uHYmW2hr" },
    { symbol: "MEW", address: "MEW1gQWJ3nEXg2qgERiKu7FAFj79PHvQVREQUzScPP5" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Token Manager</h2>
        <Badge className="bg-blue-600 text-white">{tokens.length} Tokens</Badge>
      </div>

      <Tabs defaultValue="add" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 border-0 bg-[#2a2a2a] shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <TabsTrigger
            value="add"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Add Token
          </TabsTrigger>
          <TabsTrigger
            value="popular"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Popular
          </TabsTrigger>
          <TabsTrigger
            value="manage"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Manage
          </TabsTrigger>
        </TabsList>

        <TabsContent value="add">
          <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <CardHeader>
              <CardTitle className="text-white">Add Token by Contract Address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-gray-300">Token Contract Address</Label>
                <div className="relative mt-1">
                  <Input
                    value={tokenAddress}
                    onChange={(e) => {
                      setTokenAddress(e.target.value)
                      if (e.target.value.length === 44) {
                        validateTokenAddress(e.target.value)
                      } else {
                        setIsValid(null)
                      }
                    }}
                    placeholder="Enter Solana token contract address (44 characters)"
                    className="bg-[#333333] border-[#404040] text-white pr-10"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {isValidating ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-lime-400"></div>
                    ) : isValid === true ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : isValid === false ? (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    ) : null}
                  </div>
                </div>
                {isValid === false && <p className="text-red-400 text-sm mt-1">Invalid token address format</p>}
                {isValid === true && <p className="text-green-400 text-sm mt-1">Valid token address</p>}
              </div>

              <Button
                onClick={addToken}
                disabled={!isValid || isValidating}
                className="w-full text-white border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]"
                style={{ backgroundColor: "#84cc16" }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Token
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="popular">
          <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <CardHeader>
              <CardTitle className="text-white">Popular Solana Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {popularTokens.map((token) => (
                  <div
                    key={token.address}
                    className="flex items-center justify-between p-3 rounded-lg bg-[#333333] shadow-[4px_4px_8px_#0a0a0a,-4px_-4px_8px_#141414]"
                  >
                    <div className="flex items-center space-x-3">
                      <Coins className="w-5 h-5 text-lime-400" />
                      <div>
                        <div className="text-white font-medium">{token.symbol}</div>
                        <div className="text-gray-400 text-xs font-mono">
                          {token.address.slice(0, 8)}...{token.address.slice(-8)}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        setTokenAddress(token.address)
                        validateTokenAddress(token.address).then(() => {
                          if (isValid) addToken()
                        })
                      }}
                      className="bg-lime-400 text-black hover:bg-lime-500"
                    >
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage">
          <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <CardHeader>
              <CardTitle className="text-white">Your Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              {tokens.length === 0 ? (
                <div className="text-center py-8">
                  <Coins className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">No tokens added yet</p>
                  <p className="text-gray-500 text-sm">Add tokens to start volume generation</p>
                </div>
              ) : (
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {tokens.map((token) => (
                      <div
                        key={token.address}
                        className="p-4 rounded-lg bg-[#333333] shadow-[4px_4px_8px_#0a0a0a,-4px_-4px_8px_#141414]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <Coins className="w-5 h-5 text-lime-400" />
                            <div>
                              <div className="flex items-center space-x-2">
                                <span className="text-white font-medium">{token.name}</span>
                                <Badge className="bg-gray-600 text-white text-xs">{token.symbol}</Badge>
                                {token.isVerified && <Badge className="bg-blue-600 text-white text-xs">Verified</Badge>}
                              </div>
                              <div className="text-gray-400 text-sm font-mono">
                                {token.address.slice(0, 12)}...{token.address.slice(-12)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => refreshTokenData(token.address)}
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <RefreshCw className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyAddress(token.address)}
                              className="text-gray-400 hover:text-white p-1"
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-1">
                              <ExternalLink className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeToken(token.address)}
                              className="text-red-400 hover:text-red-300 p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Price</span>
                            <div className="text-white font-medium">${token.price.toFixed(6)}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Market Cap</span>
                            <div className="text-white font-medium">{token.marketCap}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Liquidity</span>
                            <div className="text-white font-medium">{token.liquidity}</div>
                          </div>
                          <div>
                            <span className="text-gray-400">Holders</span>
                            <div className="text-white font-medium">{token.holders.toLocaleString()}</div>
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
function generateMockTokenName(): string {
  const names = [
    "Doge Killer",
    "Moon Token",
    "Rocket Fuel",
    "Diamond Hands",
    "To The Moon",
    "Ape Strong",
    "Lambo Dreams",
    "Hodl Forever",
    "Pump It",
    "Degen Coin",
  ]
  return names[Math.floor(Math.random() * names.length)]
}

function generateMockSymbol(): string {
  const symbols = ["DOGE", "MOON", "ROCK", "DIAM", "LAMBO", "HODL", "PUMP", "DEGEN", "APE", "GEM"]
  return symbols[Math.floor(Math.random() * symbols.length)]
}
