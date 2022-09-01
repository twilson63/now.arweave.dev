<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "../components/modal.svelte";

  import { compose, path } from "ramda";

  export let open;
  const dispatch = createEventDispatcher();

  let data = { files: [] };
</script>

<Modal {open} ok={false}>
  <button
    on:click={() => dispatch("cancel")}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h1 class="text-3xl mb-16">⚡️ Upload Asset ⚡️</h1>
  <form
    class="form space-y-8"
    on:submit|preventDefault={() => {
      dispatch("submit", data);
    }}
  >
    <div class="form-control">
      <label class="label">Choose Currency</label>
      <select class="select select-bordered">
        <option value="choose">choose</option>
        <option value="AR">AR</option>
        <!--
        <option value="MATIC">MATIC</option>
        <option value="SOL">SOL</option>
        -->
      </select>
      <div class="label text-sm text-base-400">
        In order to upload your Asset, you need to use $AR, $MATIC, or $SOL.
        More wallets will be added soon.
      </div>
    </div>
    <div class="form-control">
      <label class="label">Upload</label>
      <input
        type="file"
        class="input input-bordered"
        bind:files={data.files}
        accept="image/png, image/jpeg, image/jpg, image/svg+xml"
      />
      <div class="label text-sm text-base-400">
        Upload your Asset to the permaweb.
      </div>
    </div>

    <div class="flex justify-end">
      <button class="btn btn-primary btn-outline">Upload</button>
    </div>
  </form>
</Modal>
