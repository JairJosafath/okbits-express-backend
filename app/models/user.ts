import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

class UserModel extends Model {
  declare id?: number;
  declare username?: string;
  declare alias?: string;
  declare profile?: string;
  declare hash?: string;
  declare salt?: string;
}

UserModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    alias: {
      type: DataTypes.STRING,
    },
    profile: {
      type: DataTypes.STRING,
    },
    hash: {
      type: DataTypes.STRING,
    },
    salt: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "User",
    tableName: "users",
  }
);

export default UserModel;
