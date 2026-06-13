import express from "express";
import { serverConfig } from "./config";
import { logger } from "./config/logger.config";
const app= express();

app.use(express.json());

app.get("/ping",(req,res)=>{
    res.status(200).json({message:"Pong!"});
});

app.listen(serverConfig.PORT,()=>{
    logger.info(`Server is running on http://localhost:${serverConfig.PORT}`);
    logger.info("Press Ctrl+C to stop the server");
})