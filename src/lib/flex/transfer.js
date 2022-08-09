import crocks from 'crocks'
import balance from './balance.js'
const { Async } = crocks
const connect = (warp, wallet) => contract => warp.pst(contract).connect(wallet).setEvaluationOptions({ allowUnsafeClient: true })
const bundleInteraction = (data) => pst => Async.fromPromise(pst.bundleInteraction.bind(pst))(data)
const readState = pst => Async.fromPromise(pst.readState.bind(pst))()

export default function (warp, wallet, PST_ID, target, qty) {
  return Async.of(PST_ID)
    .map(connect(warp, wallet))
    .chain(bundleInteraction({ function: 'transfer', target, qty }))
    .chain(({ bundlrResponse }) =>
      balance(warp, wallet, PST_ID, target)
        .map((result) => ({ ...result, id: bundlrResponse.id }))
    )
}

