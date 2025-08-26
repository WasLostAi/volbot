"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Settings, Globe, Shield, Zap, Database, Download, Upload, RefreshCw, AlertTriangle, Save } from "lucide-react"

export default function SettingsPanel() {
  const { toast } = useToast()
  const [settings, setSettings] = useState({
    // General Settings
    theme: "dark",
    language: "en",
    autoSave: true,
    notifications: true,
    soundEffects: false,

    // Trading Settings
    defaultSlippage: 1.0,
    maxGasPrice: 0.01,
    priorityFee: 0.0001,
    autoRetry: true,
    retryAttempts: 3,
    transactionTimeout: 30,

    // Security Settings
    requireConfirmation: true,
    enableTwoFA: false,
    sessionTimeout: 30,
    ipWhitelist: "",

    // API Settings
    rpcEndpoint: "https://api.mainnet-beta.solana.com",
    customRpc: "",
    useCustomRpc: false,
    apiTimeout: 10,
    rateLimitPerMinute: 100,

    // Advanced Settings
    debugMode: false,
    logLevel: "info",
    cacheSize: 100,
    enableAnalytics: true,
    dataRetention: 30,
  })

  const [isSaving, setIsSaving] = useState(false)

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const saveSettings = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Save to localStorage for persistence
      localStorage.setItem("vlbt-settings", JSON.stringify(settings))

      toast({
        title: "Settings Saved",
        description: "Your settings have been saved successfully",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save settings. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const resetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default?")) {
      // Reset to default values
      setSettings({
        theme: "dark",
        language: "en",
        autoSave: true,
        notifications: true,
        soundEffects: false,
        defaultSlippage: 1.0,
        maxGasPrice: 0.01,
        priorityFee: 0.0001,
        autoRetry: true,
        retryAttempts: 3,
        transactionTimeout: 30,
        requireConfirmation: true,
        enableTwoFA: false,
        sessionTimeout: 30,
        ipWhitelist: "",
        rpcEndpoint: "https://api.mainnet-beta.solana.com",
        customRpc: "",
        useCustomRpc: false,
        apiTimeout: 10,
        rateLimitPerMinute: 100,
        debugMode: false,
        logLevel: "info",
        cacheSize: 100,
        enableAnalytics: true,
        dataRetention: 30,
      })

      toast({
        title: "Settings Reset",
        description: "All settings have been reset to default values",
      })
    }
  }

  const exportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = "vlbt-settings.json"
    link.click()
    URL.revokeObjectURL(url)

    toast({
      title: "Settings Exported",
      description: "Settings exported to JSON file",
    })
  }

  const importSettings = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedSettings = JSON.parse(e.target?.result as string)
        setSettings(importedSettings)
        toast({
          title: "Settings Imported",
          description: "Settings imported successfully",
        })
      } catch (error) {
        toast({
          title: "Import Failed",
          description: "Invalid settings file format",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Settings</h2>
        <div className="flex items-center space-x-2">
          <Button onClick={saveSettings} disabled={isSaving} className="bg-lime-400 text-black hover:bg-lime-500">
            {isSaving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Settings
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 border-0 bg-[#2a2a2a] shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="trading"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Trading
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Security
          </TabsTrigger>
          <TabsTrigger
            value="api"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            API
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Settings className="w-5 h-5" style={{ color: "#84cc16" }} />
                  <span>Interface Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Theme</Label>
                  <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                    <SelectTrigger className="bg-[#333333] border-[#404040] text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#333333] border-[#404040]">
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="auto">Auto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Language</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                    <SelectTrigger className="bg-[#333333] border-[#404040] text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#333333] border-[#404040]">
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="zh">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                  />
                  <Label className="text-gray-300">Auto-save settings</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.notifications}
                    onCheckedChange={(checked) => handleSettingChange("notifications", checked)}
                  />
                  <Label className="text-gray-300">Enable notifications</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.soundEffects}
                    onCheckedChange={(checked) => handleSettingChange("soundEffects", checked)}
                  />
                  <Label className="text-gray-300">Sound effects</Label>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Database className="w-5 h-5" style={{ color: "#84cc16" }} />
                  <span>Data Management</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Data Retention (days)</Label>
                  <Input
                    type="number"
                    value={settings.dataRetention}
                    onChange={(e) => handleSettingChange("dataRetention", Number.parseInt(e.target.value))}
                    className="bg-[#333333] border-[#404040] text-white mt-1"
                  />
                </div>

                <div className="space-y-2">
                  <Button onClick={exportSettings} className="w-full bg-[#333333] text-white border-none">
                    <Download className="w-4 h-4 mr-2" />
                    Export Settings
                  </Button>

                  <div className="relative">
                    <input
                      type="file"
                      accept=".json"
                      onChange={importSettings}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <Button className="w-full bg-[#333333] text-white border-none">
                      <Upload className="w-4 h-4 mr-2" />
                      Import Settings
                    </Button>
                  </div>

                  <Button onClick={resetSettings} className="w-full bg-red-600 text-white border-none">
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Reset to Default
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trading">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Zap className="w-5 h-5" style={{ color: "#84cc16" }} />
                  <span>Transaction Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-gray-300">Default Slippage (%)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={settings.defaultSlippage}
                    onChange={(e) => handleSettingChange("defaultSlippage", Number.parseFloat(e.target.value))}
                    className="bg-[#333333] border-[#404040] text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Max Gas Price (SOL)</Label>
                  <Input
                    type="number"
                    step="0.001"
                    value={settings.maxGasPrice}
                    onChange={(e) => handleSettingChange("maxGasPrice", Number.parseFloat(e.target.value))}
                    className="bg-[#333333] border-[#404040] text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Priority Fee (SOL)</Label>
                  <Input
                    type="number"
                    step="0.0001"
                    value={settings.priorityFee}
                    onChange={(e) => handleSettingChange("priorityFee", Number.parseFloat(e.target.value))}
                    className="bg-[#333333] border-[#404040] text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Transaction Timeout (seconds)</Label>
                  <Input
                    type="number"
                    value={settings.transactionTimeout}
                    onChange={(e) => handleSettingChange("transactionTimeout", Number.parseInt(e.target.value))}
                    className="bg-[#333333] border-[#404040] text-white mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <RefreshCw className="w-5 h-5" style={{ color: "#84cc16" }} />
                  <span>Retry Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.autoRetry}
                    onCheckedChange={(checked) => handleSettingChange("autoRetry", checked)}
                  />
                  <Label className="text-gray-300">Auto-retry failed transactions</Label>
                </div>

                <div>
                  <Label className="text-gray-300">Retry Attempts: {settings.retryAttempts}</Label>
                  <Slider
                    value={[settings.retryAttempts]}
                    onValueChange={(value) => handleSettingChange("retryAttempts", value[0])}
                    max={10}
                    min={1}
                    step={1}
                    className="mt-2"
                    disabled={!settings.autoRetry}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Shield className="w-5 h-5" style={{ color: "#84cc16" }} />
                  <span>Security Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.requireConfirmation}
                    onCheckedChange={(checked) => handleSettingChange("requireConfirmation", checked)}
                  />
                  <Label className="text-gray-300">Require transaction confirmation</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableTwoFA}
                    onCheckedChange={(checked) => handleSettingChange("enableTwoFA", checked)}
                  />
                  <Label className="text-gray-300">Enable Two-Factor Authentication</Label>
                  <Badge className="bg-orange-600 text-white text-xs">Coming Soon</Badge>
                </div>

                <div>
                  <Label className="text-gray-300">Session Timeout (minutes)</Label>
                  <Input
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", Number.parseInt(e.target.value))}
                    className="bg-[#333333] border-[#404040] text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">IP Whitelist (comma-separated)</Label>
                  <Input
                    value={settings.ipWhitelist}
                    onChange={(e) => handleSettingChange("ipWhitelist", e.target.value)}
                    placeholder="192.168.1.1, 10.0.0.1"
                    className="bg-[#333333] border-[#404040] text-white mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-900/20 border border-red-500/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-400">
                  <AlertTriangle className="w-5 h-5" />
                  <span>Security Notice</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-red-300 text-sm">
                  <p>• Never share your private keys or seed phrases</p>
                  <p>• Always verify transaction details before confirming</p>
                  <p>• Use hardware wallets for large amounts</p>
                  <p>• Keep your software updated</p>
                  <p>• Be cautious of phishing attempts</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="api">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Globe className="w-5 h-5" style={{ color: "#84cc16" }} />
                  <span>RPC Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.useCustomRpc}
                    onCheckedChange={(checked) => handleSettingChange("useCustomRpc", checked)}
                  />
                  <Label className="text-gray-300">Use custom RPC endpoint</Label>
                </div>

                <div>
                  <Label className="text-gray-300">RPC Endpoint</Label>
                  <Input
                    value={settings.useCustomRpc ? settings.customRpc : settings.rpcEndpoint}
                    onChange={(e) =>
                      handleSettingChange(settings.useCustomRpc ? "customRpc" : "rpcEndpoint", e.target.value)
                    }
                    disabled={!settings.useCustomRpc}
                    className="bg-[#333333] border-[#404040] text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">API Timeout (seconds)</Label>
                  <Input
                    type="number"
                    value={settings.apiTimeout}
                    onChange={(e) => handleSettingChange("apiTimeout", Number.parseInt(e.target.value))}
                    className="bg-[#333333] border-[#404040] text-white mt-1"
                  />
                </div>

                <div>
                  <Label className="text-gray-300">Rate Limit (requests/minute)</Label>
                  <Input
                    type="number"
                    value={settings.rateLimitPerMinute}
                    onChange={(e) => handleSettingChange("rateLimitPerMinute", Number.parseInt(e.target.value))}
                    className="bg-[#333333] border-[#404040] text-white mt-1"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="text-white">RPC Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 rounded-lg bg-[#333333]">
                    <div className="text-white font-medium">Mainnet Beta</div>
                    <div className="text-gray-400 text-sm font-mono">https://api.mainnet-beta.solana.com</div>
                    <Badge className="bg-green-600 text-white text-xs mt-1">Official</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-[#333333]">
                    <div className="text-white font-medium">Devnet</div>
                    <div className="text-gray-400 text-sm font-mono">https://api.devnet.solana.com</div>
                    <Badge className="bg-blue-600 text-white text-xs mt-1">Testing</Badge>
                  </div>
                  <div className="p-3 rounded-lg bg-[#333333]">
                    <div className="text-white font-medium">Custom RPC</div>
                    <div className="text-gray-400 text-sm">Configure your own RPC endpoint</div>
                    <Badge className="bg-orange-600 text-white text-xs mt-1">Advanced</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="advanced">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Settings className="w-5 h-5" style={{ color: "#84cc16" }} />
                  <span>Advanced Settings</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.debugMode}
                    onCheckedChange={(checked) => handleSettingChange("debugMode", checked)}
                  />
                  <Label className="text-gray-300">Debug mode</Label>
                </div>

                <div>
                  <Label className="text-gray-300">Log Level</Label>
                  <Select value={settings.logLevel} onValueChange={(value) => handleSettingChange("logLevel", value)}>
                    <SelectTrigger className="bg-[#333333] border-[#404040] text-white mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#333333] border-[#404040]">
                      <SelectItem value="error">Error</SelectItem>
                      <SelectItem value="warn">Warning</SelectItem>
                      <SelectItem value="info">Info</SelectItem>
                      <SelectItem value="debug">Debug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-gray-300">Cache Size (MB): {settings.cacheSize}</Label>
                  <Slider
                    value={[settings.cacheSize]}
                    onValueChange={(value) => handleSettingChange("cacheSize", value[0])}
                    max={500}
                    min={50}
                    step={10}
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.enableAnalytics}
                    onCheckedChange={(checked) => handleSettingChange("enableAnalytics", checked)}
                  />
                  <Label className="text-gray-300">Enable analytics</Label>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="text-white">System Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Version:</span>
                    <span className="text-white">v1.0.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Build:</span>
                    <span className="text-white">2024.01.15</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Network:</span>
                    <Badge className="bg-green-600 text-white text-xs">Mainnet</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <Badge className="bg-green-600 text-white text-xs">Online</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Uptime:</span>
                    <span className="text-white">2h 34m</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
