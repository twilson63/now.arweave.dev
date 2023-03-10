import crocks from 'crocks'
import * as R from 'ramda'

const { always, find, prop, pathOr, propOr, pluck, compose, head, path } = R

const { Async, ReaderT } = crocks
const { of, ask, lift } = ReaderT(Async)
const unknown = 'QXWcEttetcZX-1IbApTdMdf2XrwqiXOSutCb37r_dAc'
const runQuery = arweave => query => Async.fromPromise(arweave.api.post.bind(arweave.api))('graphql', { query })

export const isVouched = (addr) => ask(({ arweave }) =>
  Async.fromPromise(arweave.api.post.bind(arweave.api))('graphql', {
    query: `
query {
  transactions(tags: {name: "Vouch-For", values: ["${addr}"]}) {
    edges {
      node {
        id
      }
    }
  }
}    
    `
  })
    .map(compose(
      pluck('node'),
      path(['data', 'data', 'transactions', 'edges'])
    )).map(nodes => nodes.length > 0 ? true : false)
).chain(lift)

export const getProfile = (id) => ask(({ arweave }) =>
  Async.of(id)
    .map(buildProfileQuery)
    .chain(runQuery(arweave))
    .map(pathOr({ tags: [] }, ['data', 'data', 'transactions', 'edges']))
    .map(compose(prop('id'), head, pluck('node')))
    .chain((id) => id === 'unknown' ? Async.Resolved({}) : Async.fromPromise(arweave.api.get.bind(arweave.api))(id)).bimap(always({}), propOr({}, 'data'))

  //.map(({ tags }) => find(t => t.name === 'Page-Title', tags))
  //.map(propOr('Unknown', 'value'))
).chain(lift)


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