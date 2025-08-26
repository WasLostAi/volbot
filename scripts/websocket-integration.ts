// WebSocket integration for real-time updates
// Handles live data streaming and real-time notifications

import WebSocket from "ws"
import { Connection, PublicKey } from "@solana/web3.js"

interface WebSocketMessage {
  type: string
  data: any
  timestamp: number
}

interface SubscriptionData {
  walletUpdates: Set<string>
  tokenUpdates: Set<string>
  transactionUpdates: Set<string>
  botUpdates: Set<string>
}

export class WebSocketIntegration {
  private wss: WebSocket.Server
  private solanaConnection: Connection
  private subscriptions: Map<WebSocket, SubscriptionData>
  private activeConnections: Set<WebSocket>

  constructor(port = 8080) {
    this.wss = new WebSocket.Server({ port })
    this.solanaConnection = new Connection("https://api.mainnet-beta.solana.com", "confirmed")
    this.subscriptions = new Map()
    this.activeConnections = new Set()

    this.setupWebSocketServer()
    this.startSolanaSubscriptions()
  }

  private setupWebSocketServer(): void {
    this.wss.on("connection", (ws: WebSocket) => {
      console.log("🔌 New WebSocket connection")
      this.activeConnections.add(ws)
      this.subscriptions.set(ws, {
        walletUpdates: new Set(),
        tokenUpdates: new Set(),
        transactionUpdates: new Set(),
        botUpdates: new Set(),
      })

      // Send welcome message
      this.sendMessage(ws, {
        type: "connection",
        data: { status: "connected", timestamp: Date.now() },
        timestamp: Date.now(),
      })

      ws.on("message", (message: string) => {
        try {
          const data = JSON.parse(message)
          this.handleClientMessage(ws, data)
        } catch (error) {
          console.error("❌ Invalid WebSocket message:", error)
        }
      })

      ws.on("close", () => {
        console.log("🔌 WebSocket connection closed")
        this.activeConnections.delete(ws)
        this.subscriptions.delete(ws)
      })

      ws.on("error", (error) => {
        console.error("❌ WebSocket error:", error)
        this.activeConnections.delete(ws)
        this.subscriptions.delete(ws)
      })
    })

    console.log(`🚀 WebSocket server started on port ${this.wss.options.port}`)
  }

  private handleClientMessage(ws: WebSocket, message: any): void {
    const { type, data } = message

    switch (type) {
      case "subscribe":
        this.handleSubscription(ws, data)
        break
      case "unsubscribe":
        this.handleUnsubscription(ws, data)
        break
      case "ping":
        this.sendMessage(ws, { type: "pong", data: {}, timestamp: Date.now() })
        break
      default:
        console.warn("⚠️ Unknown message type:", type)
    }
  }

  private handleSubscription(ws: WebSocket, data: any): void {
    const subscription = this.subscriptions.get(ws)
    if (!subscription) return

    const { category, identifier } = data

    switch (category) {
      case "wallet":
        subscription.walletUpdates.add(identifier)
        this.subscribeToWalletUpdates(identifier)
        break
      case "token":
        subscription.tokenUpdates.add(identifier)
        this.subscribeToTokenUpdates(identifier)
        break
      case "transaction":
        subscription.transactionUpdates.add(identifier)
        this.subscribeToTransactionUpdates(identifier)
        break
      case "bot":
        subscription.botUpdates.add(identifier)
        this.subscribeToBotUpdates(identifier)
        break
    }

    this.sendMessage(ws, {
      type: "subscribed",
      data: { category, identifier },
      timestamp: Date.now(),
    })
  }

  private handleUnsubscription(ws: WebSocket, data: any): void {
    const subscription = this.subscriptions.get(ws)
    if (!subscription) return

    const { category, identifier } = data

    switch (category) {
      case "wallet":
        subscription.walletUpdates.delete(identifier)
        break
      case "token":
        subscription.tokenUpdates.delete(identifier)
        break
      case "transaction":
        subscription.transactionUpdates.delete(identifier)
        break
      case "bot":
        subscription.botUpdates.delete(identifier)
        break
    }

    this.sendMessage(ws, {
      type: "unsubscribed",
      data: { category, identifier },
      timestamp: Date.now(),
    })
  }

  private async subscribeToWalletUpdates(walletAddress: string): Promise<void> {
    try {
      const publicKey = new PublicKey(walletAddress)

      // Subscribe to account changes
      this.solanaConnection.onAccountChange(
        publicKey,
        (accountInfo) => {
          this.broadcastWalletUpdate(walletAddress, {
            balance: accountInfo.lamports / 1e9, // Convert to SOL
            owner: accountInfo.owner.toBase58(),
            executable: accountInfo.executable,
            rentEpoch: accountInfo.rentEpoch,
          })
        },
        "confirmed",
      )

      console.log(`📡 Subscribed to wallet updates: ${walletAddress}`)
    } catch (error) {
      console.error("❌ Failed to subscribe to wallet updates:", error)
    }
  }

