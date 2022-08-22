import * as Market from './market.js'
import * as Asset from './asset.js'
import * as Stamper from './stamper.js'


const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});
const { WarpWebFactory, LoggerFactory } = window.warp;
LoggerFactory.INST.logLevel("error");

const STAMPCOIN = "aSMILD7cEJr93i7TAVzzMjtci_sGkXcWnqpDkG6UGcA";
const warp = WarpWebFactory.memCached(arweave);

export const listAssets = () => Market.listAssets(STAMPCOIN).runWith({ warp, arweave, wallet: 'use_wallet' }).toPromise()
export const getTitle = (id) => Asset.getTitle(id).runWith({ arweave }).toPromise()
export const listStampers = () => Market.listStampers(STAMPCOIN).runWith({ warp, arweave }).toPromise()
export const getProfile = (id) => Stamper.getProfile(id).runWith({ arweave }).toPromise()
export const getStampers = (assetId, assets) => Asset.getStampers(assetId).runWith({ arweave, assets }).toPromise()
export const stamp = (id) => Asset.stamp(id).runWith({ warp, contract: STAMPCOIN }).toPromise()
export const isVouched = (addr) => Stamper.isVouched(addr).runWith({ arweave }).toPromise()