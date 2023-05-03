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
import { isAuthorized } from "../middleware/isAuth";

//store files in express/storage
const upload = multer({ dest: "./storage" });

export const fileRouter = express.Router();

fileRouter.get("/:id", isAuthorized.single, async (req, res) => {
  if (req.user?.id) {
    res.send(await getFileByID(parseInt(req.params.id), req.user?.id));
  } else {
    res.send({ msg: "failed" });
  }
});

// this route uses the authenticated user id, so the owner can only see their own files
fileRouter.get("/", async (req, res) => {
  if (req?.user?.id) {
    res.send(
      await getFilesByUser(parseInt(req.user.id.toString()), req.user.id)
    );
  } else {
    res.send("an error occurred");
  }
});

fileRouter.post(
  "/update/:id",
  isAuthorized.single,
  upload.single("file"),
  async (req, res) => {
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
          await updateFileByID(
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
  }
);

fileRouter.delete("/:id", isAuthorized.single, async (req, res) => {
  if (req.user?.id && req.user) {
    const result = await deleteFileByID(parseInt(req.params.id), req.user?.id);
    res.send({ msg: "success", result });
  } else {
    res.send({ msg: "failed" });
  }
});

//user creates data, any user authenticated can perform this action
fileRouter.post("/add", upload.single("file"), async (req, res) => {
  if (req.file) {
    const { originalname, buffer, size, destination, filename } = req.file;

    await convertUNL(destination + `/${filename}`);
    const result = await addFile({
      name: originalname,
      alias: `${req.user?.id}/files/${filename}`,
      path_unl: destination,
      size: size,
      user_id: req.user?.id || "",
    });
    res.send({ msg: "success", result });
  } else {
    res.send("an error occurred");
  }
});

// storage files are only exposed to owner or admin based on prefix e.g. filename: 1/files for user with id 1
fileRouter.get("/storage/:filename", isAuthorized.storage, async (req, res) => {
  const { filename } = req.params;
  const dirname = path.resolve();
  const fullfilepath = path.join(dirname, "storage/" + filename);
  try {
    res.sendFile(fullfilepath);
  } catch (e) {
    res.send({ msg: "an error occured" });
  }
});

fileRouter.post("/share/:id", isAuthorized.single, async (req, res) => {
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
