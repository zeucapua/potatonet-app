<script lang="ts">
  import BookmarkCard from "$lib/components/BookmarkCard.svelte";
  import TagPill from "$lib/components/TagPill.svelte";
  import { createInfiniteQuery } from "@tanstack/svelte-query";
  import { getAllBookmarks } from "./api/bookmarks/data.remote";

  let { data } = $props();
  let query = $state("");
  let filterTags = $state<string[]>([]);
  
  let bookmarkPage = $state(0);
  const exploreBookmarksQuery = createInfiniteQuery(() => ({
    queryKey: ["explore"],
    queryFn: ({ pageParam }) => getAllBookmarks({ cursor: pageParam }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.cursor,
    select: (data) => data.pages.map((page) => page.list).flat(),
    staleTime: 600
  }));
  let bookmarks = $derived(exploreBookmarksQuery.data ?? []);

  function onTagClick(tag: string) {
    const index = filterTags.findIndex((t) => t.toLowerCase() === tag.toLowerCase());
    if (index >= 0) { filterTags.splice(index, 1); }
    else { filterTags.push(tag.toLowerCase());
    }
  }

  function onTagDeleteClick(tag: string) {
    console.log("DELETE", tag);
  }

  $inspect(bookmarkPage, bookmarks.slice(bookmarkPage*50));
</script>

<div class="flex gap-4 items-center">
  <h1 class="text-2xl lg:text-3xl">Explore</h1>
</div>

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

  <button onclick={() => { exploreBookmarksQuery.fetchPreviousPage(); bookmarkPage--; }} disabled={!exploreBookmarksQuery.hasPreviousPage}>
    Prev Page
  </button>
  <button onclick={() => { exploreBookmarksQuery.fetchNextPage(); bookmarkPage++; }} disabled={!exploreBookmarksQuery.hasNextPage}>
    Next Page
  </button>

  {#if data.user}
    <button class="justify-self-end bg-amber-400 text-black hover:cursor-pointer hover:bg-amber-500 hover:text-white px-4 py-2">
      🔖 New Bookmark
    </button>
  {/if}

</menu>
<hr />

{#if exploreBookmarksQuery.isPending}
  <p>Loading...</p>
{:else if exploreBookmarksQuery.isError}
  <p>Error</p>
{:else if exploreBookmarksQuery.isSuccess}
  <div class="flex flex-wrap gap-4">
    {#if bookmarks}
      {@const pagedBookmarks = bookmarks.slice(bookmarkPage*50)}
      {#each pagedBookmarks as info}
        {@const bookmark = info.bookmark}
        {#if bookmark.subject.includes(query)}
          {#if (bookmark.tags && bookmark.tags.length > 0 
              && bookmark.tags.some(t => filterTags.length > 0 ? filterTags.includes(t.toLowerCase()) : true)
            ) 
            || (bookmark.tags && bookmark.tags.length === 0 && filterTags.length === 0)}
            <BookmarkCard {bookmark} {onTagClick} {onTagDeleteClick} />
          {/if}
        {/if}
      {/each}
    {/if}
  </div>
{/if}
