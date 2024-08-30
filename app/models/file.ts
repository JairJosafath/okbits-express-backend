import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

class FileModel extends Model {
  id?: number;
  name?: string;
  size?: string;
  path?: string;
  data_UNL?: Buffer;
  data_PDF?: Buffer;
  data_JSON?: Buffer;
  dateCreated?: Date;
  dateModified?: Date;
  owner?: string;
}

FileModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    alias: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    size: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    path_unl: {
      type: DataTypes.BLOB,
    },
    path_pdf: {
      type: DataTypes.BLOB,
    },
    path_json: {
      type: DataTypes.BLOB,
    },
    owner: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
    modelName: "File",
    tableName: "files",
  }
);

export default FileModel;
