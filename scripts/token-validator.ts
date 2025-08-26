// Token validation and information fetching script
// Run with: node scripts/token-validator.js <token_address>

import { Connection, PublicKey } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID } from "@solana/spl-token"

interface TokenInfo {
  address: string
  isValid: boolean
  exists: boolean
  mintInfo?: {
    supply: string
    decimals: number
    mintAuthority: string | null
    freezeAuthority: string | null
  }
  error?: string
}

export class TokenValidator {
  private connection: Connection

  constructor(rpcUrl = "https://api.mainnet-beta.solana.com") {
    this.connection = new Connection(rpcUrl, "confirmed")
  }

  async validateTokenAddress(tokenAddress: string): Promise<TokenInfo> {
    try {
      // Basic format validation
      if (!tokenAddress || tokenAddress.length !== 44) {
        return {
          address: tokenAddress,
          isValid: false,
          exists: false,
          error: "Invalid address format",
        }
      }

      // Check if it's a valid base58 string
      let publicKey: PublicKey
      try {
        publicKey = new PublicKey(tokenAddress)
      } catch (error) {
        return {
          address: tokenAddress,
          isValid: false,
          exists: false,
          error: "Invalid base58 format",
        }
      }

      // Check if the account exists and is a token mint
      const accountInfo = await this.connection.getAccountInfo(publicKey)

      if (!accountInfo) {
        return {
          address: tokenAddress,
          isValid: true,
          exists: false,
          error: "Token does not exist",
        }
      }

      // Check if it's a token mint account
      if (!accountInfo.owner.equals(TOKEN_PROGRAM_ID)) {
        return {
          address: tokenAddress,
          isValid: true,
          exists: false,
          error: "Not a token mint account",
        }
      }

      // Parse mint info
      const mintInfo = this.parseMintInfo(accountInfo.data)

      return {
        address: tokenAddress,
        isValid: true,
        exists: true,
        mintInfo,
      }
    } catch (error) {
      return {
        address: tokenAddress,
        isValid: false,
        exists: false,
        error: `Validation error: ${error.message}`,
      }
    }
  }

  private parseMintInfo(data: Buffer) {
    // Parse mint account data (simplified)
    const supply = data.readBigUInt64LE(36).toString()
    const decimals = data.readUInt8(44)

    return {
      supply,
      decimals,
      mintAuthority: null, // Would need proper parsing
      freezeAuthority: null, // Would need proper parsing
    }
  }

  async getTokenPrice(tokenAddress: string): Promise<number | null> {
    try {
      // This would integrate with Jupiter API or similar
      // For now, return mock data
      return Math.random() * 10
    } catch (error) {
      console.error("Failed to fetch token price:", error)
      return null
    }
  }

  async getTokenHolders(tokenAddress: string): Promise<number> {
    try {
      // This would require parsing all token accounts
      // For now, return mock data
      return Math.floor(Math.random() * 10000)
    } catch (error) {
      console.error("Failed to fetch token holders:", error)
      return 0
    }
  }
}

// Example usage
if (require.main === module) {
  const tokenAddress = process.argv[2]

  if (!tokenAddress) {
    console.error("Usage: node token-validator.js <token_address>")
    process.exit(1)
  }

  const validator = new TokenValidator()

  validator
    .validateTokenAddress(tokenAddress)
    .then((result) => {
      console.log("Token Validation Result:")
      console.log(JSON.stringify(result, null, 2))
    })
    .catch((error) => {
      console.error("Validation failed:", error)
    })
}
