import * as Market from './market.js'
import * as Asset from './asset.js'

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});
const { WarpWebFactory, LoggerFactory } = window.warp;
LoggerFactory.INST.logLevel("error");

const STAMPCOIN = "9nDWI3eHrMQbrfs9j8_YPfLbYJmBodgn7cBCG8bii4o";
const warp = WarpWebFactory.memCached(arweave);

export const listAssets = () => Market.listAssets(STAMPCOIN).runWith({ warp, arweave }).toPromise()
export const getTitle = (id) => Asset.getTitle(id).runWith({ arweave }).toPromise()