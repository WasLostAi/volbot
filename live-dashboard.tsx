"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  ArrowLeft,
  Activity,
  TargetIcon,
  Zap,
  Shield,
  AlertTriangle,
  TrendingUp,
  Users,
  Clock,
  Play,
  Pause,
} from "lucide-react"

interface MonitoringData {
  activeTargets: number
  disruptionsToday: number
  successRate: number
  totalVolume: string
}

interface Target {
  id: string
  address: string
  riskScore: number
  deploymentCount: number
  lastActivity: string
  status: "monitoring" | "disrupting" | "neutralized"
  disruptionType?: string
}

interface DisruptionLog {
  id: string
  timestamp: string
  target: string
  type: string
  status: "success" | "failed" | "pending"
  details: string
}

interface LiveDashboardProps {
  onBack: () => void
}

export default function LiveDashboard({ onBack }: LiveDashboardProps) {
  const [monitoringData, setMonitoringData] = useState<MonitoringData>({
    activeTargets: 12,
    disruptionsToday: 47,
    successRate: 89.2,
    totalVolume: "2.4M",
  })

  const [targets, setTargets] = useState<Target[]>([
    {
      id: "1",
      address: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
      riskScore: 94,
      deploymentCount: 8,
      lastActivity: "2 min ago",
      status: "disrupting",
      disruptionType: "front_run",
    },
    {
      id: "2",
      address: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      riskScore: 87,
      deploymentCount: 5,
      lastActivity: "5 min ago",
      status: "monitoring",
    },
    {
      id: "3",
      address: "4vJ9JU1bJJE96FWSJKvHsmmFADCg4gpZQff4P3bkLKi",
      riskScore: 76,
      deploymentCount: 12,
      lastActivity: "8 min ago",
      status: "neutralized",
      disruptionType: "liquidity_drain",
    },
    {
      id: "4",
      address: "2mBWxgE8dQqCKoXNvdxM3nqPKRfGYdLVL9zYtAWWN",
      riskScore: 82,
      deploymentCount: 3,
      lastActivity: "12 min ago",
      status: "monitoring",
    },
    {
      id: "5",
      address: "8kLmN3pQrS7vT9uW1xY2zA3bC4dE5fG6hI7jK8lM9nO",
      riskScore: 91,
      deploymentCount: 15,
      lastActivity: "15 min ago",
      status: "disrupting",
      disruptionType: "coordinated_attack",
    },
  ])

  const [disruptionLogs, setDisruptionLogs] = useState<DisruptionLog[]>([
    {
      id: "1",
      timestamp: "14:23:45",
      target: "7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgHkv",
      type: "Front Run",
      status: "success",
      details: "Successfully front-ran token deployment with competing mint",
    },
    {
      id: "2",
      timestamp: "14:21:12",
      target: "9WzDXwBbmkg8ZTbNMqUxvQRAyrZzDsGYdLVL9zYtAWWM",
      type: "Transaction Spam",
      status: "pending",
      details: "Network congestion attack in progress - 127 transactions sent",
    },
    {
      id: "3",
      timestamp: "14:18:33",
      target: "4vJ9JU1bJJE96FWSJKvHsmmFADCg4gpZQff4P3bkLKi",
      type: "Liquidity Drain",
      status: "success",
      details: "Extracted 45.2 SOL from liquidity pool before rug pull",
    },
    {
      id: "4",
      timestamp: "14:15:22",
      target: "8kLmN3pQrS7vT9uW1xY2zA3bC4dE5fG6hI7jK8lM9nO",
      type: "Coordinated Attack",
      status: "success",
      details: "Multi-vector disruption successful - 3 techniques deployed",
    },
    {
      id: "5",
      timestamp: "14:12:08",
      target: "2mBWxgE8dQqCKoXNvdxM3nqPKRfGYdLVL9zYtAWWN",
      type: "Front Run",
      status: "failed",
      details: "Target transaction confirmed before disruption could execute",
    },
  ])

  const [isMonitoring, setIsMonitoring] = useState(true)
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)

  // Simulate real-time updates
  useEffect(() => {
    if (!isMonitoring) return

    const interval = setInterval(() => {
      // Update monitoring data
      setMonitoringData((prev) => ({
        ...prev,
        activeTargets: Math.max(5, prev.activeTargets + Math.floor(Math.random() * 3) - 1),
        disruptionsToday: prev.disruptionsToday + (Math.random() > 0.8 ? 1 : 0),
        successRate: Math.min(95, Math.max(75, prev.successRate + (Math.random() - 0.5) * 2)),
      }))

      // Randomly update target statuses
      if (Math.random() > 0.7) {
        setTargets((prev) =>
          prev.map((target) => {
            if (Math.random() > 0.85) {
              const statuses: Target["status"][] = ["monitoring", "disrupting", "neutralized"]
              const newStatus = statuses[Math.floor(Math.random() * statuses.length)]
              return {
                ...target,
                status: newStatus,
                lastActivity: "just now",
                disruptionType:
                  newStatus === "disrupting" || newStatus === "neutralized"
                    ? ["front_run", "liquidity_drain", "transaction_spam", "coordinated_attack"][
                        Math.floor(Math.random() * 4)
                      ]
                    : undefined,
              }
            }
            return target
          }),
        )
      }

      // Add new disruption logs occasionally
      if (Math.random() > 0.9) {
        const newLog: DisruptionLog = {
          id: Date.now().toString(),
          timestamp: new Date().toLocaleTimeString(),
          target: targets[Math.floor(Math.random() * targets.length)].address,
          type: ["Front Run", "Transaction Spam", "Liquidity Drain", "Coordinated Attack"][
            Math.floor(Math.random() * 4)
          ],
          status: Math.random() > 0.2 ? "success" : "failed",
          details: "Real-time disruption activity detected",
        }

        setDisruptionLogs((prev) => [newLog, ...prev.slice(0, 9)])
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [isMonitoring, targets])

  const getStatusColor = (status: Target["status"]) => {
    switch (status) {
      case "monitoring":
        return "bg-blue-500"
      case "disrupting":
        return "bg-red-500"
      case "neutralized":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusIcon = (status: Target["status"]) => {
    switch (status) {
      case "monitoring":
        return <Activity className="w-4 h-4" />
      case "disrupting":
        return <Zap className="w-4 h-4" />
      case "neutralized":
        return <Shield className="w-4 h-4" />
      default:
        return <TargetIcon className="w-4 h-4" />
    }
  }

  const handleManualDisruption = (targetId: string, disruptionType: string) => {
    setTargets((prev) =>
      prev.map((target) =>
        target.id === targetId ? { ...target, status: "disrupting", disruptionType, lastActivity: "just now" } : target,
      ),
    )

    // Add to disruption logs
    const target = targets.find((t) => t.id === targetId)
    if (target) {
      const newLog: DisruptionLog = {
        id: Date.now().toString(),
        timestamp: new Date().toLocaleTimeString(),
        target: target.address,
        type: disruptionType.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
        status: "pending",
        details: `Manual ${disruptionType.replace("_", " ")} attack initiated`,
      }

      setDisruptionLogs((prev) => [newLog, ...prev.slice(0, 9)])
    }
  }

  return (
    <div className="min-h-screen p-6 bg-[#1b1b1b] font-sans">
      <div className="max-w-7xl mx-auto">
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
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Live Monitoring Dashboard</h1>
              <p className="text-gray-400">Real-time threat detection and disruption system</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${isMonitoring ? "bg-green-500" : "bg-red-500"} animate-pulse`}
              ></div>
              <span className="text-white font-medium">{isMonitoring ? "MONITORING" : "OFFLINE"}</span>
            </div>
            <Button
              onClick={() => setIsMonitoring(!isMonitoring)}
              className={`${isMonitoring ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"} text-white shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]`}
            >
              {isMonitoring ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isMonitoring ? "Stop Monitoring" : "Start Monitoring"}
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card
            className="border-0 text-white"
            style={{
              backgroundColor: "#2a2a2a",
              boxShadow: "8px 8px 16px #0a0a0a, -8px -8px 16px #141414",
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Targets</p>
                  <p className="text-2xl font-bold text-white">{monitoringData.activeTargets}</p>
                </div>
                <TargetIcon className="w-8 h-8 text-lime-400" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-0 text-white"
            style={{
              backgroundColor: "#2a2a2a",
              boxShadow: "8px 8px 16px #0a0a0a, -8px -8px 16px #141414",
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Disruptions Today</p>
                  <p className="text-2xl font-bold text-white">{monitoringData.disruptionsToday}</p>
                </div>
                <Zap className="w-8 h-8 text-lime-400" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-0 text-white"
            style={{
              backgroundColor: "#2a2a2a",
              boxShadow: "8px 8px 16px #0a0a0a, -8px -8px 16px #141414",
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Success Rate</p>
                  <p className="text-2xl font-bold text-white">{monitoringData.successRate.toFixed(1)}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-lime-400" />
              </div>
            </CardContent>
          </Card>

          <Card
            className="border-0 text-white"
            style={{
              backgroundColor: "#2a2a2a",
              boxShadow: "8px 8px 16px #0a0a0a, -8px -8px 16px #141414",
            }}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Volume Disrupted</p>
                  <p className="text-2xl font-bold text-white">{monitoringData.totalVolume}</p>
                </div>
                <Shield className="w-8 h-8 text-lime-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="targets" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 border-0 bg-[#2a2a2a] shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <TabsTrigger
              value="targets"
              className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
            >
              Active Targets
            </TabsTrigger>
            <TabsTrigger
              value="disruptions"
              className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
            >
              Disruption Logs
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="targets">
            <Card
              className="border-0"
              style={{
                backgroundColor: "#2a2a2a",
                boxShadow: "8px 8px 16px #0a0a0a, -8px -8px 16px #141414",
              }}
            >
              <CardHeader>
                <CardTitle className="text-white">High-Risk Targets</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-4">
                    {targets.map((target) => (
                      <div
                        key={target.id}
                        className={`flex items-center justify-between p-4 rounded-lg transition-all cursor-pointer ${
                          selectedTarget === target.id ? "ring-2 ring-lime-400" : ""
                        }`}
                        style={{
                          backgroundColor: "#333333",
                          boxShadow:
                            selectedTarget === target.id
                              ? "inset 4px 4px 8px #0a0a0a, inset -4px -4px 8px #141414"
                              : "4px 4px 8px #0a0a0a, -4px -4px 8px #141414",
                        }}
                        onClick={() => setSelectedTarget(selectedTarget === target.id ? null : target.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(target.status)} animate-pulse`}></div>
                          <div>
                            <p className="text-white font-mono text-sm">{target.address}</p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-gray-400 text-xs">Risk: {target.riskScore}%</span>
                              <span className="text-gray-400 text-xs">Deployments: {target.deploymentCount}</span>
                              <span className="text-gray-400 text-xs">{target.lastActivity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={`${getStatusColor(target.status)} text-white border-0`}>
                            <div className="flex items-center gap-1">
                              {getStatusIcon(target.status)}
                              {target.status.toUpperCase()}
                            </div>
                          </Badge>
                          {target.disruptionType && (
                            <Badge className="bg-orange-600 text-white border-0">
                              {target.disruptionType.replace("_", " ").toUpperCase()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Manual Disruption Controls */}
                {selectedTarget && (
                  <div className="mt-4 p-4 bg-[#333333] rounded-lg">
                    <h4 className="text-white font-medium mb-3">Manual Disruption Controls</h4>
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        size="sm"
                        onClick={() => handleManualDisruption(selectedTarget, "front_run")}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        Front Run
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleManualDisruption(selectedTarget, "transaction_spam")}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Transaction Spam
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleManualDisruption(selectedTarget, "liquidity_drain")}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Liquidity Drain
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleManualDisruption(selectedTarget, "coordinated_attack")}
                        className="bg-red-800 hover:bg-red-900 text-white"
                      >
                        Coordinated Attack
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="disruptions">
            <Card
              className="border-0"
              style={{
                backgroundColor: "#2a2a2a",
                boxShadow: "8px 8px 16px #0a0a0a, -8px -8px 16px #141414",
              }}
            >
              <CardHeader>
                <CardTitle className="text-white">Recent Disruption Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-96">
                  <div className="space-y-3">
                    {disruptionLogs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-start gap-4 p-4 rounded-lg"
                        style={{
                          backgroundColor: "#333333",
                          boxShadow: "4px 4px 8px #0a0a0a, -4px -4px 8px #141414",
                        }}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
                          <span className="text-gray-400 text-sm">{log.timestamp}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-white font-medium">{log.type}</span>
                            <Badge
                              className={`${
                                log.status === "success"
                                  ? "bg-green-600"
                                  : log.status === "failed"
                                    ? "bg-red-600"
                                    : "bg-yellow-600"
                              } text-white border-0 text-xs`}
                            >
                              {log.status.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-gray-400 text-sm font-mono truncate">{log.target}</p>
                          <p className="text-gray-300 text-sm mt-1">{log.details}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card
                className="border-0"
                style={{
                  backgroundColor: "#2a2a2a",
                  boxShadow: "8px 8px 16px #0a0a0a, -8px -8px 16px #141414",
                }}
              >
                <CardHeader>
                  <CardTitle className="text-white">Disruption Techniques</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Front Running</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div className="w-3/4 h-full bg-lime-400"></div>
                        </div>
                        <span className="text-white text-sm">75%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Transaction Spam</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div className="w-4/5 h-full bg-lime-400"></div>
                        </div>
                        <span className="text-white text-sm">80%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Liquidity Drain</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div className="w-3/5 h-full bg-lime-400"></div>
                        </div>
                        <span className="text-white text-sm">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Coordinated Attack</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 h-2 bg-gray-600 rounded-full overflow-hidden">
                          <div className="w-5/6 h-full bg-lime-400"></div>
                        </div>
                        <span className="text-white text-sm">85%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="border-0"
                style={{
                  backgroundColor: "#2a2a2a",
                  boxShadow: "8px 8px 16px #0a0a0a, -8px -8px 16px #141414",
                }}
              >
                <CardHeader>
                  <CardTitle className="text-white">Threat Intelligence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-red-900/20 border border-red-500/20">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-red-400 text-sm">High Risk Deployers</span>
                      </div>
                      <span className="text-white font-bold">8</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-900/20 border border-yellow-500/20">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 text-sm">Coordinated Groups</span>
                      </div>
                      <span className="text-white font-bold">3</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-900/20 border border-blue-500/20">
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-blue-400" />
                        <span className="text-blue-400 text-sm">Active Monitors</span>
                      </div>
                      <span className="text-white font-bold">24</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-900/20 border border-green-500/20">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span className="text-green-400 text-sm">Neutralized Today</span>
                      </div>
                      <span className="text-white font-bold">15</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
