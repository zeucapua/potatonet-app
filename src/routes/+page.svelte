<script lang="ts">
  import { getContext } from "svelte";
  import LeafletIcon from "$lib/components/LeafletIcon.svelte";
  import OffprintIcon from "$lib/components/OffprintIcon.svelte";
  import PcktIcon from "$lib/components/PcktIcon.svelte";
    import type { QuicksliceClient } from "quickslice-client-js";

  const user = getContext("user");
  const atclient = getContext("atclient") as QuicksliceClient;
  let handleInput = $state("");

  async function login() {
    if (handleInput) {
      await atclient.loginWithRedirect({ handle: handleInput });
    }
  }
</script>

<section class="flex flex-col gap-4 my-8">
  <h2 class="text-amber-400 text-2xl font-bold font-neco">Talk about what everyone's reading today</h2>
  <p><span class="font-neco text-lg font-bold">potatonet</span> lets you to follow, read, and discuss to fellow readers about long-form content on the internet as easy as pie.</p>
</section>

<section class="flex flex-col gap-4 my-8">
  <h2 class="text-amber-400 text-2xl font-bold font-neco">Subscribe to any publication across the Atmosphere</h2>
  <p>With the AT Protocol, you can read any blog made, whether it's from here, their personal website, or any platform in the network.</p>
  <menu class="flex flex-col gap-2 py-4 justify-center">
    <p class="italic opacity-80">Supported platforms include:</p>
    <div class="flex gap-2 items-center">
      <a href="https://leaflet.pub" class="group transition-all duration-150 border border-white/60 hover:border-amber-400 px-8 py-6 rounded">
        <LeafletIcon class="w-32 text-white/80 group-hover:text-amber-400 transition-colors duration-150" />
      </a>
      <a href="https://pckt.blog" class="px-10 py-6 rounded group transition-all duration-150 border border-white/60 hover:border-amber-400">
        <PcktIcon class="w-20 text-white/80 group-hover:text-amber-400 transition-colors duration-150" />
      </a>
      <a href="https://offprint.app" class="px-8 py-6 rounded group transition-all duration-150 border border-white/60 hover:border-amber-400">
        <OffprintIcon class="w-30 h-8.5 text-white/80 group-hover:text-amber-400 transition-colors duration-150" />
      </a>
    </div>
  </menu>
</section>

<section class="flex flex-col gap-4 my-8">
  <h2 class="text-amber-400 text-2xl font-bold font-neco">Coming soon: RSS Feeds</h2>
  <p>We plan to support RSS feeds, used by news organizations and independent writers online for decades, allowing you to interact with any writing available on the internet.</p>
</section>

<section class="flex flex-col gap-4 my-8 items-center justify-center">
  <h2 class="text-center text-amber-400 text-3xl font-bold font-neco">Find your next read on potatonet</h2>
  <div class="flex gap-4">
    <a href="/explore" class="bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2">🛰️ Explore</a>
    {#if user}
      <a href="/home" class="bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2">🏠 Home</a>
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
  <pre class="text-xs tracking-widest">
                                                                                               
                                                                                               
                                                                                               
                                                           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒                  
                                                      ▒▒▒▒▒▒▒▒▒▒        ▒▒▒▒▒▒▒▒               
                  ▒▒▒▒▒▒▒                          ▒▒▒▒▒▒                    ▒▒▒▒▒             
               ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒░                 ▒▒▒▒▒                          ▒▒▒            
              ▒▒▒           ▒▒▒▒▒▒              ▒▒▒                              ▒▒▒▒          
             ▒▒▒                ▒▒▒▒▒         ▒▒▒▒                                 ▒▒▒         
             ▒▒                   ▒▒▒▒      ▒▒▒▒                          ▒         ▒▒▒        
             ▒▒▒                    ▒▒    ▒▒▒▒▒                          ▒▒          ▒▒▒       
             ▒▒▒                         ▒▒▒▒                                ▒        ▒▒       
              ▒▒▒      ▒▒▒▒▒▒▒▒▒▒▒      ▒▒▒                                  ▒▒       ▒▒▒      
               ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒    ▒▒▒                                             ▒▒      
                 ▒▒▒▒▒▒           ▒    ▒▒                                              ▒▒      
                ▒▒▒▒▒▒                                                                 ▒▒      
              ▒▒▒▒   ▒▒▒                                                               ▒▒      
             ▒▒▒      ▒▒▒▒                                                             ▒▒      
           ░▒▒▒         ▒▒▒▒                                                           ▒▒      
          ▒▒▒▒            ▒▒▒                                                         ▒▒▒      
         ▒▒▒               ▒▒▒▒                                                       ▒▒       
         ▒▒▒        ▒▒       ▒▒▒▒                                                    ▒▒▒       
        ▒▒▒          ▒          ▒▒▒▒                                   ▒▒           ▒▒▒        
        ▒▒▒          ▒           ▒▒▒▒▒                                 ▒▒          ▒▒▒         
        ▒▒          ▒▒              ▒▒▒▒                          ░▒              ▒▒▒          
       ▒▒▒                            ▒▒▒▒                        ▒▒   ▒▒        ▒▒▒           
        ▒▒                              ▒▒▒▒                                   ▒▒▒             
        ▒▒▒                               ▒▒▒░                               ▒▒▒▒              
         ▒▒▒                                ▒▒▒                            ▒▒▒▒                
          ▒▒▒                                ▒▒▒▒                        ▒▒▒▒                  
           ▒▒▒▒                                ▒▒▒▒                  ▒▒▒▒▒▒                    
             ▒▒▒▒                                ▒▒▒▒              ▒▒▒▒▒        ▒▒▒            
               ▒▒▒▒▒                               ▒▒▒▒         ▒▒▒▒▒            ▒▒▒           
                 ▒▒▒▒▒▒▒                             ▒▒▒▒▒▒  ▒▒▒▒▒▒               ▒▒▒          
                     ▒▒▒▒▒▒▒▒▒▒                         ░▒▒▒▒▒▒▒                   ▒▒          
                           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒    ▒▒          
                                     ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒           ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒          
                                                                                               
                                                                                               
                                                                                               
  </pre>
</section>
