// --- UTILITIES ---
export function parseAtUri(uri: string) {
  const regex = /at:\/\/(?<did>did.*)\/(?<lexi>.*)\/(?<rkey>.*)/;
  const groups = regex.exec(uri)?.groups;
  return {
    did: groups?.did,
    lexi: groups?.lexi,
    rkey: groups?.rkey
  }
}

export function createAtUri({ did, collection, rkey }: { did: string, collection: string, rkey: string }) {
  if (did && collection && rkey) {
    return `at://${did}/${collection}/${rkey}`;    
  }
  return undefined;
}

export type MiniDoc = {
  did: string;
  handle: string;
  pds: string;
  signing_key: string;
}

export async function resolveHandle(handle: string) {
  const result = await fetch(`https://slingshot.microcosm.blue/xrpc/com.bad-example.identity.resolveMiniDoc?identifier=${encodeURIComponent(handle)}`)
  const info = await result.json();
  return info as MiniDoc;
}

export type Node = {
  uri: string;
  cid: string;
  did: string;
  indexedAt: string;
  actorHandle: string;
}

export type ATBlob = {
  $type: string;
  ref: { $link: string; };
  mimeType: string;
  size: number;
}

export type StandardSiteThemeColorRGB = {
  $type: "site.standard.theme.color#rgb",
  b: number;
  g: number;
  r: number;
}

export type PublicationNode = Node & { value: {
  url: string;
  name: string;
  description: string;
  icon?: ATBlob;
  preferences?: {
    showInDiscover?: boolean;
    hideProfile?: boolean;
  };
  basicTheme?: {
    $type: "site.standard.theme.basic",
    background: StandardSiteThemeColorRGB;
    foreground: StandardSiteThemeColorRGB;
    accent: StandardSiteThemeColorRGB;
    accentForeground: StandardSiteThemeColorRGB;
  };
}}

export type DocumentNode = Node & { value: {
  title: string;
  site: string;
  publishedAt: string;
  path?: string;
  content?: string;
  bskyPostRef?: string;
  description?: string;
  textContent?: string;
  tags?: string[];
  updatedAt?: string;
}}
