import {Queue} from "bullmq";
import  {redisConfig } from "../config/redis.config"
import logger  from "../config/logger.config";
export const submissionQueue= new Queue("submission",{
    connection:redisConfig,
    defaultJobOptions:{
        attempts:3,
        backoff:{
            type:"exponential",
            delay:2000
        }
    }
});

submissionQueue.on("error",()=>{
    logger.error("Error in submission queue")
});
submissionQueue.on("waiting",()=>{
    logger.info("Job is waiting in submission queue")
});
