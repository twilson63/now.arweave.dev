<script>
  import { router } from "tinro";
  import { createEventDispatcher } from "svelte";
  import Avatar from "./avatar.svelte";
  import { head, sort, take, takeLast } from "ramda";
  import { readState, getOwner } from "../lib/app.js";
  import { atomicToBar } from "../lib/utils.js";
  import { spring, tweened } from "svelte/motion";
  import Pie from "./pie.svelte";

  let percent = 0;
  const store = tweened(0, { duration: 1000 });
  //const store = spring(0, {stiffness: 0.3, damping: 0.3});
  $: store.set(percent);

  export let stamp;

  let unitsTotal = 0;
  let unitsAvailable = 0;
  let lowestPrice = 0;

  const dispatch = createEventDispatcher();

  function navTo(id) {
    window.open("https://arweave.dev/" + id);
    //router.goto("https://arweave.dev/" + id);
  }

  function handleStamp() {
    dispatch("stamp", { asset: stamp.asset });
  }

  function handleSell() {
    dispatch("sell", {
      contract: stamp.asset,
      name: stamp.title,
      percent: 10,
      price: "0.01",
    });
  }
  function handleBuy() {
    dispatch("buy", {
      contract: stamp.asset,
      name: stamp.title,
      units: unitsTotal,
      canPurchase: unitsAvailable,
      price: lowestPrice,
      percent: 10,
    });
  }
  async function getContract() {
    const info = await readState(stamp.asset);
    return info;
  }

  function showOrderTotal(state) {
    if (state.pairs && state.pairs[0]) {
      unitsTotal = Object.values(state.balances).reduce((a, b) => a + b, 0);
      unitsAvailable = state.pairs[0].orders.reduce(
        (a, o) => a + o.quantity,
        0
      );

      lowestPrice = head(
        sort(
          (x, y) => (x > y ? 1 : -1),
          state.pairs[0].orders.reduce(
            (a, o) => [...a, atomicToBar(o.price)],
            []
          )
        )
      );
      percent = Math.floor((unitsAvailable / unitsTotal) * 100);
      return `<div>${percent} % available <br /><span class="text-sm">As low as ${Number(
        lowestPrice
      ).toFixed(2)} $BAR</span></div>`;
    }
    return "";
  }
</script>

<li
  class="relative pl-4 pr-6 py-5 hover:bg-gray-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6"
>
  <div class="flex items-center justify-between space-x-4">
    <!-- Repo name and link -->
    <div class="min-w-0 space-y-3">
      <div class="flex-none flex flex-col md:flex-row items-center space-x-3">
        <div class="flex flex-col">
          <button
            on:click|stopPropagation={handleStamp}
            class="btn btn-ghost btn-primary rounded-none"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="w-6 h-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M15 11.25l-3-3m0 0l-3 3m3-3v7.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </button>
          <div class="text-sm text-primary text-center font-bold">
            {stamp.count}
          </div>
        </div>
        <figure class="mask mask-circle">
          {#await getOwner(stamp.asset) then owner}
            {#if owner.avatar}
              <Avatar avatar={owner.avatar} />
            {:else if owner.name && owner.name.toUpperCase() !== "UNKNOWN"}
              <Avatar name={owner.name} avatar="https://i.pravatar.cc/128" />
            {:else}
              <Avatar avatar="https://i.pravatar.cc/128" />
            {/if}
          {/await}
        </figure>
        <div class="flex-1 flex flex-col w-[400px]">
          <h2 class="text-xl font-bold">
            <a target="_blank" href="https://arweave.net/{stamp.asset}">
              {stamp.title.length > 20
                ? take(35, stamp.title) + "..."
                : stamp.title}
              <span class="text-sm font-normal"
                >({take(4, stamp.asset)}...{takeLast(4, stamp.asset)}}</span
              >
            </a>
          </h2>
          <p class="text-[12px]">
            Asset Description here, could be 300 characters of text, so need to
            make sure that a lot of text looks good here. Given the fact that I
            am testing and it needs to be a long description.
          </p>
        </div>
      </div>
    </div>
    <div class="flex-1 flex flex-col">
      {#await getContract() then state}
        {#if ((state.pairs && state.pairs[0]?.orders) || []).length > 0}
          <div class="text-success italic">For Sale</div>
        {/if}
        {@html showOrderTotal(state)}
      {/await}
    </div>
    <div class="sm:hidden">
      <!-- Heroicon name: solid/chevron-right -->
      <svg
        class="h-5 w-5 text-gray-400"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path
          fill-rule="evenodd"
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
    <div
      class="hidden flex-none sm:flex flex-col flex-shrink-0 items-start space-y-3"
    >
      <div class="flex space-x-4">
        <div class="avatar-group -space-x-6">
          {#each take(10, stamp.stampers) as stamper}
            {#if stamper.avatar}
              <Avatar avatar={stamper.avatar} />
            {:else if stamper.name && stamper.name.toUpperCase() !== "UNKNOWN"}
              <Avatar name={stamper.name} avatar="https://i.pravatar.cc/128" />
            {:else}
              <Avatar avatar="https://i.pravatar.cc/128" />
            {/if}
          {/each}
        </div>
        <div class="flex items-center justify-center">
          <Pie size={50} {percent} />
        </div>
        <button
          class="btn btn-outline btn-success rounded-none"
          on:click|stopPropagation={handleBuy}>Buy</button
        >
        <button
          class="btn btn-outline btn-secondary rounded-none"
          on:click|stopPropagation={handleSell}>Sell</button
        >
      </div>
    </div>
  </div>
</li>
