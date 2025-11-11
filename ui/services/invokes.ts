import { invoke } from "@forge/bridge";

import type { Repository, Response, ResponseGetOpenPR } from "../../common/types";

export const saveAndVerifyToken = (
  token: string
): Promise<Response<null>> => {
  return invoke("saveToken", { token });
};

export const getRepositoriesForUser = (): Promise<Response<Repository[]>> => {
  return invoke("getRepositories");
};

export const getPullRequests = (repositoryNames: string[]): Promise<Response<ResponseGetOpenPR[]>> => {
  return invoke("getOpenPullRequests", { repositoryNames });
};

export const mergePullRequest = (
  repositoryName: string,
  pullRequestNumber: number
): Promise<Response<null>> => {
  return invoke("mergePullRequest", {
    repositoryName,
    pullRequestNumber,
  });
};

export const approvePullRequest = (
  repositoryName: string,
  pullRequestNumber: number
): Promise<Response<null>> => {
  return invoke("approvePullRequest", { repositoryName, pullRequestNumber });
};

export const checkExistingToken = (): Promise<Response<null>> => {
	return invoke("checkToken");
}
