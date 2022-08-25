<script>
  import {
    addPair,
    createOrder,
    dry,
    allowOrder,
    readState,
  } from "../lib/app.js";
  let state = {};
  let contract = "dm21bXeY6Ydmv3P6mSpaDSR1lRJwnGXcCf3gFLHUy6c";
  let qty = 0;
  let price = 0;

  const TEST_BAR = "s0SSQ8z4IafHyo6gd8OkIbttT1TRiopqlSTpwaJqGSs";

  async function sell() {
    // state = await readState(contract);
    // if (
    //   state.pairs.length === 0 ||
    //   state.pairs.filter((o) => o.pair.includes(TEST_BAR)).lenth === 0
    // ) {

    // }
    //await addPair(contract, TEST_BAR);
    await createOrder({
      contract,
      pair: [contract, TEST_BAR],
      qty,
      price,
    });
    state = await readState(contract);
  }

  async function buy() {
    const { originalTxId } = await allowOrder(TEST_BAR, contract, price);
    console.log("tx", originalTxId);
    await createOrder({
      contract,
      pair: [TEST_BAR, contract],
      qty: price,
      transaction: originalTxId,
    });
    state = await readState(TEST_BAR);
    state += await readState(contract);
  }
</script>

<h1>Test Exchange</h1>
<div class="mb-8 flex justify-center space-x-16">
  <form class="form space-y-8" on:submit|preventDefault={sell}>
    <h3 class="text-3xl">Sell</h3>
    <div class="form-control">
      <label class="label">Contract</label>
      <input type="text" class="input input-bordered" bind:value={contract} />
    </div>
    <div class="form-control">
      <label class="label">Quantity</label>
      <input type="number" class="input input-bordered" bind:value={qty} />
    </div>
    <div class="form-control">
      <label class="label">Price</label>
      <input type="number" class="input input-bordered" bind:value={price} />
    </div>
    <div class="">
      <button class="btn">Submit</button>
    </div>
  </form>
  <form class="form space-y-8" on:submit|preventDefault={buy}>
    <h3 class="text-3xl">Buy</h3>
    <div class="form-control">
      <label class="label">Contract</label>
      <input type="text" class="input input-bordered" bind:value={contract} />
    </div>
    <div class="form-control">
      <label class="label">Quantity</label>
      <input type="number" class="input input-bordered" bind:value={price} />
    </div>
    <div class="">
      <button class="btn">Submit</button>
    </div>
  </form>
</div>
<hr />
<div class="mt-8 flex justify-center">
  <pre class=""><code>{JSON.stringify(state, null, 2)}</code></pre>
</div>
