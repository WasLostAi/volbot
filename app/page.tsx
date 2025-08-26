"use client"

import { useState, useEffect } from "react"
import Navigation from "../components/navigation"
import Component from "../vlbt-dashboard"
import WalletManager from "../components/wallet-manager"
import TokenManager from "../components/token-manager"
import LiveDashboard from "../live-dashboard"
import AnalyticsDashboard from "../components/analytics-dashboard"
import SettingsPanel from "../components/settings-panel"

export default function Page() {
  const [currentView, setCurrentView] = useState("dashboard")
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null)
  const [walletBalance, setWalletBalance] = useState(12.456)
  const [activeBotsCount, setActiveBotsCount] = useState(3)

  // Load saved settings on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem("vlbt-settings")
    if (savedSettings) {
      try {
        const settings = JSON.parse(savedSettings)
        console.log("Loaded settings:", settings)
      } catch (error) {
        console.error("Failed to load settings:", error)
      }
    }

    // Simulate wallet balance updates
    const interval = setInterval(() => {
      if (connectedWallet) {
        setWalletBalance((prev) => prev + (Math.random() - 0.5) * 0.1)
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [connectedWallet])

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <Component connectedWallet={connectedWallet} />
      case "wallets":
        return <WalletManager />
      case "tokens":
        return <TokenManager />
      case "live":
        return <LiveDashboard onBack={() => setCurrentView("dashboard")} />
      case "analytics":
        return <AnalyticsDashboard />
      case "settings":
        return <SettingsPanel />
      default:
        return <Component connectedWallet={connectedWallet} />
    }
  }

  return (
    <div className="min-h-screen bg-[#1b1b1b] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        <Navigation
          currentView={currentView}
          onViewChange={setCurrentView}
          walletConnected={!!connectedWallet}
          activeBotsCount={activeBotsCount}
          connectedWallet={connectedWallet}
          walletBalance={walletBalance}
          onWalletConnect={setConnectedWallet}
        />
        {renderCurrentView()}
      </div>
    </div>
  )
}
