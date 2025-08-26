"use client"

import { useState } from "react"
import { VLBTDashboard } from "../vlbt-dashboard"
import { BotConfiguration } from "../bot-configuration"
import { LiveDashboard } from "../live-dashboard"
import { WalletConnection } from "../components/wallet-connection"
import { Navigation } from "../components/navigation"

export default function HomePage() {
  const [activeSection, setActiveSection] = useState("dashboard")

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <VLBTDashboard />
      case "configuration":
        return <BotConfiguration />
      case "live":
        return <LiveDashboard />
      default:
        return <VLBTDashboard />
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#1b1b1b" }}>
      <div className="flex flex-col h-screen">
        {/* Top Navigation */}
        <div className="flex justify-between items-center p-4 border-b border-gray-800">
          <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
          <WalletConnection />
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-auto">{renderActiveSection()}</div>
      </div>
    </div>
  )
}
