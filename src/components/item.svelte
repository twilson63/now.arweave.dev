<script>
  import { router } from "tinro";
  import { createEventDispatcher } from "svelte";
  import { getTitle, getStampers } from "../lib/app.js";
  import Avatar from "./avatar.svelte";

  export let stamp;
  export let assets;

  const dispatch = createEventDispatcher();

  function navTo(id) {
    window.location = "https://arweave.dev/" + id;
    //router.goto("https://arweave.dev/" + id);
  }
  function handleStampersButton() {
    dispatch("stampers", { asset: stamp.asset });
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
      <div class="flex items-center space-x-3">
        <img class="w-[32px]" src="stamp-logo.webp" alt="stamp logo" />
        <div class="flex flex-col">
          <h2 class="text-xl font-medium">
            <a href="#">
              {#await getTitle(stamp.asset) then title}
                {title}
                <span class="text-sm">{stamp.asset.substring(0, 5)}</span>
              {/await}
            </a>
          </h2>
          <div class="flex space-x-2">
            <div>({stamp.count})</div>
            <div>stamps</div>
          </div>
        </div>
      </div>
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
          {#await getStampers(stamp.asset, assets)}
            Loading...
          {:then stampers}
            {#each stampers as stamper}
              {#if stamper.avatar}
                <Avatar avatar={stamper.avatar} />
              {/if}
            {/each}
          {/await}
        </div>
        <!--
        <button on:click={handleStampersButton} class="btn btn-outline"
          >Stampers</button
        >
        -->
        <a
          href="https://arweave.dev/{stamp.asset}"
          target="_blank"
          class="btn btn-outline">View Page</a
        >
      </div>
    </div>
  </div>
</li>
