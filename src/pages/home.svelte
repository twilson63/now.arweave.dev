<script>
  //import { formatDistanceToNow } from "date-fns";
  import Item from "../components/item.svelte";
  import Modal from "../components/modal.svelte";
  import SideNav from "../components/side-nav.svelte";
  import NavBar from "../components/navbar.svelte";
  import SortButton from "../components/sort-button.svelte";
  import { keys, groupBy, reduce } from "ramda";
  import { listAssets } from "../lib/app.js";

  let sellDialog = false;
  let buyDialog = false;

  const arweave = Arweave.init({
    host: "arweave.net",
    port: 443,
    protocol: "https",
  });
  const { WarpWebFactory, LoggerFactory } = window.warp;
  LoggerFactory.INST.logLevel("error");

  const STAMPCOIN = "9nDWI3eHrMQbrfs9j8_YPfLbYJmBodgn7cBCG8bii4o";
  const warp = WarpWebFactory.memCached(arweave);
  let defaultAvatarUrl =
    "https://tgbcqufuppegmlhigt2zosiv2q55qty4t4rg2gebmfm4vpvf.arweave.net/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0";

  async function getStamps() {
    return listAssets();
  }

  async function getTitle(contractId) {
    const query = (txId) => `query {
  transaction(id: "${txId}") {
    tags {
      name
      value
    }
  }
}
`;
    const result = await arweave.api.post("graphql", {
      query: query(contractId),
    });
    const tags = result?.data?.data?.transaction?.tags;
    return tags.find((t) => t.name === "Page-Title")?.value || "unknown";
  }

  async function getProfile(addr) {
    const query = (addr) => `query {
  transactions(
    first : 1,
    owners: ["${addr}"],
    tags: [
      { name: "Protocol", values: ["PermaProfile-v0.1"]}
    ]
  ) {
    edges {
      node {
        id
        owner {
          address
        },
        tags {
          name
          value
        }
      }
    }
  }
}  
`;
    const result = await arweave.api.post("graphql", { query: query(addr) });
    const edges = result?.data?.data?.transactions?.edges;
    if (edges.length === 0)
      return {
        name: `${addr.substring(0, 2)}-${addr.substring(40)}`,
        avatar: defaultAvatarUrl,
      };
    const { node } = edges[0];
    const name =
      node.tags.find((t) => t.name === "Profile-Name")?.value || "unknown";
    const avatar =
      node.tags.find((t) => t.name === "Profile-Avatar")?.value ||
      defaultAvatarUrl;
    return { name, avatar };
  }
</script>

<NavBar />
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
        <SortButton />
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
          <Item {stamp} on:sell={() => (sellDialog = true)} />
        {/each}
      {/await}

      <!-- More projects... -->
    </ul>
  </div>
</div>
<Modal open={sellDialog} on:click={() => (sellDialog = false)}>
  <h3 class="modal-title">Sell Meme</h3>
</Modal>
