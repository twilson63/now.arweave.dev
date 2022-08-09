import crocks from 'crocks'

const { Async } = crocks
const connect = (warp, wallet) => contract => warp.pst(contract).connect(wallet).setEvaluationOptions({ allowUnsafeClient: true })
const bundleInteraction = (data) => pst => Async.fromPromise(pst.bundleInteraction.bind(pst))(data)
const readState = pst => Async.fromPromise(pst.readState.bind(pst))()

export default function (warp, wallet, PST_ID, PAIR) {
  return Async.of(PST_ID)
    .map(connect(warp, wallet))
    .chain(bundleInteraction({ function: 'addPair', pair: PAIR }))
    .map(_ => connect(warp, wallet)(PST_ID))
    .chain(readState)
    .map(({ state }) => state.pairs.find(p => p.pair[1] === PAIR) ? ({ ok: true }) : ({ ok: false }))
}