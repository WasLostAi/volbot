// Solana RPC connection and utilities
// Handles connection to Solana network and basic operations

import { Connection, PublicKey, LAMPORTS_PER_SOL, type Transaction } from "@solana/web3.js"

export class SolanaConnection {
  private connection: Connection
  private rpcUrl: string

  constructor(rpcUrl = "https://api.mainnet-beta.solana.com") {
    this.rpcUrl = rpcUrl
    this.connection = new Connection(rpcUrl, "confirmed")
  }

  async getConnection(): Promise<Connection> {
    return this.connection
  }

  async getBalance(publicKey: string): Promise<number> {
    try {
      const pubKey = new PublicKey(publicKey)
      const balance = await this.connection.getBalance(pubKey)
      return balance / LAMPORTS_PER_SOL
    } catch (error) {
      console.error("Failed to get balance:", error)
      return 0
    }
  }

  async getRecentBlockhash(): Promise<string> {
    try {
      const { blockhash } = await this.connection.getLatestBlockhash()
      return blockhash
    } catch (error) {
      console.error("Failed to get recent blockhash:", error)
      throw error
    }
  }

  async sendTransaction(transaction: Transaction): Promise<string> {
    try {
      const signature = await this.connection.sendRawTransaction(transaction.serialize(), {
        skipPreflight: false,
        preflightCommitment: "confirmed",
      })

      // Wait for confirmation
      await this.connection.confirmTransaction(signature, "confirmed")

      return signature
    } catch (error) {
      console.error("Failed to send transaction:", error)
      throw error
    }
  }

  async getTransactionHistory(publicKey: string, limit = 10): Promise<any[]> {
    try {
      const pubKey = new PublicKey(publicKey)
      const signatures = await this.connection.getSignaturesForAddress(pubKey, { limit })

      const transactions = []
      for (const sig of signatures) {
        const tx = await this.connection.getTransaction(sig.signature)
        if (tx) {
          transactions.push({
            signature: sig.signature,
            slot: tx.slot,
            blockTime: tx.blockTime,
            fee: tx.meta?.fee,
            status: tx.meta?.err ? "failed" : "success",
          })
        }
      }

      return transactions
    } catch (error) {
      console.error("Failed to get transaction history:", error)
      return []
    }
  }

  async isValidAddress(address: string): Promise<boolean> {
    try {
      new PublicKey(address)
      return true
    } catch {
      return false
    }
  }

  async getNetworkStats(): Promise<any> {
    try {
      const epochInfo = await this.connection.getEpochInfo()
      const supply = await this.connection.getSupply()
      const version = await this.connection.getVersion()

      return {
        epoch: epochInfo.epoch,
        slotIndex: epochInfo.slotIndex,
        totalSupply: supply.value.total / LAMPORTS_PER_SOL,
        circulatingSupply: supply.value.circulating / LAMPORTS_PER_SOL,
        version: version["solana-core"],
      }
    } catch (error) {
      console.error("Failed to get network stats:", error)
      return null
    }
  }
}

// Example usage
if (require.main === module) {
  const solana = new SolanaConnection()

  // Test connection
  solana
    .getNetworkStats()
    .then((stats) => {
      console.log("Solana Network Stats:")
      console.log(JSON.stringify(stats, null, 2))
    })
    .catch((error) => {
      console.error("Connection test failed:", error)
    })
}
