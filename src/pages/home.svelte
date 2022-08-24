<script>
  //import { formatDistanceToNow } from "date-fns";
  import { ArweaveWebWallet } from "arweave-wallet-connector";

  import Modal from "../components/modal.svelte";
  import Item from "../components/item.svelte";
  import SideNav from "../components/side-nav.svelte";
  import NavBar from "../components/navbar.svelte";
  import SortButton from "../components/sort-button.svelte";

  import { listAssets, getProfile, isVouched, stamp } from "../lib/app.js";
  import { assets, profile } from "../store.js";
  import { find, propEq } from "ramda";

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
    name: "Rakis Profile",
    qty: 10000,
    price: 0,
  };

  let defaultAvatarUrl =
    "https://tgbcqufuppegmlhigt2zosiv2q55qty4t4rg2gebmfm4vpvf.arweave.net/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0";

  async function getStamps() {
    if ($assets.length === 0) {
      $assets = await listAssets();
    }
    return Promise.resolve($assets);
  }

  async function refreshStampList() {
    window.scrollTo(0, 0);
    $assets = await listAssets();
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
      } else if (type === "arweaveapp") {
        const wallet = new ArweaveWebWallet({
          name: "stamps.arweave.dev",
          logo: "https://stamps.arweave.dev/stamp-logo.webp",
        });
        wallet.setUrl("arweave.app");
        await wallet.connect();
        $profile = await getProfile(wallet.address);
      }
    };
  }

  async function disconnect() {
    await arweaveWallet.disconnect();
    $profile = {};
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
            on:sell={() => (sellDialog = true)}
            on:buy={() => (buyDialog = true)}
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

<Modal open={sellDialog} ok={false}>
  <h2 class="text-lg">Sell Asset</h2>
  <button
    on:click={() => (sellDialog = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h3 class="my-8 text-2xl">{sellItem.name}</h3>
  <p>Units you own: {sellItem.qty}</p>
  <div class="mt-8 flex flex-col space-y-8">
    <div class="form-control">
      <label class="label" for="qty">Units you would like to sell?</label>
      <input type="number" class="input input-bordered" />
    </div>
    <div class="form-control">
      <label class="label" for="price">Sell Price in BAR</label>
      <input id="price" type="number" class="input input-bordered" />
    </div>
    <div class="flex justify-end">
      <button class="btn btn-outline">Sell Asset</button>
    </div>
  </div>
</Modal>

<Modal open={buyDialog} ok={false}>
  <h2 class="text-lg">Buy Asset</h2>
  <button
    on:click={() => (buyDialog = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h3 class="my-8 text-2xl">{buyItem.name}</h3>
  <p>Units available: {buyItem.qty}</p>
  <p>Price per unit: {buyItem.price}</p>
  <div class="mt-8 flex flex-col space-y-8">
    <div class="form-control">
      <label class="label" for="price">Purchase Price in BAR</label>
      <input id="price" type="number" class="input input-bordered" />
    </div>
    <div class="flex justify-end">
      <button class="btn btn-outline">Buy Asset</button>
    </div>
  </div>
</Modal>
