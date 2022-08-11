<script>
  import NavBar from "../components/navbar.svelte";
  import SideNav from "../components/side-nav.svelte";
  import SortButton from "../components/sort-button.svelte";
  import StamperItem from "../components/stamper-item.svelte";
</script>

<NavBar />
<!-- three column wrapper -->
<div class="flex-grow w-full max-w-7xl mx-auto xl:px-8 lg:flex" />
<!-- left column -->
<div class="flex-1 min-w-0 bg-white xl:flex">
  <SideNav />
  <div class="bg-white lg:min-w-0 lg:flex-1">
    <div
      class="pl-4 pr-6 pt-4 pb-4 border-b border-t border-gray-200 sm:pl-6 lg:pl-8 xl:pl-6 xl:pt-6 xl:border-t-0"
    >
      <div class="flex items-center">
        <h1 class="flex-1 text-lg font-medium">Stampers</h1>
        <SortButton />
      </div>
    </div>
    <ul
      role="list"
      class="relative divide-y divide-gray-200 border-b border-gray-200"
    >
      <li class="alert alert-info mx-16 my-8 w-11/12">Loading stamps</li>
      <StamperItem />
    </ul>
  </div>
</div>
