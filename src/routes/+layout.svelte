<script lang="ts">
	import { page } from '$app/state';
  import '../app.css';

	let { data, children } = $props();
  const user = $derived(data.user);
</script>

<div class="flex flex-col gap-8 w-screen h-full min-h-screen font-neco">
  <header class="flex flex-col lg:flex-row lg:items-center w-full gap-4 px-8 py-4 border-b lg:border-none justify-between">
    <a href="/" class="font-comico text-2xl hover:text-shadow-md">potatonet.app</a>

    <div class="flex gap-4 items-center text-lg flex-wrap">
      <nav class="text-lg flex gap-4 flex-wrap items-center border-3 border-groove px-3 py-1.5">
        <a href="/" class="hover:text-shadow-lg hover:underline" title="explore" aria-label="explore">🛰️ explore</a>
        <a href="https://tangled.sh/@zeu.dev/potatonet-app" class="hover:text-shadow-lg" title="source code" aria-label="source code">🧶 source code</a>
        <a href="https://bsky.app/profile/zeu.dev" class="hover:text-shadow-lg" title="maker's bluesky" aria-label="maker's bluesky">🦋 maker's bluesky</a>
        {#if user}
          <a href={`/${user.handle}/bookmarks`} class="hover:text-shadow-lg" aria-label="logged in user's bookmarks">🔖 your bookmarks</a>
        {/if}
      </nav>
      {#if user}
        <form action="/?/logout" method="POST">
          <button type="submit" class="hover:text-shadow-lg hover:cursor-pointer font-comico">
            Logout
         </button>
        </form>
      {:else}
        <form action="/?/login" method="POST" class="flex gap-4 lg:basis-0">
          <input 
            name="handle" 
            type="text" 
            placeholder="Handle (eg: zeu.dev)" 
            class="border border-black border-dashed text-sm px-3 py-2 hover:shadow-lg focus:shadow-lg" 
          />
          <button type="submit" class="font-comico bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2">
            Login
          </button>
        </form>
      {/if}
    </div>
  </header>
  
  {#key page.url.pathname}
    <main class="flex flex-col gap-4 p-8 pt-0 lg:pt-8">
      <svelte:boundary>
        {@render children()}
        
        {#snippet pending()}
          <p>Loading...</p> 
        {/snippet}
      </svelte:boundary>
    </main>
  {/key}
</div>