  private async subscribeToTokenUpdates(tokenAddress: string): Promise<void> {
    try {
      // Simulate token price updates
      setInterval(() => {
        this.broadcastTokenUpdate(tokenAddress, {
          price: Math.random() * 10,
          volume24h: Math.random() * 1000000,
          marketCap: Math.random() * 10000000,
          priceChange24h: (Math.random() - 0.5) * 20,
        })
      }, 5000)

      console.log(`📡 Subscribed to token updates: ${tokenAddress}`)
    } catch (error) {
      console.error("❌ Failed to subscribe to token updates:", error)
    }
  }

  private async subscribeToTransactionUpdates(signature: string): Promise<void> {
    try {
      // Monitor transaction status
      const checkTransaction = async () => {
        const status = await this.solanaConnection.getSignatureStatus(signature)
        if (status.value) {
          this.broadcastTransactionUpdate(signature, {
            status: status.value.err ? "failed" : "confirmed",
            slot: status.value.slot,
            confirmations: status.value.confirmations,
            err: status.value.err,
          })
        }
      }

      // Check every 2 seconds
      const interval = setInterval(checkTransaction, 2000)

      // Stop checking after 2 minutes
      setTimeout(() => clearInterval(interval), 120000)

      console.log(`📡 Subscribed to transaction updates: ${signature}`)
    } catch (error) {
      console.error("❌ Failed to subscribe to transaction updates:", error)
    }
  }

  private async subscribeToBotUpdates(botId: string): Promise<void> {
    try {
      // Simulate bot status updates
      setInterval(() => {
        this.broadcastBotUpdate(botId, {
          status: Math.random() > 0.8 ? "error" : "running",
          transactionsCompleted: Math.floor(Math.random() * 100),
          volumeGenerated: Math.random() * 50000,
          profitLoss: (Math.random() - 0.5) * 1000,
          lastActivity: new Date().toISOString(),
        })
      }, 10000)

      console.log(`📡 Subscribed to bot updates: ${botId}`)
    } catch (error) {
      console.error("❌ Failed to subscribe to bot updates:", error)
    }
  }

  private broadcastWalletUpdate(walletAddress: string, data: any): void {
    this.broadcast("wallet_update", { walletAddress, ...data })
  }

  private broadcastTokenUpdate(tokenAddress: string, data: any): void {
    this.broadcast("token_update", { tokenAddress, ...data })
  }

  private broadcastTransactionUpdate(signature: string, data: any): void {
    this.broadcast("transaction_update", { signature, ...data })
  }

  private broadcastBotUpdate(botId: string, data: any): void {
    this.broadcast("bot_update", { botId, ...data })
  }

  private broadcast(type: string, data: any): void {
    const message: WebSocketMessage = {
      type,
      data,
      timestamp: Date.now(),
    }

    this.activeConnections.forEach((ws) => {
      if (ws.readyState === WebSocket.OPEN) {
        this.sendMessage(ws, message)
      }
    })
  }

  private sendMessage(ws: WebSocket, message: WebSocketMessage): void {
    try {
      ws.send(JSON.stringify(message))
    } catch (error) {
      console.error("❌ Failed to send WebSocket message:", error)
    }
  }

  private startSolanaSubscriptions(): void {
    // Subscribe to slot updates for network status
    this.solanaConnection.onSlotChange((slotInfo) => {
      this.broadcast("network_update", {
        slot: slotInfo.slot,
        parent: slotInfo.parent,
        root: slotInfo.root,
      })
    })

    console.log("📡 Started Solana network subscriptions")
  }

  getConnectionCount(): number {
    return this.activeConnections.size
  }

  getSubscriptionStats(): any {
    const stats = {
      totalConnections: this.activeConnections.size,
      walletSubscriptions: 0,
      tokenSubscriptions: 0,
      transactionSubscriptions: 0,
      botSubscriptions: 0,
    }

    this.subscriptions.forEach((subscription) => {
      stats.walletSubscriptions += subscription.walletUpdates.size
      stats.tokenSubscriptions += subscription.tokenUpdates.size
      stats.transactionSubscriptions += subscription.transactionUpdates.size
      stats.botSubscriptions += subscription.botUpdates.size
    })

    return stats
  }

  close(): void {
    this.wss.close()
    console.log("🔌 WebSocket server closed")
  }
}

// Example usage
if (require.main === module) {
  const wsIntegration = new WebSocketIntegration(8080)

  // Log connection stats every 30 seconds
  setInterval(() => {
    const stats = wsIntegration.getSubscriptionStats()
    console.log("📊 WebSocket Stats:", stats)
  }, 30000)

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log("🛑 Shutting down WebSocket server...")
    wsIntegration.close()
    process.exit(0)
  })
}
