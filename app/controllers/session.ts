import { sequelize } from "../config/db";
import SessionModel from "../models/session";
import { SessionI } from "../utils/types";

export async function addSession(data: SessionI) {
  try {
    const Session = await SessionModel.create(data);
    console.log(Session.toJSON(), "add");
    return Session?.id;
  } catch (e) {
    console.log("couldnt add session", e);
  }
  return null;
}
export async function getSessionByID(id: number) {
  try {
    const Session = await SessionModel.findByPk(id);
    if (!Session) {
      console.log("record not found with id " + id);
    }
    console.log(Session?.toJSON(), "update");
    return Session;
  } catch (e) {
    console.log("could not retrieve record", e);
  }
  return null;
}

export async function deleteSessionByID(id: number) {
  try {
    const Session = await getSessionByID(id);
    await Session?.destroy();
    console.log("deleted");
    return true;
  } catch (e) {
    console.log("could not delete record", e);
    return false;
  }
}
export async function updateSessionByID(id: number, data: SessionI) {
  try {
    const Session = await getSessionByID(id);
    Session?.set({ ...data });
    await Session?.save();
    console.log("updated");
    return true;
  } catch (e) {
    console.log("could not update record", e);
    return false;
  }
}

export async function findSessionBySessionname(sessionname: string) {
  try {
    const session = await SessionModel.findOne({ where: { sessionname } });
    if (session === null) {
      console.log("Session Not found!");
    } else {
      console.log("session found");
      return session?.toJSON();
    }
  } catch (e) {
    console.log("err while trying to find session", e);
  }
}
