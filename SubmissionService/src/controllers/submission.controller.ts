import { NextFunction,Request,Response } from "express";
import { SubmissionService } from "../services/submission.service"
import { logger } from "../config/logger.config";

export class SubmissionController{
    private submissionService:SubmissionService
    constructor(submissionService:SubmissionService){
        this.submissionService=submissionService;
    }

    createSubmission=async(req:Request,res:Response,next:NextFunction)=>{
        try {
            logger.info("Creating submission");
            const submission=await this.submissionService.createSubmission(req.body);
            logger.info("Submission created successfully",{submissionId:submission.id});
            return res.status(201).json({
                success:true,
                message:"Submission created successfully",
                data:submission
            });
        } catch (error) {
            logger.error("Error creating submission",{error});
            next(error);
        } 
     }

    getSubmissionById=async(req:Request<{id:string}>,res:Response,next:NextFunction)=>{
        try {
            const {id}=req.params;
            logger.info("Fetching submission by id",{submissionId:id});
             
            const submission=await this.submissionService.getSubmissionById(id);    
            logger.info("Submission fetched successfully",{submissionId:id});
            return res.status(200).json({
                success:true,
                message:"Submission fetched successfully",
                data:submission
            });
        } catch (error) {
            logger.error("Error fetching submission by id",{error});
            next(error);
        }

    }

    getSubmissionsByProblemId=async(req:Request<{problemId:string}>,res:Response,next:NextFunction)=>{
        try {
            const {problemId}=req.params;
            logger.info("Fetching submissions by problem id",{problemId});
            const submissions=await this.submissionService.getSubmissionsByProblemId(problemId);
    
            logger.info("Submissions fetched successfully",{problemId});    
    
            return res.status(200).json({
                success:true,
                message:"Submissions fetched successfully",
                data:submissions
            });
        } catch (error) {
           logger.error("Error fetching submissions by problem id",{error});
           next(error);
        }
    }
     

    deleteSubmissionById=async(req:Request<{id:string}> ,res:Response,next:NextFunction)=>{
        try {
            const {id}=req.params;
            logger.info("Deleting submission by id",{submissionId:id});
            await this.submissionService.deleteSubmission(id);
            logger.info("Submission deleted successfully",{submissionId:id});
            return res.status(200).json({
                success:true,
                message:"Submission deleted successfully"
            });
        } catch (error){
            logger.error(`Error in deleting submission by id`,{error});
            next(error);
        }
    }
    updateSubmissionStatus=async(req:Request<{id:string}>,res:Response,next:NextFunction)=>{
        try {
            const {id}=req.params;
            const {status,submissionData}=req.body;
    
            logger.info("Updating submission status",{submissionId:id,status});
    
            const updatedSubmission=await this.submissionService.updateSubmissionStatus(id,status,submissionData);
            logger.info("Submission status updated successfully",{submissionId:id,status});
            return res.status(200).json({
                 success:true,
                 message:"Submission status updated successfully",
                 data:updatedSubmission
            });
        } catch (error) {
            logger.error("Error updating submission status",{error});
            next(error);
            
        }

    }

}
