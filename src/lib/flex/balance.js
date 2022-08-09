import crocks from 'crocks'

const { Async } = crocks
const connect = (warp, wallet) => contract => warp.pst(contract).connect(wallet).setEvaluationOptions({ allowUnsafeClient: true })
const viewState = data => pst => Async.fromPromise(pst.viewState.bind(pst))(data)

export default function (warp, wallet, PST_ID, addr) {
  return Async.of(PST_ID)
    .map(connect(warp, wallet))
    .chain(viewState({ function: 'balance', target: addr }))
    .map(({ result }) => result)
}