<script lang="ts">
  import { Debounced } from "runed";
  import type { PublicationNode } from '$lib/utils';
  import { createInfiniteQuery } from '@tanstack/svelte-query';
  import PublicationCard from '$lib/components/PublicationCard.svelte';

  let { data } = $props();
  let { atclient, user } = data;

  let page = $state(0);
  let searchTerm = $state("");
  const debouncedSearchTerm = new Debounced(() => searchTerm, 500);

  const publicationsQuery = createInfiniteQuery(() => ({
    queryKey: ["publications", debouncedSearchTerm.current || undefined],
    queryFn: async ({ pageParam }) => {
      const query = `
        query GetPublications {
          siteStandardPublication(first: 20, after: "${pageParam}", ${debouncedSearchTerm.current && `where: {
            or: [{
              name: { contains: "${debouncedSearchTerm.current}" }
            }, {
              actorHandle: { contains: "${debouncedSearchTerm.current}" }
            }]
          }`}) {
            edges {}
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;
      const data = await atclient.publicQuery(query);
      return data as {
        siteStandardPublication: {
          edges: { node: PublicationNode, cursor: string }[],
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string;
          }
        }
      }
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.siteStandardPublication.pageInfo.endCursor,
    select: (data) => { 
      const items = data.pages.map((page) => page.siteStandardPublication.edges).flat();
      const nodes = items.map((i) => i.node);
      return nodes;
    }
  }));

  let currentPage = $derived(publicationsQuery.data?.slice(page*20, (page*20) + 20));
</script>

<menu class="flex w-full justify-between items-center">
  <label>
    Search: 
    <input bind:value={searchTerm} class="border px-3 py-2" />
  </label>

  <div class="">
    {#if page > 0}
    <button 
      onclick={() => { 
        if (page > 0) {
          page--;
        }
      }}
      class="bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2"
    >
      Previous 
    </button>
    {/if}
    <number class="px-3">Page {page + 1}</number>
    {#if publicationsQuery.hasNextPage}
      <button 
        onclick={() => { 
          page++;
          if ((page * 20) + 20 > (publicationsQuery.data?.length || 0)) {
            publicationsQuery.fetchNextPage(); 
          }
        }}
        class="bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2"
      >
        Next
      </button>
    {/if}
  </div>
</menu>

{#if publicationsQuery.isFetching}
  <p>Fetching...</p>
{:else if publicationsQuery.isError}
  <p>Error</p>
{:else if publicationsQuery.isSuccess}
  {#if currentPage?.length === 0}
    There are no publications based onb the current filters
  {/if}
  {#each currentPage as publication (publication.uri)}
    <PublicationCard {publication} />
  {/each}
{/if}

<menu class="self-end">
  {#if page > 0}
    <button 
      onclick={() => { 
        if (page > 0) {
          page--;
        }
      }}
      class="bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2"
    >
      Previous 
    </button>
  {/if}
  <number class="px-3">Page {page + 1}</number>
  {#if publicationsQuery.hasNextPage}
    <button 
      onclick={() => { 
        page++;
        if ((page * 20) + 20 > (publicationsQuery.data?.length || 0)) {
          publicationsQuery.fetchNextPage(); 
        }
      }}
      class="bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2"
    >
      Next
    </button>
  {/if}
</menu>
