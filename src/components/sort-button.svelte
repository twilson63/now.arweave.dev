<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  let hide = true;

  function change(view) {
    return () => {
      dispatch("change", { view });
      hide = true;
    };
  }
</script>

<div class="relative">
  <button
    on:click={() => (hide = !hide)}
    type="button"
    class="w-full bg-white border border-gray-300 rounded-md shadow-sm px-4 py-2 inline-flex justify-center text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 rounded-none"
    id="sort-menu-button"
    aria-expanded="false"
    aria-haspopup="true"
  >
    <!-- Heroicon name: solid/sort-ascending -->
    <svg
      class="mr-3 h-5 w-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"
      />
    </svg>
    7 Days
    <!-- Heroicon name: solid/chevron-down -->
    <svg
      class="ml-2.5 -mr-1.5 h-5 w-5 text-gray-400"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
  <!-- Dropdown menu, show/hide based on menu state. -->
  <div
    class="origin-top-right z-10 absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none {hide
      ? 'hidden'
      : ''}"
    role="menu"
    aria-orientation="vertical"
    aria-labelledby="sort-menu-button"
    tabindex="-1"
  >
    <div class="py-1" role="none">
      <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
      <button
        on:click={change("whats-hot")}
        class="text-gray-700 block px-4 py-2 text-sm"
        role="menuitem"
        tabindex="-1"
        id="sort-menu-item-0">Today</button
      >
      <button
        on:click={change("whats-new")}
        class="text-gray-700 block px-4 py-2 text-sm"
        role="menuitem"
        tabindex="-1"
        id="sort-menu-item-1">7 Days</button
      >
      <button
        on:click={change("whats-new")}
        class="text-gray-700 block px-4 py-2 text-sm"
        role="menuitem"
        tabindex="-1"
        id="sort-menu-item-1">30 Days</button
      >
    </div>
  </div>
</div>
