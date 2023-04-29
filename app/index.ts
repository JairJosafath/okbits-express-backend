import express, { json } from "express";
import { connect,close } from "./config/db";
import FileModel from "./models/file";
import { addFile, deleteFileByID, getFileByID, updateFileByID } from "./controllers/file";
import { fileRouter } from "./routes/fileRouter";

const app = express();

const port = 3001;
app.use(json());
app.use("/files",fileRouter)

app.listen(port,()=>{
    console.log("listening on port: "+ port)
})