<script lang="ts">
  import { getContext } from "svelte";
  import { createQuery } from "@tanstack/svelte-query";
  import { resolveHandle, type MiniDoc, type PublicationNode, type StandardSiteThemeColorRGB } from "$lib/utils";
  import type { QuicksliceClient } from "quickslice-client-js";

  const user = getContext("user") as MiniDoc;
  const atclient = getContext("atclient") as QuicksliceClient;

  let { publication, showEmpty = false }: { publication: PublicationNode, showEmpty?: boolean } = $props();

  let isSubscribeButtonHovered = $state(false);

  const miniDocQuery = createQuery(() => ({
    queryKey: ["miniDoc", publication.did],
    queryFn: async () => {
      const miniDoc = await resolveHandle(publication.did);
      return miniDoc;
    },
    staleTime: "static"
  }));

  const countQuery = createQuery(() => ({
    queryKey: ["counts", publication.uri],
    queryFn: async () => {
      const constellationUrl = new URL("https://constellation.microcosm.blue/links/all");
      constellationUrl.searchParams.set("target", publication.uri);
      const response = await fetch(constellationUrl, {
        headers: {
          "Accept": "application/json"
        }
      });


      const json = await response.json() as { links: Record<string, any> };
      return json;
    },
    select: (data) => {
      const documents = Number(data.links["site.standard.document"]?.[".site"]?.records) || 0;
      const subscribers = Number(data.links["site.standard.graph.subscription"]?.[".publication"]?.records) || 0;

      return { documents, subscribers }
    }
  }));

  const isSubscribedQuery = createQuery(() => ({
    queryKey: ["isSubscribed", publication.uri, user.did],
    queryFn: async () => {
      const constellationUrl = new URL("https://constellation.microcosm.blue/xrpc/blue.microcosm.links.getBacklinks");
      constellationUrl.searchParams.set("subject", publication.uri);
      constellationUrl.searchParams.set("source", "site.standard.graph.subscription:publication");
      constellationUrl.searchParams.set("did", user.did);
      const response = await fetch(constellationUrl, {
        headers: {
          "Accept": "application/json"
        }
      });


      const json = await response.json() as { total: number };
      return json;
    },
  }));

  let documents = $derived(countQuery.data?.documents || 0);
  let subscribers = $derived(countQuery.data?.subscribers || 0);
  let isSubscribed = $derived((isSubscribedQuery.data?.total ?? 0) === 1);
  let blobSyncUrl = $derived((`${miniDocQuery.data?.pds}/xrpc/com.atproto.sync.getBlob?did=${publication.did}&cid=${publication.value.icon?.ref.$link}`));
  const theme = publication.value.basicTheme || { 
    $type: "site.standard.theme.basic",
    background: {
      $type: "site.standard.theme.color#rgb",
      b: 255,
      g: 255,
      r: 255
    },
    accentForeground: {
      $type: "site.standard.theme.color#rgb",
      b: 0,
      g: 0,
      r: 0,
    },
    foreground: {
      $type: "site.standard.theme.color#rgb",
      b: 0,
      g: 0,
      r: 0 
    },
    accent: {
      $type: "site.standard.theme.color#rgb",
      b: 36,
      g: 191,
      r: 251 
    },
  };

  // TODO: update with `site.standard.graph.subscription` create or delete on click with auth
  function toggleSubscribe() {
    const past = isSubscribed;
    isSubscribed = !isSubscribed;
    if (subscribers) {
      if (past) {
        subscribers--;
      }
      else {
        subscribers++;
      }
    }
  }
</script>

<div 
  class="flex flex-col lg:flex-row overflow-hidden rounded border shadow-sm"
  style={`
    background-color: rgb(${theme.background.r},${theme.background.g},${theme.background.b});
    color: rgb(${theme.foreground.r},${theme.foreground.g},${theme.foreground.b});
  `}
>
  <div class="flex flex-1 flex-col items-center justify-center gap-3 p-8">
    {#if publication.value.icon}
      <img 
        src={blobSyncUrl.toString()} 
        alt={publication.value.name} 
        class="size-24 rounded-xl hover:-rotate-15 transition-transform duration-150" 
      />
    {/if}
    <h3 class="text-xl font-semibold text-center text-balance">
      {publication.value.name}
    </h3>
    <a 
      href={`https://bsky.app/profile/${publication.actorHandle}`}
      style={`
        color: rgb(${theme.foreground.r},${theme.foreground.g},${theme.foreground.b});
      `}
      class="hover:!text-blue-500"
    >
      by @{publication.actorHandle} 
    </a>
    <p class="text-xs text-center max-w-md leading-relaxed font-neco">
      {publication.value.description}
    </p>
  </div>

  <div class="flex w-full lg:w-32 border-t lg:flex-col lg:border-t-0 lg:border-l bg-muted/50">
    <div 
      class="group flex flex-1 flex-col items-center justify-center gap-1 border-r lg:border-r-0 lg:border-b border-border p-4 hover:cursor-pointer"
      style={`
        background-color: rgb(${theme.accent.r},${theme.accent.g},${theme.accent.b});
        color: rgb(${theme.accentForeground.r},${theme.accentForeground.g},${theme.accentForeground.b});
      `}
    >
      <span class="text-2xl font-bold text-card-foreground">
        {documents}
      </span>
      <span class="flex gap-1 text-xs uppercase tracking-wide">
        Documents
        <span class="group-hover:rotate-45 transition-transform duration-150">↗</span>
      </span>
    </div>
    <button
      onclick={toggleSubscribe}
      onmouseenter={() => isSubscribeButtonHovered = true}
      onmouseleave={() => isSubscribeButtonHovered = false}
      class={["flex flex-1 flex-col items-center justify-center gap-1 p-4 hover:cursor-pointer transition-all duration-150 hover:bg-green-500", isSubscribed && "bg-green-500 hover:bg-red-400"]}>
      <span class="text-2xl font-bold">
        {subscribers}
      </span>
      <span class="text-xs uppercase tracking-wide">
        {#if isSubscribed}
          {#if isSubscribeButtonHovered}
            Unsubscribe?
          {:else}
            Subscribed
          {/if}
        {:else}
          {#if isSubscribeButtonHovered}
            Subscribe?
          {:else}
            Subscribers
          {/if}
        {/if}
      </span>
    </button>
  </div>
</div>
