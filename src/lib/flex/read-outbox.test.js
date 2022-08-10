import { test } from 'uvu'
import * as assert from 'uvu/assert'
import fs from 'fs'
import Arweave from 'arweave'
import { WarpNodeFactory, LoggerFactory } from 'warp-contracts'
import readOutbox from './read-outbox.js'

const wallet = JSON.parse(fs.readFileSync('./wallet.json', 'utf-8'))

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

//const wallet = await arweave.wallets.generate()
const addr = 'vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI'

LoggerFactory.INST.logLevel('debug')
const warp = WarpNodeFactory.memCached(arweave)

test('readOutbox', async () => {
  const PST = 'W8oWjGyP8CHy-pMJTNKV_P-wdecwfwvbYA8L3QJXpZE'
  //const BAR = '75JDwXMhK55jvTjn4p2Tb6Y8epsZg1jybDfB7uYMqcI'
  const result = await readOutbox(warp, wallet, BAR, PST).toPromise()
  console.log(result)
  assert.equal(true, true)
})

test.run()