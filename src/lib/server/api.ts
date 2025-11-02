import { SLICES_NETWORK_ACCESS_TOKEN } from "$env/static/private";
import type { LexiconCommunityBookmark, SliceItem, SliceList } from "$lib/utils";

const SLICES_NETWORK_SLICE_URI = "at://did:plc:gotnvwkr56ibs33l4hwgfoet/network.slices.slice/3m26tswgbi42i"

const baseUrl = "https://api.slices.network/xrpc/";

type GetListProps = {
  limit?: number; // default: 50, max: 100
  cursor?: string;
  where?: {
    [key: string]: { eq?: string, contains?: string, in?: string[] }
  };
  sortBy?: { field: string, direction: "desc" | "asc" }[]
};

export class SlicesAPI<T> {

  collection: string;
  sliceUri: string;

  constructor({ collection, sliceUri }: { collection: string, sliceUri : string }) { 
    this.collection = collection; 
    this.sliceUri = sliceUri;
  }

  async getRecord({ uri }: { uri: string }) {
    const searchParams = new URLSearchParams({ slice: SLICES_NETWORK_SLICE_URI, uri });
    const response = await fetch(`${baseUrl}${this.collection}.getRecord?${searchParams.toString()}`);
    return await response.json() as SliceItem<T>;
  }

  async getList(body: GetListProps) {
    const response = await fetch(`${baseUrl}${this.collection}.getRecords`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": SLICES_NETWORK_ACCESS_TOKEN
      },
      body: JSON.stringify({ ...body, slice: SLICES_NETWORK_SLICE_URI })
    });
    const data = await response.json() as SliceList<T>;
    console.log({ data });
    return data;
  }
}

export const LexiconBookmarkSlicesAPI = new SlicesAPI<LexiconCommunityBookmark>({ 
  collection: "community.lexicon.bookmarks.bookmark",
  sliceUri: SLICES_NETWORK_SLICE_URI
});
