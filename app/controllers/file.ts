import { sequelize } from "../config/db";
import FileModel from "../models/file";
import { FileI } from "../utils/types";
import { addAudit } from "./audit";

export async function addFile(data: FileI) {
  try {
    const File = await FileModel.create(data);
    console.log(File.toJSON(), "add");
    addAudit({
      user_id: parseInt(data?.user_id.toString()),
      action: `add ${JSON.stringify(data)} to table: files`,
    });
    return File?.id;
  } catch (e) {
    console.log("couldnt add file", e);
  }
  return null;
}
export async function getFileByID(id: number, user_id: number | string) {
  try {
    const File = await FileModel.findByPk(id);
    if (!File) {
      console.log("record not found with id " + id);
    }
    addAudit({
      user_id: parseInt(user_id.toString()),
      action: `file with id ${id}, ${JSON.stringify(
        File
      )} retrieved from table: files`,
    });
    return File;
  } catch (e) {
    console.log("could not retrieve record", e);
  }
  return null;
}
export async function getFilesByUser(userid: number, user_id: number | string) {
  try {
    const Files = await FileModel.findAll({ where: { user_id: userid } });
    if (Files.length < 1) {
      console.log("record not found with id " + userid);
    }
    console.log(Files, "files by user");
    addAudit({
      user_id: parseInt(user_id.toString()),
      action: `files with user id ${userid}, ${JSON.stringify(
        Files
      )} retrieved from table: files`,
    });
    return Files;
  } catch (e) {
    console.log("could not retrieve record", e);
  }
  return null;
}

export async function deleteFileByID(id: number, user_id: number | string) {
  try {
    const File = await getFileByID(id, user_id);
    await File?.destroy();
    console.log("deleted");
    addAudit({
      user_id: parseInt(user_id.toString()),
      action: `file with id ${id}, deleted from table: files`,
    });

    return true;
  } catch (e) {
    console.log("could not delete record", e);
    return false;
  }
}
export async function updateFileByID(
  id: number,
  data: FileI,
  user_id: number | string
) {
  try {
    const File = await getFileByID(id, user_id);
    File?.set({ File, ...data });
    const res = await File?.save();
    addAudit({
      user_id: parseInt(user_id.toString()),
      action: `file with id ${id}, ${JSON.stringify(
        res
      )} updated from table: files`,
    });
    return true;
  } catch (e) {
    console.log("could not update record", e);
    return false;
  }
}
