import { Async, ReaderT } from 'crocks'

import addPair from './flex/add-pair.js'
import transfer from './flex/transfer.js'
import createOrder from './flex/create-order.js'

const { ask, of, lift } = ReaderT(Async)


export default async function (contract, qty, price) {
  return ask(({ warp, BAR }) =>
    addPair(warp, 'use_wallet', BAR)
      .chain(transfer(warp, 'use_wallet', contract, contract, qty))
      .chain(id => createOrder(warp, 'use_wallet', contract, id, [contract, BAR], price))
  ).chain(lift)
}