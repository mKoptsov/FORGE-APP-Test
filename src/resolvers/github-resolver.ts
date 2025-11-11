import { storage } from "@forge/api";
import Resolver, { Request } from "@forge/resolver";

import { GithubClient } from "../clients/Github";
import { findTicketKey } from "../helpers";
import { Response, ResponseGetOpenPR, Repository } from "../../common/types";

type SaveTokenPayload = {
  token: string;
};

type GetOpenPullRequest = {
  repositoryNames: string[];
};

type MergePullRequest = {
  repositoryName: string;
  pullRequestNumber: number;
};

const resolver = new Resolver();

resolver.define(
  "getRepositories",
  async (): Promise<Response<Repository[]>> => {
    const client = new GithubClient("https://api.github.com");

    let userName: string = await storage.get("username"); // save and decrypt

    if (userName === undefined) {
      const user = await client.getUser();

      userName = user.login;
    }

    const result = await client.getListRepositoriesByUser(userName);

    const repositories = result.map((repository) => ({
      id: repository.id,
      name: repository.name,
      description: repository.description,
      url: repository.html_url,
    }));

    return { data: repositories, success: true };
  }
);

resolver.define(
  "saveToken",
  async ({ payload }: Request<SaveTokenPayload>): Promise<Response<null>> => {
    if (!payload.token) {
      return { success: false };
    }

    await storage.set("github_token", payload.token);

    const client = new GithubClient("https://api.github.com");
    try {
      const user = await client.getUser();

      if (!user) {
        return { success: false };
      }

      await storage.set("username", user.login);

      return { data: null, success: true };
    } catch (error) {
      return { error: { message: "Invalid token" }, success: false };
    }
  }
);

resolver.define(
  "getOpenPullRequests",
  async ({
    payload,
  }: Request<GetOpenPullRequest>): Promise<Response<ResponseGetOpenPR[]>> => {
    const { repositoryNames } = payload;
    const userName: string = await storage.get("username");

    const client = new GithubClient("https://api.github.com");

    let result: ResponseGetOpenPR[][];

    try {
      if (repositoryNames.length <= 0) {
        return {
          success: false,
          error: { message: "Repository names does not have " },
        };
      }

      result = await Promise.all(
        repositoryNames.map(async (name) => {
          const pullRequests = await client.getListPullRequests(userName, name);

          return pullRequests.map((pr) => {
            const ticketName = findTicketKey(pr.head?.ref);

            if (ticketName) {
              return {
                id: pr.id,
                prNumber: pr.number,
                repository: name,
                url: pr.html_url,
                prOwnerName: pr.user.login,
                ticketName,
                title: pr.title,
              };
            }
          });
        })
      );

      return { data: result.flat(), success: true };
    } catch (error) {
      return {
        success: false,
        error: { message: "Something went wrong" },
      };
    }
  }
);

resolver.define(
  "mergePullRequest",
  async ({ payload }: Request<MergePullRequest>): Promise<Response<null>> => {
    const { repositoryName, pullRequestNumber } = payload;

    try {
      const userName: string = await storage.get("username");
      const client = new GithubClient("https://api.github.com");

      await client.mergePullRequest(
        userName,
        repositoryName,
        pullRequestNumber
      );

      return {
        data: null,
        success: true,
      };
    } catch (error) {
      return {
        success: false,
        error: { message: "Can not merge the Pull Request" },
      };
    }
  }
);

resolver.define("approvePullRequest", async ({ payload }): Promise<Response<null>> => {
  const { repositoryName, pullRequestNumber } = payload;

  try {
    const userName: string = await storage.get("username");
    const client = new GithubClient("https://api.github.com");

    const result = await client.approvePullRequest(
      userName,
      repositoryName,
      pullRequestNumber
    );

    return {
      data: null,
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: { message: "Can not approve the Pull request" },
    };
  }
});

resolver.define("checkToken", async (): Promise<Response<null>> => {
  const token = await storage.get("github_token");

  if (!token) {
    return {success: false, error: { message: 'Token does not exist'}};
  } 

  const client = new GithubClient("https://api.github.com");

  try {
    const user = await client.getUser();

    if (!user) {
      return { success: false };
    }
    return { data: null, success: true };
  } catch (error) {
    return { error: { message: "something went wrong" }, success: false };
  }
});

export default resolver.getDefinitions();
