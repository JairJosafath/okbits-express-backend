import express from "express";
import multer from "multer";
import {
  addFile,
  deleteFileByID,
  getFileByID,
  getFilesByUser,
  updateFileByID,
} from "../controllers/file";
import path from "path";
import { shareEmail } from "../service/shareEmail";
import convertUNL from "../service/convertUNL";

const upload = multer({ dest: "./storage" });

export const fileRouter = express.Router();

fileRouter.get("/:id", async (req, res) => {
  res.send(await getFileByID(parseInt(req.params.id)));
});
fileRouter.get("/", async (req, res) => {
  if (req?.user?.id) {
    res.send(await getFilesByUser(parseInt(req.user.id.toString())));
  } else {
    res.send("an error occurred");
  }
});
fileRouter.post("/update/:id", upload.single("file"), async (req, res) => {
  if (req.file) {
    const { originalname, buffer, size, destination, filename } = req.file;
    const { name } = req.body;
    // console.log({
    //   originalname,
    //   buffer,
    //   size,
    //   destination,
    //   filename,
    //   body: req.body,
    // });
    res.send(
      updateFileByID(parseInt(req.params.id), {
        name: name,
        alias: `${req.user?.id}/files/${filename}`,
        path_unl: destination,
        size: size,
        user_id: req.user?.id || "",
      })
    );
  } else {
    res.send("an error occurred");
  }
  // // res.send(await updateFileByID(parseInt(req.params.id), req.body));
  // console.log;
  // res.send("updateeeee");
});
fileRouter.delete("/:id", async (req, res) => {
  res.send(deleteFileByID(parseInt(req.params.id)));
});
fileRouter.post("/add", upload.single("file"), async (req, res) => {
  if (req.file) {
    const { originalname, buffer, size, destination, filename } = req.file;

    convertUNL(destination + "/de3354825238b3a6a1b6d286dc413b68");
    res
      .send
      // addFile({
      //   name: originalname,
      //   alias: `${req.user?.id}/files/${filename}`,
      //   path_unl: destination,
      //   size: size,
      //   user_id: req.user?.id || "",
      // })
      ();
  } else {
    res.send("an error occurred");
  }
});

fileRouter.get("/storage/:filename", async (req, res) => {
  const { filename } = req.params;
  const dirname = path.resolve();
  const fullfilepath = path.join(dirname, "storage/" + filename);
  return res.sendFile(fullfilepath);
});

fileRouter.post("/share/:id", async (req, res) => {
  console.log(req.body);
  const resp = shareEmail(req.body);
  res.send(resp);
});
