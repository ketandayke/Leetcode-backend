import { ISubmission, SubmissionStatus,ISubmissionData,Submission} from "../models/submission.model";
import { NotFoundError } from "../utils/errors/app.error";

export interface ISubmissionRepository{
    create(submissionData:Partial<ISubmission>):Promise<ISubmission>,
    findById(submissionId:string):Promise<ISubmission|null>,
    findByProblemId(problemId:string):Promise<{submissions:ISubmission[],total:number}>,
    updateStatus(submissionId:string,status:SubmissionStatus,submissionData:ISubmissionData):Promise<ISubmission|null>,
    delete(submissionId:string):Promise<boolean>
}


export class SubmissionRepository implements ISubmissionRepository{

       async create(submissionData:Partial<ISubmission>):Promise<ISubmission>{
         const newSubmission= new Submission(submissionData);

         await newSubmission.save();
         return newSubmission;
          
       }

       async findById(submissionId:string):Promise<ISubmission|null>{
          const submission=await Submission.findById(submissionId);
          if(!submission){
            new NotFoundError(`Submission with id ${submissionId} not found`);
          }
          return submission;
       }
        async findByProblemId(problemId: string): Promise<{submissions:ISubmission[],total:number}> {
           const submissions=await Submission.find({ProblemId:problemId}).sort({createdAt:-1});
           const total=await Submission.countDocuments({ProblemId:problemId});

           return {submissions,total};
       }

       async updateStatus(submissionId:string,status:SubmissionStatus,submissionData:ISubmissionData):Promise<ISubmission|null>{
            const submission=await Submission.findByIdAndUpdate(submissionId,{status,submissionData});
            if(!submission){
                new NotFoundError(`Submission with id ${submissionId} not found`);
            }
            return submission;
       }

       async delete(submissionId:string):Promise<boolean>{
            const result=await Submission.findByIdAndDelete(submissionId);
            return result!==null;
       }

        
}