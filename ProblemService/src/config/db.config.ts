import mongoose from "mongoose";
import {serverConfig} from "./index";
import logger  from "./logger.config";

 const connectDB=async()=>{
    try {
        await mongoose.connect(serverConfig.DB_URL);
        logger.info("MongoDB connected successfully")
        mongoose.connection.on("error",(error)=>{
            logger.error("MongoDB connection error",error);
        });

        mongoose.connection.on("disconnected",()=>{
            logger.warn("MongoDB is disconnected");
        })

        process.on("SIGINT",async()=>{
            await mongoose.connection.close();// close monogoDb connection on server stops
            logger.info("MongoDB service stopped");
            process.exit(0)// exit process with success
        })


    } catch (error) {
        logger.error("MongoDB connection error",error);
        process.exit(1);//exit process with failure
    }
}

export default connectDB;