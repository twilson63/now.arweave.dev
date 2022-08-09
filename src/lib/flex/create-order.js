import crocks from 'crocks'

const { Async } = crocks
const connect = (warp, wallet) => contract => warp.pst(contract).connect(wallet).setEvaluationOptions({ allowUnsafeClient: true })
const createOrder = (data) => pst => Async.fromPromise(pst.bundleInteraction.bind(pst))(data)
const readState = pst => Async.fromPromise(pst.readState.bind(pst))()

// pair should be [src, dest] or [xCoin, bAR]

export default function (warp, wallet, PST_ID, transaction, pair, price) {
  return Async.of(PST_ID)
    .map(connect(warp, wallet))
    .chain(createOrder({ function: 'createOrder', transaction, pair, price }))
    .map(_ => connect(warp, wallet)(PST_ID))
    .chain(readState)
    .map(_ => (console.log(JSON.stringify(_, null, 2)), _))
}

