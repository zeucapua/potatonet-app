// --- UTILITIES ---
export type CommonSliceFields = {
  indexedAt: string;
  cid: string;
  uri: string;
  collection: string;
}

export type LexiconCommunityBookmark = {
	$type: "community.lexicon.bookmarks.bookmark";
	subject: string;
	createdAt: string;
	tags?: string[];
  $enriched?: {
    description: string;
    favicon: string;
    title: string;
  }
};

export type LexiconCommunityLike = {
	$type: "community.lexicon.interaction.like";
	subject: string;
	createdAt: string;
}

export type SliceItem<T> = CommonSliceFields & { value: T };

export type SliceList<T> = {
  cursor: string;
  records: (CommonSliceFields & { did: string, value: T })[];
}

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
  const result = await fetch(`https://slingshot.microcosm.blue/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`)
  const info = await result.json();
  return info.did;
}
