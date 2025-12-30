<script lang="ts">
  type TagPillProps = {
    tag: string;
    variant?: "menu";
    showDeleteButton?: boolean;
    onTagClick?: (tag: string) => void;
    onTagDeleteClick?: (tag: string) => void;
  }

  let { tag, variant, showDeleteButton, onTagClick, onTagDeleteClick }: TagPillProps = $props();
</script>

<div class="relative group flex w-fit"> 
  {#if showDeleteButton && variant !== "menu"}
    <button 
      onclick={() => onTagDeleteClick?.(tag)}
      class="absolute -right-3 -top-3 lg:group-hover:block hover:cursor-pointer hidden bg-white hover:bg-red-500/20 text-white text-xs px-1 py-0.5"
    >
       ❌
    </button>
  {/if}
  <button 
    onclick={() => onTagClick?.(tag)}
    class={[
      variant === "menu" && "hover:bg-red-300",
      "bg-gray-200 w-fit px-2 py-1 hover:cursor-pointer text-sm"
    ]}
  >
    {tag}
  </button>
  {#if showDeleteButton}
    <button 
      onclick={() => onTagDeleteClick?.(tag)}
      class="lg:hidden text-xs px-1.5 py-0.5 border-2 border-gray-200"
    >
       ❌
    </button>
  {/if}
</div>
