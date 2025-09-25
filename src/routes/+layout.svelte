<script lang="ts">
	import '../app.css';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';

	let { data, children } = $props();
  const user = $derived(data.user);
  const queryClient = new QueryClient();
</script>

<QueryClientProvider client={queryClient}>
  <div class="flex flex-col gap-8 w-screen h-full min-h-screen font-neco">
    <header class="flex items-center w-full gap-4 px-8 py-4 justify-between">
      <nav class="text-lg flex gap-4 items-center">
        <a href="/" class="font-comico text-2xl hover:text-shadow-md">potatonet.app</a>
        <a href="https://tangled.sh/@zeu.dev/potatonet-app" class="hover:text-shadow-lg">🧶</a>
        <a href="https://bsky.app/profile/zeu.dev" class="hover:text-shadow-lg">🦋</a>
      </nav>

      <div class="flex gap-4 items-center text-lg">
        {#if user}
          <a href={`/${user.handle}/home`} class="hover:text-shadow-lg">🏡</a>
          <form action="/?/logout" method="POST">
            <button type="submit" class="hover:text-shadow-lg hover:cursor-pointer font-comico">
              Logout
            </button>
          </form>
        {:else}
          <form action="/?/login" method="POST">
            <input 
              name="handle" 
              type="text" 
              placeholder="Handle (eg: zeu.dev)" 
              class="border border-black border-dashed px-3 py-2 hover:shadow-lg focus:shadow-lg" 
            />
            <button type="submit" class="hover:text-shadow-lg hover:cursor-pointer font-comico">
              Login
            </button>
          </form>
        {/if}
      </div>
    </header>

    <main class="flex flex-col gap-4 p-8">
      <svelte:boundary>
        {@render children()}
        
        {#snippet pending()}
          <p>Page loading...</p> 
        {/snippet}
      </svelte:boundary>
    </main>
  </div>
</QueryClientProvider>
