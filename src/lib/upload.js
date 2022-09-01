import { __, assoc, prop } from 'ramda'
import { Async, ReaderT } from 'crocks'

const ONE_HUNDRED_K = 100000
const TEN_THOUSAND = 10000

const { ask, lift } = ReaderT(Async)
const { of, fromPromise, Resolved, Rejected } = Async

const fetchBalance = arweave => fromPromise(arweave.wallets.getBalance.bind(arweave.wallets))
const fetchFromArweave = arweave => fromPromise(arweave.api.get.bind(arweave.api))

export const getPrice = (bytes) =>
  ask(({ arweave }) =>
    fetchFromArweave(arweave)(`price/${bytes + TEN_THOUSAND}`)
      .map(prop('data')))
    .chain(lift)

export const uploadAsset = ({ file, addr, tags }) => ask(({ arweave }) =>
  of({ file, addr, tags, arweave })
    .chain(getBalance)
    .chain(addPrice)
    .chain(canIupload)
    .chain(createTx)
    .chain(dispatch)
).chain(lift)

const signAndPost = ctx => fromPromise(ctx.arweave.transactions.sign.bind(ctx.arweave.transactions))(ctx.tx)
  .chain(_ => fromPromise(ctx.arweave.transactions.post.bind(ctx.arweave.transactions))(ctx.tx))
  .map(assoc('result', __, ctx))


function dispatch(ctx) {
  if (ctx.upload === 'dispatch') {
    return fromPromise(window.arweaveWallet.dispatch.bind(window.arweaveWallet))(ctx.tx)
      .map(assoc('result', __, ctx))
  } else {
    return signAndPost(ctx)
  }
}

const generateTx = ctx => fromPromise(ctx.arweave.createTransaction.bind(ctx.arweave))({ data: ctx.file.buffer })
  .map(assoc('tx', __, ctx))

const mapTags = ctx => {
  map(t => ctx.tx.addTag(t.name, t.value), ctx.tags)
  return ctx
}

function createTx(ctx) {
  return of(ctx)
    .chain(generateTx)
    .map(mapTags)
}

function getBalance(ctx) {
  return fetchBalance(ctx.arweave)(ctx.addr)
    .map(b => assoc('balance', b, ctx))
}

function addPrice(ctx) {
  return fetchFromArweave(`price/${ctx.file.byteLength + TEN_THOUSAND}`)
    .map(prop('data'))
    .map(assoc('price', __, ctx))
}


function canIupload(ctx) {
  if ((ctx.file.byteLength + TEN_THOUSAND > ONE_HUNDRED_K)) {
    if (ctx.balance > ctx.price) {
      return Resolved(assoc('upload', 'post'))
    } else {
      return Rejected(new Error('Not enough AR to upload'))
    }
  } else {
    return Resolved(assoc('upload', 'dispatch'))
  }
}