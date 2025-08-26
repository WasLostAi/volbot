"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bot, Wallet, Coins, Activity, Settings, BarChart3, Menu, X } from "lucide-react"
import WalletDropdown from "./wallet-dropdown"

interface NavigationProps {
  currentView: string
  onViewChange: (view: string) => void
  walletConnected?: boolean
  activeBotsCount?: number
  connectedWallet?: string | null
  walletBalance?: number
  onWalletConnect?: (wallet: string | null) => void
}

export default function Navigation({
  currentView,
  onViewChange,
  walletConnected = false,
  activeBotsCount = 0,
  connectedWallet = null,
  walletBalance = 0,
  onWalletConnect,
}: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)

  const navItems = [
    {
      id: "dashboard",
      label: "Bot Manager",
      icon: <Bot className="w-5 h-5" />,
      badge: activeBotsCount > 0 ? activeBotsCount.toString() : null,
    },
    {
      id: "wallets",
      label: "Wallet Manager",
      icon: <Wallet className="w-5 h-5" />,
      badge: null,
    },
    {
      id: "tokens",
      label: "Token Manager",
      icon: <Coins className="w-5 h-5" />,
      badge: null,
    },
    {
      id: "live",
      label: "Live Trading",
      icon: <Activity className="w-5 h-5" />,
      badge: null,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      badge: null,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
      badge: null,
    },
  ]

  const handleNavClick = (viewId: string) => {
    onViewChange(viewId)
    setIsMobileMenuOpen(false)
  }

  const handleWalletConnect = async () => {
    setIsConnecting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const mockWallet = "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv"
      onWalletConnect?.(mockWallet)
    } catch (error) {
      console.error("Wallet connection failed:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleWalletDisconnect = () => {
    onWalletConnect?.(null)
  }

  const handleRefreshBalance = () => {
    // Simulate balance refresh
    console.log("Refreshing wallet balance...")
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-between mb-8 p-4 bg-[#2a2a2a] rounded-lg shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
        <div className="flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                currentView === item.id
                  ? "bg-lime-400 text-black shadow-[inset_4px_4px_8px_#0a0a0a,inset_-4px_-4px_8px_#141414]"
                  : "bg-transparent text-gray-400 hover:text-white hover:bg-[#333333]"
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
              {item.badge && <Badge className="ml-2 bg-red-500 text-white text-xs px-1.5 py-0.5">{item.badge}</Badge>}
            </Button>
          ))}
        </div>

        <WalletDropdown
          connectedWallet={connectedWallet}
          balance={walletBalance}
          onConnect={handleWalletConnect}
          onDisconnect={handleWalletDisconnect}
          onRefreshBalance={handleRefreshBalance}
          isConnecting={isConnecting}
        />
      </nav>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        {/* Mobile Header */}
        <div className="flex items-center justify-between mb-4 p-4 bg-[#2a2a2a] rounded-lg shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <h1 className="text-xl font-bold text-white">VLBT</h1>
          <div className="flex items-center space-x-3">
            <WalletDropdown
              connectedWallet={connectedWallet}
              balance={walletBalance}
              onConnect={handleWalletConnect}
              onDisconnect={handleWalletDisconnect}
              onRefreshBalance={handleRefreshBalance}
              isConnecting={isConnecting}
            />
            <Button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="bg-transparent text-white p-2">
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="mb-4 p-4 bg-[#2a2a2a] rounded-lg shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 ${
                    currentView === item.id
                      ? "bg-lime-400 text-black"
                      : "bg-transparent text-gray-400 hover:text-white hover:bg-[#333333]"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && <Badge className="bg-red-500 text-white text-xs px-1.5 py-0.5">{item.badge}</Badge>}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
