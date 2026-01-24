<script lang="ts">
  import '../app.css';
	import { page } from '$app/state';
  import { onMount, setContext } from 'svelte';
  import { QueryClient, QueryClientProvider } from "@tanstack/svelte-query";
  import { SvelteQueryDevtools } from "@tanstack/svelte-query-devtools";
    import { goto } from '$app/navigation';

	let { data, children } = $props();
  const { atclient, user } = data;

  setContext("user", user);
  setContext("atclient", atclient);

  let handleInput = $state("");

  async function login() {
    if (handleInput) {
      await atclient.loginWithRedirect({ handle: handleInput });
    }
  }

  async function logout() {
    await atclient.logout();
  }


  const queryClient = new QueryClient({
    defaultOptions: { 
      queries: { 
        enabled: true 
      }
    }
  });

  /**
  onMount(() => {
    if (user) {
      goto("/home");
    }
  });
  **/
</script>

<QueryClientProvider client={queryClient}>
  <SvelteQueryDevtools />
  <div class="flex flex-col gap-8 w-screen h-full min-h-screen font-azeret bg-[#283618] text-white">
    <header class="flex flex-col lg:flex-row lg:items-center w-full gap-4 px-8 py-4 border-b lg:border-none justify-between">
      <a href="/" class="text-2xl hover:text-shadow-md font-neco font-semibold">🥔 potatonet</a>

      <div class="flex gap-4 items-center flex-wrap">
        <nav class="flex gap-4 flex-wrap items-center px-3 py-1.5">
          <a href="/explore" class="hover:text-shadow-sm" title="explore" aria-label="explore">🛰️ explore</a>
          {#if user}
            <a href="/home" class="hover:text-shadow-sm" title="explore" aria-label="explore">🏠 {user.handle}</a>
          {/if}
        </nav>
        {#if user}
          <button onclick={logout} class="bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2">
            Logout
         </button>
        {:else}
          <input 
            type="text" 
            bind:value={handleInput}
            placeholder="Handle (eg: zeu.dev)" 
            class="border border-black border-dashed text-sm px-3 py-2 hover:shadow-lg focus:shadow-lg" 
          />
          <button onclick={login} class="bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2">
            Login
          </button>
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
</QueryClientProvider>
