<script lang="ts">
  import type { PublicationNode } from '$lib/utils';
  import { createInfiniteQuery } from '@tanstack/svelte-query';
  import PublicationCard from '$lib/components/PublicationCard.svelte';

  let { data } = $props();
  let { atclient, user } = data;

  let page = $state(0);

  const publicationsQuery = createInfiniteQuery(() => ({
    queryKey: ["publications"],
    queryFn: async ({ pageParam }) => {
      const query = `
        query GetPublications {
          siteStandardPublication(first: 20, after: "${pageParam}") {
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
    staleTime: 1000000,
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

<menu>
  <button 
    onclick={() => { 
      if (page > 0) {
        page--;
      }
    }}
    class="border"
  >
    Prev Page
  </button>
  <number>{page + 1}</number>
  {#if publicationsQuery.hasNextPage}
    <button 
      onclick={() => { 
        page++;
        if ((page * 20) + 20 > (publicationsQuery.data?.length || 0)) {
          publicationsQuery.fetchNextPage(); 
        }
      }}
      class="border"
    >
      Next Page
    </button>
  {/if}
</menu>

{#if publicationsQuery.isFetching}
  <p>Fetching...</p>
{:else if publicationsQuery.isError}
  <p>Error</p>
{:else}
  {#each currentPage as publication (publication.uri)}
    <PublicationCard {publication} />
  {/each}
{/if}

<menu>
  <button 
    onclick={() => { 
      if (page > 0) {
        page--;
      }
    }}
    class="border"
  >
    Prev Page
  </button>
  <number>{page + 1}</number>
  {#if publicationsQuery.hasNextPage}
    <button 
      onclick={() => { 
        page++;
        if ((page * 20) + 20 > (publicationsQuery.data?.length || 0)) {
          publicationsQuery.fetchNextPage(); 
        }
      }}
      class="border"
    >
      Next Page
    </button>
  {/if}
</menu>
