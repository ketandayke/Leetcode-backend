// import axios,{AxiosResponse} from "axios";
// import { serverConfig } from "../config";
// import {logger} from "../config/logger.config";
// import { InternalServerError } from "../utils/errors/app.error";
// interface ITestcase{
//     input:string,
//     output:string
// }
// export interface IProblemDetails{
//     id:string,
//     title:string,
//     description:string,
//     editorial:string,
//     difficulty:string,
//     testcases:ITestcase[],
//     createdAt:Date,
//     updatedAt:Date
// }

// interface IProblemResponse{
//   data:IProblemDetails,
//   message:string,
//   success:string
// }

// export const getProblemById = async (problemId: string): Promise<IProblemDetails | null> => {
//   try {
//     const response:AxiosResponse<IProblemResponse> =
//     await axios.get(`${serverConfig.PROBLEM_SERVICE}/problems/${problemId}`);

//     if(response.data.success){
//         return response.data.data;
//     }
//     throw new InternalServerError(`Failed to fetch problem details`);
//   } catch (error) {
//       logger.error(`Error fetching problem details for problemId ${problemId}: ${error}`);
//       return null;
//   }
    
// }