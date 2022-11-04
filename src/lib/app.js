import * as Market from './market.js'
import * as Asset from './asset.js'
import * as Stamper from './stamper.js'
import * as Flex from './flex.js'
import * as Upload from './upload.js'
import * as Bar from './bar.js'
import * as Collectors from './collectors.js'
import { pathOr, pluck } from 'ramda'


const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});
const { WarpFactory, LoggerFactory } = window.warp;
LoggerFactory.INST.logLevel("error");

const CACHE = 'https://cache.permapages.app'
const GATEWAY = 'https://gateway.redstone.finance'
//const BAR = 'ifGl8H8VrPJbYk8o1jVjXqcveO4uxdyF0ir8uS-zRdU';
const BAR = __BAR_CONTRACT__;
const STAMPCOIN = __STAMP_CONTRACT__;
const warp = WarpFactory.forMainnet();

export const loadCollectors = (assets) => Collectors.getWallets(warp, pluck('asset', assets)).then(wallets => Collectors.getProfiles(arweave, wallets))
export const getPrice = (file) => Upload.getPrice(file.buffer.byteLength).runWith({ arweave }).toPromise()
export const uploadAsset = (file, addr, tags) => Upload.uploadAsset({ file, addr, tags }).runWith({ arweave }).toPromise()

//export const myBar = (addr) => Market.getBalance(BAR, addr).runWith({ warp, wallet: 'use_wallet' }).toPromise()
export const myBar = (addr) => fetch(`${CACHE}/${BAR}`).then(res => res.json()).then(pathOr(0, ['balances', addr]))
export const myRewards = (addr) => Market.getBalance(STAMPCOIN, addr).runWith({ warp, wallet: 'use_wallet' }).toPromise()
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
export const readState = (contract) => fetch(`${CACHE}/${contract}`)
  .then(res => res.ok ? res.json() : Promise.reject('no contract found'))
  .catch(_ => Flex.readState(contract).runWith({ warp }).toPromise())

export const dry = (data) => Flex.createOrder(data).runWith({ warp }).toPromise()
export const readBar = () => fetch(`${CACHE}/${BAR}`)
  .then(res => res.ok ? res.json() : Promise.reject('no contract found'))
  .catch(_ => Flex.readState(BAR).runWith({ warp }).toPromise())

//export const sellAsset = (contract, qty, price) => Flex.sell({ contract, BAR, qty, price }).runWith({ warp }).toPromise()
export const sellAsset = (contract, qty, price) =>
  Promise.resolve(warp.contract(contract).connect('use_wallet').setEvaluationOptions({
    internalWrites: true
  }))
    .then(c => c.writeInteraction({
      function: 'addPair',
      pair: BAR
    }).then(_ => c)
    )
    .then(c => c.writeInteraction({
      function: 'createOrder',
      pair: [contract, BAR],
      qty,
      price
    }).then(_ => c))
    .then(c => c.readState().then(({ cachedValue }) => cachedValue.state))

//Flex.sell2({ contract, BAR, qty, price }).runWith({ arweave }).toPromise()
export const buyAsset = (contract, qty) => {

  // const assetContract = warp.contract(contract).connect('use_wallet').setEvaluationOptions({
  //   internalWrites: true,
  //   allowBigInt: true,
  //   allowUnsafeClient: true
  // })
  // const barContract = warp.contract(BAR).connect('use_wallet').setEvaluationOptions({
  //   internalWrites: true,
  //   allowBigInt: true,
  //   allowUnsafeClient: true
  // })

  return Promise.resolve({ qty, contract })
    .then(async ({ qty, contract }) => {
      const tx = await createTransaction(arweave, BAR, {
        function: 'allow',
        target: contract,
        qty: Number(qty)
      })
      await arweave.transactions.sign(tx, 'use_wallet')
      const transaction = tx.id
      await writeInteraction(tx)

      return { qty, contract, transaction }
    })
    .then(async ({ qty, contract, transaction }) => {
      const tx = await createTransaction(arweave, contract, {
        function: 'createOrder',
        pair: [BAR, contract],
        qty: Number(qty),
        transaction
      }, BAR)
      await arweave.transactions.sign(tx, 'use_wallet')
      await writeInteraction(tx)
      return transaction
    })
    .then(transaction =>
      fetch(`${CACHE}/${BAR}`).then(res => res.json())
        .then(({ claims }) => claims.includes(transaction))
    )

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