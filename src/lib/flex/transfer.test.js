import { test } from 'uvu'
import * as assert from 'uvu/assert'
import fs from 'fs'
import Arweave from 'arweave'
import { WarpNodeFactory, LoggerFactory } from 'warp-contracts'
import transfer from './transfer.js'

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

test('transfer', async () => {
  const PST = 'W8oWjGyP8CHy-pMJTNKV_P-wdecwfwvbYA8L3QJXpZE'
  //const BAR = '75JDwXMhK55jvTjn4p2Tb6Y8epsZg1jybDfB7uYMqcI'
  const result = await transfer(warp, wallet, PST, PST, 1).toPromise()
  console.log(result)
  assert.equal(result.balance, 1)
})

test.run()