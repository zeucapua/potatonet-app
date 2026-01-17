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

export async function resolveHandle(handle: string) {
  const result = await fetch(`https://slingshot.microcosm.blue/xrpc/com.bad-example.identity.resolveMiniDoc?identifier=${encodeURIComponent(handle)}`)
  const info = await result.json();
  return info;
}

export type Node = {
  uri: string;
  cid: string;
  did: string;
  indexedAt: string;
  actorHandle: string;
}

export type PublicationNode = Node & { value: {
  url: string;
  name: string;
  description: string;
  icon?: string;
  preferences?: {
    showInDiscover?: boolean;
    hideProfile?: boolean;
  }
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
