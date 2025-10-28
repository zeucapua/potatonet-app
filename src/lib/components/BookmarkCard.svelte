<script lang="ts">
  import type { LexiconCommunityBookmark } from "$lib/utils";

  type BookmarkCardProps = {
    isOwner: boolean;
    bookmark: LexiconCommunityBookmark;
    onTagClick: (tag: string) => void;
    onTagDeleteClick?: (tag: string) => void;
  };

  let { isOwner, bookmark, onTagClick, onTagDeleteClick }: BookmarkCardProps = $props();
</script>

<article class="flex flex-col gap-4 border border-dashed hover:border-solid px-4 py-3 w-fit">
  <a href={bookmark.subject} class="hover:cursor-pointer text-sm">{bookmark.subject}</a>
  {#if bookmark.tags && bookmark.tags.length > 0}
    <div class="flex gap-5">
      {#each bookmark.tags as tag}
        <div class="relative group"> 
          {#if isOwner}
            <button 
              onclick={() => onTagDeleteClick?.(tag)}
              class="absolute -right-3 -top-3 group-hover:block hover:cursor-pointer hidden border bg-red-500 text-white text-xs px-1"
            >
               🗑️
            </button>
          {/if}
          <button 
            onclick={() => onTagClick(tag)}
            class="bg-gray-200 w-fit px-2 py-1 hover:cursor-pointer"
          >
            {tag}
          </button>
        </div>
      {/each}
    </div>
  {:else}
    <p class="text-sm italic">No tags</p>
  {/if}
</article>
