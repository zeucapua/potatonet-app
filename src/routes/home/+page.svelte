<script lang="ts">
  import { goto } from "$app/navigation";
  import { getContext, onMount } from "svelte";
  import type { MiniDoc, PublicationNode } from "$lib/utils";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import type { QuicksliceClient } from "quickslice-client-js";
  import PublicationCard from "$lib/components/PublicationCard.svelte";

  const user = getContext("user") as MiniDoc;
  const atclient = getContext("atclient") as QuicksliceClient;

  let page = $state(0);

  onMount(() => {
    if (!user) { 
      goto("/")
    }
  });

  const subscriptionsQuery = createInfiniteQuery(() => ({
    queryKey: ["subscriptions", user.did],
    queryFn: async () => {
      const query = `
        query GetSubscriptionByUserDid {
          siteStandardGraphSubscription(first: 20, where: { 
            did: { eq: "${user.did}" }
          }) {
            edges {
              node {
                uri
                publicationResolved {
                  uri
                  indexedAt
                  cid
                  did
                  url
                  name
                  description
                  icon {}
                  actorHandle
                  preferences {
                    showInDiscover
                  }
                  basicTheme {}
                }
              }
            }
            pageInfo {
              hasNextPage
              endCursor
            }
          }
        }
      `;

      const data = await atclient.query(query);
      return data as {
        siteStandardGraphSubscription: {
          edges: { node: { uri: string, publicationResolved: PublicationNode }}[],
          pageInfo: {
            hasNextPage: boolean;
            endCursor: string;
          }
        }
      };
    },
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.siteStandardGraphSubscription.pageInfo.endCursor, 
    select: (data) => { 
      const items = data.pages.map((page) => page.siteStandardGraphSubscription.edges).flat();
      const nodes = items.map((i) => { return { ...(i.node.publicationResolved), viewerSiteStandardGraphSubscriptionViaPublication: { uri: i.node.uri }} });
      return nodes;
    }
  }));

  let currentPage = $derived(subscriptionsQuery.data?.slice(page*20, (page*20) + 20));
</script>

<h1 class="text-amber-400 text-3xl font-bold">My Subscriptions</h1>

<menu class="flex w-full justify-end items-center">
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
    {#if subscriptionsQuery.hasNextPage}
      <button 
        onclick={() => { 
          page++;
          if ((page * 20) + 20 > (subscriptionsQuery.data?.length || 0)) {
            subscriptionsQuery.fetchNextPage(); 
          }
        }}
        class="bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2"
      >
        Next
      </button>
    {/if}
  </div>
</menu>

{#if subscriptionsQuery.isFetching}
  <p>Fetching...</p>
{:else if subscriptionsQuery.isError}
  <p>Error</p>
{:else if subscriptionsQuery.isSuccess}
  {#if currentPage?.length === 0}
    There are no subscriptions based onb the current filters
  {/if}
  {#each subscriptionsQuery.data as publication (publication.uri)}
    <PublicationCard {publication} />
  {/each}
{/if}
