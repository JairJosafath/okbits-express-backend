import { Sequelize, DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

class SessionModel extends Model {
  id?: number;
  session_id?: string;
  expires?: Date;
  data?: object;
}

SessionModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    session_id: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Session",
    tableName: "sessions",
  }
);

export default SessionModel;
