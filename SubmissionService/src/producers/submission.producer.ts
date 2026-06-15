import {IProblemDetails} from "../apis/problem.api";
import {logger} from "../config/logger.config";
import { SubmissionLanguage } from "../models/submission.model";
import {submissionQueue} from "../queues/submission.queue";

interface ISubmissionJob{
    submissionId:string,
    problem:IProblemDetails,
    code:string,
    language:SubmissionLanguage
}

export async function addSubmissionJob(data:ISubmissionJob):Promise<string|null>{
     try {
        const job=await submissionQueue.add("evaluate-submission",data);
        logger.info(`Added submission job to queue with id ${job.id} for submissionId ${data.submissionId}`);
        return job.id||null
        
     } catch (error) {
        logger.error(`Error adding submission job to queue: ${error}`);
        return null;
     }
}