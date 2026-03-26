import express from "express";
import { serverConfig } from "./config";
import logger from "./config/logger.config";
import connectDB from "./config/db.config";
import v1Router from "./routers/v1/index.router";
import { attachCorrelationMiddleware } from "./middlewares/correlation.middleware";
import { appErrorHandler, genericErrorHandler } from "./middlewares/errorHandler.middleware";
const app=express();

app.use(express.json());
app.use(attachCorrelationMiddleware) // attach correlation id to each request
app.use("/api/v1",v1Router);

/**
 * Add the error handler middleware
 */

app.use(appErrorHandler);
app.use(genericErrorHandler);

app.listen(serverConfig.PORT,async()=>{
    logger.info(`Server is running or http://localhost:${serverConfig.PORT}`);
    logger.info("Press Ctrl+C to stop the server");
    await connectDB();
})