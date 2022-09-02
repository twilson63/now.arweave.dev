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
    <span>About now.arweave.dev</span>
  </h1>
  <div class="border-2 border-primary p-8">
    <p>
      Now is the home page of the Permaweb. As user explore and discover all of
      the applications and content on the Permaweb, content creators can
      leverage ANS-110 and STAMP to enable users to provide attention to their
      assets.
    </p>
  </div>
  <div class="mt-4 border-2 border-base-300 p-8">
    <h3 class="mb-4 text-2xl">$STAMP</h3>
    <p>
      Rewards for content creators on the web are broken. Clickbait spreads
      faster than great content, while providing less value. Creators are
      pushed, in a race to the bottom, to produce attention grabbing,
      time-wasting content -- all in order to sell ads.
    </p>
    <p class="mt-4">$STAMP fixes this problem.</p>
    <p class="mt-4">
      <a class="link" href="https://stamps.live">Click here to learn more</a>
    </p>
  </div>
  <div class="mt-4 border-2 border-base-300 p-8">
    <h3 class="mb-4 text-2xl">VouchDAO</h3>
    <p>
      VouchDAO is an organization that manages vouch services that provide
      identification checks. THese checks separate the need to provide and store
      human identifying information, but allows Permaweb applications and
      services to know the current wallet is a human account.
    </p>
    <p class="mt-4">
      <a class="link" href="https://vouchdao.xyz">Click here to get vouched</a>
    </p>
  </div>
  <div class="mt-4 border-2 border-base-300 p-8">
    <h3 class="mb-4 text-2xl">$bAR</h3>
    <p>
      $bAR or (burned AR)<br />
      A scarce medium of exchange for the SmartWeave ecosystem. Upload data or burn
      AR to get it. No bridges, no treasury to hack.
    </p>
    <p class="mt-4">
      <a class="link" href="https://bar.arweave.dev/"
        >Click here to get vouched</a
      >
    </p>
  </div>
  <div class="mt-4 border-2 border-base-300 p-8">
    <h3 class="mb-4 text-2xl">VertoFlex</h3>
    <p>
      Verto/Flex is a contract package that provides the ability to make any
      Atomic PST tradeable with other tradeable tokens.
    </p>
    <p class="mt-4">
      <a class="link" href="https://verto.exchange">Click here to get vouched</a
      >
    </p>
  </div>
</Modal>
