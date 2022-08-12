import { test } from 'uvu'
import * as assert from 'uvu/assert'
import Arweave from 'arweave'
import { getProfile } from './stamper.js'

const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https'
})

test('getProfile', async () => {
  const results = await getProfile('vh-NTHVvlKZqRxc8LyyTNok65yQ55a_PJ1zWLb9G2JI')
    .runWith({ arweave }).toPromise()
  console.log(results)
  assert.equal(true, true)
})

test.run()