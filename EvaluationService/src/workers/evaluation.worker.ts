import {Worker} from "bullmq";
import {SUBMISSION_QUEUE} from "../utils/constants";
import { redisConfig } from "../config/redis.config";
import logger from "../config/logger.config";
import { PYTHON_IMAGE, CPP_IMAGE } from "../utils/constants";
import { updateSubmissionStatus } from "../apis/submission.api";
import { runCode } from "../utils/containers/codeRunner.utils";
import { RunCodeOptions } from "../utils/containers/codeRunner.utils";
// Map programming languages to their respective pre-pulled Docker images
const LANGUAGE_IMAGE_MAP: Record<string, string> = {
    python: PYTHON_IMAGE,
    cpp: CPP_IMAGE
};
export enum SubmissionStatus{
    PENDING="pending",
    COMPILING="compiling",
    RUNNING="running",
    ACCEPTED="accepted",
    WRONG_ANSWER="wrong_answer",
}
interface ITestcase{
    input:string,
    output:string
}
export interface IProblemDetails{
    id:string,
    title:string,
    description:string,
    editorial:string,
    difficulty:string,
    testcases:ITestcase[],
    createdAt:Date,
    updatedAt:Date
}
export enum SubmissionLanguage{
    CPP="cpp",
    JAVA="java",
    PYTHON="python"
}
interface ISubmissionJob{
    submissionId:string,
    problem:IProblemDetails,
    code:string,
    language:SubmissionLanguage
}
async function processSubmissionJob(Job:ISubmissionJob){
    const {submissionId,problem,code,language}=Job;
    const dockerImage=LANGUAGE_IMAGE_MAP[language];
    // 1 if l
    if(!dockerImage){
        logger.error(`No Docker image found for language ${language}`);
        await updateSubmissionStatus(submissionId,SubmissionStatus.WRONG_ANSWER,{
            error: `Unsupported language: ${language}`
        });
        return;
    }
    
    // 2 Mark status as 'running' in Submission Service DB
    await updateSubmissionStatus(submissionId,SubmissionStatus.RUNNING);
    
    for(let i=0;i<problem.testcases.length;i++){
        const testcase:ITestcase=problem.testcases[i];
        logger.info(`Evaluating submission ${submissionId} against testcase ${i+1}`);
        const options:RunCodeOptions={
            imageName:dockerImage,
            code:code,
            language:language,
            input:testcase.input,
            timeout:5000, // 5 seconds timeout for each testcase
        }
        const result=await runCode(options);
        // 3. Handle Time Limit Exceeded (TLE)
        if (result.status === "time_limit_exceeded") {
            logger.warn(`Submission ${submissionId} hit Time Limit Exceeded on testcase ${i + 1}`);
            await updateSubmissionStatus(submissionId, "wrong_answer", { // Or "time_limit_exceeded" if added to your Enum
                failedTestCase: {
                    input: testcase.input,
                    expectedOutput: testcase.output,
                    actualOutput: "Time Limit Exceeded (Terminated after 3000ms)"
                }
            });
            return; // Stop evaluating further testcases
        }

        // 4. Handle Runtime / Compilation Errors
        if (result.status === "failed") {
            logger.warn(`Submission ${submissionId} encountered runtime/compilation error on testcase ${i + 1}`);
            await updateSubmissionStatus(submissionId, "wrong_answer", {
                failedTestCase: {
                    input: testcase.input,
                    expectedOutput: testcase.output,
                    actualOutput: result.output || "Runtime / Compilation Error"
                }
            });
            return; // Stop evaluating further testcases
        }

        // 5. Output Comparison (Sanitize whitespace/newlines before comparison)
        const sanitizedActual = (result.output || "").replace(/\r\n/g, "\n").trim();
        const sanitizedExpected = (testcase.output || "").replace(/\r\n/g, "\n").trim();

        if (sanitizedActual !== sanitizedExpected) {
            logger.info(`Submission ${submissionId} WRONG_ANSWER on testcase ${i + 1}`);
            await updateSubmissionStatus(submissionId, "wrong_answer", {
                failedTestCase: {
                    input: testcase.input,
                    expectedOutput: testcase.output,
                    actualOutput: result.output || ""
                }
            });
            return; // Stop evaluating further testcases
        }
    }

    // 6. If all testcases pass loop successfully -> ACCEPTED
    logger.info(`Submission ${submissionId} PASSED ALL TESTCASES!`);
    await updateSubmissionStatus(submissionId, "accepted", {
        runtime: "Normal",
        memory: "Standard"
    });

    
}
async function startEvaluationWorker(){
     const worker= new Worker(SUBMISSION_QUEUE,async(job)=>{
         logger.info(`Processing job ${job.id} of type ${job.name}`);
         await processSubmissionJob(job.data);
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