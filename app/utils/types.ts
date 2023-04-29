export type FileI = {
  id?:number;
    name: string;
    size?: string;
    path?: string;
    data_unl?: Buffer;
    data_pdf?: Buffer;
    data_json?: Buffer;
    createdat?: Date;
    updatedat?: Date;
    owner?: string;
  }

  export type UserI = {
    id?:number;
      username?: string;
      alias?: string;
      profile?: string;
      hash?: string;
      salt?: string;
      owner?: string;
      createdat?: Date;
    updatedat?: Date;
   };