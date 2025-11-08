import Resolver from "@forge/resolver";
import { storage } from "@forge/api";

import { GithubClient } from "../clients/Github";

export const trigger = async (req: any) => {
  const { code } = req.queryParameters || {};

  if (!code) return { error: "Missing code" };


  const client = new GithubClient("https://github.com");

  const token = await client.getToken('', '', code);

  if (!token.access_token){
    return { error: "Failed to get GitHub token", details: token };
  }

  await storage.set("github_token", token.access_token);

  return { success: true, access_token: token.access_token };
};
