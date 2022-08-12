<script>
  export let name;
  export let avatar =
    "https://tgbcqufuppegmlhigt2zosiv2q55qty4t4rg2gebmfm4vpvf.arweave.net/mYIoULR7yGYs_6DT1_l0kV1DvYTxyfIm0YgWFZyr6l0";
  export let background =
    "https://arweave.net/T2Kh2uOv3myw8L6BPE6kySs2QXjh8R3B1KolcW_MFQA/background.svg";
</script>

<div>
  <div>
    <img
      class="h-32 w-full object-cover lg:h-48"
      src={background ||
        "https://arweave.net/T2Kh2uOv3myw8L6BPE6kySs2QXjh8R3B1KolcW_MFQA/background.svg"}
      alt="background"
    />
  </div>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
      <div class="flex">
        <img
          class="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
          src={avatar}
          alt="avatar"
        />
      </div>
      <div
        class="mt-6 sm:flex-1 sm:min-w-0 sm:flex sm:items-center sm:justify-end sm:space-x-6 sm:pb-1"
      >
        <div class="sm:hidden md:block mt-6 min-w-0 flex-1">
          <h1 class="text-2xl font-bold truncate">{name}</h1>
        </div>
      </div>
    </div>
    <div class="hidden sm:block md:hidden mt-6 min-w-0 flex-1">
      <h1 class="text-2xl font-bold truncate">{name}</h1>
    </div>
  </div>
</div>
