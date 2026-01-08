<script lang="ts">
    import { page } from '$app/state';
  import type { DocumentNode, PublicationNode } from '$lib/utils';
  import { createInfiniteQuery, createQuery } from '@tanstack/svelte-query';

  let { data } = $props();
  let { atclient, user } = data;

  let uri = $derived(page.url.searchParams.get("uri"));
  $inspect(uri);

  const documentsQuery = createQuery(() => ({
    queryKey: ["documents", uri],
    queryFn: async ({ pageParam }) => {
      const query = `
        query GetDocuments {
          siteStandardDocument(where: {
            site: { 
              eq: "${uri}"
            }
          }) {
            edges {}
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;
      const data = await atclient.publicQuery(query);
      console.log(data);
      return data as {
        siteStandardDocument: {
          edges: { node: DocumentNode, cursor: string }[],
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string;
          }
        }
      }
    },
    // @ts-ignore
    select: (data) => data.siteStandardDocument.edges.map((edge) => edge.node)
  }));
</script>

{#if documentsQuery.isFetching}
  <p>Fetching...</p>
{:else if documentsQuery.isError}
  <p>Error</p>
{:else if documentsQuery.isSuccess}
  {@const documents = documentsQuery.data}
  {#if documents.length === 0}
    <p>No documents...</p>
  {:else}
    {#each documents as document}
      <p>{document.value.title}</p> 
    {/each}
  {/if}
{/if}

