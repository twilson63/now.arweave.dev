<script>
  import { createEventDispatcher } from "svelte";
  import Modal from "../components/modal.svelte";
  import Logo from "../assets/logo.svelte";

  export let open;

  let data = {};

  const dispatch = createEventDispatcher();
</script>

<input type="checkbox" bind:checked={open} class="modal-toggle" />
<div class="modal">
  <div class="modal-box w-full">
    <button
      on:click={() => (open = false)}
      class="btn btn-sm btn-circle absolute right-2 top-2">✕</button
    >
    <h1 class="text-3xl mb-4 flex space-x-4">
      <Logo />
      <span>Publish Content</span>
    </h1>
    <div class="mt-8 flex flex-col space-y-8">
      <a
        href="https://pages.arweave.dev"
        target="_blank"
        class="px-8 py-4 rounded-lg bg-primary text-primary-text hover:drop-shadow-2xl hover:bg-blue-500 hover:cursor-pointer"
      >
        <div class="flex space-x-2 text-white text-[32px] items-center">
          <img class="h-[58px] w-[56px]" src="blog-post.svg" alt="blog post" />
          <div class="font-semibold">Create a Blog Post</div>
        </div>
        <p class="mt-4 text-white font-extralight">
          Write about anything! A funny story, an amazing recipe, interesting
          thoughts, etc.
        </p>
        <div
          class="mt-8 flex justify-center text-[18px] font-bold text-white space-x-2"
        >
          Earn $STAMP Rewards as users STAMP you content
        </div>
      </a>
      <a
        href="https://img.arweave.dev"
        target="_blank"
        class="px-8 py-4 rounded-lg bg-primary text-primary-text  hover:drop-shadow-2xl hover:bg-blue-500 hover:cursor-pointer"
      >
        <div class="flex space-x-2 text-white text-[32px] items-center">
          <img class="h-[58px] w-[56px]" src="image.svg" alt="image" />
          <div class="font-semibold">Upload an Image</div>
        </div>
        <p class="mt-4 text-white font-extralight">
          Pictures say 1,000 words! Let's see memes, pets in funny costumes,
          nature, etc.
        </p>
        <div
          class="mt-8 flex justify-center text-[18px] font-bold text-white space-x-2"
        >
          Earn $STAMP Rewards as users STAMP you content
        </div>
      </a>
    </div>
  </div>
</div>
