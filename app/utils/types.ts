export type FileI = {
  id?: number;
  name: string;
  alias: string;
  user_id: string | number;
  size?: number;
  path?: string;
  path_unl?: string;
  data_pdf?: string;
  data_json?: string;
  createdat?: Date;
  updatedat?: Date;
  owner?: string;
};

export type UserI = {
  id?: number;
  username?: string;
  alias?: string;
  profile?: string;
  hash?: string;
  salt?: string;
  owner?: string;
  createdat?: Date;
  updatedat?: Date;
};

export type SessionI = {
  id?: number;
  session_id: string;
  expires: Date;
  data: object;
};

export interface EmailI {
  to?: string;
  subject?: string;
  cc?: string;
  content?: string;
  attached?: {
    pdf?: boolean;
    csv?: boolean;
    json?: boolean;
  };
}
