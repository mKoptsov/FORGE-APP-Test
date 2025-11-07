import { JiraStatus } from './types';

export const handleResponse = (
  statusCode: number = 200,
  headers: Record<string, string[]> = {},
  message: string
) => {
  if (!headers["Content-Type"]) {
    headers["Content-Type"] = ["application/json"];
  }
	
  const body = JSON.stringify({
    message,
  });

  return {
    statusCode,
    headers,
    body,
  };
};

export const findTicketKey = (branchName: string) => {
  const regex = /[A-Z]+-\d+/gi;

  const [result] = branchName.match(regex);
  return result;
};

export const findProperStatus = (statuses: JiraStatus[], statusCode: string) => {
  const status = statuses.find(
    (status: JiraStatus) => status.name === statusCode
  );

  return status;
};