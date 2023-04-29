import  { Sequelize, DataTypes,Model } from 'sequelize';
import { sequelize } from '../config/db';

export class FileModel extends Model {};

FileModel.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    size: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    path: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data_UNL: {
      type: DataTypes.BLOB
    },
    data_PDF: {
      type: DataTypes.BLOB
    },
    data_JSON: {
      type: DataTypes.BLOB
    },
    dateCreated: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    dateModified: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    owner: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  },{
    sequelize, 
    modelName: 'File' 
  })
  
