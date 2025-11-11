interface Params {
  method?: "POST" | "GET" | "PUT" | "PATCH" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
}
import { fetch } from "@forge/api";

export abstract class BaseHttpClient {
  protected responseHeaders: Headers | undefined;
  protected baseUrl: string;

  protected constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  protected async makeRequest(
    pathName: string,
    { method = "GET", body, headers = {} }: Params = {}
  ): Promise<any> {
    const url = new URL(pathName, this.baseUrl);

    if (!headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    if (headers["Authorization"] === undefined) {
      const header = await this.makeAuth();

      headers["Authorization"] = `Bearer ${header}`;
    }

    if (body && headers["Content-Type"] === "application/json") {
      body = JSON.stringify(body);
    }

    try {
      const response = await fetch(url.toString(), { method, headers, body });

      if (!response.ok) {
        const message = await response.text();

        throw new Error(message);
      }

      return await response.json();
    } catch (error) {
      console.error("Error", error);
  
      throw new Error(error);
    }
  }

  abstract makeAuth(): Promise<string>;
}
