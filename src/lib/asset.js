import crocks from 'crocks'
import * as R from 'ramda'

const { find, pathOr, propOr } = R

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