<script lang="ts">
  import { page } from "$app/state";

  const { handle, pubRkey } = page.params;
</script>

<p>{handle} {pubRkey}</p>
