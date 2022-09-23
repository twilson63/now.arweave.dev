<script>
  //import { formatDistanceToNow } from "date-fns";
  import { ArweaveWebWallet } from "arweave-wallet-connector";

  import Modal from "../components/modal.svelte";
  import Item from "../components/item.svelte";
  import NavBar from "../components/navbar.svelte";
  import SortButton from "../components/sort-button.svelte";

  import { barToAtomic, atomicToBar } from "../lib/utils.js";
  import PostAsset from "../dialogs/post.svelte";
  import Upload from "../dialogs/upload.svelte";
  import About from "../dialogs/about.svelte";
  import Buy from "../dialogs/buy.svelte";
  import Sell from "../dialogs/sell.svelte";
  import Connect from "../dialogs/connect.svelte";
  import Bar from "../dialogs/bar.svelte";
  import Preview from "../dialogs/preview.svelte";

  import {
    arBalance,
    mintBar,
    whatsNew,
    getProfile,
    isVouched,
    stamp,
    sellAsset,
    buyAsset,
    readState,
    readBar,
    whatsHot,
    uploadAsset,
  } from "../lib/app.js";
  import { assets, profile } from "../store.js";
  import { find, propEq, mergeRight } from "ramda";

  let connectRequestFrom = { type: "none" };
  let profileAR = 0;
  let view = "hot";
  let days = 7;
  let assetData = {};
  let processingDialog = false;
  let connectDialog = false;
  let errorDialog = false;
  let errorMessage = "";
  let postDialog = false;
  let uploadDialog = false;
  let aboutDialog = false;
  let barDialog = false;
  let confirmBar = false;
  let comingSoon = false;

  let confirmStampDialog = false;
  let confirmPurchaseDialog = false;
  let confirmSaleDialog = false;
  let buyDialog = false;
  $: buyItem = {
    name: "",
    qty: 1000,
    price: 0.1,
    percent: 0,
  };
  let sellDialog = false;
  $: sellItem = {
    contract: "",
    name: "",
    balance: 0,
    qty: 10000,
    price: 0,
  };

  let showPreview = false;
  let previewData = {};

  let defaultAvatarUrl =
    "https://tgbcqufuppegmlhigt2zosiv2q55qty4t4rg2gebmfm4vpvf.arweave.net/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0";

  let buyQty = 0;

  $: sellItem.qty = Math.floor(
    (Number(sellItem.percent) / 100) * Number(sellItem.balance)
  );
  async function getStamps() {
    if ($assets.length === 0) {
      $assets = view === "hot" ? await whatsHot(days) : await whatsNew(days);
    }
    return Promise.resolve($assets);
  }

  async function refreshStampList() {
    window.scrollTo(0, 0);
    $assets = view === "hot" ? await whatsHot(days) : await whatsNew(days);
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
      confirmStampDialog = true;
      stampList = refreshStampList();
    } catch (e) {
      errorMessage = e.message;
      errorDialog = true;
    }
  }

  function handleConnect() {
    connectDialog = true;
  }

  async function doConnect(type) {
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
      try {
        $profile = await getProfile(address);
        // hack to fix unknown profile
        $profile.owner = address;
      } catch (e) {
        $profile = { owner: address };
      }
    } else if (type === "arweaveapp") {
      const wallet = new ArweaveWebWallet({
        name: "now.arweave.dev",
        logo: "https://now.arweave.dev/stamp-logo.webp",
      });
      wallet.setUrl("arweave.app");
      await wallet.connect();
      try {
        $profile = await getProfile(wallet.address);
        // hack to fix unknown profile
        $profile.owner = wallet.address;
      } catch (e) {
        $profile = { owner: wallet.address };
      }
    }
    if ($profile.owner) {
      if (connectRequestFrom.type === "sell") {
        handleSellClick(connectRequestFrom);
      } else if (connectRequestFrom.type === "buy") {
        handleBuyClick(connectRequestFrom);
      }
    }
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
    confirmSaleDialog = true;
    stampList = refreshStampList();
  }

  async function doBuyAsset() {
    buyDialog = false;
    processingDialog = true;

    let qty = Number(barToAtomic(buyQty)).toFixed(0); //* 100;

    if (qty > Number(barToAtomic(buyItem.balance))) {
      processingDialog = false;
      errorMessage = "You do not have enough $BAR to make this purchase!";
      errorDialog = true;
      return;
    }
    //const result = await buyAsset(buyItem.contract, Number(qty.toFixed(0)));
    const result = await buyAsset(buyItem.contract, qty);

    processingDialog = false;
    confirmPurchaseDialog = true;

    stampList = refreshStampList();
  }

  async function handleSellClick(e) {
    if (!window.arweaveWallet) {
      connectRequestFrom = { type: "sell", detail: e.detail };
      handleConnect();

      return;
    }
    if (!$profile.owner) {
      connectRequestFrom = { type: "sell", detail: e.detail };
      handleConnect();
      return;
    }
    // reset
    connectRequestFrom = { type: "none" };

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

    if (state.balances[$profile.owner]) {
      sellItem.owned = state.balances[$profile.owner];
    } else {
      sellItem.owned = 0;
    }

    sellItem.balance = state.balances[$profile.owner];
    sellDialog = true;
  }

  async function handleBuyClick(e) {
    if (!window.arweaveWallet) {
      connectRequestFrom = { type: "buy", detail: e.detail };
      handleConnect();
      return;
    }
    if (!$profile.owner) {
      connectRequestFrom = { type: "buy", detail: e.detail };
      handleConnect();
      return;
    }

    buyQty = 0;
    buyItem = e.detail;

    const state = await readState(buyItem.contract);
    const bar = await readBar();

    if (!state.settings.find((a) => a[0] === "isTradeable" && a[1] === true)) {
      errorMessage = "Asset is not tradeable!";
      errorDialog = true;
      return;
    }

    // if no bar get bar
    if (Number(bar.balances[$profile.owner] || null) <= 0) {
      errorMessage = "In order to buy, you need some $BAR";
      errorDialog = true;
      return;
    }

    if (buyItem.canPurchase === 0) {
      errorMessage = "There are no units on the market";
      errorDialog = true;
      return;
    }
    if (state.balances[$profile.owner]) {
      buyItem.owned = state.balances[$profile.owner];
    } else {
      buyItem.owned = 0;
    }

    buyItem.balance = atomicToBar(bar.balances[$profile.owner]);

    buyDialog = true;
  }
  function handlePreviewClick(e) {
    previewData = e.detail;
    setTimeout(() => (showPreview = true), 100);
  }

  async function showBarDlg() {
    profileAR = await arBalance($profile.owner);
    barDialog = true;
  }

  async function doBurnAR(e) {
    let amount = e.detail.amount;
    if (Number(amount) > Number(profileAR)) {
      alert("Not enough AR to burn");
      return;
    }
    const result = await mintBar(amount);
    // check balance
    // prompt with dialog, successfully created mint transaction
    // it may take 5 to 10 minutes to resolve.
    confirmBar = true;
  }

  function changeView(e) {
    view = e.detail.view;
    days = e.detail.days;
    stampList = refreshStampList();
  }

  const toArrayBuffer = (file) =>
    new Promise((resolve, reject) => {
      const fr = new FileReader();
      fr.readAsArrayBuffer(file);
      fr.addEventListener("loadend", (evt) => {
        resolve(evt.target.result);
      });
    });

  function createPurchaseText(name, id) {
    return encodeURI(`I just purchased an Atomic Asset - "${name}", 
go to  https://arweave.net/${id} to 🪧 STAMP!
        
    `);
  }

  function createSellText(name, id) {
    return encodeURI(`👋🏻 Hey, I just listed my Tradeable Atomic Asset - "${name}" for sale on now.arweave.dev!
If you like my asset: arweave.net/${id} - go to now and consider purchasing or STAMPing 🪧.

Powered by the Permaweb 🐘
`);
  }

  let stampList = getStamps();
