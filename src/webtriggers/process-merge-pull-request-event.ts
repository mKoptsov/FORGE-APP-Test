import type { WebTriggerResponse, WebTriggerRequest } from "@forge/api";

import { handleResponse, findTicketKey, findProperStatus } from "../helpers";
import { JiraClient } from "../clients/Jira";

const STATUS = "Done";
const PR_ACTION = "closed";

export async function handleMergePullRequestEvent(
  request: WebTriggerRequest
): Promise<WebTriggerResponse> {
  try {
    const [eventType] = request.headers["x-github-event"] || [];

    if (eventType === "ping") {
      return handleResponse(
        200,
        { "Content-Type": ["application/json"] },
        "Pong"
      );
    }

    const body = JSON.parse(request.body || "{}");

    const { action, pull_request: pullRequest } = body;

    const ticketName = findTicketKey(pullRequest.head?.ref);

    if (action === PR_ACTION && pullRequest.merged === true) {
      const ticketName = findTicketKey(pullRequest.head?.ref);

      const jira = new JiraClient();
      const result = await jira.getStatusesForTicket(ticketName);

      const status = findProperStatus(result.transitions, STATUS);

      const res = await jira.updateTicket(ticketName, status.id);

      return handleResponse(
        200,
        { "Content-Type": ["application/json"] },
        `Status the ticket ${ticketName} was updated to ${STATUS}`
      );
    }

    console.warn(`Status the ticket ${ticketName} was not updated.`);

    return handleResponse(
      200,
      { "Content-Type": ["application/json"] },
      `Status the ticket ${ticketName} was not updated.`
    );
  } catch (error) {
    console.log("Error", error);

    return handleResponse(
      500,
      { "Content-Type": ["application/json"] },
      "Something went wrong"
    );
  }
}
