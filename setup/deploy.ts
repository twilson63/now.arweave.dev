import Arweave from 'arweave'
import { WarpNodeFactory, LoggerFactory } from 'warp-contracts'
import fs from 'fs'

//const { WarpNodeFactory, LoggerFactory } = warpSDK

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

async function main() {
  const wallet = JSON.parse(fs.readFileSync('../wallet.json', 'utf-8'))
  const src = fs.readFileSync('./dist/contract.js', 'utf-8')
  const addr = await arweave.wallets.jwkToAddress(wallet)

  LoggerFactory.INST.logLevel('error')
  const warp = WarpNodeFactory.memCached(arweave)

  // initState
  const initState = JSON.stringify({
    ticker: 'PLAYCOIN-v3',
    name: 'PLAYCOIN Test Contract',
    balances: {
      [addr]: 10000
    },
    creator: addr,
    canEvolve: true,
    evolve: null,
    emergencyHaltWallet: addr,
    halted: false,
    pairs: [],
    usedTransfers: [],
    invocations: [],
    foreignCalls: []
  })

  const result = await warp.createContract.deploy({
    src,
    initState,
    wallet
  }, true)

  console.log(result)
}

main()