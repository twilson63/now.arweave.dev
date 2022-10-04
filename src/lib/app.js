import * as Market from './market.js'
import * as Asset from './asset.js'
import * as Stamper from './stamper.js'
import * as Flex from './flex.js'
import * as Upload from './upload.js'
import * as Bar from './bar.js'
import * as Collectors from './collectors.js'


const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});
const { WarpWebFactory, LoggerFactory } = window.warp;
LoggerFactory.INST.logLevel("error");

const CACHE = 'https://cache.permapages.app'
const BAR = 'mMffEC07TyoAFAI_O6q_nskj2bT8n4UFvckQ3yELeic';
const STAMPCOIN = "aSMILD7cEJr93i7TAVzzMjtci_sGkXcWnqpDkG6UGcA";
const warp = WarpWebFactory.memCached(arweave);

export const getCollectors = (wallets) => Collectors.getProfiles(arweave, wallets)
export const getPrice = (file) => Upload.getPrice(file.buffer.byteLength).runWith({ arweave }).toPromise()
export const uploadAsset = (file, addr, tags) => Upload.uploadAsset({ file, addr, tags }).runWith({ arweave }).toPromise()

export const myBar = (addr) => Market.getBalance(BAR, addr).runWith({ warp, wallet: 'use_wallet' }).toPromise()
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

export const addPair = (contract, pair) => Flex.addPair(contract, pair).runWith({ warp }).toPromise()
export const createOrder = (data) => Flex.createOrder(data).runWith({ warp }).toPromise()
export const allowOrder = (contract, target, qty) => Flex.allow(contract, target, qty).runWith({ warp }).toPromise()
export const readState = (contract) => fetch(`${CACHE}/${contract}`)
  .then(res => res.ok ? res.json() : Promise.reject('no contract found'))
  .catch(_ => Flex.readState(contract).runWith({ warp }).toPromise())

export const dry = (data) => Flex.createOrder(data).runWith({ warp }).toPromise()
export const readBar = () => fetch(`${CACHE}/${BAR}`)
  .then(res => res.ok ? res.json() : Promise.reject('no contract found'))
  .catch(_ => Flex.readState(BAR).runWith({ warp }).toPromise())

export const sellAsset = (contract, qty, price) => Flex.sell({ contract, BAR, qty, price }).runWith({ warp }).toPromise()
export const buyAsset = //(contract, qty) => Flex.buy({ contract, BAR, qty }).runWith({ warp }).toPromise()
  async (contract, qty) => {
    const bar = warp.contract(BAR).connect('use_wallet').setEvaluationOptions({
      internalWrites: true,
      allowUnsafeClient: true
    })
    const asset = warp.contract(contract).connect('use_wallet').setEvaluationOptions({
      internalWrites: true,
      allowUnsafeClient: true
    })
    const allowResult = await bar.bundleInteraction({ function: 'allow', target: contract, qty: Number(qty) })
    // wait 15 secs to allow claimable record to show
    await new Promise(resolve => setTimeout(resolve, 15 * 1000))

    const barState = await bar.readState()
    // console.log('claimables', JSON.stringify(barState.state.claimables))
    // console.log('txId', allowResult.originalTxId)
    const orderResult = await asset.bundleInteraction({ function: 'createOrder', qty: Number(qty), pair: [BAR, contract], transaction: allowResult.originalTxId })
    const contractState = await asset.readState()

    return contractState.state

  }

export const mintBar = (ar) => Bar.mint(arweave, BAR, ar)
export const arBalance = (addr) => Bar.arbalance(arweave, addr)
