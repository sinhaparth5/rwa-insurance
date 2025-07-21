import { signMessage } from "@wagmi/core";
import { wagmiAdapter } from "@/configs"; // Fixed: Use wagmiAdapter instead of wagmiConfig

export const generateAuthMessage = (walletAddress: string): string => {
    const timestamp = new Date().toISOString()
    return `Welcome to RWA Insurance Protocol!\n\nSign this message to authenticate your wallet:\n${walletAddress}\n\nTimestamp: ${timestamp}`
}

export const signAuthMessage = async (message: string): Promise<string> => {
    try {
        console.log('🔐 Signing message with wagmi...')
        console.log('📝 Message:', message)
        
        // Use wagmiAdapter.wagmiConfig instead of wagmiConfig
        const signature = await signMessage(wagmiAdapter.wagmiConfig, { message })
        
        console.log('✅ Message signed successfully')
        console.log('📜 Signature:', signature.slice(0, 10) + '...')
        
        return signature
    } catch (error: any) {
        console.error("❌ Failed to sign message:", error)
        
        // Better error handling
        if (error?.message?.includes('User rejected')) {
            throw new Error('Signature rejected by user')
        } else if (error?.message?.includes('getChainId is not a function')) {
            throw new Error('Wallet configuration error - please try reconnecting')
        } else {
            throw new Error("Message signing failed")
        }
    }
}