import crocks from 'crocks'
import balance from './balance.js'
const { Async } = crocks
const connect = (warp, wallet) => contract => warp.pst(contract).connect(wallet).setEvaluationOptions({ allowUnsafeClient: true })
const bundleInteraction = (data) => pst => Async.fromPromise(pst.bundleInteraction.bind(pst))(data)
const readState = pst => Async.fromPromise(pst.readState.bind(pst))()

export default function (warp, wallet, PST, contract, qty) {
  return Async.of(PST)
    .map(connect(warp, wallet))
    .chain(bundleInteraction({ function: 'readOutbox', contract }))
    .chain(({ bundlrResponse }) =>
      readState(connect(warp, wallet))
    )
}

