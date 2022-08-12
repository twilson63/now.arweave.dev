import crocks from 'crocks'
import * as R from 'ramda'
import { getProfile } from './stamper.js'

const { find, map, pathOr, propOr, propEq, prop } = R

const { Async, ReaderT } = crocks
const { of, ask, lift } = ReaderT(Async)

const runQuery = arweave => query => Async.fromPromise(arweave.api.post.bind(arweave.api))('graphql', { query })

export const getTitle = (id) => ask(({ arweave }) =>
  Async.of(id)
    .map(buildTitleQuery)
    .chain(runQuery(arweave))
    .map(pathOr({ tags: [] }, ['data', 'data', 'transaction']))
    .map(({ tags }) => find(t => t.name === 'Page-Title', tags))
    .map(propOr('Unknown', 'value'))
).chain(lift)

export const getStampers = assetId => ask(({ arweave, assets }) =>
  Async.of(find(propEq('asset', assetId), assets))
    .map(prop('stampers'))
    .chain(stampers => Async.all(
      map(id => getProfile(id).runWith({ arweave }), stampers)
    ))

).chain(lift)

function buildTitleQuery(id) {
  return `query {
    transaction(id: "${id}") {
      tags {
        name
        value
      }
    }
  }
  `
}