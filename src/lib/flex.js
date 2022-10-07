import { Async, ReaderT } from 'crocks'
import { prop } from 'ramda'

const GATEWAY = 'https://gateway.redstone.finance'
const CACHE = 'https://cache.permapages.app'
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
  const c = warp.contract(contract).setEvaluationOptions({ internalWrites: true, allowUnsafeClient: true })
  return fromPromise(c.readState.bind(c))
  /*
  fetch(`https://cache.permapages.app/${contract}`)
    .then(_ => Promise.reject('foo'))
    .then(res => res.ok ? res.json() : Promise.reject(Error('not found')))
    .catch(() => warp.contract(contract).setEvaluationOptions({ internalWrites: true }).readState())
    */

}

const _doDryRun = (warp, contract) => {
  const c = warp.contract(contract).connect('use_wallet').setEvaluationOptions({
    internalWrites: true,
    allowUnsafeClient: true
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
  .map(prop('state'))

export const sell = ({ contract, BAR, qty, price }) =>
  addPair(contract, BAR)
    .map(always({
      contract,
      qty,
      price,
      pair: [contract, BAR]
    }))
    //.map(x => (console.log('call createorder ', x), x))
    .chain(x => ask(() => fromPromise((x) => new Promise(resolve => setTimeout(() => resolve(x), 5 * 1000)))(x)).chain(lift))
    //.map(x => (console.log(x), x))
    .chain(createOrder).map(always(contract))
    .chain(readState)

export const sell2 = ({ contract, BAR, qty, price }) =>
  ask(({ arweave }) => fromPromise(async (arweave) => {
    // addPair
    const addPairTx = await createTransaction(arweave, contract, {
      function: 'addPair',
      pair: BAR
    })

    await arweave.transactions.sign(addPairTx)
    console.log(await writeInteraction2(addPairTx))

    // createOrder
    const tx = await createTransaction(arweave, contract, {
      function: 'createOrder',
      pair: [contract, BAR],
      price,
      qty
    })

    await arweave.transactions.sign(tx)
    console.log('createOrder', await writeInteraction2(tx))

    return fetch(`${CACHE}/${contract}`).then(res => res.json())
  })(arweave))
    .chain(lift)

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

export const buy2 = ({ contract, BAR, qty }) =>
  ask(({ arweave }) => fromPromise(async (arweave) => {
    // addPair
    const allowTx = await createTransaction(arweave, BAR, {
      function: 'allow',
      target: contract,
      qty
    })

    await arweave.transactions.sign(allowTx)
    const transaction = allowTx.id
    await writeInteraction2(allowTx)

    // createOrder
    const tx = await createTransaction(arweave, contract, {
      function: 'createOrder',
      pair: [BAR, contract],
      transaction,
      qty: Number(qty)
    })

    await arweave.transactions.sign(tx)
    console.log('createOrder', await writeInteraction2(tx))

    return fetch(`${CACHE}/${contract}`).then(res => res.json())
  })(arweave))
    .chain(lift)

async function createTransaction(arweave, contract, input) {
  const tx = await arweave.createTransaction({
    data: Math.random().toString().slice(-4),
    reward: '72600854',
    last_tx: 'p7vc1iSP6bvH_fCeUFa9LqoV5qiyW-jdEKouAT0XMoSwrNraB9mgpi29Q10waEpO'
  })

  tx.addTag('App-Name', 'SmartWeaveAction')
  tx.addTag('App-Version', '0.3.0')
  tx.addTag('Contract', contract)
  tx.addTag('Input', JSON.stringify(input))
  tx.addTag('SDK', 'Warp')

  return tx
}

function writeInteraction2(tx) {
  return fetch(`${GATEWAY}/gateway/sequencer/register`, {
    method: 'POST',
    body: JSON.stringify(tx),
    headers: {
      'Accept-Encoding': 'gzip, deflate, br',
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  }).then(res => res.ok ? res.json() : Promise.reject(res))
}