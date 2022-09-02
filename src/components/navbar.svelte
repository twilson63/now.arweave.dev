<script>
  import { createEventDispatcher } from "svelte";
  import SortButton from "./sort-button.svelte";
  import { atomicToStamp, atomicToBar } from "../lib/utils.js";
  import { myRewards, myBar } from "../lib/app.js";
  import { take, toUpper } from "ramda";

  export let profile = {};
  let view = "hot";
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
</script>

<div class="navbar bg-base-100 border-2 border-b-slate space-x-8">
  <div class="flex-none">
    <a class="btn btn-ghost normal-case text-xl">
      <svg
        width="35"
        height="35"
        viewBox="0 0 35 35"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <rect width="35" height="35" fill="url(#pattern0)" />
        <defs>
          <pattern
            id="pattern0"
            patternContentUnits="objectBoundingBox"
            width="1"
            height="1"
          >
            <use xlink:href="#image0_3_2" transform="scale(0.00657895)" />
          </pattern>
          <image
            id="image0_3_2"
            width="152"
            height="152"
            xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJgAAACYCAYAAAAYwiAhAAAACXBIWXMAAAsTAAALEwEAmpwYAAAGlmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNy4yLWMwMDAgNzkuMWI2NWE3OSwgMjAyMi8wNi8xMy0xNzo0NjoxNCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczpkYz0iaHR0cDovL3B1cmwub3JnL2RjL2VsZW1lbnRzLzEuMS8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIzLjQgKFdpbmRvd3MpIiB4bXA6Q3JlYXRlRGF0ZT0iMjAyMi0wOC0wNVQxNTo0ODowNi0wNzowMCIgeG1wOk1ldGFkYXRhRGF0ZT0iMjAyMi0wOC0yOVQxNzoxODo1My0wNzowMCIgeG1wOk1vZGlmeURhdGU9IjIwMjItMDgtMjlUMTc6MTg6NTMtMDc6MDAiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NjEzZWE0ZjgtNzZlMy04YjQ3LWFiNmEtZDQyODhlZDg3YjhjIiB4bXBNTTpEb2N1bWVudElEPSJhZG9iZTpkb2NpZDpwaG90b3Nob3A6ZGMwZWQ4YWItZmUwZS05MzQwLWJiNWUtM2JmZDMxYWFhNGE1IiB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6ZWYwNmY1MDYtZTM2Zi1jMzQ2LWI5N2MtNTUxY2ZmNTE0NjBiIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZWYwNmY1MDYtZTM2Zi1jMzQ2LWI5N2MtNTUxY2ZmNTE0NjBiIiBzdEV2dDp3aGVuPSIyMDIyLTA4LTA1VDE1OjQ4OjA2LTA3OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjMuNCAoV2luZG93cykiLz4gPHJkZjpsaSBzdEV2dDphY3Rpb249InNhdmVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjlhNGVjZGZjLTgwMDQtOTA0Yi04N2IxLWQ0YzZiMDYxY2Y3YiIgc3RFdnQ6d2hlbj0iMjAyMi0wOC0wNVQxNTo0ODowNi0wNzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIDIzLjQgKFdpbmRvd3MpIiBzdEV2dDpjaGFuZ2VkPSIvIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDo2MTNlYTRmOC03NmUzLThiNDctYWI2YS1kNDI4OGVkODdiOGMiIHN0RXZ0OndoZW49IjIwMjItMDgtMjlUMTc6MTg6NTMtMDc6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCAyMy41IChXaW5kb3dzKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7KXIVeAAATXUlEQVR4nO2de5AV1Z3HP/24wyCgiLAyMEQUEB8wvETF6AIiRjGrxEUtk7JW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"
          />
        </defs>
      </svg>

      <span class="text-primary ml-4">now</span>.arweave.dev
    </a>
  </div>
  <div class="flex-1 space-x-8">
    <div class="tabs">
      <a
        class="tab tab-bordered text-sm text-gray-400 text-primary flex justify-center pb-8"
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
            fill="#000"
          />
        </svg>
        &nbsp;&nbsp;Hot</a
      >
      <a
        class="tab tab-bordered tab-active border-primary flex justify-center text-sm text-primary pb-8"
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
            fill="#04D3EF"
          />
        </svg>

        &nbsp;New</a
      >
    </div>

    <SortButton />
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal p-0 items-center space-x-none">
      <li>
        <button class="btn btn-ghost">
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
        </button>
      </li>
      <li>
        <a
          class="h-[48px] w-[64px]"
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
        <a
          target="_blank"
          class="h-[48px] w-[64px]"
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
      {#if profile.owner}
        <li>
          <div class="flex flex-col justify-start items-start space-y-[0px]">
            <div class="font-bold flex justify-start">
              <span>Balances:</span>
            </div>
            <div class="flex space-x-4">
              {#await myBar(profile.owner) then bar}
                <div class="">
                  <span class="text-primary"
                    >{Number(atomicToBar(bar)).toFixed(2)}</span
                  >
                  <span>$bAR</span>
                </div>
              {/await}
              {#await myRewards(profile.owner) then rewards}
                <div>
                  <span class="text-primary"
                    >{Number(atomicToStamp(rewards)).toFixed(2)}</span
                  >
                  <span>$STAMP</span>
                </div>
              {/await}
            </div>
          </div>
        </li>
      {/if}
    </ul>
    <!--
    <ul class="menu menu-horizontal p-0">
      <li><a href="/">Assets</a></li>
      <li><a href="/about">About</a></li>
    </ul>
    -->
  </div>
</div>
