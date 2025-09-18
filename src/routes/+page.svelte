<script lang="ts">
  let { data } = $props();
  const user = data.user;
</script>

<main class="flex flex-col gap-4 p-8">

  <h1 class="text-3xl font-black">potatonet.app</h1>
  <h2 class="text-xl font-semibold">
    Implemented by
    <a href="https://zeu.dev" class="underline">zeu.dev</a>
    💛
  </h2>

  <div class="flex gap-4">
    <a href="https://tangled.sh/@zeu.dev/potatonet-app" class="flex gap-2 rounded border border-black px-4 py-2 w-fit">
      🧶 Tangled Repo
    </a>
    <a href="https://bsky.app/profile/zeu.dev" class="flex gap-2 rounded border border-black px-4 py-2 w-fit">
      🦋 Bluesky
    </a>
  </div>

  <div class="border border-black p-4 rounded shadow-md flex flex-col gap-4">
  {#if user}
    <section class="border border-black flex gap-4 items-center px-4 py-2 rounded shadow-md">
      <img src={user.avatar} alt={`${user.handle} avatar`} class="size-20 rounded" />
      <div class="flex flex-col">
        <p>Logged in as:</p>
        <h1>Handle: <span class="font-bold">{user.handle}</span></h1>
        <h2>Display Name: <span class="font-bold">{user.displayName}</span></h2>
        <h3 class="italic">{user.did}</h3>
      </div>
    </section>

    <form action="/?/logout" method="POST">
      <button type="submit" class="border border-black rounded px-2 py-1">
        Logout
      </button>
    </form>
  {:else}
    <p>You're not logged in</p>

    <form action="/?/login" method="POST">
      <input 
        name="handle" 
        type="text" 
        placeholder="Handle (eg: zeu.dev)" 
        class="border border-black rounded px-2 py-1" 
      />
      <button type="submit" class="border border-black rounded px-2 py-1">
        Login
      </button>
    </form>
  {/if}
  </div>

</main>
