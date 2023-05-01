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
fileRouter.post("/update/:id", async (req, res) => {
  res.send(await updateFileByID(parseInt(req.params.id), req.body));
});
fileRouter.delete("/:id", async (req, res) => {
  res.send(deleteFileByID(parseInt(req.params.id)));
});
fileRouter.post("/add", upload.single("file"), async (req, res) => {
  if (req.file) {
    const { originalname, buffer, size, destination, filename } = req.file;
    res.send(
      addFile({
        name: originalname,
        alias: `${req.user?.id}/files/${filename}`,
        path_unl: destination,
        size: size,
        user_id: req.user?.id || "",
      })
    );
  } else {
    res.send("an error occurred");
  }
});
