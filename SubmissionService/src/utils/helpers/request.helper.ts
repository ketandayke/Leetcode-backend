import { AsyncLocalStorage } from "async_hooks";

type AsyncLocalStorageType={
    correlationId:string
}
// creates an instance of AsyncLocalStorage to store the correlationId for each request, which can be used for logging and tracing purposes throughout the application.
export const asyncLocalStorage= new AsyncLocalStorage<AsyncLocalStorageType>();

export const getCorrelationId=()=>{
    const store=asyncLocalStorage.getStore();
    return store?.correlationId||"Invalid unknown-error-while-creating-correlation-id "
}

