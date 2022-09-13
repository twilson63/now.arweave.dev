export async function mint(arweave, ar) {
  const tx = await arweave.createTransaction({
    data: '1234',
    fee: arweave.ar.arToWinston(ar)
  })



  tx.addTag('App-Name', 'SmartWeaveAction')
  tx.addTag('App-Version', '0.3.0')
  tx.addTag('Input', JSON.sringify({ function: 'mint' }))
  tx.addTag('Contract', 'JnPMxlTvHtdMsEHgTJrhYvoBL33f_-FfNPt6a9qhaF4')
  await arweave.transactions.sign(tx)
  await arweave.transactions.post(tx)

}

export async function arbalance(arweave, addr) {
  const { data } = await arweave.api.get(`wallet/${addr}/balance`)
  return arweave.ar.winstonToAr(data)
}