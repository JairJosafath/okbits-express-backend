import { Sequelize } from "sequelize";

import dotenv from "dotenv";
dotenv.config();

const DB = process.env.DB || "";
const USER = process.env.USER || "";
const HOST = process.env.HOST || "";
const PASSWORD = process.env.PASSWORD || "";
const PORT = parseInt(process.env.PORT || "");

export const sequelize = new Sequelize(DB, USER, PASSWORD, {
  host: HOST,
  dialect: "postgres",
  port: PORT,
  define: {
    createdAt: "createdat",
    updatedAt: "updatedat",
  },
});

export async function connect() {
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
