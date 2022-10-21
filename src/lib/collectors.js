import { compose, concat, flatten, uniq, keys, map, path, pluck, prop, reduce } from 'ramda'

// fetch(`https://cache.permapages.app/${id}`)
// .then(res => res.json())

export async function getWallets(warp, assets) {
  return Promise.all(map(
    id => warp.contract(id).setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true
    }).readState()
      .then(({ cachedValue }) => cachedValue.state)
      .then(compose(keys, prop('balances')))
      .catch(e => [])
    , //warp.contract(id).readState().then(res => keys(res.state.balances)),
    assets
  )).then((...args) => reduce(concat, [], args))
    .then(compose(uniq, flatten))
}

export async function getProfiles(arweave, wallets) {
  const query = `query {
  transactions(
    first: 100,
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