export type Repository = {
  id: number;
  name: string;
  description: string;
  url: string;
};

export type ResponseGetOpenPR = {
  repository: string;
  url: string;
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