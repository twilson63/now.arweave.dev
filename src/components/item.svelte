<script>
  import ArweaveIcon from "./arweave-icon.svelte";
  import PermapagesIcon from "./permapages-icon.svelte";
  export let stamp;
</script>

<li
  class="relative pl-4 pr-6 py-5 hover:bg-gray-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6"
>
  <div class="flex items-center justify-between space-x-4">
    <!-- Repo name and link -->
    <div class="min-w-0 space-y-3">
      <div class="flex items-center space-x-3">
        <figure class="h-4 w-4">
          <PermapagesIcon />
        </figure>
        <h2 class="text-sm font-medium">
          <a href="#">
            <span class="absolute inset-0" aria-hidden="true" />
            Page Name - (25 Stamps) - <a href="#" class="link">PREVIEW</a>
            <span class="sr-only">Running</span>
          </a>
        </h2>
      </div>
      <a
        href="https://viewblock.io/arweave/tx/{stamp.asset}"
        class="relative group flex items-center space-x-2.5"
      >
        <ArweaveIcon />
        <span
          class="text-sm text-gray-500 group-hover:text-gray-900 font-medium truncate"
        >
          8000 Tokens available for a total of 8 BAR
        </span>
      </a>
      <div class="badge badge-success text-primary-content">For Sale</div>
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
      class="hidden sm:flex flex-col flex-shrink-0 items-start w-[200px] space-y-3"
    >
      <button class="btn btn-small w-full">Buy</button>
      <button class="btn btn-small w-full">Sell</button>
    </div>
  </div>
</li>
