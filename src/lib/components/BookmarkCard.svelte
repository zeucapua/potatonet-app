<script lang="ts">
  import TagPill from "./TagPill.svelte";
  import type { LexiconCommunityBookmark } from "$lib/utils";

  type BookmarkCardProps = {
    isOwner?: boolean;
    bookmark: LexiconCommunityBookmark;
    onTagClick: (tag: string) => void;
    onTagDeleteClick?: (tag: string) => void;
  };

  let { isOwner = false, bookmark, onTagClick, onTagDeleteClick }: BookmarkCardProps = $props();
</script>

<span class="flex border-3 border-double w-full rounded hover:shadow-lg">
  <article class="flex flex-col gap-4 px-4 py-3 w-full h-fit">
    <div class="flex gap-4 items-center">
      {#if bookmark.$enriched?.favicon}
        <img src={bookmark.$enriched.favicon} alt={bookmark.$enriched.title} class="size-8 bg-neutral-300 rounded p-1" />
      {/if}
      <h1 class="font-semibold">{bookmark.$enriched?.title}</h1>
    </div>

    <a href={bookmark.subject} class="break-all hover:underline underline-offset-4 hover:cursor-pointer text-xl visited:text-violet-600">
      {bookmark.subject}
    </a>
    {#if bookmark.$enriched?.description}
      <p>{bookmark.$enriched.description}</p>
    {/if}
    {#if bookmark.tags && bookmark.tags.length > 0}
      <div class="flex gap-5 flex-wrap">
        {#each bookmark.tags as tag}
          <TagPill {tag} showDeleteButton={isOwner} {onTagClick} {onTagDeleteClick} />
        {/each}
      </div>
    {:else}
      <p class="text-sm italic">No tags</p>
    {/if}
  </article>

  <nav class="w-fit border-l grid grid-rows-3 divide-y-1">
    <button class="px-4">💛</button>
    <button class="px-4">💬</button>
    {#if isOwner}
      <button class="px-4">🗑️</button>
    {:else}
      <button class="px-4">🔖</button>
    {/if}
  </nav>
</span>
