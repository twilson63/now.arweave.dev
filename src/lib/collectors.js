import { compose, map, path, pluck, prop } from 'ramda'

export async function getProfiles(arweave, wallets) {
  const query = `query {
  transactions(
    first: 1,
    owners:[${map(id => `"${id}"`, wallets)}],
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
}`

  return arweave.api.post('graphql', { query })
    .then(compose(
      pluck('id'),
      pluck('node'),
      path(['data', 'data', 'transactions', 'edges'])
    ))
    .then(ids => Promise.all(map(id => arweave.api.get(id).then(prop('data')), ids)))
    .then(x => (console.log(x), x))
}