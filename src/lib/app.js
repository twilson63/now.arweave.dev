import * as Market from './market.js'
import * as Asset from './asset.js'
import * as Stamper from './stamper.js'
import * as Flex from './flex.js'


const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});
const { WarpWebFactory, LoggerFactory } = window.warp;
LoggerFactory.INST.logLevel("error");

//const BAR = "ywE43lMzhO69CJQtrWqxa3K2Ip8EfUanqUQULbGslpc";
const BAR = 'LJbfMMltmCa_pwhA0QMY1XYK0e-xHtNQYcnHHhtCcNs';
const STAMPCOIN = "aSMILD7cEJr93i7TAVzzMjtci_sGkXcWnqpDkG6UGcA";
const warp = WarpWebFactory.memCached(arweave);

export const listAssets = () => Market.listAssets(STAMPCOIN).runWith({ warp, arweave, wallet: 'use_wallet' }).toPromise()
export const getTitle = (id) => Asset.getTitle(id).runWith({ arweave }).toPromise()
export const listStampers = () => Market.listStampers(STAMPCOIN).runWith({ warp, arweave }).toPromise()
export const getProfile = (id) => Stamper.getProfile(id).runWith({ arweave }).toPromise()
export const getStampers = (assetId, assets) => Asset.getStampers(assetId).runWith({ arweave, assets }).toPromise()
export const stamp = (id) => Asset.stamp(id).runWith({ warp, contract: STAMPCOIN }).toPromise()
export const isVouched = (addr) => Stamper.isVouched(addr).runWith({ arweave }).toPromise()

export const addPair = (contract, pair) => Flex.addPair(contract, pair).runWith({ warp }).toPromise()
export const createOrder = (data) => Flex.createOrder(data).runWith({ warp }).toPromise()
export const allowOrder = (contract, target, qty) => Flex.allow(contract, target, qty).runWith({ warp }).toPromise()
export const readState = (contract) => Flex.readState(contract).runWith({ warp }).toPromise()
export const dry = (data) => Flex.createOrder(data).runWith({ warp }).toPromise()
export const readBar = () => Flex.readState(BAR).runWith({ warp }).toPromise()

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