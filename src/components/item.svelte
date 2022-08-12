<script>
  import { router } from "tinro";
  import { createEventDispatcher } from "svelte";
  import { getTitle } from "../lib/app.js";

  export let stamp;

  const dispatch = createEventDispatcher();

  function navTo(id) {
    router.goto("/assets/" + id);
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
        <a href="/assets/{stamp.asset}" class="btn btn-secondary">Details</a>
        <button class="btn">View</button>
        <button class="btn btn-info">Share</button>
      </div>
    </div>
  </div>
</li>
