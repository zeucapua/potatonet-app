// --- UTILITIES ---

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

export function parseAtUri(uri: string) {
  const regex = /at:\/\/(?<did>did.*)\/(?<lexi>.*)\/(?<rkey>.*)/;
  const groups = regex.exec(uri)?.groups;
  return {
    did: groups?.did,
    lexi: groups?.lexi,
    rkey: groups?.rkey
  }
}
