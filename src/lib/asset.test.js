import { test } from 'uvu'
import * as assert from 'uvu/assert'
import Arweave from 'arweave'
import { listAssets } from './market.js'
import { getTitle, getStampers } from './asset.js'
import { WarpNodeFactory, LoggerFactory } from 'warp-contracts'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

const wallet = await arweave.wallets.generate()

LoggerFactory.INST.logLevel('debug')
const warp = WarpNodeFactory.memCached(arweave)


test('getTitle', async () => {
  const results = await getTitle('SdjIH1eC-kT2JCxvnbexJxaxxf8MUOYHsvAZByGk16U')
    .runWith({ arweave }).toPromise()
  console.log(results)
  assert.equal(results, "Scott's Permapage")
})

test('getStampers', async () => {
  const assets = await listAssets('9nDWI3eHrMQbrfs9j8_YPfLbYJmBodgn7cBCG8bii4o').runWith({ arweave, warp }).toPromise()
  const results = await getStampers('SdjIH1eC-kT2JCxvnbexJxaxxf8MUOYHsvAZByGk16U')
    .runWith({ arweave, assets }).toPromise()
  assert.equal(results.length, 4)
})

test.run()