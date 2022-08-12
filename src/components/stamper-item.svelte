<script>
  import { getProfile } from "../lib/app.js";
  export let stamper;
</script>

{#await getProfile(stamper.stamper) then profile}
  <li
    class="relative pl-4 pr-6 py-5 hover:bg-gray-50 sm:py-6 sm:pl-6 lg:pl-8 xl:pl-6"
  >
    <div class="flex items-center justify-between space-x-4">
      <!-- Repo name and link -->
      <div class="min-w-0 space-y-3">
        <div class="flex items-center space-x-3">
          <div class="stats shadow bg-primary text-primary-content">
            <div class="stat place-items-center">
              <div class="stat-figure">
                <img class="w-[80px]" src="stamp-logo.webp" alt="stamp logo" />
              </div>

              <div class="stat-title">Stamps</div>
              <div class="stat-value">{stamper.count}</div>
              <div class="stat-desc">+5 stamps today</div>
            </div>
          </div>
          <div class="flex space-x-4 items-center justify-center">
            <img
              class="w-[64px] mask mask-circle"
              src={profile.avatar ||
                "https://arweave.net/yZ64EcoLWgY4jGZp6RIxR4O6wKGUuHVNu8JidQf4nFo"}
              alt="avatar"
            />
            <h2 class="text-2xl font-medium">
              <a href="#">{profile.name}</a>
            </h2>
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
          <a href="/stampers/{stamper.stamper}" class="btn btn-secondary"
            >Details</a
          >
          <button class="btn btn-info">Share</button>
        </div>
      </div>
    </div>
  </li>
{/await}
