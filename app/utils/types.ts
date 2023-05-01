export type FileI = {
  id?: number;
  name: string;
  user_id: string | number;
  size?: string;
  path?: string;
  data_unl?: Buffer;
  data_pdf?: Buffer;
  data_json?: Buffer;
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
