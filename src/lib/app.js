import * as Market from './market.js'
import * as Asset from './asset.js'
import * as Stamper from './stamper.js'
import * as Flex from './flex.js'
import * as Upload from './upload.js'
import * as Bar from './bar.js'
import * as Collectors from './collectors.js'
import { pathOr, pluck } from 'ramda'
import { getHost } from './utils.js'

const host = getHost(globalThis.location.hostname)

let _config = {
  host: host,
  port: 443,
  protocol: "https",
}

const arweave = Arweave.init(_config);

const { WarpFactory, LoggerFactory } = window.warp;
LoggerFactory.INST.logLevel("fatal");

const CACHE = 'https://cache.permapages.app'
const GATEWAY = 'https://gateway.warp.cc'
const DRE = 'https://dre-1.warp.cc'
//const BAR = 'rO8f4nTVarU6OtU2284C8-BIH6HscNd-srhWznUllTk';
const BAR = __BAR_CONTRACT__;
const STAMPCOIN = __STAMP_CONTRACT__;

const warp = WarpFactory.forMainnet();

export const loadCollectors = (assets) => Collectors.getWallets(warp, pluck('asset', assets)).then(wallets => Collectors.getProfiles(arweave, wallets))
export const getPrice = (file) => Upload.getPrice(file.buffer.byteLength).runWith({ arweave }).toPromise()
export const uploadAsset = (file, addr, tags) => Upload.uploadAsset({ file, addr, tags }).runWith({ arweave }).toPromise()

export const myBar = (addr) => warp.contract(BAR).setEvaluationOptions({
  allowBigInt: true,
  internalWrites: true,
  unsafeClient: 'skip',
  remoteStateSyncEnabled: true
})
  .readState()

  .then(({ cachedValue }) => cachedValue.state.balances[addr])
  .catch(e => 'N/A')
export const myRewards = (addr) => warp.contract(STAMPCOIN).setEvaluationOptions({
  allowBigInt: true,
  internalWrites: true,
  unsafeClient: 'skip',
  remoteStateSyncEnabled: true,
  remoteStateSyncSource: 'https://dre-5.warp.cc/contract'
})
  .readState()
  // .then(x => {
  //   console.log('STAMP balances', x.cachedValue.state.balances)
  //   console.log('STAMP address', addr)
  //   console.log('STAMP balance', x.cachedValue.state.balances[addr])
  //   return x
  // })
  .then(({ cachedValue }) => cachedValue.state.balances[addr])
  //.then(x => (console.log('STAMP ', x), x))
  .catch(e => {
    console.log(e)
    return null
  })


//Market.getBalance(STAMPCOIN, addr).runWith({ warp, wallet: 'use_wallet' }).toPromise()
export const whatsHot = (days) => Market.whatsHot(STAMPCOIN, days).runWith({ warp, wallet: 'use_wallet', arweave }).toPromise()
export const whatsNew = (days) => Market.whatsNew(STAMPCOIN, days).runWith({ warp, arweave, wallet: 'use_wallet' }).toPromise()
export const getTitle = (id) => Asset.getTitle(id).runWith({ arweave }).toPromise()
export const listStampers = () => Market.listStampers(STAMPCOIN).runWith({ warp, arweave }).toPromise()
export const getProfile = (id) => Stamper.getProfile(id).runWith({ arweave }).toPromise()
export const getStampers = (assetId, assets) => Asset.getStampers(assetId).runWith({ arweave, assets }).toPromise()
export const stamp = (id) => Asset.stamp(id).runWith({ warp, contract: STAMPCOIN }).toPromise()
export const getOwner = (id) => Asset.getOwner(id).runWith({ arweave }).toPromise()
export const isVouched = (addr) => Stamper.isVouched(addr).runWith({ arweave }).toPromise()

export const addPair = (contract, pair) =>
  warp.contract(contract).connect('use_wallet').setEvaluationOptions({
    internalWrites: true
  }).writeInteraction({
    function: 'addPair',
    pair: BAR
  })

export const createOrder = (data) => Flex.createOrder(data).runWith({ warp }).toPromise()
export const allowOrder = (contract, target, qty) => Flex.allow(contract, target, qty).runWith({ warp }).toPromise()
export const readState = async (contract) => {
  const c = await warp.contract(contract).syncState('https://cache.permapages.app/contract', { validity: true })
  return c.setEvaluationOptions({ internalWrites: true, allowBigInt: true })
    .readState().then(({ cachedValue }) => cachedValue.state)

}


