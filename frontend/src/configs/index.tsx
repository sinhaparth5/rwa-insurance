import { cookieStorage, createStorage } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, arbitrum } from '@reown/appkit/networks'
import { blockdagPrimordial } from '@/chains/blockdag' // Keep your custom chain

// Get projectId from https://cloud.reown.com
export const projectId = process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || 'bdbd66e5e4a2ea59b2fd0f042b692f63'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

// Include your custom BlockDAG chain
export const networks = [blockdagPrimordial, mainnet, arbitrum]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig
