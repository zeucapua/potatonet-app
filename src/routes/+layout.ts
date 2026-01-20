import { redirect } from "@sveltejs/kit";
import { createQuicksliceClient, QuicksliceClient } from "quickslice-client-js";
import type { LayoutLoadEvent } from "./$types";
import { resolveHandle, type MiniDoc } from "$lib/utils";

export const ssr = false;

export const load = async ({ url }: LayoutLoadEvent) => {
  const atclient = await createQuicksliceClient({
    server: "https://admin.potatonet.app",
    clientId: "client_HYu7ocYtdMWtlOrEhgjpBA"
  });

  if (url.searchParams.has("code")) {
    await atclient.handleRedirectCallback();
    redirect(302, "/");
  }

  const isAuthed = await atclient.isAuthenticated();
  if (isAuthed) {
    const user = await atclient.getUser();
    if (user) {
      const info = await resolveHandle(user.did);
      return { atclient, user: info } as { atclient: QuicksliceClient, user: MiniDoc | undefined }
    }
  }

  return { atclient, user: undefined } as { atclient: QuicksliceClient, user: MiniDoc | undefined }
}
