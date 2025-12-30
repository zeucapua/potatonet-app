import * as v from "valibot";
import { query } from "$app/server"
import { LexiconBookmarkSlicesAPI } from "$lib/server/api"

const GetUserBookmarksValidator = v.object({
  handle: v.string(),
  cursor: v.optional(v.string())
});

export const getUserBookmarks = query(GetUserBookmarksValidator, async ({ handle, cursor }) => {
  const result = await fetch(`https://slingshot.microcosm.blue/xrpc/com.atproto.identity.resolveHandle?handle=${handle}`)
  const info = await result.json();

  if (!info) { throw Error(); }

  const data = await LexiconBookmarkSlicesAPI.getList({ 
    cursor: !cursor ? null : cursor, 
    where: {
      did: { eq: info.did } 
    }
  });

  console.log(info);

  return { cursor: data.cursor, list: data.records.map((r) => { 
    return { did: r.did, bookmark: r.value }
  })};
});


const GetAllBookmarksValidator = v.object({
  cursor: v.optional(v.string())
});

export const getAllBookmarks = query(GetAllBookmarksValidator, async ({ cursor }) => {
  const data = await LexiconBookmarkSlicesAPI.getList({ cursor }); 

  return { cursor: data.cursor, list: data.records.map((r) => { 
    return { did: r.did, bookmark: r.value }
  })};
});
