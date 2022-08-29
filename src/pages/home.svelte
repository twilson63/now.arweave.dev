<script>
  //import { formatDistanceToNow } from "date-fns";
  import { ArweaveWebWallet } from "arweave-wallet-connector";

  import Modal from "../components/modal.svelte";
  import Item from "../components/item.svelte";
  import SideNav from "../components/side-nav.svelte";
  import NavBar from "../components/navbar.svelte";
  import SortButton from "../components/sort-button.svelte";

  import { barToAtomic, atomicToBar } from "../lib/utils.js";

  import {
    listAssets,
    getProfile,
    isVouched,
    stamp,
    sellAsset,
    buyAsset,
    readState,
    readBar,
    whatsHot,
  } from "../lib/app.js";
  import { assets, profile } from "../store.js";
  import { find, propEq } from "ramda";

  const { ar } = Arweave.init();

  let processingDialog = false;
  let connectDialog = false;
  let errorDialog = false;
  let errorMessage = "";

  let buyDialog = false;
  let buyItem = {
    name: "Rakis Profile",
    qty: 1000,
    price: 0.1,
  };
  let sellDialog = false;
  let sellItem = {
    contract: "",
    name: "Rakis Profile",
    balance: 0,
    qty: 10000,
    price: 0,
  };

  let defaultAvatarUrl =
    "https://tgbcqufuppegmlhigt2zosiv2q55qty4t4rg2gebmfm4vpvf.arweave.net/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0";

  $: buyQty = Number(buyItem.price) * Number(buyItem.buyUnits);

  async function getStamps() {
    if ($assets.length === 0) {
      $assets = await whatsHot();
    }
    return Promise.resolve($assets);
  }

  async function refreshStampList() {
    window.scrollTo(0, 0);
    $assets = await whatsHot();
    return Promise.resolve($assets);
  }

  async function handleStamp(e) {
    const asset = e.detail.asset;
    if (!$profile.owner) {
      return (connectDialog = true);
    }
    const data = find(propEq("asset", asset), $assets);
    const stamper = find(propEq("id", $profile.owner), data.stampers);
    if (stamper) {
      errorMessage = "Already Stamped!";
      errorDialog = true;
      return;
    }
    if (!(await isVouched($profile.owner))) {
      errorMessage =
        "Must be vouched in order to stamp. (See https://vouchdao.xyz)";
      errorDialog = true;
      return;
    }
    try {
      await stamp(asset);
      stampList = refreshStampList();
    } catch (e) {
      errorMessage = e.message;
      errorDialog = true;
    }
  }

  function handleConnect() {
    connectDialog = true;
  }

  function doConnect(type) {
    return async function () {
      connectDialog = false;
      if (type === "arconnect") {
        if (!window.arweaveWallet) {
          return window.open("https://arconnect.io");
        }
        await window.arweaveWallet.connect([
          "ACCESS_ADDRESS",
          "SIGN_TRANSACTION",
        ]);
        const address = await window.arweaveWallet.getActiveAddress();
        $profile = await getProfile(address);
        // hack to fix unknown profile
        $profile.owner = address;
      } else if (type === "arweaveapp") {
        const wallet = new ArweaveWebWallet({
          name: "stamps.arweave.dev",
          logo: "https://stamps.arweave.dev/stamp-logo.webp",
        });
        wallet.setUrl("arweave.app");
        await wallet.connect();
        $profile = await getProfile(wallet.address);
        // hack to fix unknown profile
        $profile.owner = wallet.address;
      }
    };
  }

  async function disconnect() {
    await arweaveWallet.disconnect();
    $profile = {};
  }

  async function doSellAsset() {
    sellDialog = false;
    processingDialog = true;
    if (sellItem.qty > sellItem.balance) {
      errorMessage = "You do not have enough tokens in your balance!";
      errorDialog = true;
      return;
    }
    try {
      const result = await sellAsset(
        sellItem.contract,
        sellItem.qty,
        Number(barToAtomic(sellItem.price))
      );
    } catch (e) {
      console.log(e);
      processingDialog = false;
      errorMessage = e.message;
      errorDialog = true;
      return;
    }
    processingDialog = false;
    errorMessage = "Successfully placed asset for sale.";
    errorDialog = true;
    stampList = refreshStampList();
  }

  async function doBuyAsset() {
    buyDialog = false;
    processingDialog = true;

    let qty = Number(barToAtomic(buyQty)).toFixed(0); //* 100;
    console.log("Purchase Amount", qty);

    if (qty > Number(barToAtomic(buyItem.balance))) {
      processingDialog = false;
      errorMessage = "You do not have enough $BAR to make this purchase!";
      errorDialog = true;
      return;
    }
    //const result = await buyAsset(buyItem.contract, Number(qty.toFixed(0)));
    const result = await buyAsset(buyItem.contract, qty);
    console.log(result);
    processingDialog = false;
    errorMessage = "Successfully purchased asset";
    errorDialog = true;

    stampList = refreshStampList();
  }

  async function handleSellClick(e) {
    if (!window.arweaveWallet) {
      handleConnect();
      return;
    }
    if (!$profile.owner) {
      handleConnect();
      return;
    }

    sellItem = e.detail;
    const state = await readState(sellItem.contract);

    if (!state.settings.find((a) => a[0] === "isTradeable" && a[1] === true)) {
      errorMessage = "Asset is not tradeable!";
      errorDialog = true;
      return;
    }
    if (!state.balances[$profile.owner]) {
      errorMessage = "You do not own any " + sellItem.name + " to sell!";
      errorDialog = true;
      return;
    }
    sellItem.balance = state.balances[$profile.owner];
    sellDialog = true;
  }

  async function handleBuyClick(e) {
    if (!window.arweaveWallet) {
      handleConnect();
      return;
    }
    if (!$profile.owner) {
      handleConnect();
      return;
    }

    buyItem = e.detail;
    const state = await readState(buyItem.contract);
    const bar = await readBar();

    if (!state.settings.find((a) => a[0] === "isTradeable" && a[1] === true)) {
      errorMessage = "Asset is not tradeable!";
      errorDialog = true;
      return;
    }
    // if no bar get bar
    if (!bar.balances[$profile.owner] || bar.balances[$profile.owner] <= 0) {
      errorMessage = "In order to buy, you need some $BAR";
      errorDialog = true;
      return;
    }
    buyItem.balance = atomicToBar(bar.balances[$profile.owner]);
    buyDialog = true;
  }

  let stampList = getStamps();
