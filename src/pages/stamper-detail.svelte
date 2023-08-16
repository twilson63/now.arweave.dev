<script>
  import NavBar from "../components/navbar.svelte";
  import Profile from "../components/profile.svelte";
  import { stampers } from "../store";
  import { getProfile, listStampers, getTitle } from "../lib/app.js";
  import { find, propEq, prop, map } from "ramda";
  import { getHost } from "../lib/utils.js";

  const host = getHost(globalThis.location.hostname);

  export let id;

  let profile = {
    name: "Unknown",
    avatar: `https://${host}/yZ64EcoLWgY4jGZp6RIxR4O6wKGUuHVNu8JidQf4nFo`,
  };

  async function loadData() {
    if ($stampers.length === 0) {
      $stampers = await listStampers();
    }
    profile = await getProfile(id);

    const assets = await Promise.all(
      map(async (id) => {
        const title = await getTitle(id);
        console.log("id", id);
        return { id, title };
      }, prop("assets", find(propEq("stamper", id), $stampers)))
    );
    return Promise.resolve({
      ...profile,
      assets,
    });
  }
</script>

<NavBar />
{#await loadData() then stamper}
  <div class="relative bg-base-100">
    <div class="lg:absolute lg:inset-0">
      <div class="lg:absolute lg:inset-y-0 lg:left-0 lg:w-1/2">
        <Profile
          name={stamper.name}
          avatar={stamper.avatar}
          background={stamper.background}
        />
      </div>
    </div>
    <div
      class="relative pt-12 pb-16 px-4 sm:pt-16 sm:px-6 lg:px-8 lg:max-w-7xl lg:mx-auto lg:grid lg:grid-cols-2"
    >
      <div class="lg:col-start-2 lg:pl-8">
        <div
          class="text-base max-w-prose mx-auto lg:max-w-lg lg:ml-auto lg:mr-0"
        >
          <h2
            class="leading-6 text-primary font-semibold tracking-wide uppercase"
          >
            Stamper
          </h2>
          <h3
            class="mt-2 mb-4 flex text-3xl leading-8 font-extrabold tracking-tight sm:text-4xl"
          >
            {stamper.name}
            <img class="ml-4 h-8" src="/vouchdao.svg" alt="vouched" />
          </h3>

          <p>ID: {id}</p>
          <nav class="mt-16 h-[800px] overflow-y-auto rounded">
            <div class="relative">
              <div
                class="z-10 sticky top-0 border-t border-b border-gray-200 bg-gray-50 px-6 py-1 text-sm font-medium text-gray-500"
              >
                <h3>Passport</h3>
              </div>
              <ul role="list" class="relative z-0 divide-y divide-gray-200">
                {#each stamper.assets as asset}
                  <li class="bg-white">
                    <div
                      class="relative px-6 py-5 flex items-center space-x-3 hover:bg-gray-50 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-500"
                    >
                      <div class="flex-shrink-0">
                        <img class="h-10 w-10" src="stamp-logo.webp" alt="" />
                      </div>
                      <div class="flex-1 min-w-0">
                        <a href="#" class="focus:outline-none">
                          <!-- Extend touch target to entire panel -->
                          <span class="absolute inset-0" aria-hidden="true" />
                          <p class="text-sm font-medium text-gray-900">
                            {asset.title}
                          </p>
                          <a href="/assets/{asset.id}">View Asset</a>
                        </a>
                      </div>
                    </div>
                  </li>
                {/each}
              </ul>
            </div>
          </nav>
        </div>
      </div>
    </div>
  </div>
{/await}
