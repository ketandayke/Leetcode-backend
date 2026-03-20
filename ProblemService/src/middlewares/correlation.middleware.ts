import { NextFunction,Request,Response } from "express";
import {v4 as uuidV4} from "uuid"
import { asyncLocalStorage } from "../utils/helpers/request.helpers";

export const attachCorrelationMiddleware=(req:Request,res:Response,next:NextFunction)=>{
     // generate unqiue id
      const correlationId=uuidV4();
      // correlation id to headers to track individual request
      req.headers['x-correlation-id'] = correlationId;

      // create storage for request id inside asyncLocalStorage
     // Call the next middleware or route handler
     asyncLocalStorage.run( { correlationId: correlationId } , () => {
        next();
    });
}