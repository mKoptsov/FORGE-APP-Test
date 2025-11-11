import { BaseHttpClient } from "./HttpClient";
import { storage } from "@forge/api";

type Params  =  {
  state: 'open' | 'closed' | 'all'
  base: string,
  sort: string,
  per_page: number,
  page: number,
}
type GetRepository = {
  id: number,
  name: string,
  description: string,
  html_url: string,
}

type PullRequest = {
  id: number,
  number: number,
  html_url: string,
  title: string
  body: string,
  head: Branch,
  base: Branch,
  user: User,
}

type User = {
  id: number,
  login: string,
  html_url: string,
  name: string,
  eamil: string,
}

type Branch = {
  label: string,
  ref: string,
  sha: string
}

export class GithubClient extends BaseHttpClient {

  constructor(baseUrl: string) {
    super(baseUrl);
  }
  public async getListPullRequests(
    owner: string,
    repo: string,
    params?: Params,
  ): Promise<PullRequest[]> {
    const response = await this.makeRequest(`/repos/${owner}/${repo}/pulls`);

    return response;
  }

  public async getListRepositoriesByUser(username: string): Promise<GetRepository[]> {
    const response = await this.makeRequest(`/users/${username}/repos`);

    return response;
  }

  public async getUser(): Promise<User> {
    const token = await this.token();

    const response = await this.makeRequest(`/user`);

    return response;
  }

  private async token() {
    return storage.get("github_token");
  }

  async makeAuth(): Promise<string> {
    return await this.token();
  }

  async mergePullRequest(userName: string, repo: string, pullRequestNumber: number): Promise<string> {
    const response = await this.makeRequest(`/repos/${userName}/${repo}/pulls/${pullRequestNumber}/merge`, {
      method: "PUT",
    });

    return response;
  }

  async approvePullRequest(userName: string, repo: string, pullRequestNumber: number): Promise<string> {
    const body = { event: 'APPROVE' };

     const response = await this.makeRequest(`/repos/${userName}/${repo}/pulls/${pullRequestNumber}/reviews`, {
      method: "POST", 
      body,
    });

    return response;
  }
}
