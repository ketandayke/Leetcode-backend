import { ISubmission, ISubmissionData } from "../models/submission.model";
import { ISubmissionRepository} from "../repositories/submission.repository";
import {logger} from "../config/logger.config";
import { NotFoundError } from "../utils/errors/app.error";

interface ISubmissionService{
    createSubmission(submissionData:Partial<ISubmission>):Promise<ISubmission>,
    getSubmssionById(submissionId:string):Promise<ISubmission>,
    getSubmssionByProblemId(submissionId:string):Promise<{submissions:ISubmission[],total:number}>,
    deleteSubmission(submissionId:string):Promise<boolean>,
    updateSubmissionStatus(submissionId:string,status:string,submissionData:Partial<ISubmissionData>):Promise<ISubmission>
}

export class SubmissionService implements ISubmissionService {

    private submissionRepository: ISubmissionRepository;

    constructor(submissionRepository: ISubmissionRepository) {
        this.submissionRepository = submissionRepository;
    }

    async createSubmission(submissionData:Partial<ISubmission>):Promise<ISubmission> {
        if(!submissionData.problmeId){
            throw new NotFoundError("Problem Id is required field");
        }
        if(!submissionData.code){
            throw new NotFoundError("Code is required field");
        }
        if(!submissionData.language){
            throw new NotFoundError("Language is required field");
        }
        logger.info(`getting problem by problemId :${submissionData.problemId}`);

        const problem=await getProblemById(submissionData.problemId);
        if(!problem){
            throw new NotFoundError("Problem not found or something went wrong");
        }

    }


}