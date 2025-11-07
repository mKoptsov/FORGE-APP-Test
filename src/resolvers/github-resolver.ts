import { storage } from "@forge/api";
import Resolver, { Request } from "@forge/resolver";

import { GithubClient } from "../clients/Github";
import { findTicketKey } from "../helpers";

type SaveTokenPayload = {
  token: string;
};

type GetOpenPullRequest = {
  repositoryNames: string[];
};

type mergePullRequest = {
  repositoryName: string;
  pullRequestId: number;
};

type Repository = {
  id: number;
  name: string;
  description: string;
  url: string;
};


type ResponseGetOpenPR = {
  repository: string;
  url: string;
  ticketName: string;
  title: string;
};

const resolver = new Resolver();

resolver.define("getRepositories", async (): Promise<Repository[]> => {
  const client = new GithubClient("https://api.github.com");

  let userName: string = await storage.get("username"); // save and decript

  if (userName === undefined) {
    const user = await client.getUser();

    userName = user.login;
  }

  const result = await client.getListRepositoriesByUser(userName);

  return result.map((repository) => ({
    id: repository.id,
    name: repository.name,
    description: repository.description,
    url: repository.html_url,
  }));
});

resolver.define("saveToken", async ({ payload }: Request<SaveTokenPayload>) => {
  if (!payload.token) {
    return { success: false };
  }

  await storage.set("github_token", payload.token);

  const client = new GithubClient("https://api.github.com");
  const user = await client.getUser();

  if (!user) {
    return { success: false };
  }

  await storage.set("username", user.login);

  return { success: true };
});

resolver.define(
  "getOpenPullRequests",
  async ({ payload }: Request<GetOpenPullRequest>): Promise<{result: ResponseGetOpenPR[]}> => {
    const { repositoryNames } = payload;
    const userName: string = await storage.get("username");

    const client = new GithubClient("https://api.github.com");

    let result;
    console.log("repositories", repositoryNames);

    if (repositoryNames.length > 0) {
      result = await Promise.all(
        repositoryNames.map(async (name) => {
          const pullRequests = await client.getListPullRequests(userName, name);

          return pullRequests.map((pr) => {
            const ticketName = findTicketKey(pr.head?.ref);

            if (ticketName) {
              return {
                id: pr.id,
                number: pr.number,
                repository: name,
                url: pr.html_url,
                ticketName,
                title: pr.title,
              };
            }
          });
        })
      );
    }

    return { result: result.flat() };
  }
);

resolver.define(
  "mergePullRequest",
  async ({ payload }: Request<mergePullRequest>) => {
    const { repositoryName, pullRequestId } = payload;

    const userName: string = await storage.get("username");

    const client = new GithubClient("https://api.github.com");
    console.log('ha ha ha ', repositoryName, pullRequestId);
    const result = await client.mergePullRequest(
      userName,
      repositoryName,
      pullRequestId
    );

    return { success: true };
  }
);

export default resolver.getDefinitions();
