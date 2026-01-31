<script lang="ts">
  import { Debounced } from "runed";
  import { page as pageState } from "$app/state";
  import { getContext } from "svelte";
  import { defaultTheme, type DocumentNode, type MiniDoc, type PublicationNode } from "$lib/utils";
  import type { QuicksliceClient } from "quickslice-client-js";
  import { createInfiniteQuery, createQuery } from "@tanstack/svelte-query";

  const { data } = $props();
  const { author }: { author: MiniDoc } = data;
  const user = getContext("user") as MiniDoc;
  const atclient = getContext("atclient") as QuicksliceClient;

  let page = $state(0);
  let sortDirection = $state("DESC");
  let searchTerm = $state("");
  const debouncedSearchTerm = new Debounced(() => searchTerm, 500);

  function toggleSort() {
    sortDirection = sortDirection === "DESC" ? "ASC" : "DESC";
  }
 
  const publicationQuery = createQuery(() => ({
    queryKey: ["publication", author.did, pageState.params.pubRkey],
    queryFn: async () => {
      const query = `
        query GetPublication {
          siteStandardPublication(where: {
            uri: { eq: "at://${author.did}/site.standard.publication/${pageState.params.pubRkey}" }
          }) {
            edges { node {}}
          }
        }
      `;
      const data = await atclient.publicQuery(query) as {
        siteStandardPublication: { 
          edges: { 
            node: Node & { value: PublicationNode }
          }[]
        }
      };

      return data.siteStandardPublication.edges[0].node;
    }
  }));

  const documentsQuery = createInfiniteQuery(() => ({
    queryKey: ["documents", author.did, pageState.params.pubRkey, sortDirection],
    queryFn: async ({ pageParam }) => {
      const query = `
        query GetDocuments {
          siteStandardDocument(
            first: 20, 
            after: "${pageParam}", 
            where: {
              and: [{
                title: { contains: "${debouncedSearchTerm.current || ""}" }
              }, {
                site: { eq: "at://${author.did}/site.standard.publication/${pageState.params.pubRkey}" }
              }]
            },
            sortBy: [{
              field: "publishedAt",
              direction: "${sortDirection}"
            }]
          ) {
            edges {
              node {}
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      const data = await atclient.publicQuery(query);

      return data as {
        siteStandardDocument: {
          edges: { 
            node: DocumentNode;
            cursor: string 
          }[],
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string;
          }
        }
      }
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.siteStandardDocument.pageInfo.endCursor,
    select: (data) => { 
      const items = data.pages.map((page) => page.siteStandardDocument.edges).flat();
      const nodes = items.map((i) => i.node);
      return nodes;
    },
  }));

  let publication = $derived(publicationQuery.data?.value);
  let theme = $derived(publication?.basicTheme || defaultTheme);
  let currentPage = $derived(documentsQuery.data?.slice(page*20, (page*20) + 20));
  
</script>

<!-- TODO: create DocumentCard component with likes & bookmarks -->
{#snippet documentCard(doc: DocumentNode)}
  <article 
    class="flex flex-col gap-2 border px-5 py-4 rounded"
    style={`
      background-color: rgb(${theme.background.r},${theme.background.g},${theme.background.b});
      color: rgb(${theme.foreground.r},${theme.foreground.g},${theme.foreground.b});
    `}
  >
    <a href={`${publication?.url}${doc.value.path}`}>
      <h1 class="text-lg font-bold hover:underline">
        {doc.value.title}
      </h1> 
    </a>
    <time class="opacity-80">{new Date(doc.value.publishedAt).toLocaleDateString()}</time> 
    <p class="font-neco">{doc.value.description}</p> 
  </article>
{/snippet}

<header class="flex flex-col gap-2 lg:mb-8">
  <h1 class="text-2xl lg:text-4xl font-bold text-yellow-400">{publication?.name}</h1>
  <h2 class="font-neco lg:text-xl">{publication?.description}</h2>
  <h3>Author: <a href={`/${author.handle}`} class="hover:underline hover:text-yellow-400">@{author.handle}</a></h3>
</header>

<menu class="flex flex-col lg:flex-row gap-4 w-full justify-between items-center">
  <label>
    Search: 
    <input bind:value={searchTerm} class="border px-3 py-2" />
  </label>

  <button onclick={toggleSort} class="bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2">
    <span class="text-xl">⇅</span> Sort by: {#if sortDirection === "DESC"}Newest{:else}Oldest{/if}
  </button>

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
    {#if documentsQuery.hasNextPage}
      <button 
        onclick={() => { 
          page++;
          if ((page * 20) + 20 > (documentsQuery.data?.length || 0)) {
            documentsQuery.fetchNextPage(); 
          }
        }}
        class="bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2"
      >
        Next
      </button>
    {/if}
  </div>
</menu>

{#if documentsQuery.isFetching}
  <p>Fetching...</p>
{:else if documentsQuery.isError}
  <p>Error</p>
{:else if documentsQuery.isSuccess}
  {#if currentPage?.length === 0}
    There are no documents based onb the current filters
  {/if}
  {#each currentPage as document, i (i)}
    {@render documentCard(document)}
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
  {#if documentsQuery.hasNextPage}
    <button 
      onclick={() => { 
        page++;
        if ((page * 20) + 20 > (documentsQuery.data?.length || 0)) {
          documentsQuery.fetchNextPage(); 
        }
      }}
      class="bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2"
    >
      Next
    </button>
  {/if}
</menu>
