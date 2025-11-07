import Resolver, { type Request } from "@forge/resolver";
import { storage } from "@forge/api";

import { GithubClient } from "../clients/Github";

type SaveTokenPayload = {
  token: string;
};

const resolver = new Resolver();

resolver.define("saveToken", async ({ payload }: Request<SaveTokenPayload>) => {
  await storage.set("github_token", payload.token);

  const client = new GithubClient("https://api.github.com");
  const user = await client.getUser();

  if (!user) {
    return { success: false };
  }

  await storage.set("username", user.login);

  return { success: true };
});

export const validateAndSaveToken = resolver.getDefinitions();
