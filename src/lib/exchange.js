import { Async, ReaderT } from 'crocks'

const AsyncReader = ReaderT(Async)

const { ask, of, lift } = AsyncReader

const BAR = ''

const pst = (warp) => (assetId) => Async.of(assetId)
  .map(id => warp.pst(id).connect('use_wallet'))

const configureAddPair = (pst) => ({ pst, function: 'addPair', pair: BAR })

const writeInteraction = ({ pst, function, pair }) =>
  Async.fromPromise(pst.writeInteraction.bind(pst))({ function, pair })

export function setup(assetId) {
  return ask(({ warp }) =>
    pst(warp)(assetId)
      .map(configureAddPair)
      .chain(writeInteraction)
  ).chain(lift)
}

// calculate transaction
// if the current supply 10000 is available for 10 BAR
// if I choose to send 1 BAR, then 1000 tokens should be transferred
// to my wallet.

export async function buy(assetId, addr, qty) {
  return ask(({ warp }) =>
    pst(warp)(BAR)
      .map(pst => ({ pst, function: 'balance', target: addr }))
      .chain(viewState) // get balance
      .chain(({ pst, balance }) => balance > qty ? Async.Resolved(pst) : Async.Rejected(new Error('Not enough BAR in Account!')))
      // check addr bar balance is available
      .chain(pst => ({ pst, function: transfer, target: assetId }))
      // transfer bar to contractId
      .chain(writeInteraction)
      // confirmbalance transfer via ReadState
      // then call create order
      // createOrder on contract with txId and pair
      .chain(txId => pst(warp)(assetId)
      ).chain(lift)

}

export async function sell(assetId, addr, qty, price) {
  // check addr balance is available
  // transfer bar to assetId 
  // createOrder price
}

export async function finalize(assetId) {
  // readOutbox
  return ask(({ warp }) => pst(warp)(BAR)
    .map(configureReadOutbox)
  )
}