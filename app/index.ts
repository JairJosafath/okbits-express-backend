import express from "express";
import { connect,close } from "./config/db";
import { FileModel } from "./models/file";

const app = express();

const port = 3001;

app.listen(port,()=>{
    console.log("listening on port: "+ port)
})