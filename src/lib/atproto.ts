import { db } from "./server/db";
import { NodeOAuthClient } from "@atproto/oauth-client-node";
import { AuthSessionStore, AuthStateStore } from "./stores";

import { dev } from "$app/environment";

const publicUrl = "https://potatonet.app"
// localhost resolves to either 127.0.0.1 or [::1] (if ipv6)
const url = dev ? "http://[::1]:5173" : publicUrl;

export const atclient = new NodeOAuthClient({
  stateStore: new AuthStateStore(db),
  sessionStore: new AuthSessionStore(db),
  clientMetadata: {
    client_name: "potatonet-app",
    client_id: !dev ? `${publicUrl}/client-metadata.json`
      : `http://localhost?redirect_uri=${
          encodeURIComponent(`${url}/oauth/callback`)
        }&scope=${
          encodeURIComponent(`atproto transition:generic`)
        }`,
    client_uri: url,
    redirect_uris: [`${url}/oauth/callback`],
    scope: "atproto transition:generic",
    grant_types: ["authorization_code", "refresh_token"],
    application_type: "web",
    token_endpoint_auth_method: "none",
    dpop_bound_access_tokens: true
  }
});
