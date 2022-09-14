<script>
  import Modal from "../components/modal.svelte";
  export let open;
  export let id;
  export let title;
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
  <img class="h-[90%] w-full" src="https://arweave.net/{id}" alt={title} />
</Modal>