</script>

<NavBar
  on:connect={handleConnect}
  on:disconnect={disconnect}
  profile={$profile}
/>
<!-- three column wrapper -->
<div class="flex-grow w-full max-w-7xl mx-auto xl:px-8 lg:flex" />
<!-- left column -->
<div class="flex-1 min-w-0 bg-white xl:flex">
  <SideNav />
  <!-- Log List -->
  <div class="bg-white lg:min-w-0 lg:flex-1">
    <div
      class="pl-4 pr-6 pt-4 pb-4 border-b border-t border-gray-200 sm:pl-6 lg:pl-8 xl:pl-6 xl:pt-6 xl:border-t-0"
    >
      <div class="flex items-center">
        <h1 class="flex-1 text-lg font-medium">🔥 Whats Hot</h1>
        <!--
        <SortButton />
        -->
      </div>
    </div>
    <ul
      role="list"
      class="relative divide-y divide-gray-200 border-b border-gray-200"
    >
      {#await stampList}
        <li class="alert alert-info mx-16 my-8 w-11/12">Loading stamps</li>
      {:then stamps}
        {#each stamps as stamp}
          <Item
            {stamp}
            on:stamp={handleStamp}
            on:sell={handleSellClick}
            on:buy={handleBuyClick}
          />
        {/each}
      {/await}

      <!-- More projects... -->
    </ul>
  </div>
</div>
<Modal open={connectDialog} ok={false}>
  <h2 class="text-lg">Connect Wallet</h2>
  <button
    on:click={() => (connectDialog = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <div class="mt-8">
    <ul>
      <li>
        <button on:click={doConnect("arconnect")} class="btn btn-ghost"
          >ArConnect</button
        >
      </li>
      <li>
        <button on:click={doConnect("arweaveapp")} class="btn btn-ghost"
          >Arweave.app</button
        >
      </li>
    </ul>
  </div>
</Modal>
<Modal open={errorDialog} ok={false}>
  <h2 class="text-lg">Alert</h2>
  <button
    on:click={() => (errorDialog = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <div class="mt-8">
    {errorMessage}
  </div>
</Modal>
<Modal open={processingDialog} ok={false}>
  <div class="text-xl">Processing Request...</div>
</Modal>

<Modal open={sellDialog} ok={false}>
  <h2 class="text-lg">Sell Asset</h2>
  <button
    on:click={() => (sellDialog = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h3 class="my-8 text-2xl">{sellItem.name}</h3>
  <p>Units you own: {sellItem.balance}</p>
  <form
    on:submit|preventDefault={doSellAsset}
    class="form mt-8 flex flex-col space-y-8"
  >
    <div class="form-control">
      <label class="label" for="qty">Units you would like to sell?</label>
      <input
        type="number"
        class="input input-bordered"
        bind:value={sellItem.qty}
      />
    </div>
    <div class="form-control">
      <label class="label" for="price">Sell Price per Unit in BAR</label>
      <input
        id="price"
        type="text"
        class="input input-bordered"
        bind:value={sellItem.price}
      />
      <label class="label">
        <span class="label-text-alt">** Price is in $BAR</span>
      </label>
    </div>
    <div class="flex justify-end">
      <button class="btn btn-outline">Sell Asset</button>
    </div>
  </form>
</Modal>

<Modal open={buyDialog} ok={false}>
  <h2 class="text-lg">Buy Asset</h2>
  <button
    on:click={() => (buyDialog = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h3 class="my-8 text-2xl">{buyItem.name}</h3>
  <p>Units available: {buyItem.canPurchase}</p>
  <p>Price per unit: {buyItem.price} $BAR</p>
  <p>Your $BAR Balance: {buyItem.balance}</p>
  <!--
  <button href="#" class="link">Calc Price</button>
  -->
  <div class="mt-8 flex flex-col space-y-8">
    <div class="form-control">
      <label class="label" for="price"
        >How much many units do you want to purchase?</label
      >
      <input
        id="price"
        type="number"
        class="input input-bordered"
        bind:value={buyItem.buyUnits}
      />
    </div>
    {#if buyQty > 0}
      <div class="text-xl">Suggested Cost {buyQty} $BAR</div>
    {/if}
    <div class="flex justify-end">
      <button class="btn btn-outline" on:click={doBuyAsset}>Buy Asset</button>
    </div>
  </div>
</Modal>
