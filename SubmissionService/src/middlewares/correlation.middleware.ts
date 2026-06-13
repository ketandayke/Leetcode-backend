import {Request,Response,NextFunction} from "express";
import { asyncLocalStorage } from '../utils/helpers/request.helper';
import {v4 as uuidv4} from "uuid";

export const correlationMiddleware=(req:Request,res:Response,next:NextFunction)=>{
      
    const correlationId=uuidv4();
    req.headers['-x-correlation-id']=correlationId;
    // now we can use this correlationId in any part of the application to log the request and trace it throughout the application, which is very useful for debugging and monitoring purposes.
    asyncLocalStorage.run({correlationId},()=>{
        next();
    })
}

