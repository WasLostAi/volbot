"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, DollarSign, Activity, Target, Zap, Clock } from "lucide-react"

const volumeData = [
  { time: "00:00", volume: 12500, transactions: 45 },
  { time: "04:00", volume: 18200, transactions: 67 },
  { time: "08:00", volume: 25400, transactions: 89 },
  { time: "12:00", volume: 31200, transactions: 112 },
  { time: "16:00", volume: 28900, transactions: 98 },
  { time: "20:00", volume: 22100, transactions: 76 },
]

const profitData = [
  { date: "Mon", profit: 245, loss: 45 },
  { date: "Tue", profit: 312, loss: 67 },
  { date: "Wed", profit: 189, loss: 23 },
  { date: "Thu", profit: 456, loss: 89 },
  { date: "Fri", profit: 378, loss: 56 },
  { date: "Sat", profit: 423, loss: 78 },
  { date: "Sun", profit: 334, loss: 45 },
]

const strategyData = [
  { name: "Advanced Bot", value: 35, color: "#84cc16" },
  { name: "Target Price", value: 25, color: "#3b82f6" },
  { name: "Boost Token", value: 20, color: "#f59e0b" },
  { name: "Hybrid", value: 15, color: "#ef4444" },
  { name: "Premium", value: 5, color: "#8b5cf6" },
]

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState("24h")
  const [metrics, setMetrics] = useState({
    totalVolume: 125420,
    totalProfit: 2847,
    successRate: 89.2,
    activeStrategies: 12,
    avgTransactionTime: 2.4,
    gasEfficiency: 94.7,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-white">Analytics Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Badge className="bg-blue-600 text-white">Live Data</Badge>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="bg-[#2a2a2a] text-white border border-[#404040] rounded px-3 py-1 text-sm"
          >
            <option value="1h">1 Hour</option>
            <option value="24h">24 Hours</option>
            <option value="7d">7 Days</option>
            <option value="30d">30 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Total Volume</p>
                <p className="text-xl font-bold text-white">${metrics.totalVolume.toLocaleString()}</p>
              </div>
              <DollarSign className="w-6 h-6 text-lime-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Total Profit</p>
                <p className="text-xl font-bold text-green-400">${metrics.totalProfit}</p>
              </div>
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Success Rate</p>
                <p className="text-xl font-bold text-white">{metrics.successRate}%</p>
              </div>
              <Target className="w-6 h-6 text-lime-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Active Strategies</p>
                <p className="text-xl font-bold text-white">{metrics.activeStrategies}</p>
              </div>
              <Activity className="w-6 h-6 text-lime-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Avg TX Time</p>
                <p className="text-xl font-bold text-white">{metrics.avgTransactionTime}s</p>
              </div>
              <Clock className="w-6 h-6 text-lime-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-xs">Gas Efficiency</p>
                <p className="text-xl font-bold text-white">{metrics.gasEfficiency}%</p>
              </div>
              <Zap className="w-6 h-6 text-lime-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="volume" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 border-0 bg-[#2a2a2a] shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
          <TabsTrigger
            value="volume"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Volume Analysis
          </TabsTrigger>
          <TabsTrigger
            value="profit"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Profit/Loss
          </TabsTrigger>
          <TabsTrigger
            value="strategies"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Strategy Performance
          </TabsTrigger>
          <TabsTrigger
            value="transactions"
            className="data-[state=active]:bg-lime-400 data-[state=active]:text-black text-white"
          >
            Transaction Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="volume">
          <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <CardHeader>
              <CardTitle className="text-white">Volume Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="time" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2a2a2a",
                      border: "1px solid #404040",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Area type="monotone" dataKey="volume" stroke="#84cc16" fill="#84cc16" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profit">
          <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <CardHeader>
              <CardTitle className="text-white">Profit vs Loss Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={profitData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="date" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2a2a2a",
                      border: "1px solid #404040",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="profit" fill="#10b981" />
                  <Bar dataKey="loss" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strategies">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="text-white">Strategy Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={strategyData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {strategyData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#2a2a2a",
                        border: "1px solid #404040",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
              <CardHeader>
                <CardTitle className="text-white">Strategy Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-72">
                  <div className="space-y-4">
                    {strategyData.map((strategy, index) => (
                      <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-[#333333]">
                        <div className="flex items-center space-x-3">
                          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: strategy.color }}></div>
                          <span className="text-white font-medium">{strategy.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-bold">{strategy.value}%</div>
                          <div className="text-gray-400 text-sm">Usage</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card className="bg-[#2a2a2a] border-none shadow-[8px_8px_16px_#0a0a0a,-8px_-8px_16px_#141414]">
            <CardHeader>
              <CardTitle className="text-white">Transaction Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#404040" />
                  <XAxis dataKey="time" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#2a2a2a",
                      border: "1px solid #404040",
                      borderRadius: "8px",
                      color: "#fff",
                    }}
                  />
                  <Line type="monotone" dataKey="transactions" stroke="#3b82f6" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
