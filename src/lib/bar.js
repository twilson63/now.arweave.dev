export async function mint(arweave, bar, ar) {
  const tx = await arweave.createTransaction({
    data: '1234'
  })

  tx.addTag('App-Name', 'SmartWeaveAction')
  tx.addTag('App-Version', '0.3.0')
  tx.addTag('Input', JSON.stringify({ function: 'mint' }))
  tx.addTag('Contract', bar)
  tx.reward = arweave.ar.arToWinston(ar)
  await arweave.transactions.sign(tx, 'use_wallet')
  await arweave.transactions.post(tx)

}

export async function arbalance(arweave, addr) {
  const { data } = await arweave.api.get(`wallet/${addr}/balance`)
  return arweave.ar.winstonToAr(data)
}