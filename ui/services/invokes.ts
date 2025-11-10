import { invoke } from "@forge/bridge";

import { SaveTokenResponse } from "./types";

export const saveAndVerifyToken = (
  token: string
): Promise<SaveTokenResponse> => {
  return invoke<SaveTokenResponse>("saveToken", { token });
};

export const getRepositoriesForUser = (): Promise<any> => {
  return invoke<SaveTokenResponse>("getRepositories");
};

export const getPullRequests = (repositoryNames: string[]): Promise<any> => {
  return invoke<SaveTokenResponse>("getOpenPullRequests", { repositoryNames });
};

export const mergePullRequest = (
  repositoryName: string,
  pullRequestId: number
) => {
  return invoke<SaveTokenResponse>("mergePullRequest", {
    repositoryName,
    pullRequestId,
  });
};

export const approvePullRequest = (
  repositoryName: string,
  pullRequestId: number
) => {
  return invoke("approvePullRequest", { repositoryName, pullRequestId });
};

export const checkExistingToken = (): any => {
	return invoke("checkToken");
}
