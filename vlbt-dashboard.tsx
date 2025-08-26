"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bot, Zap, Target, TrendingUp, Crown, Activity, DollarSign } from "lucide-react"
import BotConfiguration from "./bot-configuration"
import LiveDashboard from "./live-dashboard"

interface ComponentProps {
  connectedWallet?: string | null
}

export default function Component({ connectedWallet }: ComponentProps) {
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [showConfig, setShowConfig] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)

  const modes = [
    {
      id: "advanced",
      title: "Advanced Bot",
      icon: <Bot className="w-6 h-6" />,
      description: "Full control over trading parameters",
      recommended: true,
      features: [
        "Custom token targeting",
        "Maker wallet management",
        "Order amount ranges",
        "Transaction delays",
        "Sell strategies",
      ],
    },
    {
      id: "target-price",
      title: "Target Price / Bumps",
      icon: <Target className="w-6 h-6" />,
      description: "Price-focused volume generation",
      features: ["% Pump targeting", "SOL spend limits", "Time-based execution", "Automated bumps", "Price monitoring"],
    },
    {
      id: "boost-token",
      title: "Boost Token",
      icon: <TrendingUp className="w-6 h-6" />,
      description: "Volume-focused token boosting",
      features: [
        "Volume generation",
        "Performance optimization",
        "Maker distribution",
        "Time constraints",
        "Fee optimization",
      ],
    },
    {
      id: "hybrid-strategy",
      title: "Hybrid Strategy",
      icon: <Zap className="w-6 h-6" />,
      description: "Combined price and volume approach",
      features: [
        "Multi-strategy execution",
        "Dynamic adjustments",
        "Risk management",
        "Portfolio balancing",
        "Smart routing",
      ],
    },
    {
      id: "premium-agent",
      title: "Premium Agent",
      icon: <Crown className="w-6 h-6" />,
      description: "AI-powered trading decisions",
      features: [
        "AI market analysis",
        "Automated strategies",
        "Risk assessment",
        "Performance tracking",
        "Custom algorithms",
      ],
    },
    {
      id: "real-time",
      title: "Real-time Monitor",
      icon: <Activity className="w-6 h-6" />,
      description: "Live trading dashboard",
      features: ["Real-time updates", "Performance metrics", "Transaction history", "Profit tracking", "Alert system"],
    },
  ]

  if (showDashboard) {
    return <LiveDashboard onBack={() => setShowDashboard(false)} />
  }

  if (showConfig && selectedMode) {
    return (
      <BotConfiguration
        mode={selectedMode}
        onBack={() => setShowConfig(false)}
        onStart={(config) => {
          console.log("Starting bot with config:", config)
          setShowConfig(false)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-[#1b1b1b] text-white p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4" style={{ color: "#84cc16" }}>
            Volume Bot Trading Platform
          </h1>
          <p className="text-gray-400 text-lg mb-8">Select your trading mode and configure your bot</p>
        </div>

        {/* Mode Selection */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-4" style={{ color: "#84cc16" }}>
            Choose Your Trading Mode
          </h2>
          <p className="text-gray-400 text-lg">Select the mode that best fits your trading strategy</p>
        </div>

        {/* Mode Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {modes.map((mode) => (
            <Card
              key={mode.id}
              className={`bg-[#2a2a2a] border-none transition-all duration-300 cursor-pointer ${
                selectedMode === mode.id
                  ? "shadow-[inset_8px_8px_16px_#0a0a0a,inset_-8px_-8px_16px_#141414]"
                  : "shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414] hover:shadow-[4px_4px_8px_#0a0a0a,-4px_-4px_8px_#141414]"
              }`}
              onClick={() => setSelectedMode(mode.id)}
            >
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div style={{ color: "#84cc16" }}>{mode.icon}</div>
                    <h3 className="text-xl font-bold text-white">{mode.title}</h3>
                  </div>
                  {mode.recommended && (
                    <Badge className="text-white text-xs px-2 py-1 border-none" style={{ backgroundColor: "#84cc16" }}>
                      Recommended
                    </Badge>
                  )}
                </div>
                <p className="text-gray-400 text-sm">{mode.description}</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <h4 className="font-medium text-sm mb-3" style={{ color: "#84cc16" }}>
                    Features:
                  </h4>
                  <ul className="space-y-1">
                    {mode.features.map((feature, index) => (
                      <li key={index} className="text-gray-300 text-sm flex items-center">
                        <div className="w-1 h-1 rounded-full mr-2" style={{ backgroundColor: "#84cc16" }}></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mb-8">
          {selectedMode && connectedWallet && (
            <Button
              className="text-white px-8 py-3 text-lg font-medium border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414] hover:shadow-[4px_4px_8px_#0a0a0a,-4px_-4px_8px_#141414] transition-all duration-300"
              style={{ backgroundColor: "#84cc16" }}
              onClick={() => setShowConfig(true)}
            >
              Configure {modes.find((m) => m.id === selectedMode)?.title}
            </Button>
          )}

          {!connectedWallet && selectedMode && (
            <div className="text-center">
              <p className="text-gray-400 mb-2">Connect your wallet to continue</p>
            </div>
          )}

          <Button
            className="text-white px-8 py-3 text-lg font-medium border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414] hover:shadow-[4px_4px_8px_#0a0a0a,-4px_-4px_8px_#141414] transition-all duration-300"
            style={{ backgroundColor: "#2563eb" }}
            onClick={() => setShowDashboard(true)}
          >
            <Activity className="w-5 h-5 mr-2" />
            Live Dashboard
          </Button>
        </div>

        {/* Footer Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-[#2a2a2a] rounded-lg p-4 text-center shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <DollarSign className="w-8 h-8 mx-auto mb-2" style={{ color: "#84cc16" }} />
            <div className="text-2xl font-bold text-white">$12.5K</div>
            <div className="text-gray-400 text-sm">Total Volume</div>
          </div>
          <div className="bg-[#2a2a2a] rounded-lg p-4 text-center shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <Activity className="w-8 h-8 mx-auto mb-2" style={{ color: "#84cc16" }} />
            <div className="text-2xl font-bold text-white">1,247</div>
            <div className="text-gray-400 text-sm">Transactions</div>
          </div>
          <div className="bg-[#2a2a2a] rounded-lg p-4 text-center shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <Bot className="w-8 h-8 mx-auto mb-2" style={{ color: "#84cc16" }} />
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-gray-400 text-sm">Active Bots</div>
          </div>
          <div className="bg-[#2a2a2a] rounded-lg p-4 text-center shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <TrendingUp className="w-8 h-8 mx-auto mb-2" style={{ color: "#84cc16" }} />
            <div className="text-2xl font-bold text-white">+24.7%</div>
            <div className="text-gray-400 text-sm">Success Rate</div>
          </div>
        </div>
      </div>
    </div>
  )
}
