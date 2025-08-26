"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Wallet, Copy, ExternalLink, LogOut, RefreshCw, ChevronDown } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface WalletDropdownProps {
  connectedWallet: string | null
  balance: number
  onConnect: () => void
  onDisconnect: () => void
  onRefreshBalance: () => void
  isConnecting?: boolean
}

export default function WalletDropdown({
  connectedWallet,
  balance,
  onConnect,
  onDisconnect,
  onRefreshBalance,
  isConnecting = false,
}: WalletDropdownProps) {
  const { toast } = useToast()

  const copyAddress = () => {
    if (connectedWallet) {
      navigator.clipboard.writeText(connectedWallet)
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      })
    }
  }

  const viewOnExplorer = () => {
    if (connectedWallet) {
      window.open(`https://solscan.io/account/${connectedWallet}`, "_blank")
    }
  }

  if (!connectedWallet) {
    return (
      <Button
        onClick={onConnect}
        disabled={isConnecting}
        className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-[#333333] hover:bg-[#404040] text-gray-300"
      >
        {isConnecting ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span className="text-sm">Connecting...</span>
          </>
        ) : (
          <>
            <Wallet className="w-4 h-4" />
            <span className="text-sm">Connect</span>
          </>
        )}
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
          <div className="flex flex-col items-start">
            <span className="text-xs font-mono">
              {connectedWallet.slice(0, 4)}...{connectedWallet.slice(-4)}
            </span>
            <span className="text-xs opacity-80">{balance.toFixed(3)} SOL</span>
          </div>
          <ChevronDown className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-[#2a2a2a] border-[#404040]" align="end">
        <div className="p-3 border-b border-[#404040]">
          <div className="flex items-center space-x-2 mb-2">
            <Wallet className="w-4 h-4 text-lime-400" />
            <span className="text-white font-medium">Connected Wallet</span>
            <Badge className="bg-green-600 text-white text-xs">Active</Badge>
          </div>
          <div className="text-xs font-mono text-gray-300 mb-1">{connectedWallet}</div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-white font-medium">{balance.toFixed(6)} SOL</span>
            <Button size="sm" variant="ghost" onClick={onRefreshBalance} className="text-gray-400 hover:text-white p-1">
              <RefreshCw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        <DropdownMenuItem onClick={copyAddress} className="text-gray-300 hover:text-white hover:bg-[#333333]">
          <Copy className="w-4 h-4 mr-2" />
          Copy Address
        </DropdownMenuItem>

        <DropdownMenuItem onClick={viewOnExplorer} className="text-gray-300 hover:text-white hover:bg-[#333333]">
          <ExternalLink className="w-4 h-4 mr-2" />
          View on Solscan
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-[#404040]" />

        <DropdownMenuItem onClick={onDisconnect} className="text-red-400 hover:text-red-300 hover:bg-[#333333]">
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
