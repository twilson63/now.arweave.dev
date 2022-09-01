<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "../components/modal.svelte";

  export let open;

  const dispatch = createEventDispatcher();
</script>

<Modal {open} ok={false}>
  <button
    on:click={() => dispatch("cancel")}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h1 class="text-3xl mb-16">🪧 Post Asset to Now ⚡️</h1>
  <form class="form space-y-8">
    <div class="form-control">
      <label class="label">Title</label>
      <input class="input input-bordered" />
      <div class="label text-sm text-base-400">
        Title of your asset that should describe what your asset is in 150
        characters.
      </div>
    </div>
    <div class="form-control">
      <label class="label">Description</label>
      <textarea
        class="textarea textarea-bordered"
        placeholder="Enter a description of your asset in less than 300 characters."
      />
    </div>
    <div class="form-control">
      <label class="label">Type</label>
      <select class="select select-bordered">
        <option value="choose">choose</option>
        <option value="meme">meme</option>
        <!--
        <option value="image">image</option>
        <option value="video">video</option>
        <option value="audio">audio</option>
        <option value="app">app</option>
        <option value="page">page</option>
        <option value="blogpost">blog post</option>
        <option value="social">social</option>
        -->
      </select>
      <label class="label"
        >** In the future multiple types will be supported (photos, videos,
        audio, apps, blog, social)</label
      >
    </div>
    <!--
    <div class="form-control">
      <label class="label">Uploald</label>
      <input type="file" class="input input-bordered" />
      <div class="label text-sm text-base-400">
        Upload your Asset to the permaweb.
      </div>
    </div>
    -->
    <div class="flex justify-end">
      <button class="btn btn-primary btn-outline">Submit</button>
    </div>
  </form>
</Modal>
