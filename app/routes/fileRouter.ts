import express from "express";
import multer from "multer"; //used for storing files locally
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

//store files in express/storage
const upload = multer({ dest: "./storage" });

export const fileRouter = express.Router();

fileRouter.get("/:id", async (req, res) => {
  if (req.user?.id)
    res.send(await getFileByID(parseInt(req.params.id), req.user?.id));
});
fileRouter.get("/", async (req, res) => {
  if (req?.user?.id) {
    res.send(
      await getFilesByUser(parseInt(req.user.id.toString()), req.user.id)
    );
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
    convertUNL(destination + `/${filename}`);
    if (req.user?.id)
      res.send(
        updateFileByID(
          parseInt(req.params.id),
          {
            name: name,
            alias: `${req.user?.id}/files/${filename}`,
            path_unl: destination,
            size: size,
            user_id: req.user?.id || "",
          },
          req.user.id
        )
      );
  } else {
    res.send("an error occurred");
  }
  // // res.send(await updateFileByID(parseInt(req.params.id), req.body));
  // console.log;
  // res.send("updateeeee");
});
fileRouter.delete("/:id", async (req, res) => {
  if (req.user?.id && req.user)
    res.send(deleteFileByID(parseInt(req.params.id), req.user?.id));
});
fileRouter.post("/add", upload.single("file"), async (req, res) => {
  if (req.file) {
    const { originalname, buffer, size, destination, filename } = req.file;

    convertUNL(destination + `/${filename}`);
    res.send;
    addFile({
      name: originalname,
      alias: `${req.user?.id}/files/${filename}`,
      path_unl: destination,
      size: size,
      user_id: req.user?.id || "",
    });
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
  const { email } = req.body;
  const { pdf, csv, json } = email.attached;
  const attachments = [];
  if (req.user?.id) {
    const file = await getFileByID(parseInt(req.params.id), req.user?.id);
    const temp: any = file?.get("alias");
    const alias: string = temp;
    if (pdf) {
      attachments.push({
        filename: "pdf-output.pdf",
        path: path.join(
          __dirname,
          `../../storage/${alias.replace(req.user?.id + "/files/", "")}-pdf`
        ),
      });
    }
    if (csv) {
      attachments.push({
        filename: "csv-output.csv",
        path: path.join(
          __dirname,
          `../../storage/${alias.replace(req.user?.id + "/files/", "")}-csv`
        ),
      });
    }
    if (json) {
      attachments.push({
        filename: "json-output.json",
        path: path.join(
          __dirname,
          `../../storage/${alias.replace(req.user?.id + "/files/", "")}-json`
        ),
      });
    }
    const resp = shareEmail({ ...email, attachments });
    res.send(resp);
  }
});
