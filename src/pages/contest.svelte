<script>
  import Navbar from "../components/navbar.svelte";
</script>

<Navbar />
<main>
  <section class="flex flex-col items-center relative">
    <div class="flex flex-col items-center w-[1000px]">
      <img class="mt-16 w-[130px] h-[130px]" src="now.svg" alt="logo" />
      <h1 class="mt-4 text-[40px] font-light text-[#44444F]">
        The <em>Stamp Contest</em> is going on
        <span class="text-[55px] text-primary font-bold">now.</span>
      </h1>
      <p class="text-[24px] font-normal text-[#44444F]">
        Hello permaweb content creators! Welcome to the experiment <span
          class="emoji">🙌</span
        >
      </p>
      <p class="mt-4">
        <span class="text-primary">now.arweave.dev</span> is an aggregation of
        content uploaded to the permaweb (think Reddit, but for the permaweb).
        With the added functionality or the Stamp Protocol, users can "stamp"
        the content they find useful, engaging, entertaining, thought-provoking,
        etc.
        <span class="text-[#169260]"
          >Stamping is similar to hitting the "like" button in web2 - but with
          way more functionality.</span
        >
      </p>
      <div class="mt-16 font-bold text-[#44444F]">
        The context details! We kept it easy!
      </div>
      <ol class="mt-4 list-decimal">
        <li>
          Create either a <span class="text-primary">blog post</span> or upload
          an <span class="text-primary">image</span>
        </li>
        <li>Get the most stamps within the contest time frame.</li>
        <li>Claim your reward!</li>
      </ol>
      <div class="mt-8 flex space-x-8">
        <a
          href="https://pages.arweave.dev"
          target="_blank"
          class="px-8 py-4 rounded-lg bg-primary text-primary-text hover:drop-shadow-2xl hover:bg-blue-500 hover:cursor-pointer"
        >
          <div class="flex space-x-2 text-white text-[32px] items-center">
            <img
              class="h-[58px] w-[56px]"
              src="blog-post.svg"
              alt="blog post"
            />
            <div class="font-semibold">Create a Blog Post</div>
          </div>
          <p class="mt-4 text-white font-extralight">
            Write about anything! A funny story, an amazing recipe, interesting
            thoughts, etc.
          </p>
          <div
            class="mt-8 flex justify-center text-[36px] font-bold text-white space-x-2"
          >
            Prize: &nbsp;<span class="text-[#FFC294]">50 $AR</span>
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
            class="mt-8 flex justify-center text-[36px] font-bold text-white space-x-2"
          >
            Prize: &nbsp;<span class="text-[#FFC294]">10 $AR</span>
          </div>
        </a>
      </div>
      <div class="mt-8 flex w-[800px] text-[16px] text-[#979797] font-medium">
        * These buttons are intended to make the contest more accessible. If
        you're familiar with the stamp protocol and are already using it for
        uploading your content, it will automatically show up on now.arweave.dev
        and is eligible to win.
      </div>
    </div>
    <div class="absolute top-4 right-4">
      <div>Contest Starts: <span class="text-primary">9/16/2022</span></div>
      <div>Contest Ends: <span class="text-primary">9/23/2022</span></div>
      <div class="text-right mt-2">
        <a
          href="/"
          class="btn btn-sm btn-primary rounded-none normal-case font-light"
          >View Standings</a
        >
      </div>
    </div>
  </section>
</main>

<style>
  .emoji {
    font-family: "Twemoji Mozilla", "Apple Color Emoji", "Segoe UI Emoji",
      "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji",
      sans-serif;
  }
</style>
