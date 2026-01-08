<script lang="ts">
  import type { PublicationNode } from '$lib/utils';
  import { createInfiniteQuery, createQuery } from '@tanstack/svelte-query';

  let { data } = $props();
  let { atclient, user } = data;

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
    getNextPageParam: (lastPage) => lastPage.siteStandardPublication.pageInfo.endCursor
  }));
</script>

{#if publicationsQuery.isFetching}
  <p>Fetching...</p>
{:else if publicationsQuery.isError}
  <p>Error</p>
{:else if publicationsQuery.isSuccess}
  {@const publications = publicationsQuery.data.pages.map((p) => p.siteStandardPublication.edges.map((edge) => edge.node)).flat()}
  {#each publications as publication}
    <a href={`/pub?uri=${publication.uri}`}>{publication.uri}</a>
    <p>{publication.value.url}</p>
  {/each}
  {#if publicationsQuery.hasNextPage}
    <button onclick={() => publicationsQuery.fetchNextPage()}>Next Page</button>
  {/if}
{/if}

