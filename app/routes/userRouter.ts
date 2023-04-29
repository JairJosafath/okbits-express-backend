import express from "express";
import { addFile, deleteFileByID, getFileByID, updateFileByID } from "../controllers/file";

export const fileRouter = express.Router();

fileRouter.get("/:id", async(req,res)=>{
    res.send(await getFileByID(parseInt(req.params.id)));
});
fileRouter.post("/:id/update", async(req,res)=>{
    res.send(await updateFileByID(parseInt(req.params.id),req.body));
});
fileRouter.delete("/:id",async(req,res)=>{
    res.send(deleteFileByID(parseInt(req.params.id)));
});
fileRouter.post("/add", async (req,res)=>{
    res.send(addFile(req.body));
});
