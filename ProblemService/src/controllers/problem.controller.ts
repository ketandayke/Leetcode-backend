import { Request,Response } from "express";
import { ProblemRepository} from "../repositories/problem.repository";
import { ProblemService } from "../services/problem.service";


const problemRepository=new ProblemRepository();
const problemService=new ProblemService(problemRepository);

export const ProblemController={

     async createProblem(req:Request,res:Response):Promise<void>{
        const problem=await problemService.createProblem(req.body);
        res.status(201).json({
            success:true,
            data:problem,
            message:"Problem created successfully"
        })
     },
     async getProblemById(req:Request,res:Response):Promise<void>{
        const problem=await problemService.getProblemById(req.params.id as string);
        res.status(200).json({
            success:true,
            data:problem,
            message:"Problem fetched successfully"
        });
      },

      async getAllProblems(req:Request,res:Response):Promise<void>{
         const {problems,total}=await problemService.getAllProblems();
         res.status(200).json({
            success:true,
            data:{problems,total},
            message:"Problems fetched successfully"
         })

     },

     async updateProblem(req:Request,res:Response):Promise<void>{
        const problem=await problemService.updateProblem(req.params.id as string,req.body);
        res.status(200).json({
            success:true,
            data:problem,
            message:"Problem updated successfully"
        })
     },

     async deleteProblem(req:Request,res:Response):Promise<void>{
        const isDeleted=await problemService.deleteProblem(req.params.id as string);
        res.status(200).json({
            success:true,
            data:null,
            message:isDeleted?"Problem deleted successfully":"Problem not found"
        })
    },

    async findByDifficulty(req:Request,res:Response):Promise<void>{
        const difficulty=req.params.difficulty as "easy"|"medium"|"hard";
        const problems=await problemService.findByDifficulty(difficulty);
        res.status(200).json({
            success:true,
            data:problems,
            message:"Problems fetched successfully"
        })
    },

    async searchProblem(req:Request,res:Response):Promise<void>{
        const query=req.query.query as string;
        const problems=await problemService.searchProblem(query);
        res.status(200).json({
            success:true,
            data:problems,
            message:"Problems fetched successfully"
        })
    }

}