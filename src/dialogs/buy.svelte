<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "../components/modal.svelte";
  import Pie from "../components/pie2.svelte";

  export let open;

  export let data = {
    title: "Asset Title",
    percent: 0,
    bar: 0,
  };

  export let buyQty = 0;

  const dispatch = createEventDispatcher();

  $: {
    let purchase = Math.floor(Number(buyQty) / Number(data.price));
    let remaining =
      Number(data.units) - Math.floor(Number(buyQty) / Number(data.price));
    let percent = Math.floor((purchase / remaining) * 100);
    console.log("percent owned", percent);
    data.percent = percent;
  }

  function handleSubmit() {
    dispatch("submit");
  }
  function handleCancel() {
    open = false;
  }
</script>

<Modal {open} ok={false}>
  <button
    on:click={() => (open = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h1 class="mb-16 text-3xl font-bold">
    Purchase Asset: <br /><span class="text-3xl font-normal">{data.name}</span>
  </h1>
  <div class="flex space-x-8">
    <div class="w-[350px]">
      <Pie
        bind:purchase={data.percent}
        available={(data.canPurchase / data.units) * 100 - data.percent}
        notAvailable={((data.units - data.canPurchase - data.owned) /
          data.units) *
          100}
        owned={(data.owned / data.units) * 100}
      />
    </div>
    <div>
      <form class="form" on:submit|preventDefault={handleSubmit}>
        <div class="form-control w-2/3">
          <label class="label" for="spend">I will spend...</label>
          <div class="relative">
            <input
              id="spend"
              type="text"
              class="input input-bordered w-full"
              bind:value={buyQty}
            />
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <!-- Heroicon name: mini/exclamation-circle -->
              <span class="font-bold">$bAR</span>
            </div>
          </div>
        </div>
        <div class="form-control w-2/3">
          <label class="label" for="percent">I will receive...</label>
          <div class="relative">
            <input
              id="percent"
              type="text"
              class="input input-bordered w-full"
              bind:value={data.percent}
              readonly
            />
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <!-- Heroicon name: mini/exclamation-circle -->
              <span class="font-bold">%</span>
            </div>
          </div>
        </div>
        <div class="mt-16">
          <button class="btn btn-outline btn-block rounded-none">Buy</button>
          <!--
          <button
            type="button"
            class="btn btn-outline rounded-none"
            on:click={handleCancel}>Cancel</button
          >
          -->
        </div>
      </form>
    </div>
  </div>
</Modal>
