<script>
  import { createEventDispatcher } from "svelte";
  import Logo from "../assets/logo.svelte";
  import SortButton from "./sort-button.svelte";
  import { atomicToStamp, atomicToBar } from "../lib/utils.js";
  import { myRewards, myBar } from "../lib/app.js";
  import { take, toUpper } from "ramda";

  export let profile = {};
  let view = "hot";
  let days = 7;
  let bar = 0;
  let rewards = 0;

  let text =
    "Check out whats hot with the Stamp Protocol: https://now.arweave.dev 🐘 @permapages";

  const dispatch = createEventDispatcher();

  function connect() {
    dispatch("connect");
  }

  function disconnect() {
    dispatch("disconnect");
  }

  function post() {
    dispatch("post");
  }

  function about() {
    dispatch("about");
  }

  function changeView(v) {
    return (e) => {
      view = v;
      dispatch("change", { view, days });
    };
  }

  function changeDays() {
    dispatch("change", { view, days });
  }
</script>

<div class="navbar bg-base-100 border-2 border-b-slate space-x-8">
  <div class="flex-none">
    <a class="btn btn-ghost normal-case text-xl">
      <Logo />

      <span class="text-primary ml-4">now</span>.arweave.dev
    </a>
  </div>
  <div class="flex-1 space-x-8">
    <div class="tabs">
      <a
        on:click={changeView("hot")}
        class="tab tab-bordered {view === 'hot'
          ? 'tab-active'
          : ''} text-sm text-gray-400 text-primary flex justify-center pb-8"
        ><svg
          width="20"
          height="28"
          viewBox="0 0 20 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M18.8011 23.5808C18.0443 24.9532 16.7195 26.1129 15.2801 26.9341C14.6671 27.284 13.7958 27.6958 13.2928 27.8719C15.48 25.6874 16.2524 22.4462 14.1169 19.9438C13.9485 20.8771 13.4096 21.8172 12.9605 22.2289C12.6619 18.9373 9.33403 17.1738 9.34076 14.6759C5.09451 18.5736 3.58777 25.111 7.724 28C7.21876 27.8445 6.68657 27.6775 6.20378 27.4739C5.03388 26.9821 3.8752 26.1747 2.88942 25.1751C-6.55068 15.5977 10.1693 0.92182 10.093 0C9.94704 1.82534 11.3056 7.99902 13.2614 10.2132C13.6521 9.51785 14.593 8.25063 15.3407 7.84348C14.1237 10.6272 23.1641 15.6824 18.8011 23.5808Z"
            fill={view === "hot" ? "#ff8543" : "#000"}
          />
        </svg>
        <span class="ml-2 {view === 'hot' ? 'font-bold text-primary' : ''}"
          >Hot</span
        ></a
      >
      <a
        on:click={changeView("new")}
        class="tab tab-bordered {view === 'new'
          ? 'tab-active'
          : ''} flex justify-center text-sm"
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M17.9102 4.65937C17.6641 4.75234 17.5 4.9875 17.5 5.25C17.5 5.5125 17.6641 5.74766 17.9102 5.84063L21 7L22.1594 10.0898C22.2523 10.3359 22.4875 10.5 22.75 10.5C23.0125 10.5 23.2477 10.3359 23.3406 10.0898L24.5 7L27.5898 5.84063C27.8359 5.74766 28 5.5125 28 5.25C28 4.9875 27.8359 4.75234 27.5898 4.65937L24.5 3.5L23.3406 0.410156C23.2477 0.164062 23.0125 0 22.75 0C22.4875 0 22.2523 0.164062 22.1594 0.410156L21 3.5L17.9102 4.65937ZM11.2164 4.00859C11.0742 3.69688 10.7625 3.5 10.4234 3.5C10.0844 3.5 9.77266 3.69688 9.63047 4.00859L6.74297 10.243L0.508594 13.125C0.196875 13.2672 0 13.5789 0 13.9234C0 14.268 0.196875 14.5742 0.508594 14.7164L6.74844 17.5984L9.625 23.8328C9.76719 24.1445 10.0789 24.3414 10.418 24.3414C10.757 24.3414 11.0688 24.1445 11.2109 23.8328L14.093 17.593L20.3328 14.7109C20.6445 14.5688 20.8414 14.257 20.8414 13.918C20.8414 13.5789 20.6445 13.2672 20.3328 13.125L14.0984 10.2484L11.2164 4.00859ZM21 21L17.9102 22.1594C17.6641 22.2523 17.5 22.4875 17.5 22.75C17.5 23.0125 17.6641 23.2477 17.9102 23.3406L21 24.5L22.1594 27.5898C22.2523 27.8359 22.4875 28 22.75 28C23.0125 28 23.2477 27.8359 23.3406 27.5898L24.5 24.5L27.5898 23.3406C27.8359 23.2477 28 23.0125 28 22.75C28 22.4875 27.8359 22.2523 27.5898 22.1594L24.5 21L23.3406 17.9102C23.2477 17.6641 23.0125 17.5 22.75 17.5C22.4875 17.5 22.2523 17.6641 22.1594 17.9102L21 21Z"
            fill={view === "new" ? "#04D3EF" : "#000"}
          />
        </svg>

        <span class="ml-2 {view === 'new' ? 'font-bold text-primary' : ''}"
          >New</span
        ></a
      >
    </div>

    <SortButton bind:days on:change={changeDays} />
    <a class="btn bg-[#3DD598] rounded-none">
      <img src="arweave.svg" alt="arweave image" />
      WIN $AR! <span>Click for Details</span>
    </a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal p-0 items-center space-x-none">
      <!--
      {#if profile.owner}
        <li on:click={post}>
          <div
            class="tooltip tooltip-bottom tooltip-primary"
            data-tip="POST Asset to Now"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              class="w-6 h-6"
            >
              <path
                d="M9.97.97a.75.75 0 011.06 0l3 3a.75.75 0 01-1.06 1.06l-1.72-1.72v3.44h-1.5V3.31L8.03 5.03a.75.75 0 01-1.06-1.06l3-3zM9.75 6.75v6a.75.75 0 001.5 0v-6h3a3 3 0 013 3v7.5a3 3 0 01-3 3h-7.5a3 3 0 01-3-3v-7.5a3 3 0 013-3h3z"
              />
              <path
                d="M7.151 21.75a2.999 2.999 0 002.599 1.5h7.5a3 3 0 003-3v-7.5c0-1.11-.603-2.08-1.5-2.599v7.099a4.5 4.5 0 01-4.5 4.5H7.151z"
              />
            </svg>
          </div>
        </li>
      {/if}
      -->
      <li on:click={() => about()}>
        <div
          class="tooltip tooltip-bottom tooltip-primary"
          data-tip="About now.arweave.dev"
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 25 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12.5 0C5.5957 0 0 5.5957 0 12.5C0 19.4043 5.5957 25 12.5 25C19.4043 25 25 19.4043 25 12.5C25 5.5957 19.4043 0 12.5 0ZM12.5 6.25C13.3628 6.25 14.0625 6.94971 14.0625 7.8125C14.0625 8.67529 13.3628 9.375 12.5 9.375C11.6372 9.375 10.9375 8.67676 10.9375 7.8125C10.9375 6.94824 11.6357 6.25 12.5 6.25ZM14.4531 18.75H10.5469C9.90234 18.75 9.375 18.2275 9.375 17.5781C9.375 16.9287 9.8999 16.4062 10.5469 16.4062H11.3281V13.2812H10.9375C10.2905 13.2812 9.76562 12.7563 9.76562 12.1094C9.76562 11.4624 10.293 10.9375 10.9375 10.9375H12.5C13.147 10.9375 13.6719 11.4624 13.6719 12.1094V16.4062H14.4531C15.1001 16.4062 15.625 16.9312 15.625 17.5781C15.625 18.2251 15.1025 18.75 14.4531 18.75Z"
              fill="#44444F"
            />
          </svg>
        </div>
      </li>
      <li>
        <a
          target="_blank"
          class="h-[48px] w-[64px] tooltip tooltip-primary tooltip-bottom"
          data-tip="Join our Discord"
          href="https://discord.com/invite/jRTnwdrxg5"
        >
          <svg
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            viewBox="0 0 30 23"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              d="M25.4353 1.92756C25.427 1.91172 25.4132 1.89931 25.3964 1.89254C23.4513 1.01756 21.3987 0.393631 19.2899 0.0363662C19.2707 0.032874 19.251 0.0353933 19.2333 0.0435659C19.2157 0.0517384 19.2012 0.065148 19.1918 0.0818877C18.9123 0.579267 18.6586 1.09016 18.4316 1.61261C16.1584 1.27429 13.8462 1.27429 11.5731 1.61261C11.3446 1.08883 11.0868 0.577813 10.8009 0.0818877C10.7911 0.0655118 10.7765 0.052411 10.759 0.0442916C10.7415 0.0361721 10.7219 0.0334104 10.7027 0.0363662C8.59374 0.392881 6.541 1.01686 4.59618 1.89259C4.57953 1.89951 4.56549 1.91133 4.55598 1.92641C0.66673 7.621 -0.398682 13.1756 0.123973 18.6614C0.125443 18.6748 0.129656 18.6878 0.136361 18.6996C0.143067 18.7115 0.152127 18.7218 0.163004 18.7302C2.42768 20.3742 4.96074 21.6291 7.6541 22.4414C7.67307 22.4469 7.69332 22.4467 7.71214 22.4406C7.73096 22.4346 7.74744 22.423 7.75936 22.4075C8.33783 21.6358 8.8504 20.8186 9.29186 19.9643C9.29793 19.9526 9.30139 19.9397 9.30202 19.9266C9.30266 19.9134 9.30044 19.9003 9.29553 19.8881C9.29062 19.8759 9.28312 19.8648 9.27353 19.8556C9.26393 19.8464 9.25246 19.8393 9.23987 19.8348C8.43158 19.5316 7.64906 19.1661 6.89966 18.7417C6.88605 18.7338 6.87461 18.7228 6.86637 18.7096C6.85813 18.6964 6.85333 18.6814 6.85239 18.6659C6.85146 18.6505 6.85442 18.635 6.86102 18.621C6.86762 18.6069 6.87765 18.5946 6.89022 18.5853C7.04747 18.4698 7.20481 18.3496 7.35497 18.2283C7.36831 18.2175 7.38445 18.2106 7.40158 18.2083C7.4187 18.2061 7.43614 18.2085 7.45191 18.2155C12.3616 20.4123 17.6769 20.4123 22.5285 18.2155C22.5443 18.2081 22.5619 18.2053 22.5793 18.2073C22.5967 18.2094 22.6131 18.2163 22.6267 18.2271C22.7769 18.3485 22.9342 18.4698 23.0926 18.5853C23.1052 18.5946 23.1153 18.6067 23.122 18.6207C23.1287 18.6348 23.1318 18.6502 23.131 18.6656C23.1302 18.6811 23.1255 18.6961 23.1174 18.7094C23.1092 18.7226 23.0979 18.7337 23.0843 18.7417C22.3366 19.1696 21.5534 19.5349 20.743 19.8337C20.7304 19.8384 20.719 19.8456 20.7094 19.8549C20.6999 19.8643 20.6925 19.8755 20.6877 19.8878C20.6828 19.9001 20.6807 19.9133 20.6815 19.9265C20.6822 19.9397 20.6858 19.9525 20.692 19.9643C21.1408 20.8139 21.6526 21.63 22.2233 22.4062C22.2349 22.4221 22.2513 22.4341 22.2702 22.4403C22.289 22.4466 22.3095 22.4469 22.3285 22.4412C25.0267 21.6317 27.5642 20.3767 29.8317 18.7302C29.8428 18.7223 29.852 18.7121 29.8587 18.7005C29.8654 18.6888 29.8695 18.6759 29.8708 18.6625C30.4965 12.3204 28.8232 6.81132 25.4353 1.92756ZM10.0251 15.3211C8.54691 15.3211 7.32895 13.9911 7.32895 12.3577C7.32895 10.7244 8.52329 9.39429 10.0251 9.39429C11.5386 9.39429 12.7448 10.7359 12.7212 12.3576C12.7212 13.9911 11.5268 15.3211 10.0251 15.3211ZM19.9935 15.3211C18.5154 15.3211 17.2974 13.9911 17.2974 12.3577C17.2974 10.7244 18.4917 9.39429 19.9935 9.39429C21.5071 9.39429 22.7132 10.7359 22.6896 12.3576C22.6896 13.9911 21.5071 15.3211 19.9935 15.3211Z"
              fill="#000"
            /></svg
          >
        </a>
      </li>
      <li>
        <a
          class="h-[48px] w-[64px] tooltip tooltip-bottom tooltip-primary"
          data-tip="Share on Twitter"
          target="_blank"
          href="https://twitter.com/intent/tweet?text={text}"
        >
          <svg
            width="100%"
            height="100%"
            preserveAspectRatio="none"
            viewBox="0 0 30 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            ><path
              d="M26.9162 6.88961C26.9353 7.1561 26.9353 7.42264 26.9353 7.68912C26.9353 15.8172 20.7487 25.1828 9.44162 25.1828C5.95811 25.1828 2.72209 24.1738 0 22.4226C0.494941 22.4797 0.970781 22.4988 1.48477 22.4988C4.35908 22.4988 7.00506 21.528 9.11801 19.8719C6.41496 19.8147 4.14973 18.0445 3.36926 15.6079C3.75 15.665 4.13068 15.703 4.53047 15.703C5.08248 15.703 5.63455 15.6269 6.14848 15.4937C3.33123 14.9226 1.21822 12.448 1.21822 9.45942V9.3833C2.03672 9.84016 2.98857 10.1257 3.99738 10.1637C2.34129 9.05963 1.25631 7.17514 1.25631 5.04315C1.25631 3.90104 1.56082 2.85408 2.09385 1.94037C5.12051 5.67133 9.67002 8.10783 14.7715 8.37438C14.6763 7.91752 14.6192 7.44168 14.6192 6.96578C14.6192 3.57742 17.3603 0.817307 20.7677 0.817307C22.538 0.817307 24.1369 1.55969 25.2601 2.75893C26.6496 2.49244 27.9821 1.97846 29.1623 1.27416C28.7054 2.70186 27.7346 3.9011 26.4593 4.66246C27.6966 4.52928 28.8959 4.18656 29.9999 3.71072C29.1625 4.92895 28.1154 6.01393 26.9162 6.88961V6.88961Z"
              fill="#000"
            /></svg
          >
        </a>
      </li>

      <li>
        {#if profile.owner}
          <figure class="w-[72px]" on:click={disconnect}>
            {#if profile.avatar}
              <div class="avatar mask mask-circle">
                <img src={profile.avatar} alt={profile.name} />
              </div>
            {:else if profile.name && profile.name.toUpperCase() !== "UNKNOWN"}
              <div class="avatar mask mask-circle">
                <div
                  class="bg-gray-400 p-2 h-full w-full flex items-center justify-center text-white"
                >
                  {toUpper(take(2, profile.name))}
                </div>
              </div>
            {:else}
              <div class="avatar mask mask-circle">
                <img src="https://i.pravatar.cc/128" alt="avatar" />
              </div>
            {/if}
          </figure>
        {:else}
          <button class="btn btn-primary text-white" on:click={connect}
            >Connect Wallet</button
          >
        {/if}
      </li>
    </ul>
  </div>
  <div>
    {#if profile.owner}
      <div>
        <div class="flex flex-col justify-start items-start space-y-[0px]">
          <div class="font-bold flex justify-start">
            <span>Balances:</span>
          </div>
          <div class="flex space-x-4">
            {#await myRewards(profile.owner) then rewards}
              <div>
                <span class="text-primary"
                  >{Number(atomicToStamp(rewards)).toFixed(2)}</span
                >
                <span>$STAMP</span>
              </div>
            {/await}
            {#await myBar(profile.owner) then bar}
              <div on:click={() => dispatch("bar")} class="">
                <span class="text-primary"
                  >{Number(atomicToBar(bar)).toFixed(2)}</span
                >
                <span class="underline cursor-pointer">$bAR</span>
              </div>
            {/await}
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>
