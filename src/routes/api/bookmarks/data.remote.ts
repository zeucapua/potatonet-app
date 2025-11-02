import * as v from "valibot";
import { getRequestEvent, query } from "$app/server"
import { LexiconBookmarkSlicesAPI } from "$lib/server/api"
import { Agent } from "@atproto/api";

const GetUserBookmarksValidator = v.object({
  handle: v.string(),
  cursor: v.optional(v.string())
});

export const getUserBookmarks = query(GetUserBookmarksValidator, async ({ handle, cursor }) => {
  const { locals } = getRequestEvent();
  const agent = locals.authedAgent ?? new Agent({ service: "https://api.bsky.app" });
  const result = await agent.resolveHandle({ handle });
  if (!result.success) { throw Error() };

  const data = await LexiconBookmarkSlicesAPI.getList({ 
    cursor, 
    where: {
      did: { eq: result.data.did } 
    }
  });

  return { cursor: data.cursor, bookmarks: data.records.map((r) => r.value )};
});


const GetAllBookmarksValidator = v.object({
  cursor: v.optional(v.string())
});

export const getAllBookmarks = query(GetAllBookmarksValidator, async ({ cursor }) => {
  const data = await LexiconBookmarkSlicesAPI.getList({ cursor }); 

  return { cursor: data.cursor, bookmarks: data.records.map((r) => r.value )};
});
