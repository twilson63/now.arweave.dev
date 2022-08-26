import { Async, ReaderT } from 'crocks'
import { prop } from 'ramda'

const { fromPromise } = Async
const { of, ask, lift } = ReaderT(Async)

const always = v => _ => v

/*
const writeInteraction = (contract) => ask(({ warp }) => {
  const c = warp.contract(contract).connect('use_wallet')
  return fromPromise(c.writeInteraction.bind(c))
})
*/
const _doWrite = (warp, contract) => {
  const c = warp.contract(contract).connect('use_wallet').setEvaluationOptions({
    internalWrites: true
  })
  return fromPromise(c.bundleInteraction.bind(c))
}
const _doRead = (warp, contract) => {
  return fromPromise(() =>
    fetch(`https://cache.permapages.app/${contract}`)
      //.then(_ => Promise.reject('foo'))
      .then(res => res.ok ? res.json() : Promise.reject(Error('not found')))
      .catch(() => warp.contract(contract).setEvaluationOptions({ internalWrites: true }).readState())
  )
}

const _doDryRun = (warp, contract) => {
  const c = warp.contract(contract).connect('use_wallet').setEvaluationOptions({
    internalWrites: true
  })
  return fromPromise(c.dryWrite.bind(c))
}

const writeInteraction = contract => args => ask(({ warp }) => _doWrite(warp, contract)(args)).chain(lift)
const read = (contract) => ask(({ warp }) => _doRead(warp, contract)()).chain(lift)
const dryWrite = (contract) => args => ask(({ warp }) => _doDryRun(warp, contract)(args)).chain(lift)

export const addPair = (contract, pair) =>
  of({ function: 'addPair', pair })
    .chain(writeInteraction(contract))


export const allow = (contract, target, qty) =>
  of({ function: 'allow', target, qty })
    .chain(writeInteraction(contract)).map(prop('originalTxId'))

export const createOrder = ({ contract, qty, price, pair, transaction = '' }) =>
  of({ function: 'createOrder', qty, price, pair, transaction })
    .chain(writeInteraction(contract))

export const dry = ({ contract, qty, price, pair, transaction = '' }) =>
  of({ function: 'createOrder', qty, price, pair, transaction })
    .chain(dryWrite(contract))

export const readState = (contract) => read(contract)

export const sell = ({ contract, BAR, qty, price }) =>
  addPair(contract, BAR)
    .map(always({
      contract,
      qty,
      price,
      pair: [contract, BAR]
    }))
    .map(x => (console.log('call createorder ', x), x))
    .chain(createOrder).map(always(contract))
    .chain(readState)

export const buy = ({ contract, BAR, qty }) =>
  allow(BAR, contract, qty)
    .map(transaction => ({
      contract,
      qty,
      transaction,
      pair: [BAR, contract]
    }))
    .chain(createOrder).map(always(contract))
    .chain(readState)