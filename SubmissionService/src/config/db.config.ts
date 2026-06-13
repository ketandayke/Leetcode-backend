import mongoose from "mongoose";
import {serverConfig} from "./index"
import {logger} from "./logger.config"
export const connectDB= async()=>{
    try {
        await mongoose.connect(serverConfig.DB_URL);
        
        mongoose.connection.on("error",(error)=>{
            logger.error("MongoDB connection error",error);
            process.exit(1);
        });

        mongoose.connection.on("disconnected",()=>{
            logger.warn("MongoDB is disconnected");
            process.exit(1);
        });
       // on server forcefully stopped, close the MongoDB connection gracefully
        process.on("SIGINT",()=>{
            mongoose.connection.close();// close monogoDb connection on server stops
            logger.info("MongoDB service stopped");
            process.exit(0);// exit process with success
        })
        
    } catch (error) {
        logger.error("MongoDB connection error",error);
        process.exit(1);
        
    }
}