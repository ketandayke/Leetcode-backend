import {Worker} from "bullmq";
import {SUBMISSION_QUEUE} from "../utils/constants";
import { redisConfig } from "../config/redis.config";
import logger from "../config/logger.config";
async function startEvaluationWorker(){
     const worker= new Worker(SUBMISSION_QUEUE,async(job)=>{
         logger.info(`Processing job ${job.id} of type ${job.name}`);
     },{
        connection:redisConfig,
     });

     worker.on("completed",(job)=>{
         logger.info(`Job ${job.id} completed successfully`);
     })
     worker.on("failed",(job,err)=>{    
         logger.error(`Job ${job?.id} failed with error ${err.message}`);
     })
     worker.on("error",(err)=>{      
             logger.error(`Worker error: ${err.message}`);
    })
}

export const startWorkers=()=>{
    startEvaluationWorker();
}