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
    ticker: 'FAKEBARv3',
    name: 'Testing purposes only do not use',
    balances: {},
    divisbility: 6,
    invocations: [],
    settings: [
      ["isTradeable", true]
    ],
    foreignCalls: []
  })

  const result = await warp.createContract.deployFromSourceTx({
    srcTxId: 'SaOFPAlREsBTdoNlgGFY4K7lGJHCZJEvLq2StDar25M',
    initState,
    wallet
  }, true)

  console.log(result)
}

main()