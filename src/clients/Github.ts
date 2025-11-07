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

  public async getToken(
    clientId: string,
    clientSecret: string,
    code: string
  ): Promise<any> {
    const body = {
      client_id: clientId,
      client_secret: clientSecret,
      code,
    };

    const response = await this.makeRequest(`/login/oauth/access_token`, {
      method: "POST",
      body,
    });

    return response;
  }

  public async getUser(): Promise<any> {
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

  async mergePullRequest(userName: string, repo: string, pullNumber: number): Promise<string> {
    console.log('hui', userName, repo, pullNumber);
    const response = await this.makeRequest(`/repos/${userName}/${repo}/pulls/${pullNumber}/merge`, {
      method: "PUT",
    });
    console.log('respose mergePullRequest', response);
    return response;
  }
}
