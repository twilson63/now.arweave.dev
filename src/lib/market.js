import crocks from 'crocks'
import * as R from 'ramda'

const { groupBy, reduce, values, keys, reverse } = R

const { Async, ReaderT } = crocks
const { of, ask, lift } = ReaderT(Async)

const connect = (warp, wallet) => contract => warp.pst(contract).connect(wallet).setEvaluationOptions({ allowUnsafeClient: true })

export const listAssets = (contract) =>
  of(contract)
    .chain(contract =>
      ask(({ warp, wallet }) => Async.of(connect(warp, wallet)(contract))
        .chain(pst => Async.fromPromise(pst.readState.bind(pst))())
        .map(({ state }) => state.stamps)
        .map(values)
        .map(reverse)
        .map(groupBy((s) => s.asset))
        .map(assets => reduce((a, x) => [
          ...a,
          {
            asset: x,
            count: assets[x].length,
            stampers: assets[x].map((o) => o.address),
          },
        ], [], keys(assets)
        ))
      ).chain(lift)
    )