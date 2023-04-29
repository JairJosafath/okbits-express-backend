import  { Sequelize, DataTypes,Model } from 'sequelize';
import { sequelize } from '../config/db';

 class FileModel extends Model {
  id?:number;
    name?: string;
    size?: string;
    path?: string;
    data_UNL?: Buffer;
    data_PDF?: Buffer;
    data_JSON?: Buffer;
    dateCreated?: Date;
    dateModified?: Date;
    owner?: string;
 };

FileModel.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    size: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    path: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    data_unl: {
      type: DataTypes.BLOB
    },
    data_pdf: {
      type: DataTypes.BLOB
    },
    data_json: {
      type: DataTypes.BLOB
    },
    owner: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },{
    sequelize, 
    modelName: 'File',
    tableName:'files' 
  })
  
  export default FileModel;