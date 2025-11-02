<script lang="ts">
  import { page } from "$app/state";
  import BookmarkCard from "$lib/components/BookmarkCard.svelte";
  import TagPill from "$lib/components/TagPill.svelte";
  import { getUserBookmarks } from "../../api/bookmarks/data.remote";

  let { data } = $props(); 
  const { handle } = page.params;
  let isOwner = $derived(data.user?.handle === handle);
  let cursor = $state("");
  const userBookmarksQuery = $derived(getUserBookmarks({ handle: handle as string, cursor }));

  let query = $state("");
  let filterTags = $state<string[]>([]);

  function onTagClick(tag: string) {
    const index = filterTags.findIndex((t) => t === tag);
    if (index >= 0) { filterTags.splice(index, 1); }
    else {
      filterTags.push(tag);
    }
  }

  function onTagDeleteClick(tag: string) {
    console.log("DELETE", tag);
  }
</script>

<h1 class="text-2xl lg:text-3xl font-comico">Bookmarks by @{handle}</h1>

<menu class="flex flex-col lg:flex-row w-full gap-4">
  <label class="flex items-center gap-2">
    Search URLs:
    <input type="text" bind:value={query} class="border border-black border-dashed text-sm px-3 py-2 hover:shadow-lg focus:shadow-lg" placeholder="recipe" />
  </label>

  <label class="flex items-center gap-2">
    Tags:
    {#if filterTags.length === 0}
      <TagPill tag="all" />
    {:else}
      {#each filterTags as filtered}
        <TagPill showDeleteButton tag={filtered} {onTagClick} onTagDeleteClick={onTagClick} variant="menu" /> 
      {/each}
    {/if}
  </label>
  <button
    onclick={() => userBookmarksQuery.refresh()}
    class="font-comico bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2"
  >
    Refresh
  </button>
  {#if isOwner}
    <button class="justify-self-end font-comico bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2">
      🔖 New Bookmark
    </button>
  {/if}

</menu>
<hr />

{#if userBookmarksQuery.loading}
  <p>Loading...</p>
{:else if userBookmarksQuery.error}
  <p>Error</p>
{:else}
  {@const { cursor: returnedCursor, bookmarks } = userBookmarksQuery.current || { cursor: "", bookmarks: []}}
  <div class="flex flex-wrap gap-4">
    {#each bookmarks as bookmark}
      {#if bookmark.subject.includes(query) && (bookmark.tags?.every(t => filterTags.length > 0 ? filterTags.includes(t) : true))} 
        <BookmarkCard {isOwner} {bookmark} {onTagClick} {onTagDeleteClick} />
      {/if}
    {/each}
  </div>
{/if}
