<script lang="ts">
  import { page } from "$app/state";
  import { Agent } from "@atproto/api";
  import { createQuery } from "@tanstack/svelte-query";
  import type { LexiconCommunityBookmark } from "$lib/utils";

  const { handle } = page.params;
  const agent = new Agent({ service: "https://selfhosted.social" });

  const bookmarksQuery = createQuery({
    queryKey: ["bookmarks", handle],
    queryFn: async () => {
      if (!handle) { throw Error }
      const result = await agent.com.atproto.repo.listRecords({
        repo: handle,
        collection: "community.lexicon.bookmarks.bookmark"
      });
      if (!result.success) { throw Error }
      console.log({ result });
      return result.data as unknown as { cursor: string, records: { uri: string, cid: string, value: LexiconCommunityBookmark }[] };
    },
    staleTime: 3000
  });
</script>

{#if $bookmarksQuery.isLoading}
  <p>Loading...</p>
{:else if $bookmarksQuery.isError}
  <p>Error</p>
{:else if $bookmarksQuery.isSuccess}
  {@const bookmarks = $bookmarksQuery.data.records}
  {#each bookmarks as { uri, cid, value: bookmark }}
    <p>{bookmark.subject}</p>
  {/each}
{/if}
