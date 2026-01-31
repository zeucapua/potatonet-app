import { resolveHandle } from "$lib/utils";
import type { PageLoadEvent } from "./$types";

export async function load({ params }: PageLoadEvent) {
  const info = await resolveHandle(params.handle);
  return { author: info }
}
