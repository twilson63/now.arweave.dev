<script>
  import { createEventDispatcher } from "svelte";
  import Avatar from "./avatar.svelte";
  import { head, sort, take, takeLast, split, join, compose } from "ramda";
  import { readState, getOwner } from "../lib/app.js";
  import { atomicToBar, getHost } from "../lib/utils.js";
  import { tweened } from "svelte/motion";
  import Pie from "./pie.svelte";
  import { profile } from "../store.js";

  const host = getHost(window.location.hostname);
  let percent = 0;
  const store = tweened(0, { duration: 1000 });
  //const store = spring(0, {stiffness: 0.3, damping: 0.3});
  $: store.set(percent);

  export let stamp;

  let unitsTotal = 0;
  let unitsAvailable = 0;
  let lowestPrice = 0;
  let preview = false;

  let alreadyStamped = $profile
    ? !!stamp.stampers.find((s) => s.id === $profile.owner)
    : false;

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
      percent: 0,
      price: "0.01",
      units: unitsTotal,
      canPurchase: unitsAvailable,
    });
  }
  function handleBuy() {
    dispatch("buy", {
      contract: stamp.asset,
      name: stamp.title,
      units: unitsTotal,
      canPurchase: unitsAvailable,
      price: lowestPrice,
      percent: 0,
    });
  }
  async function getContract() {
    const info = await readState(stamp.asset);

    return info;
  }

  function showOrderTotal(state) {
    unitsTotal = Object.values(state.balances).reduce((a, b) => a + b, 0);
    if (state.pairs && state.pairs[0]) {
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
      ).toFixed(6)} $BAR</span></div>`;
    } else {
      unitsAvailable = 0;
      return `<div>0 % available</div>`;
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
        <div class="hidden md:flex flex-col">
          <button
            on:click|stopPropagation={handleStamp}
            class="btn btn-ghost btn-primary rounded-none"
          >
            <svg
              width="47"
              height="47"
              viewBox="0 0 47 47"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M45.4268 42.9727C45.4273 42.5558 45.5932 42.1561 45.8882 41.8615C46.1832 41.5668 46.5831 41.4013 47 41.4013V39.6772C46.5828 39.6772 46.1826 39.5115 45.8876 39.2165C45.5926 38.9215 45.4268 38.5214 45.4268 38.1042C45.4268 37.687 45.5926 37.2869 45.8876 36.9919C46.1826 36.6969 46.5828 36.5312 47 36.5312V34.8088C46.5828 34.8088 46.1826 34.643 45.8876 34.348C45.5926 34.053 45.4268 33.6529 45.4268 33.2357C45.4268 32.8185 45.5926 32.4184 45.8876 32.1234C46.1826 31.8284 46.5828 31.6627 47 31.6627V29.9403C46.7934 29.9403 46.5888 29.8996 46.398 29.8205C46.2071 29.7415 46.0337 29.6256 45.8876 29.4795C45.7415 29.3335 45.6256 29.1601 45.5466 28.9692C45.4675 28.7784 45.4268 28.5738 45.4268 28.3672C45.4268 28.1607 45.4675 27.9561 45.5466 27.7653C45.6256 27.5744 45.7415 27.401 45.8876 27.2549C46.0337 27.1089 46.2071 26.993 46.398 26.9139C46.5888 26.8349 46.7934 26.7942 47 26.7942V25.0718C46.7904 25.0766 46.582 25.0395 46.3869 24.9626C46.1919 24.8858 46.0142 24.7707 45.8642 24.6242C45.7143 24.4777 45.5952 24.3027 45.5138 24.1095C45.4325 23.9163 45.3906 23.7088 45.3906 23.4992C45.3906 23.2895 45.4325 23.082 45.5138 22.8888C45.5952 22.6956 45.7143 22.5206 45.8642 22.3741C46.0142 22.2276 46.1919 22.1125 46.3869 22.0357C46.582 21.9588 46.7904 21.9217 47 21.9265V20.205C46.7904 20.2098 46.582 20.1727 46.3869 20.0958C46.1919 20.019 46.0142 19.9039 45.8642 19.7574C45.7143 19.6109 45.5952 19.4359 45.5138 19.2427C45.4325 19.0495 45.3906 18.842 45.3906 18.6323C45.3906 18.4227 45.4325 18.2152 45.5138 18.022C45.5952 17.8288 45.7143 17.6538 45.8642 17.5073C46.0142 17.3608 46.1919 17.2457 46.3869 17.1689C46.582 17.092 46.7904 17.0549 47 17.0597V15.3356C46.5828 15.3356 46.1826 15.1699 45.8876 14.8749C45.5926 14.5799 45.4268 14.1798 45.4268 13.7626C45.4268 13.3454 45.5926 12.9453 45.8876 12.6503C46.1826 12.3553 46.5828 12.1896 47 12.1896V10.4672C46.5828 10.4672 46.1826 10.3014 45.8876 10.0064C45.5926 9.71143 45.4268 9.31132 45.4268 8.89413C45.4268 8.47693 45.5926 8.07682 45.8876 7.78182C46.1826 7.48682 46.5828 7.32109 47 7.32109V5.60118C46.5828 5.60118 46.1826 5.43545 45.8876 5.14045C45.5926 4.84545 45.4268 4.44534 45.4268 4.02814C45.4268 3.61095 45.5926 3.21084 45.8876 2.91584C46.1826 2.62084 46.5828 2.45511 47 2.45511V0H44.5472C44.5472 0.417195 44.3814 0.817303 44.0864 1.11231C43.7914 1.40731 43.3912 1.57304 42.974 1.57304C42.5568 1.57304 42.1566 1.40731 41.8616 1.11231C41.5666 0.817303 41.4008 0.417195 41.4008 0H39.6783C39.6831 0.209568 39.646 0.417987 39.5691 0.61301C39.4922 0.808033 39.3772 0.985727 39.2306 1.13565C39.0841 1.28557 38.9091 1.4047 38.7159 1.48603C38.5227 1.56737 38.3151 1.60927 38.1055 1.60927C37.8959 1.60927 37.6883 1.56737 37.4951 1.48603C37.3019 1.4047 37.1269 1.28557 36.9804 1.13565C36.8338 0.985727 36.7188 0.808033 36.6419 0.61301C36.565 0.417987 36.5279 0.209568 36.5327 0H34.8093C34.8142 0.209568 34.7771 0.417987 34.7002 0.61301C34.6233 0.808033 34.5082 0.985727 34.3617 1.13565C34.2152 1.28557 34.0402 1.4047 33.847 1.48603C33.6538 1.56737 33.4462 1.60927 33.2366 1.60927C33.0269 1.60927 32.8194 1.56737 32.6262 1.48603C32.433 1.4047 32.258 1.28557 32.1114 1.13565C31.9649 0.985727 31.8498 0.808033 31.773 0.61301C31.6961 0.417987 31.659 0.209568 31.6638 0H29.9413C29.9413 0.417195 29.7755 0.817303 29.4805 1.11231C29.1855 1.40731 28.7853 1.57304 28.3681 1.57304C27.9508 1.57304 27.5507 1.40731 27.2557 1.11231C26.9607 0.817303 26.7949 0.417195 26.7949 0H25.0723C25.0723 0.417195 24.9066 0.817303 24.6116 1.11231C24.3165 1.40731 23.9164 1.57304 23.4992 1.57304C23.0819 1.57304 22.6818 1.40731 22.3868 1.11231C22.0917 0.817303 21.926 0.417195 21.926 0H20.2034C20.2034 0.206574 20.1627 0.411126 20.0837 0.601975C20.0046 0.792825 19.8887 0.966235 19.7427 1.11231C19.5966 1.25837 19.4231 1.37424 19.2323 1.4533C19.0414 1.53235 18.8368 1.57304 18.6302 1.57304C18.4237 1.57304 18.2191 1.53235 18.0282 1.4533C17.8374 1.37424 17.6639 1.25837 17.5178 1.11231C17.3718 0.966235 17.2559 0.792825 17.1768 0.601975C17.0978 0.411126 17.0571 0.206574 17.0571 0H15.3345C15.3345 0.417195 15.1688 0.817303 14.8737 1.11231C14.5787 1.40731 14.1786 1.57304 13.7613 1.57304C13.3441 1.57304 12.944 1.40731 12.6489 1.11231C12.3539 0.817303 12.1882 0.417195 12.1882 0H10.4656C10.4704 0.209568 10.4333 0.417987 10.3564 0.61301C10.2796 0.808033 10.1645 0.985727 10.018 1.13565C9.87145 1.28557 9.69643 1.4047 9.50322 1.48603C9.31 1.56737 9.10247 1.60927 8.89283 1.60927C8.68319 1.60927 8.47566 1.56737 8.28244 1.48603C8.08922 1.4047 7.91421 1.28557 7.76769 1.13565C7.62117 0.985727 7.50609 0.808033 7.42922 0.61301C7.35235 0.417987 7.31524 0.209568 7.32007 0H5.5975C5.5975 0.417195 5.43176 0.817303 5.13673 1.11231C4.8417 1.40731 4.44156 1.57304 4.02433 1.57304C3.60709 1.57304 3.20695 1.40731 2.91192 1.11231C2.6169 0.817303 2.45115 0.417195 2.45115 0H0V2.4526C0.417232 2.4526 0.817376 2.61833 1.1124 2.91333C1.40743 3.20834 1.57318 3.60844 1.57318 4.02564C1.57318 4.44283 1.40743 4.84294 1.1124 5.13794C0.817376 5.43295 0.417232 5.59868 0 5.59868V7.32109C0.417232 7.32109 0.817376 7.48682 1.1124 7.78182C1.40743 8.07682 1.57318 8.47693 1.57318 8.89413C1.57318 9.31132 1.40743 9.71143 1.1124 10.0064C0.817376 10.3014 0.417232 10.4672 0 10.4672V12.1937C0.417232 12.1937 0.817376 12.3595 1.1124 12.6545C1.40743 12.9495 1.57318 13.3496 1.57318 13.7668C1.57318 14.184 1.40743 14.5841 1.1124 14.8791C0.817376 15.1741 0.417232 15.3398 0 15.3398V17.0622C0.40426 17.0809 0.785789 17.2546 1.06528 17.5472C1.34477 17.8399 1.50073 18.2289 1.50073 18.6336C1.50073 19.0383 1.34477 19.4273 1.06528 19.72C0.785789 20.0126 0.40426 20.1863 0 20.205V21.9282C0.410849 21.9377 0.801683 22.1075 1.08891 22.4014C1.37613 22.6953 1.53694 23.0899 1.53694 23.5008C1.53694 23.9118 1.37613 24.3064 1.08891 24.6003C0.801683 24.8941 0.410849 25.064 0 25.0735V26.7975C0.417232 26.7975 0.817376 26.9633 1.1124 27.2583C1.40743 27.5533 1.57318 27.9534 1.57318 28.3706C1.57318 28.7878 1.40743 29.1879 1.1124 29.4829C0.817376 29.7779 0.417232 29.9436 0 29.9436V31.6627C0.417232 31.6627 0.817376 31.8284 1.1124 32.1234C1.40743 32.4184 1.57318 32.8185 1.57318 33.2357C1.57318 33.6529 1.40743 34.053 1.1124 34.348C0.817376 34.643 0.417232 34.8088 0 34.8088V36.5312C0.417232 36.5312 0.817376 36.6969 1.1124 36.9919C1.40743 37.2869 1.57318 37.687 1.57318 38.1042C1.57318 38.5214 1.40743 38.9215 1.1124 39.2165C0.817376 39.5115 0.417232 39.6772 0 39.6772V41.4013C0.417232 41.4013 0.817376 41.5671 1.1124 41.8621C1.40743 42.1571 1.57318 42.5572 1.57318 42.9744C1.57318 43.3916 1.40743 43.7917 1.1124 44.0867C0.817376 44.3817 0.417232 44.5474 0 44.5474V47H2.45282C2.45282 46.7934 2.49351 46.5889 2.57257 46.398C2.65163 46.2072 2.76751 46.0338 2.91359 45.8877C3.05968 45.7416 3.2331 45.6258 3.42397 45.5467C3.61484 45.4676 3.8194 45.427 4.026 45.427C4.23259 45.427 4.43716 45.4676 4.62802 45.5467C4.81889 45.6258 4.99232 45.7416 5.1384 45.8877C5.28448 46.0338 5.40036 46.2072 5.47942 46.398C5.55848 46.5889 5.59917 46.7934 5.59917 47H7.32174C7.31691 46.7904 7.35402 46.582 7.43089 46.387C7.50776 46.192 7.62283 46.0143 7.76936 45.8643C7.91588 45.7144 8.09089 45.5953 8.28411 45.514C8.47733 45.4326 8.68486 45.3907 8.8945 45.3907C9.10414 45.3907 9.31167 45.4326 9.50488 45.514C9.6981 45.5953 9.87312 45.7144 10.0196 45.8643C10.1662 46.0143 10.2812 46.192 10.3581 46.387C10.435 46.582 10.4721 46.7904 10.4673 47H12.1848C12.1848 46.5828 12.3506 46.1827 12.6456 45.8877C12.9406 45.5927 13.3408 45.427 13.758 45.427C14.1752 45.427 14.5754 45.5927 14.8704 45.8877C15.1654 46.1827 15.3312 46.5828 15.3312 47H17.0537C17.0537 46.5828 17.2195 46.1827 17.5145 45.8877C17.8095 45.5927 18.2097 45.427 18.6269 45.427C19.0441 45.427 19.4443 45.5927 19.7393 45.8877C20.0343 46.1827 20.2001 46.5828 20.2001 47H21.9227C21.9227 46.5828 22.0884 46.1827 22.3834 45.8877C22.6785 45.5927 23.0786 45.427 23.4958 45.427C23.9131 45.427 24.3132 45.5927 24.6082 45.8877C24.9033 46.1827 25.069 46.5828 25.069 47H26.7916C26.7916 46.5828 26.9573 46.1827 27.2523 45.8877C27.5474 45.5927 27.9475 45.427 28.3647 45.427C28.782 45.427 29.1821 45.5927 29.4772 45.8877C29.7722 46.1827 29.9379 46.5828 29.9379 47H31.6638C31.659 46.7904 31.6961 46.582 31.773 46.387C31.8498 46.192 31.9649 46.0143 32.1114 45.8643C32.258 45.7144 32.433 45.5953 32.6262 45.514C32.8194 45.4326 33.0269 45.3907 33.2366 45.3907C33.4462 45.3907 33.6538 45.4326 33.847 45.514C34.0402 45.5953 34.2152 45.7144 34.3617 45.8643C34.5082 46.0143 34.6233 46.192 34.7002 46.387C34.7771 46.582 34.8142 46.7904 34.8093 47H36.5327C36.5279 46.7904 36.565 46.582 36.6419 46.387C36.7188 46.192 36.8338 46.0143 36.9804 45.8643C37.1269 45.7144 37.3019 45.5953 37.4951 45.514C37.6883 45.4326 37.8959 45.3907 38.1055 45.3907C38.3151 45.3907 38.5227 45.4326 38.7159 45.514C38.9091 45.5953 39.0841 45.7144 39.2306 45.8643C39.3772 46.0143 39.4922 46.192 39.5691 46.387C39.646 46.582 39.6831 46.7904 39.6783 47H41.4008C41.4008 46.5828 41.5666 46.1827 41.8616 45.8877C42.1566 45.5927 42.5568 45.427 42.974 45.427C43.3912 45.427 43.7914 45.5927 44.0864 45.8877C44.3814 46.1827 44.5472 46.5828 44.5472 47H47V44.5457C46.5828 44.5457 46.1826 44.38 45.8876 44.085C45.5926 43.79 45.4268 43.3899 45.4268 42.9727V42.9727Z"
                fill="#7189FF"
              />
              <path d="M41 6H6V41H41V6Z" fill="white" />
              <path
                d="M20.8333 24.5V24H20.3333H14.5V23.2151L23.5 14.6888L32.5 23.2151V24H26.6667H26.1667V24.5V34.5H20.8333V24.5Z"
                fill={alreadyStamped ? "#3DD598" : "white"}
                stroke="#7189FF"
              />
            </svg>
          </button>
          <div class="text-sm text-primary text-center font-bold">
            {stamp.count}
          </div>
        </div>
        <figure class="hidden md:block">
          {#await getOwner(stamp.asset) then owner}
            {#if owner.avatar}
              <Avatar avatar={owner.avatar} />
            {:else if owner.name && owner.name.toUpperCase() !== "UNKNOWN"}
              <Avatar name={owner.name} />
            {:else}
              <div class="avatar mask mask-circle">
                <div class="bg-gray-400 text-gray-400 h-[48px] w-[48px]" />
              </div>
            {/if}
          {/await}
        </figure>
        <div class="flex-1 flex flex-col md:w-[450px]">
          <h2 class="text-xl font-bold">
            {#if stamp.type === "image"}
              <a
                target="_blank"
                href="https://img.arweave.dev/#/show/{stamp.asset}"
              >
                {stamp.title.length > 35
                  ? take(35, stamp.title) + "..."
                  : stamp.title}
                <span class="text-sm font-normal"
                  >({take(4, stamp.asset)}...{takeLast(4, stamp.asset)})</span
                >
              </a>
            {:else if stamp.renderWith !== "" && stamp.renderWith.length === "43"}
              <a
                target="_blank"
                href={`https://arweave.net/${stamp.renderWith}?tx=${stamp.asset}`}
              >
                {stamp.title.length > 35
                  ? take(35, stamp.title) + "..."
                  : stamp.title}
                <span class="text-sm font-normal"
                  >({take(4, stamp.asset)}...{takeLast(4, stamp.asset)})</span
                >
              </a>
            {:else if stamp.renderWith !== ""}
              <a
                target="_blank"
                href={`https://${stamp.renderWith}.${host}/?tx=${stamp.asset}`}
              >
                {stamp.title.length > 35
                  ? take(35, stamp.title) + "..."
                  : stamp.title}
                <span class="text-sm font-normal"
                  >({take(4, stamp.asset)}...{takeLast(4, stamp.asset)})</span
                >
              </a>
            {:else}
              <a target="_blank" href="https://arweave.net/{stamp.asset}">
                {stamp.title.length > 35
                  ? take(35, stamp.title) + "..."
                  : stamp.title}
                <span class="text-sm font-normal"
                  >({take(4, stamp.asset)}...{takeLast(4, stamp.asset)})</span
                >
              </a>
            {/if}
          </h2>

          <p class="text-[12px]">
            {compose(join(" "), take(50), split(" "))(stamp.description)}
          </p>
          <div class="flex space-x-2">
            {#if unitsAvailable > 0}
              <div class="mt-2 badge badge-success text-white">For Sale</div>
            {/if}
            <div class="mt-2 badge bg-gray-400 border-gray-400">
              {stamp.type}
            </div>

            {#if preview === false}
              <img
                on:click={() => (preview = true)}
                class="mt-2 w-[15px]"
                src="expand.svg"
                alt="expand image"
              />
            {/if}
            {#if preview === true}
              <img
                on:click={() => (preview = false)}
                class="mt-2 w-[15px]"
                src="down.svg"
                alt="close image"
              />
            {/if}
          </div>
        </div>
      </div>
    </div>
    <div class="hidden flex-none flex flex-col">
      <div>First Stamped: {new Date(stamp.firstStamped).toISOString()}</div>
      <div>Last Stamped: {new Date(stamp.lastStamped).toISOString()}</div>
    </div>
    {#await getContract() then state}
      <!--
      <div class="flex-none flex flex-col w-[250px]">
        <div class="">Collectors</div>
        <div class="flex space-x-2 items-center">
          <div class="avatar-group -space-x-6">
            {#await keys(state.balances).reduce((a, b) => ($collectors.find((p) => p.owner == b) ? [...a, $collectors.find((p) => p.owner == b)] : a), []) then collectors}
              {#each take(5, collectors) as c}
                {#if c.avatar}
                  <Avatar avatar={c.avatar} />
                {:else if c.name}
                  <Avatar name={take(2, c.name)} />
                {:else}
                  <Avatar name={"AA"} />
                {/if}
              {:else}
                <Avatar name={"BB"} />
              {/each}
            {/await}
          </div>
          {#if keys(state.balances).length > 5}
            <span class="ml-8 text-[#696974] text-[14px]"
              >+{keys(state.balances).length - 5}</span
            >
          {/if}
        </div>
      </div>
-->
      <div class="hidden flex-none flex flex-col w-[300px] pl-[50px]">
        {#if ((state.pairs && state.pairs[0]?.orders) || []).length > 0}
          <div class="badge bg-success text-white rounded-none border-none">
            For Sale
          </div>
        {/if}
        {@html showOrderTotal(state)}
      </div>
    {/await}
    <div class="hidden w-[600px] lg:flex flex-col">
      <div class="">Stampers</div>
      <div class="flex space-x-2 items-center">
        <div class="avatar-group -space-x-6">
          {#each take(15, stamp.stampers.reverse()) as stamper}
            {#if stamper.avatar}
              <Avatar avatar={stamper.avatar} />
            {:else if stamper.name && stamper.name.toUpperCase() !== "UNKNOWN"}
              <Avatar name={stamper.name} avatar="https://i.pravatar.cc/128" />
            {:else}
              <Avatar
                name={take(2, stamp.asset)}
                avatar="https://i.pravatar.cc/128"
              />
            {/if}
          {/each}
        </div>
        {#if stamp.stampers.length > 15}
          <span class="ml-8 text-[#696974] text-[14px]"
            >+{stamp.stampers.length - 15}</span
          >
        {/if}
      </div>
    </div>
    <div class="hidden">
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
    <div class="hidden flex-none md:flex flex-col items-start space-y-3">
      <div class="flex space-x-4">
        <div class="flex-none flex items-center justify-center">
          <Pie size={50} {percent} />
        </div>
        <button
          class="btn btn-outline btn-success rounded-none"
          on:click|stopPropagation={handleBuy}>Buy</button
        >
        <button
          class="btn btn-outline btn-error rounded-none"
          on:click|stopPropagation={handleSell}>Sell</button
        >
      </div>
    </div>
  </div>
  {#if preview}
    {#if stamp.type === "image"}
      <img
        class="mt-4 w-[600px] h-[350px]"
        src={"https://arweave.net/" + stamp.asset}
        alt={stamp.title}
      />
    {:else if stamp.renderWith !== "" && stamp.renderWith.length === "43"}
      <iframe
        class="mt-4 w-[600px] h-[350px]"
        src={`https://arweave.net/${stamp.renderWith}?tx=${stamp.asset}`}
        alt={stamp.title}
      />
    {:else if stamp.renderWith !== ""}
      <iframe
        class="mt-4 w-[600px] h-[350px]"
        src={`https://${stamp.renderWith}.${host}/?tx=${stamp.asset}`}
        alt={stamp.title}
      />
    {:else if stamp.type === "video"}
      <video class="mt-4 w-[600px] h-[350px]" controls>
        <source src={"https://arweave.net/" + stamp.asset} />
      </video>
    {:else}
      <iframe
        class="mt-4 w-[600px] h-[350px]"
        src={"https://arweave.net/" + stamp.asset}
        alt={stamp.title}
      />
    {/if}
  {/if}
</li>
