import { Async, ReaderT } from 'crocks'

import readOutbox from './flex/read-outbox.js'
import transfer from './flex/transfer.js'
import createOrder from './flex/create-order.js'

const { ask, of, lift } = ReaderT(Async)


export default async function (contract, qty) {
  return ask(({ warp, BAR }) => transfer(warp, 'use_wallet', BAR, contract, qty)
    .chain(id => createOrder(warp, 'use_wallet', contract, id, [BAR, contract], price))
    .chain(id => readOutbox(warp, 'use_wallet', contract, id))
  ).chain(lift)
}