import Resolver from "@forge/resolver";
import { storage } from "@forge/api";

import { GithubClient } from "../clients/Github";

export const trigger = async (req: any) => {
  const { code } = req.queryParameters || {};

  if (!code) return { error: "Missing code" };

  const clientId = "Ov23li4cXVVJau5GC7tn";
  const clientSecret = "a5983fb4d76a78361b96826d4a9890688271a11e";

  const client = new GithubClient("https://github.com");

  const token = await client.getToken(clientId, clientSecret, code);

  if (!token.access_token){
    return { error: "Failed to get GitHub token", details: token };
  }

  await storage.set("github_token", token.access_token);

  return { success: true, access_token: token.access_token };
};
