import * as v from "valibot";
import ogs from "open-graph-scraper";
import { query } from "$app/server";
import { error } from "@sveltejs/kit";

export const getMetadata = query(v.string(), async (url) => {
  if (url === "/") { return error(401); }
  const response = await ogs({ url }); 
  if (response.error) { return error(404); }
  return response.result;
});
