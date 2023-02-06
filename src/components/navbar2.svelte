<script>
  let view = "hot";
</script>

<div class="navbar bg-base-100 border-2 border-b-slate space-x-8">
  <div class="flex-none">
    <a href="/" class="btn btn-ghost normal-case text-xl">
      <div class="flex flex-col">
        <div>
          <span class="text-primary ml-4">now</span>
          <span class="float-right text-[8px] mt-[-10px]"
            >v{__APP_VERSION__}</span
          >
        </div>
        <div class="text-[12px] text-[#44444F] font-light">
          A place to trade culture.
        </div>
      </div>
    </a>
  </div>
  <div class="xl:hidden flex-1" />
  <div class="btn-group">
    <button
      class="btn btn-sm {view === 'new' ? 'btn-outline' : ''}"
      on:click={() => (view = "hot")}
    >
      <img class="h-[16px]" src="/hot.svg" />
    </button>
    <button
      class="btn btn-sm {view === 'hot' ? 'btn-outline' : ''}"
      on:click={() => (view = "new")}
    >
      <img class="h-[16px]" src="new.svg" />
    </button>
  </div>
</div>
