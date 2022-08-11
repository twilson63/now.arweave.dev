import { test } from 'uvu'
import * as assert from 'uvu/assert'
import Arweave from 'arweave'
import { getTitle } from './asset.js'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

test('getTitle', async () => {
  const results = await getTitle('SdjIH1eC-kT2JCxvnbexJxaxxf8MUOYHsvAZByGk16U')
    .runWith({ arweave }).toPromise()
  console.log(results)
  assert.equal(results, "Scott's Permapage")
})

test.run()