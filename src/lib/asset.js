import crocks from 'crocks'
import * as R from 'ramda'
import { getProfile } from './stamper.js'
import Stamps from '@permaweb/stampjs'

const { find, map, pathOr, propOr, propEq, prop, path, compose, head, pluck } = R

const { Async, ReaderT } = crocks
const { of, ask, lift } = ReaderT(Async)

const runQuery = arweave => query => Async.fromPromise(arweave.api.post.bind(arweave.api))('graphql', { query })
const connect = (warp, wallet) => contract => warp.pst(contract).connect(wallet).setEvaluationOptions({ allowUnsafeClient: true })

export const stamp = (id) => ask(({ warp, contract }) =>
  Async.of(contract)
    .chain(_ => Async.fromPromise(Stamps.init({ warp }).stamp.bind(Stamps.init({ warp })))(id))
    /*
    .chain(pst => Async.fromPromise(pst.writeInteraction.bind(pst))({
      function: 'stamp',
      transactionId: id,
      timestamp: Date.now()
    }))
    */
    .toPromise()
)

export const getTitle = (id) => ask(({ arweave }) =>
  Async.of(id)
    .map(buildAssetQuery)
    .chain(runQuery(arweave))
    .map(pathOr({ tags: [] }, ['data', 'data', 'transaction']))
    .map(({ tags }) => find(t => t.name === 'Title', tags) || find(t => t.name === 'Page-Title', tags))
    .map(propOr('Unknown', 'value'))
).chain(lift)

export const getOwner = (id) => ask(({ arweave }) =>
  Async.of(id)
    .map(buildAssetQuery)
    .chain(runQuery(arweave))
    .map(path(['data', 'data', 'transaction', 'owner', 'address']))
    .map(buildProfileQuery)
    .chain(runQuery(arweave))
    .map(pathOr({ tags: [] }, ['data', 'data', 'transactions', 'edges']))
    .map(compose(propOr('unknown', 'id'), head, pluck('node')))
    .chain((id) => id === 'unknown' ? Async.Resolved({}) : Async.fromPromise(arweave.api.get.bind(arweave.api))(id)).map(propOr({}, 'data'))
).chain(lift)

export const getStampers = assetId => ask(({ arweave, assets }) =>
  Async.of(find(propEq('asset', assetId), assets))
    .map(prop('stampers'))
    .chain(stampers => Async.all(
      map(id => getProfile(id).runWith({ arweave }), stampers)
    ))

).chain(lift)

function buildAssetQuery(id) {
  return `query {
    transaction(id: "${id}") {
      owner {
        address
      }
      tags {
        name
        value
      }
    }
  }
  `
}

function buildProfileQuery(id) {
  return `query {
    transactions(
      first: 1,
      owners:["${id}"],
      tags: [
        {name: "Protocol", values: ["PermaProfile-v0.1"]}
      ]) {
        edges {
          node {
            id
            owner {
              address
            }
            tags {
              name
              value
            }
          }
        }
      }
  }
  `
}