import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DATABASE_URL || "",

  {
    dialect: "postgres",
    ssl: true,
    dialectOptions: {
      ssl: false,
    },
    define: {
      createdAt: "createdat",
      updatedAt: "updatedat",
    },
  }
);

export async function testdb() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

export async function close() {
  try {
    await sequelize.close();
    console.log("Connection has been closed successfully.");
  } catch (error) {
    console.error("Unable to close the connection:", error);
  }
}
