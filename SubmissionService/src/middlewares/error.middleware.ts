import { AppError } from "../utils/errors/app.error";
import { Request,Response,NextFunction } from "express";
import {logger} from "../config/logger.config";

export const appErrorHandler=(err:AppError,req:Request,res:Response,next:NextFunction)=>{
    logger.error(`Error occurred: ${err.message}`);
    res.status(err.statusCode || 500).json({
        message: err.message || "Internal Server Error",
        success: false,
        error: err
    });
}

export const genericErrorHandler=(err:Error,req:Request,res:Response,next:NextFunction)=>{
    logger.error(`Error occurred:${err.message}`);
    res.status(500).json({
        message: "Internal Server Error",
        success: false,
        error: err.message
    });
}