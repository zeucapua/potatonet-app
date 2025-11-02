<script lang="ts">
  import BookmarkCard from "$lib/components/BookmarkCard.svelte";
  import { getAllBookmarks } from "./api/bookmarks/data.remote";

  let { data } = $props();
  let cursor = $state("");
  const userBookmarksQuery = $derived(getAllBookmarks({ cursor }));

  let query = $state("");
  let filterTags = $state<string[]>([]);

  function onTagClick(tag: string) {
    const index = filterTags.findIndex((t) => t === tag);
    if (index >= 0) { filterTags.splice(index, 1); }
    else { filterTags.push(tag);
    }
  }

  function onTagDeleteClick(tag: string) {
    console.log("DELETE", tag);
  }
</script>

<h1 class="text-3xl font-bold font-comico">explore</h1> 

{#if userBookmarksQuery.loading}
  <p>Loading...</p>
{:else if userBookmarksQuery.error}
  <p>Error</p>
{:else}
  {@const { cursor: returnedCursor, bookmarks } = userBookmarksQuery.current || { cursor: "", bookmarks: []}}

  <div class="sticky top-0 flex flex-col gap-4 pt-4 bg-white z-50">
    <menu class="flex justify-between font-comico">
      <div class="flex gap-4">
        <label class="flex items-center gap-2">
          Search term:
          <input type="text" bind:value={query} class="font-neco border px-2 py-1" placeholder="recipe" />
        </label>

        <label class="flex items-center gap-2">
          Tags:
          {#each filterTags as filtered}
            <button onclick={() => onTagClick(filtered)}>{filtered}</button>
          {/each}
        </label>
        <button onclick={() => userBookmarksQuery.refresh()}>Refresh</button>
      </div>
    </menu>
    <hr />
  </div>

  <div class="flex flex-wrap gap-4">
    {#each bookmarks as bookmark}
      {#if bookmark.subject.includes(query) && (bookmark.tags?.some(t => filterTags.length > 0 ? filterTags.includes(t) : true))} 
        <BookmarkCard isOwner={false} {bookmark} {onTagClick} {onTagDeleteClick} />
      {/if}
    {/each}
  </div>
{/if}
