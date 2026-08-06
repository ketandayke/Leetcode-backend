import { NextFunction, Request, Response } from "express";
import { v4 as uuidV4 } from "uuid";
import { asyncLocalStorage } from "../utils/helpers/request.helpers";

export const attachCorrelationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    // 1. Reuse existing incoming header if provided by another microservice, else generate a new UUID
    const existingCorrelationId = req.headers['x-correlation-id'] as string;
    const correlationId = existingCorrelationId || uuidV4();

    // 2. Attach to request headers for downstream processing
    req.headers['x-correlation-id'] = correlationId;

    // 3. Attach to outgoing response headers so clients can trace the request
    res.setHeader('x-correlation-id', correlationId);

    // 4. Wrap the execution context inside AsyncLocalStorage
    asyncLocalStorage.run({ correlationId: correlationId }, () => {
        next();
    });
};