import {Problem,IProblem} from "../models/problem.model";
import logger from "../config/logger.config"

/**
 *  Interface of Problem Repository for Problem Collection 
 *  createProblem,getProblemById,getAllProblems,updateProblem,deleteProblem,findByDifficulty,searchProblems
 */
export interface IProblemRepository{
    createProblem(problem:Partial<IProblem>):Promise<IProblem>,
    getProblemById(id:string):Promise<IProblem|null>,
    getAllProblems():Promise<{problems:IProblem[],total:number}>,
    updateProblem(id:string,updateData:Partial<IProblem>):Promise<IProblem|null>,
    deleteProblem(id:string):Promise<boolean>,
    findByDifficulty(difficulty:"easy"|"medium"|"hard"):Promise<IProblem[]|null>,
    searchProblem(query:string):Promise<IProblem[]>,
}

export class ProblemRepository implements IProblemRepository{
       constructor(){
         logger.info("ProblemRepository initialized");
       }

       async createProblem(problem: Partial<IProblem>): Promise<IProblem> {
           const newProblem=new Problem(problem);
            await newProblem.save();
            return newProblem;
       }

       async getProblemById(id: string): Promise<IProblem | null> {
          return await Problem.findById(id);
       }

       async getAllProblems(): Promise<{ problems: IProblem[]; total: number; }> {
            const problems=await Problem.find().sort({createdAt:-1});
            const total=await Problem.countDocuments();
            return{problems,total};
       }

       async updateProblem(id:string,updateData:Partial<IProblem>):Promise<IProblem|null>{
            return await Problem.findByIdAndUpdate(id,updateData,{new:true});
       }
    

       async deleteProblem(id: string): Promise<boolean> {
            const result= await Problem.findByIdAndDelete(id);
            return result!==null;
       }
       
        async findByDifficulty(difficulty: "easy" | "medium" | "hard"): Promise<IProblem[] | null> {
            return await Problem.find({difficulty}).sort({createdAt:-1});
       }

        async searchProblem(query: string): Promise<IProblem[]> {
            // RegExp convertes the query into regex i(for cases insensitive)
            const regex=new RegExp(query,"i")
            return await Problem.find({
                $or:[{title:regex},{description:regex}]
            }).sort({createdAt:-1});
       }


}