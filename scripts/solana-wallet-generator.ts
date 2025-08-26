// Solana wallet generation script
// Run with: node scripts/solana-wallet-generator.js

import { Keypair } from "@solana/web3.js"
import * as fs from "fs"

interface GeneratedWallet {
  publicKey: string
  privateKey: string
  secretKey: number[]
}

export function generateSolanaWallet(): GeneratedWallet {
  const keypair = Keypair.generate()

  return {
    publicKey: keypair.publicKey.toBase58(),
    privateKey: Buffer.from(keypair.secretKey).toString("base64"),
    secretKey: Array.from(keypair.secretKey),
  }
}

export function generateBulkWallets(count: number): GeneratedWallet[] {
  const wallets: GeneratedWallet[] = []

  for (let i = 0; i < count; i++) {
    wallets.push(generateSolanaWallet())
  }

  return wallets
}

export function saveWalletsToFile(wallets: GeneratedWallet[], filename = "generated-wallets.json") {
  const data = {
    timestamp: new Date().toISOString(),
    count: wallets.length,
    wallets: wallets,
  }

  fs.writeFileSync(filename, JSON.stringify(data, null, 2))
  console.log(`Saved ${wallets.length} wallets to ${filename}`)
}

// Example usage
if (require.main === module) {
  const walletCount = Number.parseInt(process.argv[2]) || 10
  console.log(`Generating ${walletCount} Solana wallets...`)

  const wallets = generateBulkWallets(walletCount)
  saveWalletsToFile(wallets)

  console.log("Sample wallet:")
  console.log("Public Key:", wallets[0].publicKey)
  console.log("Private Key:", wallets[0].privateKey)
}
