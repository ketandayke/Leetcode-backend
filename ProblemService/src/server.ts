import express from "express";
import { serverConfig } from "./config";
import logger from "./config/logger.config";
import connectDB from "./config/db.config";

const app=express();

app.use(express.json());

app.get("/",(req,res)=>{
    res.send("Problem Service is live")
});

app.listen(serverConfig.PORT,async()=>{
    logger.info(`Server is running or http://localhost:${serverConfig.PORT}`);
    logger.info("Press Ctrl+C to stop the server");
    await connectDB();
})