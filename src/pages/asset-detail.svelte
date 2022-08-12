<script>
  import NavBar from "../components/navbar.svelte";
  import {
    listAssets,
    getStampers as appGetStampers,
    getTitle,
  } from "../lib/app.js";
  import { assets } from "../store.js";

  export let id;

  let title = "unknown";

  async function getStampers() {
    if ($assets.length === 0) {
      $assets = await listAssets();
    }
    title = await getTitle(id);
    const results = await appGetStampers(id, $assets);
    console.log({ results });
    return results;
  }
</script>

<NavBar />
<div class="relative bg-base-100">
  <div class="lg:absolute lg:inset-0">
    <div class="lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2">
      <iframe class="w-full h-screen" src="https://arweave.net/{id}" />
    </div>
  </div>
  <div
    class="relative pt-12 pb-16 px-4 sm:pt-16 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2"
  >
    <div class="lg:col-start-2 lg:pl-8">
      <div class="text-base max-w-prose mx-auto lg:max-w-lg lg:ml-auto lg:mr-0">
        <h2
          class="leading-6 text-primary font-semibold tracking-wide uppercase"
        >
          Asset
        </h2>
        <h3
          class="mt-2 mb-4 text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl"
        >
          {title}
        </h3>
        <p>ID: <a class="link" href="https://arweave.net/{id}">{id}</a></p>
        <nav class="mt-16 h-[800px] overflow-y-auto rounded">
          <div class="relative">
            <div
              class="z-10 sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500"
            >
              <h3>Stampers</h3>
            </div>
            <ul role="list" class="relative z-0 divide-y divide-gray-200">
              {#await getStampers() then stampers}
                {#each stampers as profile}
                  <li class="bg-white">
                    <div
                      class="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
                    >
                      <div class="flex-shrink-0">
                        <img
                          class="h-10 w-10 rounded-full"
                          src={profile.avatar ||
                            "https://arweave.net/yZ64EcoLWgY4jGZp6RIxR4O6wKGUuHVNu8JidQf4nFo"}
                          alt=""
                        />
                      </div>
                      <div class="flex-1 min-w-0">
                        <a href="#" class="focus:outline-none">
                          <!-- Extend touch target to entire panel -->
                          <span class="absolute inset-0" aria-hidden="true" />
                          <p class="text-sm font-medium text-gray-900">
                            {profile.name}
                          </p>
                          <p class="text-sm text-gray-500 truncate">
                            {profile.bio || ""}
                          </p>
                        </a>
                      </div>
                    </div>
                  </li>
                {/each}
              {/await}
            </ul>
          </div>
        </nav>
      </div>
    </div>
  </div>
</div>
