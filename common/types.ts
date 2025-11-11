export type Repository = {
  id: number;
  name: string;
  description: string;
  url: string;
};

export type ResponseGetOpenPR = {
  id: number,
  prNumber: number,
  repository: string;
  url: string;
  prOwnerName: string,
  ticketName: string;
  title: string;
};

type Error = {
  message: string,
}

export type Response<T> = {
  data?: T;
  error?: Error;
  success: boolean;
}