import { ISubmission, ISubmissionData,SubmissionStatus } from "../models/submission.model";
import { ISubmissionRepository} from "../repositories/submission.repository";
import {logger} from "../config/logger.config";
import { NotFoundError } from "../utils/errors/app.error";
import { addSubmissionJob } from "../producers/submission.producer";
import { getProblemById } from "../apis/problem.api";
interface ISubmissionService{
    createSubmission(submissionData:Partial<ISubmission>):Promise<ISubmission>,
    getSubmissionById(submissionId:string):Promise<ISubmission>,
    getSubmissionsByProblemId(submissionId:string):Promise<{submissions:ISubmission[],total:number}>,
    deleteSubmission(submissionId:string):Promise<boolean>,
    updateSubmissionStatus(submissionId:string,status:string,submissionData:Partial<ISubmissionData>):Promise<ISubmission>
}

export class SubmissionService implements ISubmissionService {

    private submissionRepository: ISubmissionRepository;

    constructor(submissionRepository: ISubmissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    async createSubmission(submissionData:Partial<ISubmission>):Promise<ISubmission> {
        if(!submissionData.problemId){
            throw new NotFoundError("Problem Id is required field");
        }
        if(!submissionData.code){
            throw new NotFoundError("Code is required field");
        }
        if(!submissionData.language){
            throw new NotFoundError("Language is required field");
        }
        const problem=await getProblemById(submissionData.problemId);
        if(!problem){
            throw new NotFoundError("Problem not found or something went wrong");
        }
        
        const submission=await this.submissionRepository.create(submissionData);
        if(!submission){
            throw new NotFoundError("submission not found or something went wrong");
        }
        const jobId=await addSubmissionJob({
            submissionId:submission.id,
            problem,
            code:submissionData.code,
            language:submissionData.language
        });
        logger.info(`Submission Job added with Job Id ${jobId}`);
        return submission;
    }

    async getSubmissionById(submissionId:string):Promise<ISubmission>{
        const submission=await this.submissionRepository.findById(submissionId);
        if(!submission){
            throw new NotFoundError(`Submission with id ${submissionId}Not found`);
        }
        return submission;
    }

    async getSubmissionsByProblemId(problemId:string):Promise<{submissions:ISubmission[],total:number}>{
         const {submissions,total}=await this.submissionRepository.findByProblemId(problemId);
         if(!submissions || submissions.length===0){
            throw new NotFoundError(`No submissions found for problem with id ${problemId}`);
         }
         return {submissions,total};
    }

    async deleteSubmission(submissionId:string):Promise<boolean>{
        const deleted=await this.submissionRepository.delete(submissionId);
        if(!deleted){
            throw new NotFoundError(`Submission with id ${submissionId} not found or could not be deleted`);
        }
        return deleted;
    }

    async updateSubmissionStatus(submissionId:string,status:SubmissionStatus,submissionData:ISubmissionData):Promise<ISubmission>{   
        const updatedSubmission=await this.submissionRepository.updateStatus(submissionId,status,submissionData);
        if(!updatedSubmission){
            throw new NotFoundError(`Submission with id ${submissionId} not found or could not be updated`);
        }
        return updatedSubmission;
    }

}