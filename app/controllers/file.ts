import { sequelize } from "../config/db";
import FileModel from "../models/file";
import { FileI } from "../utils/types";
import { addAudit } from "./audit";
import { unlink } from "fs";

export async function addFile(data: FileI) {
  try {
    const File = await FileModel.create(data);
    console.log(File.toJSON(), "add");
    await addAudit({
      user_id: parseInt(data?.user_id.toString()),
      action: `add ${JSON.stringify(data)} to table: files`,
    });
    return File;
  } catch (e) {
    console.log("couldnt add file", e);
  }
}
export async function getFileByID(id: number, user_id: number | string) {
  try {
    const File = await FileModel.findByPk(id);
    if (!File) {
      console.log("record not found with id " + id);
    }
    await addAudit({
      user_id: parseInt(user_id.toString()),
      action: `file with id ${id}, ${JSON.stringify(
        File
      )} retrieved from table: files`,
    });
    return File;
  } catch (e) {
    console.log("could not retrieve record", e);
    return null;
  }
}
export async function getFileByName(name: string, user_id: number | string) {
  try {
    const File = await FileModel.sequelize?.query(
      `SELECT * FROM files WHERE name LIKE '%${name}%' AND user_id=${user_id};`
    );
    const temp: any = File;
    if (!File) {
      console.log("record not found with id " + name);
    }
    await addAudit({
      user_id: parseInt(user_id.toString()),
      action: `file with name containing ${name}, ${JSON.stringify(
        File
      )} retrieved from table: files via Search`,
    });
    return temp[0];
  } catch (e) {
    console.log("could not retrieve record", e);
    return null;
  }
}
export async function getFilesByUser(userid: number, user_id: number | string) {
  try {
    const Files = await FileModel.findAll({ where: { user_id: userid } });
    if (Files.length < 1) {
      console.log("record not found with id " + userid);
      return null;
    }
    console.log(Files, "files by user");
    await addAudit({
      user_id: parseInt(user_id.toString()),
      action: `files with user id ${userid}, ${JSON.stringify(
        Files
      )} retrieved from table: files`,
    });
    return Files;
  } catch (e) {
    console.log("could not retrieve record", e);
    return null;
  }
}

export async function deleteFileByID(id: number, user_id: number | string) {
  try {
    const File = await getFileByID(id, user_id);

    try {
      const temp: any = File?.get("alias");
      const tempfile: string = temp;
      ["-json", "-pdf", "-csv", ""].map((sufx) =>
        unlink(
          `./storage/${tempfile.replace(`${user_id}/files/`, "")}${sufx}`,
          (err) => {
            if (err) throw err;
            console.log("File deleted");
          }
        )
      );
    } catch (error) {
      console.error("there was an error:", error);
    }
    await File?.destroy();
    console.log("deleted");
    await addAudit({
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
    await addAudit({
      user_id: parseInt(user_id.toString()),
      action: `file with id ${id}, ${JSON.stringify(
        res
      )} updated from table: files`,
    });
    return File;
  } catch (e) {
    console.log("could not update record", e);
    return false;
  }
}
