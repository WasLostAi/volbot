"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Settings, Wallet, DollarSign, Clock, Users, Target, Zap, AlertTriangle } from "lucide-react"

interface BotConfigurationProps {
  mode: string
  onBack: () => void
  onStart: (config: any) => void
}

export default function BotConfiguration({ mode, onBack, onStart }: BotConfigurationProps) {
  const [config, setConfig] = useState({
    tokenAddress: "",
    makers: 5,
    orderAmount: [0.1, 1.0],
    delay: [30, 120],
    sellStrategy: "gradual",
    pumpPercentage: 25,
    solToSpend: 10,
    minutesToRun: 60,
    volumeToGenerate: 50000,
    enableAutoSell: true,
    slippage: 1.0,
    disruptionEnabled: false,
    frontRunning: true,
    transactionSpam: false,
    liquidityDrain: false,
    riskThreshold: 70,
    maxConcurrentDisruptions: 3,
    priorityFeeMultiplier: 1.5,
    autoGenerateWallets: true,
  })

  const [estimatedFees, setEstimatedFees] = useState(0.45)
  const [isStarting, setIsStarting] = useState(false)
  const [isGeneratingWallets, setIsGeneratingWallets] = useState(false)

  const handleConfigChange = (key: string, value: any) => {
    setConfig((prev) => ({ ...prev, [key]: value }))
  }

  const getModeTitle = () => {
    const titles = {
      advanced: "Advanced Bot Configuration",
      "target-price": "Target Price / Bumps Configuration",
      "boost-token": "Boost Token Configuration",
      "hybrid-strategy": "Hybrid Strategy Configuration",
      "premium-agent": "Premium Agent Configuration",
      "real-time": "Real-time Monitor Configuration",
    }
    return titles[mode as keyof typeof titles] || "Bot Configuration"
  }

  const generateMakerWallets = async () => {
    setIsGeneratingWallets(true)

    try {
      // Simulate wallet generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log(`Generated ${config.makers} maker wallets`)
    } catch (error) {
      console.error("Failed to generate wallets:", error)
    } finally {
      setIsGeneratingWallets(false)
    }
  }

  const validateTokenAddress = (address: string) => {
    // Basic Solana address validation
    return address.length === 44 && /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)
  }

  const handleStart = async () => {
    if (!config.tokenAddress) {
      alert("Please enter a token contract address")
      return
    }

    if (!validateTokenAddress(config.tokenAddress)) {
      alert("Invalid token contract address")
      return
    }

    setIsStarting(true)

    try {
      // Generate wallets if needed
      if (config.autoGenerateWallets) {
        await generateMakerWallets()
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      console.log("Starting bot with configuration:", config)

      // Call the onStart callback
      onStart(config)
    } catch (error) {
      console.error("Failed to start bot:", error)
    } finally {
      setIsStarting(false)
    }
  }

  const renderAdvancedConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Target className="w-5 h-5" style={{ color: "#84cc16" }} />
              <span>Token Settings</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Token Contract Address *</Label>
              <Input
                value={config.tokenAddress}
                onChange={(e) => handleConfigChange("tokenAddress", e.target.value)}
                placeholder="Enter Solana token contract address"
                className="bg-[#333333] border-[#404040] text-white mt-1"
              />
              {config.tokenAddress && !validateTokenAddress(config.tokenAddress) && (
                <p className="text-red-400 text-sm mt-1">Invalid token address format</p>
              )}
            </div>
            <div>
              <Label className="text-gray-300">Slippage Tolerance (%)</Label>
              <Input
                type="number"
                value={config.slippage}
                onChange={(e) => handleConfigChange("slippage", Number.parseFloat(e.target.value))}
                className="bg-[#333333] border-[#404040] text-white mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Users className="w-5 h-5" style={{ color: "#84cc16" }} />
              <span>Maker Wallets</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Number of Makers: {config.makers}</Label>
              <Slider
                value={[config.makers]}
                onValueChange={(value) => handleConfigChange("makers", value[0])}
                max={20}
                min={1}
                step={1}
                className="mt-2"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.autoGenerateWallets}
                onCheckedChange={(checked) => handleConfigChange("autoGenerateWallets", checked)}
              />
              <Label className="text-gray-300">Auto-generate wallets</Label>
            </div>
            <div className="text-sm text-gray-400">More makers = better distribution but higher fees</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <DollarSign className="w-5 h-5" style={{ color: "#84cc16" }} />
              <span>Order Amount Range (SOL)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">
                Range: {config.orderAmount[0]} - {config.orderAmount[1]} SOL
              </Label>
              <Slider
                value={config.orderAmount}
                onValueChange={(value) => handleConfigChange("orderAmount", value)}
                max={10}
                min={0.01}
                step={0.01}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-white">
              <Clock className="w-5 h-5" style={{ color: "#84cc16" }} />
              <span>Transaction Delays (seconds)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">
                Delay: {config.delay[0]} - {config.delay[1]} seconds
              </Label>
              <Slider
                value={config.delay}
                onValueChange={(value) => handleConfigChange("delay", value)}
                max={300}
                min={5}
                step={5}
                className="mt-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Disruption Settings */}
      <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Zap className="w-5 h-5" style={{ color: "#84cc16" }} />
            <span>Disruption Settings</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={config.disruptionEnabled}
              onCheckedChange={(checked) => handleConfigChange("disruptionEnabled", checked)}
            />
            <Label className="text-gray-300">Enable Disruption Mode</Label>
          </div>

          {config.disruptionEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.frontRunning}
                  onCheckedChange={(checked) => handleConfigChange("frontRunning", checked)}
                />
                <Label className="text-gray-300">Front Running</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.transactionSpam}
                  onCheckedChange={(checked) => handleConfigChange("transactionSpam", checked)}
                />
                <Label className="text-gray-300">Transaction Spam</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.liquidityDrain}
                  onCheckedChange={(checked) => handleConfigChange("liquidityDrain", checked)}
                />
                <Label className="text-gray-300">Liquidity Drain</Label>
              </div>
            </div>
          )}

          {config.disruptionEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-gray-300">Risk Threshold: {config.riskThreshold}%</Label>
                <Slider
                  value={[config.riskThreshold]}
                  onValueChange={(value) => handleConfigChange("riskThreshold", value[0])}
                  max={100}
                  min={50}
                  step={5}
                  className="mt-2"
                />
              </div>
              <div>
                <Label className="text-gray-300">Max Concurrent Disruptions: {config.maxConcurrentDisruptions}</Label>
                <Slider
                  value={[config.maxConcurrentDisruptions]}
                  onValueChange={(value) => handleConfigChange("maxConcurrentDisruptions", value[0])}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-white">
            <Settings className="w-5 h-5" style={{ color: "#84cc16" }} />
            <span>Sell Strategy</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-300">Strategy Type</Label>
              <Select value={config.sellStrategy} onValueChange={(value) => handleConfigChange("sellStrategy", value)}>
                <SelectTrigger className="bg-[#333333] border-[#404040] text-white mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[#333333] border-[#404040]">
                  <SelectItem value="immediate">Immediate Sell</SelectItem>
                  <SelectItem value="gradual">Gradual Sell</SelectItem>
                  <SelectItem value="hold">Hold Tokens</SelectItem>
                  <SelectItem value="smart">Smart Exit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.enableAutoSell}
                onCheckedChange={(checked) => handleConfigChange("enableAutoSell", checked)}
              />
              <Label className="text-gray-300">Enable Auto-Sell</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTargetPriceConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardHeader>
            <CardTitle className="text-white">Token & Price Target</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Token Contract Address *</Label>
              <Input
                value={config.tokenAddress}
                onChange={(e) => handleConfigChange("tokenAddress", e.target.value)}
                placeholder="Enter Solana token contract address"
                className="bg-[#333333] border-[#404040] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">% Pump Target</Label>
              <Input
                type="number"
                value={config.pumpPercentage}
                onChange={(e) => handleConfigChange("pumpPercentage", Number.parseInt(e.target.value))}
                className="bg-[#333333] border-[#404040] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">SOL to Spend</Label>
              <Input
                type="number"
                value={config.solToSpend}
                onChange={(e) => handleConfigChange("solToSpend", Number.parseFloat(e.target.value))}
                className="bg-[#333333] border-[#404040] text-white mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardHeader>
            <CardTitle className="text-white">Execution Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Makers to Generate</Label>
              <Input
                type="number"
                value={config.makers}
                onChange={(e) => handleConfigChange("makers", Number.parseInt(e.target.value))}
                className="bg-[#333333] border-[#404040] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Minutes to Run</Label>
              <Input
                type="number"
                value={config.minutesToRun}
                onChange={(e) => handleConfigChange("minutesToRun", Number.parseInt(e.target.value))}
                className="bg-[#333333] border-[#404040] text-white mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.autoGenerateWallets}
                onCheckedChange={(checked) => handleConfigChange("autoGenerateWallets", checked)}
              />
              <Label className="text-gray-300">Auto-generate wallets</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderBoostTokenConfig = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardHeader>
            <CardTitle className="text-white">Token & Volume Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Token Contract Address *</Label>
              <Input
                value={config.tokenAddress}
                onChange={(e) => handleConfigChange("tokenAddress", e.target.value)}
                placeholder="Enter Solana token contract address"
                className="bg-[#333333] border-[#404040] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Volume to Generate ($)</Label>
              <Input
                type="number"
                value={config.volumeToGenerate}
                onChange={(e) => handleConfigChange("volumeToGenerate", Number.parseInt(e.target.value))}
                className="bg-[#333333] border-[#404040] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">SOL to Spend</Label>
              <Input
                type="number"
                value={config.solToSpend}
                onChange={(e) => handleConfigChange("solToSpend", Number.parseFloat(e.target.value))}
                className="bg-[#333333] border-[#404040] text-white mt-1"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardHeader>
            <CardTitle className="text-white">Performance Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-gray-300">Makers to Generate</Label>
              <Input
                type="number"
                value={config.makers}
                onChange={(e) => handleConfigChange("makers", Number.parseInt(e.target.value))}
                className="bg-[#333333] border-[#404040] text-white mt-1"
              />
            </div>
            <div>
              <Label className="text-gray-300">Minutes to Run</Label>
              <Input
                type="number"
                value={config.minutesToRun}
                onChange={(e) => handleConfigChange("minutesToRun", Number.parseInt(e.target.value))}
                className="bg-[#333333] border-[#404040] text-white mt-1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                checked={config.autoGenerateWallets}
                onCheckedChange={(checked) => handleConfigChange("autoGenerateWallets", checked)}
              />
              <Label className="text-gray-300">Auto-generate wallets</Label>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const renderConfigContent = () => {
    switch (mode) {
      case "advanced":
        return renderAdvancedConfig()
      case "target-price":
        return renderTargetPriceConfig()
      case "boost-token":
        return renderBoostTokenConfig()
      default:
        return renderAdvancedConfig()
    }
  }

  return (
    <div className="fixed inset-0 bg-[#1b1b1b] z-50 overflow-y-auto font-sans">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Button
              onClick={onBack}
              className="bg-[#2a2a2a] hover:bg-[#333333] text-white border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">{getModeTitle()}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" style={{ color: "#84cc16" }} />
            <span className="text-gray-300">Connected: 7x8k...9mN2</span>
          </div>
        </div>

        {/* Configuration Form */}
        {renderConfigContent()}

        {/* Warning for Disruption Mode */}
        {config.disruptionEnabled && (
          <Card className="bg-red-900/20 border border-red-500/20 mt-6">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Disruption Mode Enabled</span>
              </div>
              <p className="text-red-300 text-sm mt-2">
                This mode will actively disrupt token deployments. Use responsibly and ensure compliance with applicable
                laws.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Fee Estimation */}
        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414] mt-6">
          <CardHeader>
            <CardTitle className="text-white">Fee Estimation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white">{estimatedFees} SOL</div>
                <div className="text-gray-400 text-sm">Total Fees</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{config.makers}</div>
                <div className="text-gray-400 text-sm">Makers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">{config.makers * 2}</div>
                <div className="text-gray-400 text-sm">Est. Transactions</div>
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ color: "#84cc16" }}>
                  ${(config.solToSpend * 150).toFixed(0)}
                </div>
                <div className="text-gray-400 text-sm">Est. Volume</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-8">
          <Button
            onClick={onBack}
            className="bg-[#333333] hover:bg-[#333333] text-white px-8 py-3 border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleStart}
            disabled={isStarting || !config.tokenAddress}
            className="text-white px-8 py-3 border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414] hover:shadow-[4px_4px_8px_#0a0a0a,-4px_-4px_8px_#141414]"
            style={{ backgroundColor: "#84cc16" }}
          >
            {isStarting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                {isGeneratingWallets ? "Generating Wallets..." : "Starting Bot..."}
              </>
            ) : (
              "Start Bot"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
