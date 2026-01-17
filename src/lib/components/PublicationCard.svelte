<script lang="ts">
  import type { PublicationNode } from "$lib/utils";
    import { createQuery } from "@tanstack/svelte-query";

  let { publication, showEmpty = false }: { publication: PublicationNode, showEmpty?: boolean } = $props();

  const countQuery = createQuery(() => ({
    queryKey: ["publication", publication.uri],
    queryFn: async () => {
      const constellationUrl = new URL("https://constellation.microcosm.blue/links/all");
      constellationUrl.searchParams.set("target", publication.uri);
      const response = await fetch(constellationUrl, {
        headers: {
          "Accept": "application/json"
        }
      });


      const json = await response.json() as { links: Record<string, any> };
      return json;
    },
    staleTime: 30 * 60 * 1000,
    select: (data) => {
      const documents = Number(data.links["site.standard.document"]?.[".site"]?.records) || 0; 
      const subscribers = Number(data.links["site.standard.graph.subscription"]?.[".publication"]?.records) || 0;
      return { documents, subscribers }
    }
  }));
</script>

{#if countQuery.isFetching}
  <p>Fetching...</p>
{:else if countQuery.isSuccess}
  {#if countQuery.data.documents > 0 || showEmpty}
  <li class="flex flex-col gap-4 border p-4">
    <a href={publication.value.url} class="w-fit">{publication.value.name}</a>
    <a href={`https://pdsls.dev/${publication.uri}`} target="_blank" class="w-fit border">Go to Record</a>
    <div class="flex gap-4">
      <p>{countQuery.data.documents} Documents</p>
      <p>{countQuery.data.subscribers} Subscribers</p>
    </div>
  </li>
  {/if}
{/if}