</script>

<NavBar
  on:connect={handleConnect}
  on:disconnect={disconnect}
  on:post={() => (postDialog = true)}
  on:about={() => (aboutDialog = true)}
  on:change={changeView}
  on:bar={showBarDlg}
  profile={$profile}
/>
<!-- three column wrapper -->
<div class="flex-grow w-full max-w-7xl mx-auto xl:px-8 lg:flex" />
<!-- left column -->
<div class="flex-1 min-w-0 bg-white xl:flex">
  <!-- <SideNav /> -->
  <!-- Log List -->
  <div class="bg-white lg:min-w-0 lg:flex-1">
    <ul class="relative divide-y divide-gray-200 border-b border-gray-200">
      {#await stampList}
        <li class="alert alert-info mx-16 my-8 w-11/12">Loading stamps</li>
      {:then stamps}
        {#each stamps as stamp}
          <Item
            {stamp}
            on:stamp={handleStamp}
            on:sell={handleSellClick}
            on:buy={handleBuyClick}
            on:preview={handlePreviewClick}
          />
        {/each}
      {/await}

      <!-- More projects... -->
    </ul>
  </div>
</div>
<Connect
  bind:open={connectDialog}
  on:connect={(e) => {
    doConnect(e.detail.wallet);
  }}
/>
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
<Modal open={confirmSaleDialog} ok={false}>
  <button
    on:click={() => (confirmSaleDialog = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h1 class="text-4xl font-bold my-8">Sale Order Successful!</h1>
  <p>
    You have created a sale order for <span class="font-bold"
      >{sellItem.name}</span
    >!
  </p>
  <div>
    <h4 class="text-2xl my-4">
      Share to let everyone know your Atomic Asset is for sale!
    </h4>
    <a
      href="https://twitter.com/intent/tweet?text={createSellText(
        sellItem.name,
        sellItem.contract
      )}"
      class="twitter-share-button btn btn-outline btn-info"
      data-size="large"
      data-show-count="false"
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 30 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          d="M26.9162 6.88961C26.9353 7.1561 26.9353 7.42264 26.9353 7.68912C26.9353 15.8172 20.7487 25.1828 9.44162 25.1828C5.95811 25.1828 2.72209 24.1738 0 22.4226C0.494941 22.4797 0.970781 22.4988 1.48477 22.4988C4.35908 22.4988 7.00506 21.528 9.11801 19.8719C6.41496 19.8147 4.14973 18.0445 3.36926 15.6079C3.75 15.665 4.13068 15.703 4.53047 15.703C5.08248 15.703 5.63455 15.6269 6.14848 15.4937C3.33123 14.9226 1.21822 12.448 1.21822 9.45942V9.3833C2.03672 9.84016 2.98857 10.1257 3.99738 10.1637C2.34129 9.05963 1.25631 7.17514 1.25631 5.04315C1.25631 3.90104 1.56082 2.85408 2.09385 1.94037C5.12051 5.67133 9.67002 8.10783 14.7715 8.37438C14.6763 7.91752 14.6192 7.44168 14.6192 6.96578C14.6192 3.57742 17.3603 0.817307 20.7677 0.817307C22.538 0.817307 24.1369 1.55969 25.2601 2.75893C26.6496 2.49244 27.9821 1.97846 29.1623 1.27416C28.7054 2.70186 27.7346 3.9011 26.4593 4.66246C27.6966 4.52928 28.8959 4.18656 29.9999 3.71072C29.1625 4.92895 28.1154 6.01393 26.9162 6.88961V6.88961Z"
          fill="#1DA1F2"
        /></svg
      >
      Tweet
    </a>
  </div>
</Modal>
<Modal open={confirmPurchaseDialog} ok={false}>
  <button
    on:click={() => (confirmPurchaseDialog = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h1 class="text-4xl font-bold my-8">Purchase Successful!</h1>
  <p>
    You have purchased <span class="font-bold">{buyItem.name}</span>.
  </p>
  <div>
    <h4 class="text-2xl my-4">Share to encourage STAMPs</h4>
    <a
      href="https://twitter.com/intent/tweet?text={createPurchaseText(
        buyItem.name,
        buyItem.contract
      )}"
      class="twitter-share-button btn btn-outline btn-info"
      data-size="large"
      data-show-count="false"
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 30 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          d="M26.9162 6.88961C26.9353 7.1561 26.9353 7.42264 26.9353 7.68912C26.9353 15.8172 20.7487 25.1828 9.44162 25.1828C5.95811 25.1828 2.72209 24.1738 0 22.4226C0.494941 22.4797 0.970781 22.4988 1.48477 22.4988C4.35908 22.4988 7.00506 21.528 9.11801 19.8719C6.41496 19.8147 4.14973 18.0445 3.36926 15.6079C3.75 15.665 4.13068 15.703 4.53047 15.703C5.08248 15.703 5.63455 15.6269 6.14848 15.4937C3.33123 14.9226 1.21822 12.448 1.21822 9.45942V9.3833C2.03672 9.84016 2.98857 10.1257 3.99738 10.1637C2.34129 9.05963 1.25631 7.17514 1.25631 5.04315C1.25631 3.90104 1.56082 2.85408 2.09385 1.94037C5.12051 5.67133 9.67002 8.10783 14.7715 8.37438C14.6763 7.91752 14.6192 7.44168 14.6192 6.96578C14.6192 3.57742 17.3603 0.817307 20.7677 0.817307C22.538 0.817307 24.1369 1.55969 25.2601 2.75893C26.6496 2.49244 27.9821 1.97846 29.1623 1.27416C28.7054 2.70186 27.7346 3.9011 26.4593 4.66246C27.6966 4.52928 28.8959 4.18656 29.9999 3.71072C29.1625 4.92895 28.1154 6.01393 26.9162 6.88961V6.88961Z"
          fill="#1DA1F2"
        /></svg
      >
      Tweet
    </a>
  </div>
</Modal>
<Modal open={confirmStampDialog} ok={false}>
  <button
    on:click={() => (confirmStampDialog = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h1 class="text-4xl my-8 font-bold">STAMP Successful!</h1>
  <p>You just stamped!</p>
  <div>
    <h4 class="text-2xl my-4">Share to encourage STAMPs</h4>
    <a
      href="https://twitter.com/intent/tweet?text={encodeURI(
        `I just stamped on https://now.arweave.dev!`
      )}"
      class="twitter-share-button btn btn-outline btn-info"
      data-size="large"
      data-show-count="false"
    >
      <svg
        width="100%"
        height="100%"
        preserveAspectRatio="none"
        viewBox="0 0 30 26"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        ><path
          d="M26.9162 6.88961C26.9353 7.1561 26.9353 7.42264 26.9353 7.68912C26.9353 15.8172 20.7487 25.1828 9.44162 25.1828C5.95811 25.1828 2.72209 24.1738 0 22.4226C0.494941 22.4797 0.970781 22.4988 1.48477 22.4988C4.35908 22.4988 7.00506 21.528 9.11801 19.8719C6.41496 19.8147 4.14973 18.0445 3.36926 15.6079C3.75 15.665 4.13068 15.703 4.53047 15.703C5.08248 15.703 5.63455 15.6269 6.14848 15.4937C3.33123 14.9226 1.21822 12.448 1.21822 9.45942V9.3833C2.03672 9.84016 2.98857 10.1257 3.99738 10.1637C2.34129 9.05963 1.25631 7.17514 1.25631 5.04315C1.25631 3.90104 1.56082 2.85408 2.09385 1.94037C5.12051 5.67133 9.67002 8.10783 14.7715 8.37438C14.6763 7.91752 14.6192 7.44168 14.6192 6.96578C14.6192 3.57742 17.3603 0.817307 20.7677 0.817307C22.538 0.817307 24.1369 1.55969 25.2601 2.75893C26.6496 2.49244 27.9821 1.97846 29.1623 1.27416C28.7054 2.70186 27.7346 3.9011 26.4593 4.66246C27.6966 4.52928 28.8959 4.18656 29.9999 3.71072C29.1625 4.92895 28.1154 6.01393 26.9162 6.88961V6.88961Z"
          fill="#1DA1F2"
        /></svg
      >
      Tweet
    </a>
  </div>
</Modal>
<PostAsset
  open={postDialog}
  on:cancel={() => (postDialog = false)}
  on:submit={({ detail }) => {
    postDialog = false;
    assetData = detail;
    console.log(assetData);
    uploadDialog = true;
  }}
/>
<Upload
  open={uploadDialog}
  on:cancel={() => (uploadDialog = false)}
  on:submit={async ({ detail }) => {
    uploadDialog = false;
    assetData = mergeRight(assetData, {
      file: await toArrayBuffer(detail.files[0]),
    });
    //console.log(assetData);
    const tags = [
      { name: "Title", value: assetData.title },
      { name: "Description", value: assetData.description },
      { name: "Type", value: assetData.type },
      { name: "Content-Type", value: detail.files[0].type },
      { name: "App-Name", value: "SmartWeaveContract" },
      { name: "App-Version", value: "0.3.0" },
      { name: "SDK", value: "RedStone" },
      {
        name: "Contract-Src",
        value: "BzNLxND_nJEMfcLWShyhU4i9BnzEWaATo6FYFsfsO0Q",
      },
      {
        name: "Init-State",
        value: JSON.stringify({
          ticker: "MEME-" + assetData.title,
          title: assetData.title,
          owner: $profile.owner,
          contentType: detail.files[0].type,
          balances: {
            [$profile.owner]: 10000,
          },
          createdAt: Date.now(),
          invocations: [],
          halted: false,
          pairs: [],
          usedTransfers: [],
          foreignCalls: [],
          emergencyHaltWallet: $profile.owner,
          claims: [],
          claimable: [],
          settings: [["isTradeable", true]],
        }),
      },
    ];
    //console.log(tags);
    // uploadAsset
    console.log(assetData.file);
    const result = await uploadAsset(assetData.file, $profile.owner, tags);
    console.log(result);
  }}
/>
<About open={aboutDialog} on:cancel={() => (aboutDialog = false)} />
<Buy
  bind:open={buyDialog}
  bind:data={buyItem}
  bind:buyQty
  on:submit={doBuyAsset}
/>
<Sell bind:open={sellDialog} bind:data={sellItem} on:submit={doSellAsset} />
<Bar bind:open={barDialog} ar={profileAR} on:burn={doBurnAR} />
<Preview
  bind:open={showPreview}
  id={previewData.id}
  title={previewData.title}
/>
<Modal bind:open={confirmBar} ok={false}>
  <button
    on:click={() => (confirmBar = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h1 class="text-4xl my-8">BAR Purchase Sent!</h1>
  <p>
    It can take 15 - 30 minutes for the transaction to confirm, please check
    back soon.
  </p>
  <div class="flex justify-center mt-8">
    <button
      class="btn btn-outline rounded-none"
      on:click={() => (confirmBar = false)}>Ok</button
    >
  </div>
</Modal>
<Modal bind:open={comingSoon} ok={false}>
  <button
    on:click={() => (comingSoon = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h1 class="text-3xl my-8 text-center">Tradeable assets <br />coming soon!</h1>
  <div class="flex justify-center mt-8">
    <button
      class="btn btn-outline rounded-none"
      on:click={() => (comingSoon = false)}>Ok</button
    >
  </div>
</Modal>
