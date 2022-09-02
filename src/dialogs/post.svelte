<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "../components/modal.svelte";
  import Logo from "../assets/logo.svelte";

  export let open;

  let data = {};

  const dispatch = createEventDispatcher();
</script>

<Modal {open} ok={false}>
  <button
    on:click={() => dispatch("cancel")}
    class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
  >
  <h1 class="text-3xl mb-4 flex space-x-4">
    <Logo />
    <span>Post Asset to Now</span>
  </h1>
  <div class="border-2 border-primary p-8">
    <p>
      Create a meme from one of these fine meme creators and upload it to
      Arweave!
      <br />
      <a
        target="_blank"
        class="link"
        href="https://arweave.net/AUWJcMf9JtwTVXybvoH0GUlkETKC5CTqZodMOkprPUM"
        >Meme Generator (arweave)</a
      >
      or
      <a target="_blank" class="link" href="https://imgflip.com/memegenerator"
        >ImgFlip</a
      >
    </p>
  </div>
  <form
    class="form space-y-8"
    on:submit|preventDefault={() => dispatch("submit", data)}
  >
    <div class="form-control">
      <label class="label">Title</label>
      <input class="input input-bordered" bind:value={data.title} />
      <div class="label text-sm text-base-400">
        Title of your asset that should describe what your asset is in 150
        characters.
      </div>
    </div>
    <div class="form-control">
      <label class="label">Description</label>
      <textarea
        bind:value={data.description}
        class="textarea textarea-bordered"
        placeholder="Enter a description of your asset in less than 300 characters."
      />
    </div>
    <div class="form-control">
      <label class="label">Type</label>
      <select class="select select-bordered" bind:value={data.type}>
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
