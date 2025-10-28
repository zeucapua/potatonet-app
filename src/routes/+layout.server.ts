import type { ServerLoadEvent } from "@sveltejs/kit";

export async function load({ locals }: ServerLoadEvent) {
  // have user available throughout the app via LayoutData
  return !locals.user ? undefined : { user: {
    did: locals.user.did,
    handle: locals.user.handle
  }};
}