export const dry = (data) => Flex.createOrder(data).runWith({ warp }).toPromise()
export const readBar = () => fetch(`${CACHE}/${BAR}`)
  .then(res => res.ok ? res.json() : Promise.reject('no contract found'))
  .catch(_ => Flex.readState(BAR).runWith({ warp }).toPromise())

//export const sellAsset = (contract, qty, price) => Flex.sell({ contract, BAR, qty, price }).runWith({ warp }).toPromise()
export const sellAsset = async (contract, qty, price) => {
  await doSyncState(BAR)
  await doSyncState(contract)
  // const c = await warp.contract(contract).syncState(CACHE + '/contract', { validity: true })
  return Promise.resolve(warp.contract(contract).connect('use_wallet').setEvaluationOptions({
    internalWrites: true
  }))

    .then(c => c.writeInteraction({
      function: 'addPair',
      pair: BAR
    }, { strict: true }).catch(e => c).then(_ => c)
    )
    .then(c => c.writeInteraction({
      function: 'createOrder',
      pair: [contract, BAR],
      qty,
      price: Math.floor(price) > 1 ? Math.floor(price) : 1
    }, { strict: true })
      .then(_ => c))
    .then(c => c.readState().then(({ cachedValue }) => cachedValue.state))
}
//Flex.sell2({ contract, BAR, qty, price }).runWith({ arweave }).toPromise()
export const buyAsset = async (contract, qty) => {
  await doSyncState(BAR)
  await doSyncState(contract)

  const assetContract = warp.contract(contract).connect('use_wallet').setEvaluationOptions({
    internalWrites: true,
    allowBigInt: true,
    unsafeClient: 'allow'
  })
  const barContract = warp.contract(BAR).connect('use_wallet').setEvaluationOptions({
    internalWrites: true,
    allowBigInt: true,
    unsafeClient: 'allow'
  })
  return barContract.writeInteraction({
    function: 'allow',
    target: contract,
    qty: Number(qty)
  }, { strict: true })
    .then(x => (console.log(x), x))
    .then(result => assetContract.writeInteraction({
      function: 'createOrder',
      pair: [BAR, contract],
      qty: Number(qty),
      transaction: result.originalTxId
    }, { strict: true })
      .then(r => barContract.readState())
      .then(x => (console.log(x), x))
      .then(({ cachedValue }) => cachedValue.state.claims.includes(result.originalTxId))
    )
  // return Promise.re  solve({ qty, contract })
  // .then(async ({ qty, contract }) => {
  //   const tx = await createTransaction(arweave, BAR, {
  //     function: 'allow',
  //     target: contract,
  //     qty: Number(qty)
  //   })
  //   await arweave.transactions.sign(tx, 'use_wallet')
  //   const transaction = tx.id
  //   await writeInteraction(tx)

  //   return { qty, contract, transaction }
  // })
  // .then(async ({ qty, contract, transaction }) => {
  //   const tx = await createTransaction(arweave, contract, {
  //     function: 'createOrder',
  //     pair: [BAR, contract],
  //     qty: Number(qty),
  //     transaction
  //   }, BAR)
  //   await arweave.transactions.sign(tx, 'use_wallet')
  //   await writeInteraction(tx)
  //   return transaction
  // })
  // .then(transaction =>
  //   fetch(`${CACHE}/${BAR}`).then(res => res.json())
  //     .then(({ claims }) => claims.includes(transaction))
  // )

}

//Flex.buy2({ contract, BAR, qty }).runWith({ arweave }).toPromise()

export const mintBar = (ar) => Bar.mint(arweave, BAR, ar)
export const arBalance = (addr) => Bar.arbalance(arweave, addr)


async function createTransaction(arweave, contract, input, interact = null) {
  const tx = await arweave.createTransaction({
    data: Math.random().toString().slice(-4),
    reward: '72600854',
    last_tx: 'p7vc1iSP6bvH_fCeUFa9LqoV5qiyW-jdEKouAT0XMoSwrNraB9mgpi29Q10waEpO'
  })

  if (interact) {
    tx.addTag('Interact-Write', interact)
  }
  tx.addTag('App-Name', 'SmartWeaveAction')
  tx.addTag('App-Version', '0.3.0')
  tx.addTag('Contract', contract)
  tx.addTag('Input', JSON.stringify(input))
  tx.addTag('SDK', 'Warp')

  return tx
}

function writeInteraction(tx) {
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

async function doSyncState(c) {
  await (await warp.contract(c).syncState(CACHE + '/contract', { validity: true })).setEvaluationOptions({
    internalWrites: true,
    allowBigInt: true,
    unsafeClient: 'allow'
  }).readState()

}