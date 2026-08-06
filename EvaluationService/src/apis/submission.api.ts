import axios from "axios";
import { serverConfig } from "../config";
import logger from "../config/logger.config";


interface ISubmissionData{
    runtime?:string,
    memory?:string,
    failedTestCase?:{
        input:string,
        expectedOutput:string,
        actualOutput:string
    },
    error?:string;
}
/**
 * 
 * @param submissionId 
 * @param status 
 * @param submissionData 
 * @returns updated submission status
 */
export const updateSubmissionStatus = async(
    submissionId:string,
    status:string,
    submissionData:ISubmissionData={}
    ):Promise<boolean>=>{
    try {
        const response= await axios.patch(
            `${serverConfig.SUBMISSION_SERVICE_URL}/submissions/${submissionId}/status`,
            {
                status,
                submissionData
            });

        if(response.data&&response.data.success){
            return true;
        }
        return false;
    } catch (error) {
        logger.error(`Error updating submission status for submissionId ${submissionId}: ${error}`);
        return false;
    }
}