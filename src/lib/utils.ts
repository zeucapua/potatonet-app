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
};

export type LexiconCommunityLike = {
	$type: "community.lexicon.interaction.like";
	subject: string;
	createdAt: string;
}

export type SliceItem<T> = CommonSliceFields & { value: T };

export type SliceList<T> = CommonSliceFields & {
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
