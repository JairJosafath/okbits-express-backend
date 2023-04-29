export type FileI = {
    name: string;
    size?: string;
    path?: string;
    data_UNL?: Buffer;
    data_PDF?: Buffer;
    data_JSON?: Buffer;
    dateCreated: Date;
    dateModified: Date;
    owner: string;
  }
