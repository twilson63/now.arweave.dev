import { test } from 'uvu'
import * as assert from 'uvu/assert'
import fs from 'fs'
import Arweave from 'arweave'
import { WarpNodeFactory, LoggerFactory } from 'warp-contracts'
import { listAssets } from './market.js'

//const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

const wallet = await arweave.wallets.generate()

LoggerFactory.INST.logLevel('debug')
const warp = WarpNodeFactory.memCached(arweave)

test('listAssets', async () => {
  const results = await listAssets('9nDWI3eHrMQbrfs9j8_YPfLbYJmBodgn7cBCG8bii4o')
    .runWith({ warp, wallet, arweave }).toPromise()
  console.log(results)
  assert.equal(true, true)
})

test.run()