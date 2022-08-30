<script>
  import { createEventDispatcher } from "svelte";
  import Avatar from "./avatar.svelte";
  import { atomicToStamp, atomicToBar } from "../lib/utils.js";
  import { myRewards, myBar } from "../lib/app.js";
  import { take, toUpper } from "ramda";

  export let profile = {};
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
</script>

<div class="navbar bg-base-100">
  <div class="flex-1">
    <a class="btn btn-ghost normal-case text-xl">
      <img class="w-[20px] mr-2" src="stamp-logo.webp" alt="stamp-logo" />
      <span class="text-primary">now</span>.arweave.dev
    </a>
  </div>
  <div class="flex-none">
    <ul class="menu menu-horizontal p-0 items-center space-x-4">
      {#if profile.owner}
        {#await myRewards(profile.owner) then rewards}
          <li>
            My Rewards {Number(atomicToStamp(rewards)).toFixed(2)}
          </li>
        {/await}

        <li>
          <button class="btn btn-secondary btn-outline"
            >Post Asset to Now.</button
          >
        </li>
        <li>
          {#await myBar(profile.owner) then bar}
            $BAR {Number(atomicToBar(bar)).toFixed(2)}
          {/await}
        </li>
        <li>
          <a
            target="_blank"
            href="https://bar.arweave.dev"
            class="btn btn-outline"
          >
            Get Bar
          </a>
        </li>
      {/if}
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
    </ul>
    <!--
    <ul class="menu menu-horizontal p-0">
      <li><a href="/">Assets</a></li>
      <li><a href="/about">About</a></li>
    </ul>
    -->
  </div>
</div>
