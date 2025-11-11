import api, { route } from "@forge/api";

export class JiraClient {
  protected request = api.asApp();

  async getStatusesForTicket(ticketId: string) {
    try {
      const response = await this.request.requestJira(
        route`/rest/api/3/issue/${ticketId}/transitions`
      );

      if (!response.ok) {
        const message = await response.text();

        throw new Error(message);
      }

      const result = await response.json();
			return result;
    } catch (error) {
      console.error("error", error);

      throw new Error();
    }
  }

  async updateTicket(ticketId: string, status: string): Promise<void> {
    const body = {
      transition: { id: status },
    };

    const headers = { "Content-Type": "application/json" };

    try {
       const response = await this.request.requestJira(
        route`/rest/api/3/issue/${ticketId}/transitions`,
        {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        }
      );

			if (!response.ok) {
        const message = await response.text();

        throw new Error(message);
      }
			
    } catch (error) {
			console.error('error', error);

			throw new Error();
		}
  }
}
