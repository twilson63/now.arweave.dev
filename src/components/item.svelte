<script>
  import { router } from "tinro";
  import { createEventDispatcher } from "svelte";
  import Avatar from "./avatar.svelte";
  import { head, sort, take } from "ramda";
  import Arweave from "arweave";
  import { readState } from "../lib/app.js";

  export let stamp;

  const { ar } = Arweave.init();
  let unitsTotal = 0;
  let unitsAvailable = 0;
  let lowestPrice = 0;

  const dispatch = createEventDispatcher();

  function navTo(id) {
    window.location = "https://arweave.dev/" + id;
    //router.goto("https://arweave.dev/" + id);
  }

  function handleStamp() {
    dispatch("stamp", { asset: stamp.asset });
  }

  function handleSell() {
    dispatch("sell", { contract: stamp.asset, name: stamp.title });
  }
  function handleBuy() {
    dispatch("buy", {
      contract: stamp.asset,
      name: stamp.title,
      units: unitsTotal,
      canPurchase: unitsAvailable,
      price: lowestPrice,
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

      lowestPrice = ar.winstonToAr(
        head(
          sort(
            (x, y) => (x > y ? 1 : -1),
            state.pairs[0].orders.reduce(
              (a, o) => [...a, o.price / o.quantity],
              []
            )
          )
        )
      );
      return `<div>${unitsAvailable}/${unitsTotal} available <br />as low as ${lowestPrice} $BAR</div>`;
    }
    return "";
  }
</script>

<li
  class="relative pl-4 pr-6 py-5 hover:bg-gray-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6"
>
  <div
    class="flex items-center justify-between space-x-4"
    on:click|preventDefault={navTo(stamp.asset)}
  >
    <!-- Repo name and link -->
    <div class="min-w-0 space-y-3">
      <div class="flex flex-col md:flex-row items-center space-x-3">
        <img class="w-[32px]" src="stamp-logo.webp" alt="stamp logo" />
        <div class="flex flex-col max-w-[200px]">
          <h2 class="text-xl font-medium">
            <a href="#">
              {stamp.title.length > 20
                ? take(15, stamp.title) + "..."
                : stamp.title}
              <span class="text-sm">{stamp.asset.substring(0, 5)}</span>
            </a>
          </h2>
          <div class="flex space-x-2">
            <div>({stamp.count})</div>
            <div>stamps</div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col">
      {#await getContract() then state}
        {#if ((state.pairs && state.pairs[0]?.orders) || []).length > 0}
          <div class="badge badge-success">For Sale</div>
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
    <div class="hidden sm:flex flex-col flex-shrink-0 items-start space-y-3">
      <div class="flex space-x-4">
        <div class="avatar-group -space-x-6">
          {#each stamp.stampers as stamper}
            {#if stamper.avatar}
              <Avatar avatar={stamper.avatar} />
            {/if}
          {/each}
        </div>

        <button on:click|stopPropagation={handleStamp} class="btn btn-outline"
          >Stamp</button
        >
        <button class="btn btn-outline" on:click|stopPropagation={handleBuy}
          >Buy</button
        >
        <button class="btn btn-outline" on:click|stopPropagation={handleSell}
          >Sell</button
        >
      </div>
    </div>
  </div>
</li>
