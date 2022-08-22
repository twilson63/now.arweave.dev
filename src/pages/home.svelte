<script>
  //import { formatDistanceToNow } from "date-fns";
  import Modal from "../components/modal.svelte";
  import Item from "../components/item.svelte";
  import SideNav from "../components/side-nav.svelte";
  import NavBar from "../components/navbar.svelte";
  import SortButton from "../components/sort-button.svelte";

  import { listAssets } from "../lib/app.js";
  import { assets } from "../store.js";

  let connectDialog = false;

  let defaultAvatarUrl =
    "https://tgbcqufuppegmlhigt2zosiv2q55qty4t4rg2gebmfm4vpvf.arweave.net/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0";

  async function getStamps() {
    if ($assets.length === 0) {
      $assets = await listAssets();
    }
    return Promise.resolve($assets);
  }

  function handleStamp(e) {
    if (window.arweaveWallet) {
      // connect wallet
    } else {
      // prompt model select wallet
    }
    // get wallet address
    // check is vouched
    // do stamp
    // reload cache
  }

  function handleConnect() {
    connectDialog = true;
  }

  function doConnect(type) {
    return async function () {
      connectDialog = false;
    };
  }
</script>

<NavBar on:connect={handleConnect} />
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
      {#await getStamps()}
        <li class="alert alert-info mx-16 my-8 w-11/12">Loading stamps</li>
      {:then stamps}
        {#each stamps as stamp}
          <Item {stamp} on:stamp={handleStamp} />
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
