type StatusCategory = {
  self: string;
  id: number;
  key: string;
  colorName: string;
  name: string;
};

type To = {
  self: string;
  description: string;
  iconUrl: string;
  name: string;
  id: string;
  statusCategory: StatusCategory;
};

export type JiraStatus = {
  id: string;
  name: string;
  to: To;
  hasScreen: boolean;
  isGlobal: boolean;
  isInitial: boolean;
  isAvailable: boolean;
  isConditional: boolean;
  isLooped: boolean;
};