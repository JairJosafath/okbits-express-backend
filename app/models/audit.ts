import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/db";

class AuditModel extends Model {
  declare id?: number;
  declare user_id?: number;
  declare action?: string;
  declare timestamp?: Date;
}

AuditModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(10),
    },
    timestamp: {
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: "Audit",
    tableName: "audit",
  }
);

export default AuditModel;
