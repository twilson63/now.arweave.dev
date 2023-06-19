import crocks from 'crocks'
import * as R from 'ramda'
import { isAfter, fromUnixTime, subDays } from 'date-fns'

const { take, propOr, pathOr, sortWith, ascend, descend, __, filter, gt, compose, groupBy, reduce, values, keys, reverse, prop, identity, pluck, path, map, find, propEq, uniq, concat } = R

const { Async, ReaderT } = crocks
const { of, ask, lift } = ReaderT(Async)
const DAY = (24 * 60 * 60 * 1000)

const connect = (warp, wallet) => contract => warp.pst(contract).connect(wallet).setEvaluationOptions({
  unsafeClient: 'allow',
  internalWrites: true,
  allowBigInt: true
})

const getState = (contract, warp) => {
  return Async.fromPromise(() =>
    warp.contract(contract).setEvaluationOptions({
      internalWrites: true,
      allowBigInt: true,
      unsafeClient: 'allow',
      remoteStateSyncEnabled: true,
      remoteStateSyncSource: 'https://dre-5.warp.cc/contract'
    }).readState().then(({ cachedValue }) => cachedValue.state)
  )()
}
export const getBalance = (contract, addr) => ask(({ warp, wallet }) =>
  getState(contract, warp)
    .map(pathOr(0, ['balances', addr]))
    .map(x => (console.log(x), x))

).chain(lift)

export const whatsHot = (contract, days = 1) => ask(({ arweave }) =>
  get100StampTxs(arweave)
    .map(buildStampObjects)
    .chain(createItems(arweave))
    .chain(loadProfiles(arweave))
    .map(filter(a => a.title))
    .map(sortWith([descend(prop('count'))]))
).chain(lift)

export const whatsNew = (contract, days = 1) => ask(({ arweave }) =>
  get100StampTxs(arweave)
    .map(buildStampObjects)
    .chain(createItems(arweave))
    .chain(loadProfiles(arweave))
    .map(filter(a => a.title))
    .map(sortWith([descend(prop('height'))]))
).chain(lift)

export const listStampers = (contract) =>
  ask(({ warp, wallet }) =>
    getState(contract, warp)
      .bichain(
        _ => connect(warp, wallet)(contract)
          .chain(pst => Async.fromPromise(pst.readState.bind(pst))())
          .map(prop('state')),
        Async.Resolved
      )
      .map(prop('stamps'))
      .map(values)
      .map(reverse)

      .map(groupBy((s) => s.address))
      .map(stampers => reduce((a, x) => [
        ...a,
        {
          stamper: x,
          count: stampers[x].length,
          assets: stampers[x].map((o) => o.asset),
        },
      ], [], keys(stampers)
      ))
  )
    .chain(lift)

// get asset Page-Title and asset stampers in batches to avoid so many gql calls.

const buildQuery = (ids) => `
  query {
    transactions(first: 100, ids: ${JSON.stringify(ids)}) {
      edges {
        node {
          id
          tags {
            name 
            value
          }
          block {
            height
          }
        }
      }
    }
  }
`

const buildProfileQuery = (owners) => `
  query {
    transactions(first: 100, owners: ${JSON.stringify(owners)}, tags: [
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

function buildStampObjects(response) {
  return compose(
    assets => reduce((a, x) => {
      const stampers = uniq(assets[x].map((o) => o.address))
      return [
        ...a,
        {
          asset: x,
          count: stampers.length,
          stampers
        },
      ]
    }, [], keys(assets)
    ),
    groupBy(prop('asset')),
    filter(n => n.asset !== ""),
    map(node => {
      const address = node.tags.find(t => t.name === 'Sequencer')
        ? node.tags.find(t => t.name === 'Sequencer-Owner').value
        : node.owner.address

      return {
        asset: node.tags.find(t => t.name === 'Data-Source').value,
        height: node.block?.height ? node.block.height : Infinity,
        address
      }
    }),
    pluck('node'),
    path(['data', 'data', 'transactions', 'edges'])
  )(response)
}

function createItems(arweave) {
  return assets => {
    const ids = pluck('asset', assets)
    const query = buildQuery(ids)
    return Async.fromPromise(arweave.api.post.bind(arweave.api))('graphql', { query })
      .map(compose(
        map(n => ({
          id: n.id,
          title: prop('value', find(propEq('name', 'Title'), n.tags) || find(propEq('name', 'Page-Title'), n.tags)),
          description: propOr('', 'value', find(propEq('name', 'Description'), n.tags)),
          type: propOr('page', 'value', find(propEq('name', 'Type'), n.tags)),
          renderWith: propOr('', 'value', find(propEq('name', 'Render-With'), n.tags)),
          height: n.block?.height ? n.block?.height : Infinity
        })),
        pluck('node'),
        path(['data', 'data', 'transactions', 'edges'])
      ))

      .map(nodes => {
        const getTitle = id => compose(prop('title'), find(propEq('id', id)))(nodes)
        const getDescription = id => compose(prop('description'), find(propEq('id', id)))(nodes)
        const getType = id => compose(prop('type'), find(propEq('id', id)))(nodes)
        const getRenderWith = id => compose(prop('renderWith'), find(propEq('id', id)))(nodes)
        const getHeight = id => compose(prop('height'), find(propEq('id', id)))(nodes)
        return map(a => ({
          ...a,
          title: getTitle(a.asset),
          description: getDescription(a.asset),
          renderWith: getRenderWith(a.asset),
          type: getType(a.asset),
          height: getHeight(a.asset)
        }), assets)
      })
  }
}

function get100StampTxs(arweave) {
  const query = Async.fromPromise(arweave.api.post.bind(arweave.api))
  return query('graphql', {
    query: `
query {
  transactions(first: 100, tags: [
    {name: "Protocol-Name", values: ["Stamp"]}
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
        block {
          height
        }
      }
    }
  }
}
  `})
}

function loadProfiles(arweave) {
  return assets => {
    const stampers = uniq(reduce(concat, [], pluck('stampers', assets)))
    const query = buildProfileQuery(stampers)
    return Async.fromPromise(arweave.api.post.bind(arweave.api))('graphql', { query })
      .map(compose(
        map(profile => ({
          id: profile.owner.address,
          name: prop('value', find(propEq('name', 'Profile-Name'), profile.tags)),
          avatar: prop('value', find(propEq('name', 'Profile-Avatar'), profile.tags))
        })),
        pluck('node'),
        path(['data', 'data', 'transactions', 'edges'])
      ))
      .map(profiles => {

        return map(asset => {
          return ({
            ...asset, stampers: map(stamper => {
              const profile = find(propEq('id', stamper), profiles)
              return {
                id: stamper,
                name: profile?.name || 'unknown',
                avatar: profile?.avatar
              }
            }, asset.stampers)
          })
        }, assets)
      })
  }
}