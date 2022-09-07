<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "../components/modal.svelte";
  import Pie from "../components/pie.svelte";

  export let open;

  export let data = {
    name: "Asset Title",
    percent: 0,
    bar: 0,
  };

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
    open = false;
  }
</script>

<Modal {open} ok={false}>
  <button
    on:click={() => (open = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h1 class="mb-16 text-3xl font-bold">
    Sell Asset: <br /><span class="text-3xl font-normal">{data.name}</span>
  </h1>
  <div class="flex space-x-8">
    <div>
      <Pie size={200} percent={data.percent} />
    </div>
    <div>
      <form class="form" on:submit|preventDefault={handleSubmit}>
        <div class="form-control w-1/2">
          <label class="label" for="percent">I want to sell...</label>
          <div class="relative">
            <input
              id="percent"
              type="text"
              class="input input-bordered w-full"
              bind:value={sellPercent}
            />
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <span class="font-bold">%</span>
            </div>
          </div>
        </div>
        <div class="form-control w-1/2">
          <label class="label" for="bar">I want to receive...</label>
          <div class="relative">
            <input
              id="bar"
              type="text"
              class="input input-bordered w-full"
              bind:value={bar}
            />
            <div
              class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <span class="font-bold">$bAR</span>
            </div>
          </div>
        </div>
        <div class="mt-16">
          <button class="btn btn-outline rounded-none">Create Order</button>
          <button class="btn btn-outline rounded-none">Cancel Order</button>
          <button class="btn btn-outline rounded-none">Close</button>
        </div>
      </form>
    </div>
  </div>
</Modal>
