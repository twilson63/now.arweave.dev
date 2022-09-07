<script>
  import Modal from "../components/modal.svelte";
  import { createEventDispatcher } from "svelte";
  export let open;
  const dispatch = createEventDispatcher();

  function handleConnect(wallet) {
    return () => {
      dispatch("connect", { wallet });
    };
  }
</script>

<Modal {open} ok={false}>
  <h2 class="text-lg">Connect Wallet</h2>
  <button
    on:click={() => (open = false)}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <div class="mt-8">
    <ul>
      <li>
        <button on:click={handleConnect("arconnect")} class="btn btn-ghost"
          >ArConnect</button
        >
      </li>
      <li>
        <button on:click={handleConnect("arweaveapp")} class="btn btn-ghost"
          >Arweave.app</button
        >
      </li>
    </ul>
  </div>
</Modal>
