import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const port = 3001;


app.listen(port,()=>{
    console.log("listening on port: "+port)
})