<script>
  import { take, toUpper } from "ramda";
  export let avatar;
  export let name;
</script>

<div class="avatar">
  <div class="w-10 h-10">
    {#if name}
      <div
        class="mask mask-circle bg-gray-400 h-full flex items-center justify-center text-white"
      >
        {toUpper(take(2, name))}
      </div>
    {:else}
      <img class="mask mask-circle" src={avatar} />
    {/if}
  </div>
</div>
