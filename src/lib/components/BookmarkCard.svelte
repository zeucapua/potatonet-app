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

<article class="flex flex-col gap-4 border border-dashed hover:border-solid hover:shadow-lg px-4 py-3 w-fit">
  <a href={bookmark.subject} class="hover:underline hover:cursor-pointer hover:text-shadow-md text-xl visited:text-violet-600">{bookmark.subject}</a>
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
