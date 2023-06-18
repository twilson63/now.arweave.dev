<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "../components/modal.svelte";

  export let open;
  export let ar;
  let amount = "0.0";
  const dispatch = createEventDispatcher();

  function handleBurn() {
    open = false;
    dispatch("burn", { amount });
  }
</script>

<Modal
  bind:open
  bgColor="bg-white"
  border="border-4 border-[#929292]"
  cancel={false}
  ok={false}
>
  <button
    on:click={() => (open = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <div class="px-[36px] py-[24px] flex flex-col space-y-8">
    <h2 class="text-2xl font-bold text-[#160042]">Get $U</h2>
    <p class="text-xl text-[#160042]">Burn AR to get U:</p>
    <p class="text-sm">A Unit of exchange for the Permaweb.</p>
    <div class="form-control">
      <div class="relative">
        <input
          type="text"
          class="input input-bordered w-full"
          bind:value={amount}
        />
        <div
          class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
        >
          <span class="font-normal">AR</span>
        </div>
      </div>
      <label class="label">AR: {ar}</label>
    </div>
    <div>
      <button on:click={handleBurn} class="btn btn-block rounded-none"
        >Burn</button
      >
    </div>
  </div>
</Modal>
