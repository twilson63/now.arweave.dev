<script>
  import { Route, router } from "tinro";
  import Announcer from "./components/announcer.svelte";
  import Transition from "./components/transition.svelte";

  import Home from "./pages/home.svelte";
  import About from "./pages/about.svelte";
  import Stampers from "./pages/stampers.svelte";
  import AssetDetail from "./pages/asset-detail.svelte";
  import StamperDetail from "./pages/stamper-detail.svelte";

  router.mode.hash();
  router.subscribe((_) => window.scrollTo(0, 0));
</script>

<Announcer />
<Transition>
  <Route path="/">
    <Home />
  </Route>
  <Route path="/assets/:id">
    <AssetDetail />
  </Route>
  <Route path="/stampers/:id">
    <StamperDetail />
  </Route>
  <Route path="/stampers">
    <Stampers />
  </Route>
  <Route path="/about">
    <About />
  </Route>
</Transition>
